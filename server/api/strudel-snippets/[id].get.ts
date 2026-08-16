import { defineEventHandler } from "h3";
import * as StrudelSnippetsService from "../../service/strudel-snippets.service";
import z from "zod";

const getSnippetSchema = z.object({
  id: z.string().min(1).refine((val) => val !== "undefined", { message: "Invalid ID" })
});

export default defineEventHandler(async (event) => {
  const params = await getValidatedRouterParams(event, (data) => getSnippetSchema.parse(data));
  const snippet = await StrudelSnippetsService.getStrudelSnippetBlocksById(params.id);
  return snippet;
});
