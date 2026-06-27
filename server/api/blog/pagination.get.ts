import { defineEventHandler, getValidatedQuery } from "h3"
import * as BlogService from "../../service/blog.service"
import type { Pagination } from "~/server/service/blog.service.types";
import z from "zod";

const paginationSchema = z.object({
  tags: z.preprocess(
    (val) => {
      if (val === undefined || val === null || val === "") return undefined;
      return Array.isArray(val) ? val : [val];
    },
    z.array(z.string())
  ).optional(),
  keyword: z.string().optional(),
})

export default defineEventHandler(async (event) => {
  const query = await getValidatedQuery(event, (data) => paginationSchema.parse(data))
  const pagination: Pagination = await BlogService.getPaginationData(query);
  console.log(pagination);
  return pagination;
})