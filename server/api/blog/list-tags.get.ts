import { defineEventHandler, type H3Event } from 'h3'
import * as BlogService from "../../service/blog.service"

export default defineEventHandler(async (event) => {
  return await BlogService.getAllTags();
})