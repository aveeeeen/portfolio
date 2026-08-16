import type { BlockObjectResponse } from "@notionhq/client";

export type ListStrudelSnippetsInput = {
  cursor?: string;
}

export type ListStrudelSnippetsResult = {
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
  cursorMap: Record<number, string>;
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
export type StrudelSnippetsBlocksResult = {
  id: string;
  title: string;
  date: string;
  blocks: NotionBlock[];
  createdAt: string;
  updatedAt: string;
}