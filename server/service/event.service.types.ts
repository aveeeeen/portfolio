import type { BlockObjectResponse } from "@notionhq/client";

export type ListEventInput = {
  cursor?: string;
}

export type ListEventResult = {
  id: string;
  title: string;
  date: string;
  venue: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}

export type PaginationInput = {
} | undefined

export type Pagination = {
  totalPages: number;
  cursorMap: Map<number, string>
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
export type EventBlocksResult = ListEventResult & {
  blocks: NotionBlock[];
}