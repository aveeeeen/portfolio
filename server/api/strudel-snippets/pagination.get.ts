import { defineEventHandler } from "h3";
import * as StrudelSnippetsService from "../../service/strudel-snippets.service";
import type { Pagination } from "~/server/service/strudel-snippets.service.types";

export default defineEventHandler(async (_event): Promise<Pagination> => {
  const pagination: Pagination = await StrudelSnippetsService.getPaginationData({});
  return pagination;
});
