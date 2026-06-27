import { defineEventHandler, getQuery, type H3Event } from 'h3'
import * as BlogService from "../../service/blog.service"
import z from 'zod';

const pageListSchema = z.object({
  page: z.string().optional(),
  tags: z.preprocess(
      (val) => {
        if (val === undefined || val === null || val === "") return undefined;
        return Array.isArray(val) ? val : [val];
      },
      z.array(z.string())
    ).optional(),
  keyword: z.string().optional()
})

export default defineEventHandler(async (event) => {
  const query = await getValidatedQuery(event, (data) => pageListSchema.parse(data));
  const pagination = await BlogService.getPaginationData({
    tags: query.tags,
    keyword: query.keyword
  })

  const page = query.page ? Number(query.page) : 1;
  if (page > pagination.totalPages || page < 1) {
    return setResponseStatus(event, 400, "Out of Bound")
  }

  const cursor = pagination.cursorMap.get(page);
  const result = await BlogService.listArticles({
    cursor: cursor,
    tags: query.tags,
    keyword: query.keyword
  })
  return result
})