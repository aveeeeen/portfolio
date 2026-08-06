import { defineEventHandler, type H3Event } from 'h3'
import * as EventService from "../../service/event.service"
import z from 'zod';

const pageListSchema = z.object({
  page: z.string().optional()
})

export default defineEventHandler(async (event) => {
  const query = await getValidatedQuery(event, (data) => pageListSchema.parse(data));
  const pagination = await EventService.getPaginationData({})

  const page = query.page ? Number(query.page) : 1;
  if (page > pagination.totalPages || page < 1) {
    return setResponseStatus(event, 400, "Out of Bound")
  }

  const cursor = pagination.cursorMap.get(page);
  const result = await EventService.listEvents({
    cursor: cursor,
  })
  return result
})