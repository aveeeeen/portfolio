import { defineEventHandler } from "h3"
import * as Event from "../../service/event.service"
import type { Pagination } from "~/server/service/event.service.types";
import z from "zod";

export default defineEventHandler(async (event): Promise<Pagination> => {
  const pagination: Pagination = await Event.getPaginationData({});
  return pagination;
})