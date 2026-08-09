import { APIResponseError, Client } from "@notionhq/client";
import type { ArticleResult, ArticleBlocksResult, NotionBlock, ListArticleInput, Pagination, PaginationInput, Tag } from "./blog.service.types";
import type { GroupFilterOperatorArray } from "@notionhq/client/build/src/api-endpoints";
import { shouldBypassCache } from "../utils/cache";

const notion = new Client({
  auth: process.env.NOTION_API_KEY
});

const dataSourceID = process.env.NOTION_BLOG_DATASOURCE_ID;

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
 * Fetch all raw article page objects matching keyword and tags in batches of 100.
 * Cached in Nitro memory to avoid redundant Notion API roundtrips.
 */
const getAllRawArticles = defineCachedFunction(
  async (input?: { tags?: string[]; keyword?: string }) => {
    if (!dataSourceID) throw Error("Data Source ID empty");
    const andList: GroupFilterOperatorArray = [];

    andList.push({
      property: "isPublic",
      checkbox: {
        equals: true
      }
    })

    if (input?.keyword !== "" && input?.keyword) {
      andList.push({
        property: "Name",
        title: {
          contains: input.keyword
        }
      });
    }

    if (input?.tags && input.tags.length !== 0) {
      andList.push({
        property: "タグ",
        multi_select: {
          contains: input.tags
        }
      });
    }

    let results: any[] = [];
    let hasMore = true;
    let nextCursor: string | undefined = undefined;

    while (hasMore) {
      const queryresult = await retryNotionApi(() =>
        notion.dataSources.query({
          data_source_id: dataSourceID,
          filter: andList.length !== 0 ? { and: andList } : undefined,
          sorts: [
            {
              timestamp: "created_time",
              direction: "descending"
            }
          ],
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
    name: "blog-getAllRawArticles",
    getKey: (input) => JSON.stringify(input ?? {}),
    shouldBypassCache
  }
);

export const getManyArticles = defineCachedFunction(
  async (input: ListArticleInput) => {
    const rawArticles = await getAllRawArticles({
      tags: input.tags,
      keyword: input.keyword
    });

    let startIndex = 0;
    if (input.cursor && input.cursor !== "") {
      const foundIndex = rawArticles.findIndex(item => item.id === input.cursor);
      if (foundIndex !== -1) {
        startIndex = foundIndex;
      }
    }

    return rawArticles.slice(startIndex, startIndex + 10);
  },
  {
    maxAge: 60,
    name: "blog-getManyArticles",
    getKey: (input: ListArticleInput) => JSON.stringify(input ?? {}),
    shouldBypassCache
  }
);

export const getAllPagesAndCursors = defineCachedFunction(
  async (input: PaginationInput): Promise<Pagination> => {
    const rawArticles = await getAllRawArticles({
      tags: input?.tags,
      keyword: input?.keyword
    });
    const totalItems = rawArticles.length;
    const totalPages = Math.ceil(totalItems / 10) || 1;

    const cursors: Record<number, string> = {};
    cursors[1] = "";

    for (let p = 2; p <= totalPages; p++) {
      const item = rawArticles[(p - 1) * 10];
      cursors[p] = item ? item.id : "";
    }

    return {
      totalPages,
      cursorMap: cursors
    };
  },
  {
    maxAge: 300,
    name: "blog-getAllPagesAndCursors",
    getKey: (input: PaginationInput) => JSON.stringify(input ?? {}),
    shouldBypassCache
  }
);

export const getArticleById = async (id: string): Promise<ArticleResult> => {
  const [article, articleContent] = await Promise.all([
    retryNotionApi(() =>
      notion.pages.retrieve({
        page_id: id
      })
    ),
    retryNotionApi(() =>
      notion.pages.retrieveMarkdown({
        page_id: id
      })
    )
  ]);

  return {
    id: id,
    title: (article as any).properties["Name"].title[0].plain_text,
    tags: (article as any).properties["タグ"].multi_select.map((tag: any) => {
      return {
        name: tag.name,
        id: tag.id
      };
    }),
    content: (articleContent as any).markdown,
    createdAt: (article as any)["created_time"],
    updatedAt: (article as any)["last_edited_time"],
  };
};

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
 * Fetch an article by ID with block objects instead of markdown.
 */
export const getArticleBlocksById = defineCachedFunction(
  async (id: string): Promise<ArticleBlocksResult> => {
    const [article, blocks] = await Promise.all([
      retryNotionApi(() =>
        notion.pages.retrieve({
          page_id: id
        })
      ),
      getBlockChildren(id)
    ]);

    return {
      id: id,
      title: (article as any).properties["Name"].title[0].plain_text,
      tags: (article as any).properties["タグ"].multi_select.map((tag: any) => {
        return {
          name: tag.name,
          id: tag.id
        };
      }),
      blocks,
      createdAt: (article as any)["created_time"],
      updatedAt: (article as any)["last_edited_time"],
    };
  },
  {
    maxAge: 300,
    name: "blog-getArticleBlocksById-v9",
    getKey: (id: string) => id,
    shouldBypassCache
  }
);

export const getAllTags = defineCachedFunction(
  async (): Promise<Tag[]> => {
    if (!dataSourceID) throw Error("Data Source ID empty");
    const dataSourceMeta = await retryNotionApi(() =>
      notion.dataSources.retrieve({
        data_source_id: dataSourceID
      })
    );

    return (dataSourceMeta as any).properties["タグ"].multi_select.options.map((tag: any) => {
      return {
        id: tag.id,
        name: tag.name
      };
    });
  },
  {
    maxAge: 600,
    name: "blog-getAllTags",
    getKey: () => "all-tags",
    shouldBypassCache
  }
);