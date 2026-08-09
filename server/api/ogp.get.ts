import { defineEventHandler, getQuery } from "h3";
import { fetchOgpMeta, type OgpData } from "../service/ogp.service";
import { shouldBypassCache } from "../utils/cache";

const cachedFetchOgpMeta = defineCachedFunction(
  async (url: string): Promise<OgpData> => {
    return await fetchOgpMeta(url);
  },
  {
    maxAge: 60 * 60 * 24 * 7, // 7 days cache
    name: "ogp-metadata-v1",
    getKey: (url: string) => url,
    shouldBypassCache
  }
);

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const targetUrl = typeof query.url === "string" ? query.url : "";
  if (!targetUrl) {
    return { url: "" } as OgpData;
  }

  return await cachedFetchOgpMeta(targetUrl);
});
