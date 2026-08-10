import { defineEventHandler, getQuery, type H3Event } from 'h3'
import * as EventService from "../../service/event.service"
import z from 'zod';

const getArticleSchema = z.object({
  id: z.string()
})

export default defineEventHandler(async (event) => {
  const query = await getValidatedRouterParams(event, (data) => getArticleSchema.parse(data));
  const article = await EventService.getEventBlocksById(query.id);
  return article
})