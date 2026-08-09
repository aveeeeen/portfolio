import { resolveEmbed } from "../service/embed.service";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const testUrl = (query.url as string) || "https://maps.app.goo.gl/qrHSk33iToWZJpX58";
  const result = await resolveEmbed(testUrl);
  return {
    testUrl,
    result
  };
});
