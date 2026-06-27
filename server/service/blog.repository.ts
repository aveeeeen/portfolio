import { Client } from "@notionhq/client";
import type { DataSourceObjectResponse, QueryDataSourceParameters } from "@notionhq/client";
import type { ListArticleInput, Pagination, PaginationInput } from "./blog.service.types";
import type { GroupFilterOperatorArray } from "@notionhq/client/build/src/api-endpoints";
import { getPaginationData } from "./blog.service";

const notion = new Client({
  auth: process.env.NOTION_API_KEY
})

const dataSourceID = process.env.NOTION_DATASOURCE_ID;

export const getManyArticles = async (input: ListArticleInput) => {

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
      page_size: 10,
      start_cursor: !input.cursor || input.cursor === "" ? undefined : input.cursor
    }
  )

  return datasourceResult.results
}

export const getAllPagesAndCursors = async (input: PaginationInput): Promise<Pagination> => {
  const cursors: Map<number, string> = new Map();
  let hasMore = true;
  let totalPages = 1;
  let nextCursor = "";
  cursors.set(totalPages, nextCursor);

  if (!dataSourceID) throw Error("Data Source ID empty");

  const andList: GroupFilterOperatorArray = []

  if (input && input.keyword !== "" && input.keyword) {
    andList.push({
      "property": "Name",
      "title": {
        "contains": input.keyword
      }
    })
  }

  if (input && input.tags && input.tags.length !== 0){
    andList.push({
      "property": "タグ",
      "multi_select": {
        "contains": input.tags
      }
    })
  }

  while (hasMore) {
    if (nextCursor === "") {
      const queryresult = await notion.dataSources.query({
        data_source_id: dataSourceID,
        filter: andList.length !== 0 
          ? {and: andList}
          : undefined,
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
        filter: andList.length !== 0 
          ? {and: andList}
          : undefined,
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