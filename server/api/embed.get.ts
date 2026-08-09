import { defineEventHandler, getQuery } from "h3";
import { resolveEmbed, type EmbedResult } from "../service/embed.service";
import { shouldBypassCache } from "../utils/cache";

const cachedResolveEmbed = defineCachedFunction(
  async (url: string): Promise<EmbedResult> => {
    return await resolveEmbed(url);
  },
  {
    maxAge: 60 * 60 * 24 * 7, // 7 days cache
    name: "embed-resolution-v5",
    getKey: (url: string) => url,
    shouldBypassCache
  }
);

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const targetUrl = typeof query.url === "string" ? query.url : "";
  if (!targetUrl) {
    return { type: "fallback", url: "" } as EmbedResult;
  }

  return await cachedResolveEmbed(targetUrl);
});
