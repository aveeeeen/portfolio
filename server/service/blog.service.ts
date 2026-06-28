import type { ArticleBlocksResult, ArticleResult, ListArticleInput, ListArticleResult, Pagination, PaginationInput, Tag } from "./blog.service.types";
import * as BlogRepository from "./blog.repository";

export const listArticles = async (input: ListArticleInput): Promise<ListArticleResult[]> => {
  console.log(input);
  const result = await BlogRepository.getManyArticles(input);
  const transformedResult = result.map(page => {
    return {
      id: page.id,
      title: page.properties["Name"].title[0].plain_text,
      tags: page.properties["タグ"].multi_select.map(tag => {
        return {
          name: tag.name,
          id: tag.id
        }
      }),
      createdAt: page["created_time"],
      updatedAt: page["last_edited_time"],
    } as ListArticleResult
  })
  return transformedResult
}


export const getPaginationData = async (input: PaginationInput): Promise<Pagination> => {
  const pagination = await BlogRepository.getAllPagesAndCursors(input);
  return pagination
}

export const getArticleById = async (id: string): Promise<ArticleResult> => {
  const article = await BlogRepository.getArticleById(id);
  return article;
}

const extractExcerpt = (blocks: NotionBlock[]): string => {
  const paragraphs: string[] = [];
  for (const block of blocks) {
    if (block.type === 'paragraph') {
      const richText = (block as any).paragraph?.rich_text;
      if (richText && Array.isArray(richText)) {
        const text = richText
          .map((rt: any) => rt.plain_text || '')
          .join('')
          .trim();
        if (text) {
          paragraphs.push(text);
          if (paragraphs.length === 2) {
            break;
          }
        }
      }
    }
  }
  return paragraphs.join('\n\n');
}

export const getArticleBlocksById = async (id: string): Promise<ArticleBlocksResult> => {
  const article = await BlogRepository.getArticleBlocksById(id);
  return {
    ...article,
    excerpt: extractExcerpt(article.blocks)
  };
}

export const getAllTags = async (): Promise<Tag[]> => {
  const tags = await BlogRepository.getAllTags();
  return tags;
}