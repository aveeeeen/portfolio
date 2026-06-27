export type ListArticleInput = {
  cursor?: string;
  tags?: string[];
  keyword?: string;
}

export type ListArticleResult = {
  id: string;
  title: string;
  tag: {
    id: string;
    name: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

export type PaginationInput = {
  tags?: string[];
  keyword?: string;
} | undefined

export type Pagination = {
  totalPages: number;
  cursorMap: Map<number, string>
}