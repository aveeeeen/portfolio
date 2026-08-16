import { APIResponseError, Client } from "@notionhq/client";
import type {
  ListStrudelSnippetsInput,
  ListStrudelSnippetsResult,
  NotionBlock,
  Pagination,
  PaginationInput,
  StrudelSnippetsBlocksResult
} from "./strudel-snippets.service.types";
import type { PropertyFilter } from "@notionhq/client/build/src/api-endpoints";
import { shouldBypassCache } from "../utils/cache";

const notion = new Client({
  auth: process.env.NOTION_API_KEY
});

const dataSourceID = process.env.NOTION_STRUDEL_SNIPPETS_DATASOURCE_ID;

const numberOfRetry = 2;

async function retryNotionApi<T>(fn: () => Promise<T>, retries = numberOfRetry): Promise<T> {
  let attempt = 0;
  while (true) {
    try {
      return await fn();
    } catch (error: unknown) {
      if (error instanceof APIResponseError) {
        if (error.status && error.status >= 400 && error.status < 500) {
          throw error;
        }
      }
      if (attempt >= retries) {
        throw error;
      }
      attempt++;
      await new Promise((resolve) => setTimeout(resolve, 300 * Math.pow(2, attempt)));
    }
  }
}

/**
 * Fetch all public raw strudel snippet page objects from Notion in batches of 100.
 * Cached in Nitro memory to avoid redundant Notion API roundtrips.
 */
const getAllRawStrudelSnippets = defineCachedFunction(
  async () => {
    if (!dataSourceID) throw Error("Data Source ID empty");

    const filterOption: PropertyFilter = {
      property: "isPublic",
      checkbox: {
        equals: true
      }
    };

    let results: any[] = [];
    let hasMore = true;
    let nextCursor: string | undefined = undefined;

    while (hasMore) {
      const queryresult = await retryNotionApi(() =>
        notion.dataSources.query({
          data_source_id: dataSourceID,
          filter: filterOption,
          sorts: [
            {
              property: "Date",
              direction: "descending"
            }
          ],
          filter_properties: ["isPublic", "Date", "Name"],
          page_size: 100,
          start_cursor: nextCursor
        })
      );

      results = results.concat(queryresult.results);
      hasMore = queryresult.has_more;
      nextCursor = queryresult.next_cursor ?? undefined;
    }

    return results;
  },
  {
    maxAge: 60,
    name: "strudel-snippets-getAllRawStrudelSnippets",
    getKey: () => "all-raw-strudel-snippets",
    shouldBypassCache
  }
);

export const getManyStrudelSnippets = defineCachedFunction(
  async (input: ListStrudelSnippetsInput): Promise<ListStrudelSnippetsResult[]> => {
    const rawSnippets = await getAllRawStrudelSnippets();

    let startIndex = 0;
    if (input.cursor && input.cursor !== "") {
      const foundIndex = rawSnippets.findIndex(item => item.id === input.cursor);
      if (foundIndex !== -1) {
        startIndex = foundIndex;
      }
    }

    const sliced = rawSnippets.slice(startIndex, startIndex + 10);

    return sliced.map(result => {
      const props = (result as any).properties ?? {};

      return {
        id: result.id,
        title: props["Name"]?.title?.[0]?.plain_text ?? props["Title"]?.title?.[0]?.plain_text ?? "",
        date: props["Date"]?.date?.start ?? "",
        createdAt: (result as any)["created_time"],
        updatedAt: (result as any)["last_edited_time"],
      } as ListStrudelSnippetsResult;
    });
  },
  {
    maxAge: 60,
    name: "strudel-snippets-getManyStrudelSnippets",
    getKey: (input: ListStrudelSnippetsInput) => JSON.stringify(input ?? {}),
    shouldBypassCache
  }
);

export const getAllPagesAndCursors = defineCachedFunction(
  async (input: PaginationInput): Promise<Pagination> => {
    const rawSnippets = await getAllRawStrudelSnippets();
    const totalItems = rawSnippets.length;
    const totalPages = Math.ceil(totalItems / 10) || 1;

    const cursors: Record<number, string> = {};
    cursors[1] = "";

    for (let p = 2; p <= totalPages; p++) {
      const item = rawSnippets[(p - 1) * 10];
      cursors[p] = item ? item.id : "";
    }

    return {
      totalPages,
      cursorMap: cursors
    };
  },
  {
    maxAge: 300,
    name: "strudel-snippets-getAllPagesAndCursors",
    getKey: (input: PaginationInput) => JSON.stringify(input ?? {}),
    shouldBypassCache
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
    const response = await retryNotionApi(() =>
      notion.blocks.children.list({
        block_id: blockId,
        start_cursor: startCursor,
        page_size: 100,
      })
    );

    const childrenPromises: Promise<void>[] = [];

    for (const block of response.results) {
      if (!("type" in block)) {
        continue;
      }

      const notionBlock: NotionBlock = {
        ...block,
        children: [],
      };

      blocks.push(notionBlock);

      if (block.has_children) {
        childrenPromises.push(
          getBlockChildren(block.id).then(children => {
            notionBlock.children = children;
          })
        );
      }
    }

    if (childrenPromises.length > 0) {
      await Promise.all(childrenPromises);
    }

    hasMore = response.has_more;
    startCursor = response.next_cursor ?? undefined;
  }

  return blocks;
};

/**
 * Fetch a strudel snippet by ID with block objects instead of markdown.
 */
export const getStrudelSnippetBlocksById = defineCachedFunction(
  async (id: string): Promise<StrudelSnippetsBlocksResult> => {
    const [snippet, blocks] = await Promise.all([
      retryNotionApi(() =>
        notion.pages.retrieve({
          page_id: id,
          filter_properties: ["isPublic", "Date", "Name"]
        })
      ),
      getBlockChildren(id)
    ]);

    const props = (snippet as any).properties ?? {};

    return {
      id: id,
      title: props["Name"]?.title?.[0]?.plain_text ?? props["Title"]?.title?.[0]?.plain_text ?? "",
      date: props["Date"]?.date?.start ?? "",
      blocks,
      createdAt: (snippet as any)["created_time"],
      updatedAt: (snippet as any)["last_edited_time"],
    } as StrudelSnippetsBlocksResult;
  },
  {
    maxAge: 300,
    name: "strudel-snippets-getStrudelSnippetBlocksById",
    getKey: (id: string) => id,
    shouldBypassCache
  }
);
