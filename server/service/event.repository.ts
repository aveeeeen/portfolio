import { APIResponseError, Client } from "@notionhq/client";
import type { EventBlocksResult, NotionBlock, ListEventResult, ListEventInput, Pagination, PaginationInput } from "./event.service.types";
import type { PropertyFilter } from "@notionhq/client/build/src/api-endpoints";

const notion = new Client({
  auth: process.env.NOTION_API_KEY
});

const dataSourceID = process.env.NOTION_EVENT_DATASOURCE_ID;

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

export const getManyEvents = defineCachedFunction(
  async (input: ListEventInput): Promise<ListEventResult[]> => {
    if (!dataSourceID) throw Error("Data Source ID empty");

    const datasourceResult = await retryNotionApi(() =>
      notion.dataSources.query({
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
      })
    );

    return datasourceResult.results.map(result => {
      return {
        id: result.id,
        title: (result as any).properties["Name"].title[0].plain_text,
        date: (result as any).properties["Date"].date.start,
        venue: (result as any).properties["Venue"].rich_text[0].plain_text,
        imageUrl: (result as any).properties["Image"].files[0].file.url,
        createdAt: (result as any)["created_time"],
        updatedAt: (result as any)["last_edited_time"],
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
    let nextCursor: string | undefined = undefined;
    cursors[totalPages] = "";

    if (!dataSourceID) throw Error("Data Source ID empty");

    const filterOption: PropertyFilter = {
      property: "Publicity",
      select: {
        equals: "public"
      }
    };

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
          page_size: 10,
          start_cursor: nextCursor
        })
      );

      if (queryresult.has_more && queryresult.next_cursor) {
        nextCursor = queryresult.next_cursor;
        totalPages++;
        cursors[totalPages] = queryresult.next_cursor;
      } else {
        hasMore = false;
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
    const response = await retryNotionApi(() =>
      notion.blocks.children.list({
        block_id: blockId,
        start_cursor: startCursor,
        page_size: 100,
      })
    );

    const childrenPromises: Promise<void>[] = [];

    for (const block of response.results) {
      // Skip partial block objects (they only have object + id)
      if (!("type" in block)) {
        continue;
      }

      const notionBlock: NotionBlock = {
        ...block,
        children: [],
      };

      blocks.push(notionBlock);

      // Recursively fetch children in parallel if the block has nested content
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
 * Fetch an article by ID with block objects instead of markdown.
 */
export const getEventBlocksById = defineCachedFunction(
  async (id: string): Promise<EventBlocksResult> => {
    const [event, blocks] = await Promise.all([
      retryNotionApi(() =>
        notion.pages.retrieve({
          page_id: id
        })
      ),
      getBlockChildren(id)
    ]);

    return {
      id: id,
      title: (event as any).properties["Name"].title[0].plain_text,
      venue: (event as any).properties["Venue"].rich_text[0].plain_text,
      imageUrl: (event as any).properties["Image"].files[0].file.url,
      date: (event as any).properties["Date"].date.start,
      blocks,
      createdAt: (event as any)["created_time"],
      updatedAt: (event as any)["last_edited_time"],
    } as EventBlocksResult;
  },
  {
    maxAge: 300,
    name: "event-getEventBlocksById",
    getKey: (id: string) => id
  }
);