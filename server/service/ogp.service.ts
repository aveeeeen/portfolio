import { URL } from "url";

export type OgpData = {
  url: string;
  siteName?: string;
  title?: string;
  description?: string;
  image?: string;
};

/**
 * Fetch OpenGraph meta elements (og:site_name, og:title, og:description, og:image) for a given URL
 */
export async function fetchOgpMeta(targetUrl: string): Promise<OgpData> {
  if (!targetUrl || typeof targetUrl !== "string") {
    return { url: targetUrl || "" };
  }

  const cleanUrl = targetUrl.trim();

  try {
    const htmlContent = await $fetch<string>(cleanUrl, {
      timeout: 5000,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "ja,en-US;q=0.9,en;q=0.8"
      }
    });

    if (typeof htmlContent !== "string") {
      return { url: cleanUrl };
    }

    const getMetaContent = (property: string): string | undefined => {
      const regex1 = new RegExp(
        `<meta[^>]+(?:property|name)=["']${property}["'][^>]+content=["']([^"']+)["']`,
        "i"
      );
      const regex2 = new RegExp(
        `<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${property}["']`,
        "i"
      );

      const match = htmlContent.match(regex1) || htmlContent.match(regex2);
      if (!match) return undefined;

      const val = match[1].trim();
      return val ? val : undefined;
    };

    const siteName = getMetaContent("og:site_name");
    const title = getMetaContent("og:title");
    const description = getMetaContent("og:description");
    let image = getMetaContent("og:image");

    // Resolve relative image URL to absolute URL if needed
    if (image) {
      try {
        const base = new URL(cleanUrl);
        if (!image.startsWith("http://") && !image.startsWith("https://")) {
          image = new URL(image, base.origin).toString();
        }
      } catch {
        // Keep original image string if URL parsing fails
      }
    }

    const result: OgpData = { url: cleanUrl };
    if (siteName) result.siteName = siteName;
    if (title) result.title = title;
    if (description) result.description = description;
    if (image) result.image = image;

    return result;
  } catch (err) {
    return { url: cleanUrl };
  }
}
