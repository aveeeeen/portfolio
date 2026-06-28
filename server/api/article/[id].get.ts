import { defineEventHandler, getQuery, type H3Event } from 'h3'
import * as BlogService from "../../service/blog.service"
import z from 'zod';

const getArticleSchema = z.object({
  id: z.uuid()
})

export default defineEventHandler(async (event) => {
  const query = await getValidatedRouterParams(event, (data) => getArticleSchema.parse(data));
  const article = await BlogService.getArticleBlocksById(query.id);
  return article
})