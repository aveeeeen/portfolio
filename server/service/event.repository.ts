import { Client } from "@notionhq/client";
import type { EventBlocksResult, NotionBlock, ListEventResult, ListEventInput, Pagination, PaginationInput } from "./event.service.types";
import type { GroupFilterOperatorArray, PropertyFilter } from "@notionhq/client/build/src/api-endpoints";

const notion = new Client({
  auth: process.env.NOTION_API_KEY
})

const dataSourceID = process.env.NOTION_EVENT_DATASOURCE_ID;

export const getManyEvents = defineCachedFunction(
  async (input: ListEventInput): Promise<ListEventResult[]> => {
    if (!dataSourceID) throw Error("Data Source ID empty");

    const datasourceResult = await notion.dataSources.query({
      data_source_id: dataSourceID,
      filter: {
        property: "Publicity",
        select: {
          equals: "public"
        }
      },
      sorts: [
        {
          property: "Date",
          direction: "descending"
        }
      ],
      page_size: 10,
      start_cursor: !input.cursor || input.cursor === "" ? undefined : input.cursor
    });

    return datasourceResult.results.map(result => {
      return {
        id: result.id,
        title: result.properties["Name"].title[0].plain_text,
        date: result.properties["Date"].date.start,
        venue: result.properties["Venue"].rich_text[0].plain_text,
        imageUrl: result.properties["Image"].files[0].file.url,
        createdAt: result["created_time"],
        updatedAt: result["last_edited_time"],
      } as ListEventResult;
    });
  },
  {
    maxAge: 60,
    name: "event-getManyEvents",
    getKey: (input: ListEventInput) => JSON.stringify(input ?? {})
  }
);

export const getAllPagesAndCursors = defineCachedFunction(
  async (input: PaginationInput): Promise<Pagination> => {
    const cursors: Record<number, string> = {};
    let hasMore = true;
    let totalPages = 1;
    let nextCursor = "";
    cursors[totalPages] = nextCursor;

    if (!dataSourceID) throw Error("Data Source ID empty");

    const filterOption: PropertyFilter = {
      "property": "Publicity",
      "select": {
        "equals": "public"
      }
    };

    while (hasMore) {
      if (nextCursor === "") {
        const queryresult = await notion.dataSources.query({
          data_source_id: dataSourceID,
          filter: filterOption,
          sorts: [
            {
              property: "Date",
              direction: "descending"
            }
          ],
          page_size: 10,
        });
        if (queryresult.next_cursor) {
          nextCursor = queryresult.next_cursor;
          totalPages++;
          cursors[totalPages] = queryresult.next_cursor;
        } else {
          hasMore = false;
        }
      } else {
        const queryresult = await notion.dataSources.query({
          data_source_id: dataSourceID,
          filter: filterOption,
          sorts: [
            {
              property: "Date",
              direction: "descending"
            }
          ],
          page_size: 10,
          start_cursor: nextCursor
        });
        if (queryresult.next_cursor) {
          nextCursor = queryresult.next_cursor;
          totalPages++;
          cursors[totalPages] = queryresult.next_cursor;
        } else {
          hasMore = false;
        }
      }
    }
    return {
      totalPages: totalPages,
      cursorMap: cursors
    };
  },
  {
    maxAge: 300,
    name: "event-getAllPagesAndCursors",
    getKey: (input: PaginationInput) => JSON.stringify(input ?? {})
  }
);

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
};

/**
 * Fetch an article by ID with block objects instead of markdown.
 */
export const getEventBlocksById = defineCachedFunction(
  async (id: string): Promise<EventBlocksResult> => {
    const event = await notion.pages.retrieve({
      page_id: id
    });

    const blocks = await getBlockChildren(id);

    return {
      id: id,
      title: event.properties["Name"].title[0].plain_text,
      venue: event.properties["Venue"].rich_text[0].plain_text,
      imageUrl: event.properties["Image"].files[0].file.url,
      date: event.properties["Date"].date.start,
      blocks,
      createdAt: event["created_time"],
      updatedAt: event["last_edited_time"],
    } as EventBlocksResult;
  },
  {
    maxAge: 300,
    name: "event-getEventBlocksById",
    getKey: (id: string) => id
  }
);