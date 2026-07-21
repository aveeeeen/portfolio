import type { BlockObjectResponse } from "@notionhq/client";

export type ListEventInput = {
  cursor?: string;
}

export type ListEventResult = {
  id: string;
  title: string;
  date: string;
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

export type EventResult = {
  id: string;
  title: string;
  data: string;
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
  date: string;
  blocks: NotionBlock[];
  createdAt: string;
  updatedAt: string;
}