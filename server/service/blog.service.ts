import type { ListArticleInput, ListArticleResult, Pagination, PaginationInput } from "./blog.service.types";
import * as BlogRepository from "./blog.repository";

export const listArticles = async (input: ListArticleInput): Promise<ListArticleResult[]> => {
  const result = await BlogRepository.getManyArticles(input);
  const transformedResult = result.map(page => {
    return {
      id: page.id,
      title: page.properties["Name"].title[0].plain_text,
      tag: page.properties["タグ"].multi_select.map(tag => {
        return {
        name: tag.name,
        id: tag.id
      }
    })
    } as ListArticleResult
  })
  
  return transformedResult
}


export const getPaginationData = async (input: PaginationInput): Promise<Pagination> => {
  const pagination = await BlogRepository.getAllPagesAndCursors(input);
  return pagination
}