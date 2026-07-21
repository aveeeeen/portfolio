import { Client } from "@notionhq/client";
import type { EventResult, EventBlocksResult, NotionBlock, ListEventInput, Pagination, PaginationInput, Tag } from "./event.service.types";
import type { GroupFilterOperatorArray, PropertyFilter } from "@notionhq/client/build/src/api-endpoints";

const notion = new Client({
  auth: process.env.NOTION_API_KEY
})

const dataSourceID = process.env.NOTION_EVENT_DATASOURCE_ID;

export const getManyEvents = async (input: ListArticleInput) => {

  if (!dataSourceID) throw Error("Data Source ID empty")
  const andList: GroupFilterOperatorArray = []

  if (input.keyword !== "" && input.keyword) {
    andList.push({
      "property": "Name",
      "title": {
        "contains": input.keyword
      }
    })
  }

  if (input.tags && input.tags.length !== 0){
    andList.push({
      "property": "タグ",
      "multi_select": {
        "contains": input.tags
      }
    })
  }

  const datasourceResult = await notion.dataSources.query(
    {
      data_source_id: dataSourceID,
      filter: andList.length !== 0 
        ? {and: andList}
        : undefined,
      sorts: [
        {
          timestamp: "created_time",
          direction: "descending"
        }
      ],
      page_size: 10,
      start_cursor: !input.cursor || input.cursor === "" ? undefined : input.cursor
    }
  )

  return datasourceResult.results
}

export const getAllPageAndCursors = async (input: PaginationInput): Promise<Pagination> => {
  const cursors: Map<number, string> = new Map();
  let hasMore = true;
  let totalPages = 1;
  let nextCursor = "";
  cursors.set(totalPages, nextCursor);

  if (!dataSourceID) throw Error("Data Source ID empty");

  const filterOption: PropertyFilter = 
    {
      "property": "Publicity",
      "select": {
        "equals": "public"
      }
    }

  while (hasMore) {
    if (nextCursor === "") {
      const queryresult = await notion.dataSources.query({
        data_source_id: dataSourceID,
        filter: filterOption,
        sorts: [
          {
            timestamp: "created_time",
            direction: "descending"
          }
        ],
        page_size: 10,
      })
      if (queryresult.next_cursor){
        nextCursor = queryresult.next_cursor;
        totalPages++;
        cursors.set(totalPages, queryresult.next_cursor)
      } else {
        hasMore = false;
      }
    } else {
      const queryresult = await notion.dataSources.query({
        data_source_id: dataSourceID,
        filter: filterOption,
        sorts: [
          {
            timestamp: "created_time",
            direction: "descending"
          }
        ],
        page_size: 10,
        start_cursor: nextCursor
      })
      if (queryresult.next_cursor){
        nextCursor = queryresult.next_cursor;
        totalPages++;
        cursors.set(totalPages, queryresult.next_cursor)
      } else {
        hasMore = false;
      }
    }
  }
  return {
    totalPages: totalPages,
    cursorMap: cursors
  }
}

/**
 * Recursively fetch all block children for a given block ID.
 * Handles pagination (has_more / next_cursor) and
 * recursively fetches children for blocks with has_children === true.
 */
const getBlockChildren = async (blockId: string): Promise<NotionBlock[]> => {
  const blocks: NotionBlock[] = [];
  let hasMore = true;
  let startCursor: string | undefined = undefined;

  while (hasMore) {
    const response = await notion.blocks.children.list({
      block_id: blockId,
      start_cursor: startCursor,
      page_size: 100,
    });

    for (const block of response.results) {
      // Skip partial block objects (they only have object + id)
      if (!("type" in block)) {
        continue;
      }

      const notionBlock: NotionBlock = {
        ...block,
        children: [],
      };

      // Recursively fetch children if the block has nested content
      if (block.has_children) {
        notionBlock.children = await getBlockChildren(block.id);
      }

      blocks.push(notionBlock);
    }

    hasMore = response.has_more;
    startCursor = response.next_cursor ?? undefined;
  }

  return blocks;
}

/**
 * Fetch an article by ID with block objects instead of markdown.
 */
export const getEventBlocksById = async (id: string): Promise<ArticleBlocksResult> => {
  const article = await notion.pages.retrieve({
    page_id: id
  });

  const blocks = await getBlockChildren(id);

  return {
    id: id,
    title: article.properties["Name"].title[0].plain_text,
    tags: article.properties["タグ"].multi_select.map(tag => {
      return {
        name: tag.name,
        id: tag.id
      }
    }),
    blocks,
    createdAt: article["created_time"],
    updatedAt: article["last_edited_time"],
  }
}