import { defineEventHandler } from "h3";
import * as StrudelSnippetsService from "../../service/strudel-snippets.service";
import z from "zod";

const pageListSchema = z.object({
  page: z.string().optional()
});

export default defineEventHandler(async (event) => {
  const query = await getValidatedQuery(event, (data) => pageListSchema.parse(data));
  const page = query.page ? Number(query.page) : 1;
  let cursor: string | undefined = undefined;

  if (page > 1) {
    const pagination = await StrudelSnippetsService.getPaginationData({});

    if (page > pagination.totalPages || page < 1) {
      return setResponseStatus(event, 400, "Out of Bound");
    }

    cursor = pagination.cursorMap[page];
  }

  const result = await StrudelSnippetsService.listStrudelSnippets({
    cursor: cursor,
  });
  return result;
});
