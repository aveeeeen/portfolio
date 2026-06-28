import type { BlockObjectResponse, ListBlockChildrenResponse, PartialBlockObjectResponse } from "@notionhq/client";

export type ListArticleInput = {
  cursor?: string;
  tags?: string[];
  keyword?: string;
}

export type ListArticleResult = {
  id: string;
  title: string;
  tags: Tag[];
  createdAt: string;
  updatedAt: string;
}

export type PaginationInput = {
  tags?: string[];
  keyword?: string;
} | undefined

export type Pagination = {
  totalPages: number;
  cursorMap: Map<number, string>
}

export type Tag = {
  id: string;
  name: string;
}

export type ArticleResult = {
  id: string;
  title: string;
  tags: Tag[];
  content: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * A Notion block with recursively fetched children.
 * Extends the SDK's BlockObjectResponse with a children array.
 */
export type NotionBlock = BlockObjectResponse & {
  children: NotionBlock[];
}

/**
 * Article result with Notion block objects instead of markdown.
 */
export type ArticleBlocksResult = {
  id: string;
  title: string;
  tags: Tag[];
  blocks: NotionBlock[];
  excerpt?: string;
  createdAt: string;
  updatedAt: string;
}