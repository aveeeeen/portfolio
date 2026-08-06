import { defineEventHandler, type H3Event } from 'h3'
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
  const page = query.page ? Number(query.page) : 1;
  let cursor: string | undefined = undefined;

  if (page > 1) {
    const pagination = await BlogService.getPaginationData({
      tags: query.tags,
      keyword: query.keyword
    });

    if (page > pagination.totalPages || page < 1) {
      return setResponseStatus(event, 400, "Out of Bound");
    }

    cursor = pagination.cursorMap[page];
  }

  const result = await BlogService.listArticles({
    cursor: cursor,
    tags: query.tags,
    keyword: query.keyword
  });
  return result;
});