import { URL } from "url";

export type EmbedResult =
  | { type: "oembed"; html: string; provider?: string; title?: string }
  | { type: "iframe"; iframeUrl: string; provider?: string }
  | { type: "bookmark"; title: string; description?: string; image?: string; siteName?: string; favicon?: string; url: string }
  | { type: "fallback"; url: string };

/**
 * Extract location/query from a Google Maps URL, resolving shortlinks if necessary.
 */
async function extractGoogleMapsInfo(urlStr: string): Promise<{ query?: string; zoom?: string; embedUrl?: string } | null> {
  let targetUrl = urlStr;

  // 1. Resolve shortened URLs (maps.app.goo.gl or goo.gl/maps) via HTTP GET request
  if (targetUrl.includes("maps.app.goo.gl") || targetUrl.includes("goo.gl/maps") || targetUrl.includes("google.com/url")) {
    try {
      const res = await fetch(targetUrl, {
        method: "GET",
        redirect: "follow",
        headers: {
          "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        }
      });
      if (res.url && res.url !== targetUrl) {
        targetUrl = res.url;
      } else {
        const text = await res.text();
        const refreshMatch =
          text.match(/<meta[^>]+http-equiv=["']refresh["'][^>]+content=["']\d+;\s*url=["']?([^"'>]+)["']?/i) ||
          text.match(/<a[^>]+href=["'](https:\/\/(?:www\.)?google\.[^"']+\/maps\/[^"']+)["']/i);
        if (refreshMatch) {
          targetUrl = refreshMatch[1];
        }
      }
    } catch {
      // Continue with original URL
    }
  }

  // Handle consent.google.com or google.com/url redirects
  if (targetUrl.includes("consent.google.com") || targetUrl.includes("google.com/url")) {
    try {
      const u = new URL(targetUrl);
      const cont = u.searchParams.get("continue") || u.searchParams.get("q");
      if (cont && cont.includes("google.com/maps")) {
        targetUrl = cont;
      }
    } catch {
      // Ignore URL parsing errors
    }
  }

  // 2. Already an iframe embed URL (e.g. google.com/maps/embed?pb=...)
  if (targetUrl.includes("/maps/embed")) {
    return { embedUrl: targetUrl };
  }

  try {
    const parsed = new URL(targetUrl);

    // 3. Check 3d/4d exact location coordinates in data parameter (!3d34.7120857!4d135.5082373)
    const dataMatch = targetUrl.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/);
    if (dataMatch) {
      return { query: `${dataMatch[1]},${dataMatch[2]}`, zoom: "15" };
    }

    // 4. Check q or query search parameter
    let qParam = parsed.searchParams.get("q") || parsed.searchParams.get("query");
    if (qParam) {
      qParam = qParam.replace(/^@/, "").replace(/,\d+z$/, "").trim();
      if (qParam) {
        return { query: qParam };
      }
    }

    // 4. Extract place name from pathname: /place/Place+Name/@lat,lng...
    const placeMatch = parsed.pathname.match(/\/place\/([^/@]+)/);
    if (placeMatch && placeMatch[1]) {
      const placeName = decodeURIComponent(placeMatch[1].replace(/\+/g, " ")).trim();
      if (placeName && placeName !== "@") {
        return { query: placeName };
      }
    }

    // 5. Extract search query from pathname: /search/Search+Query/...
    const searchMatch = parsed.pathname.match(/\/search\/([^/@]+)/);
    if (searchMatch && searchMatch[1]) {
      const searchQuery = decodeURIComponent(searchMatch[1].replace(/\+/g, " ")).trim();
      if (searchQuery) {
        return { query: searchQuery };
      }
    }

    // 6. Extract coordinates from pathname: /@lat,lng,zoom
    const coordMatch = parsed.pathname.match(/@(-?\d+\.\d+),(-?\d+\.\d+)(?:,(\d+(?:\.\d+)?z))?/);
    if (coordMatch) {
      const coords = `${coordMatch[1]},${coordMatch[2]}`;
      const zoom = coordMatch[3] ? coordMatch[3].replace("z", "") : undefined;
      return { query: coords, zoom };
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * Check static iframe patterns for supported providers
 */
function matchStaticIframePattern(url: string): string | null {
  // YouTube
  const youtubeMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]+)/);
  if (youtubeMatch) {
    return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
  }

  // Spotify
  const spotifyMatch = url.match(/open\.spotify\.com\/(track|album|playlist|episode|artist)\/([a-zA-Z0-9]+)/);
  if (spotifyMatch) {
    return `https://open.spotify.com/embed/${spotifyMatch[1]}/${spotifyMatch[2]}`;
  }

  // Figma
  if (url.includes("figma.com/")) {
    return `https://www.figma.com/embed?embed_host=share&url=${encodeURIComponent(url)}`;
  }

  // CodePen
  const codepenMatch = url.match(/codepen\.io\/([^/]+)\/(?:pen|embed)\/([a-zA-Z0-9]+)/);
  if (codepenMatch) {
    return `https://codepen.io/${codepenMatch[1]}/embed/${codepenMatch[2]}?default-tab=result`;
  }

  // Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(?:video\/)?([0-9]+)/);
  if (vimeoMatch) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  }

  // Loom
  const loomMatch = url.match(/loom\.com\/(?:share|embed)\/([a-zA-Z0-9]+)/);
  if (loomMatch) {
    return `https://www.loom.com/embed/${loomMatch[1]}`;
  }

  // SoundCloud
  if (url.includes("soundcloud.com/")) {
    return `https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}`;
  }

  // CodeSandbox
  const csbMatch = url.match(/codesandbox\.io\/s\/([a-zA-Z0-9_-]+)/);
  if (csbMatch) {
    return `https://codesandbox.io/embed/${csbMatch[1]}`;
  }

  return null;
}

/**
 * Get known oEmbed API endpoint for URL if available
 */
function getKnownOembedEndpoint(url: string): string | null {
  const encodedUrl = encodeURIComponent(url);

  if (url.includes("twitter.com/") || url.includes("x.com/")) {
    return `https://publish.twitter.com/oembed?url=${encodedUrl}&omit_script=true`;
  }
  if (url.includes("speakerdeck.com/")) {
    return `https://speakerdeck.com/oembed.json?url=${encodedUrl}`;
  }
  if (url.includes("slideshare.net/")) {
    return `https://www.slideshare.net/api/oembed/2?url=${encodedUrl}&format=json`;
  }
  if (url.includes("tiktok.com/")) {
    return `https://www.tiktok.com/oembed?url=${encodedUrl}`;
  }
  if (url.includes("giphy.com/")) {
    return `https://giphy.com/services/oembed?url=${encodedUrl}`;
  }

  return null;
}

/**
 * Parse OpenGraph and title tags from raw HTML content
 */
function parseOpenGraphMeta(htmlStr: string, targetUrl: string): { title?: string; description?: string; image?: string; siteName?: string; favicon?: string } {
  const getMetaTag = (attr: string, value: string): string | undefined => {
    const regex = new RegExp(`<meta[^>]+(?:${attr}=["']${value}["'][^>]+content=["']([^"']+)["']|content=["']([^"']+)["'][^>]+${attr}=["']${value}["'])`, "i");
    const match = htmlStr.match(regex);
    return match ? match[1] || match[2] : undefined;
  };

  const titleMatch = htmlStr.match(/<title[^>]*>([^<]+)<\/title>/i);
  const title = getMetaTag("property", "og:title") || getMetaTag("name", "title") || (titleMatch ? titleMatch[1].trim() : undefined);
  const description = getMetaTag("property", "og:description") || getMetaTag("name", "description");
  let image = getMetaTag("property", "og:image") || getMetaTag("name", "image");
  const siteName = getMetaTag("property", "og:site_name");

  // Favicon
  const faviconMatch = htmlStr.match(/<link[^>]+rel=["'](?:shortcut icon|icon)["'][^>]+href=["']([^"']+)["']/i) || htmlStr.match(/<link[^>]+href=["']([^"']+)["'][^>]+rel=["'](?:shortcut icon|icon)["']/i);
  let favicon = faviconMatch ? faviconMatch[1] : undefined;

  // Resolve relative URLs for image and favicon
  try {
    const base = new URL(targetUrl);
    if (image && !image.startsWith("http")) {
      image = new URL(image, base.origin).toString();
    }
    if (favicon && !favicon.startsWith("http")) {
      favicon = new URL(favicon, base.origin).toString();
    } else if (!favicon) {
      favicon = `${base.origin}/favicon.ico`;
    }
  } catch {
    // Ignore URL resolution errors
  }

  return { title, description, image, siteName, favicon };
}

/**
 * Resolve any URL to EmbedResult (oEmbed, iframe, or Bookmark)
 */
export async function resolveEmbed(url: string): Promise<EmbedResult> {
  if (!url || typeof url !== "string") {
    return { type: "fallback", url: url || "" };
  }

  const cleanUrl = url.trim();

  // 1. Google Maps Check
  if (cleanUrl.includes("google.com/maps") || cleanUrl.includes("maps.app.goo.gl") || cleanUrl.includes("maps.google.com") || cleanUrl.includes("goo.gl/maps")) {
    const info = await extractGoogleMapsInfo(cleanUrl);
    if (info?.embedUrl) {
      return { type: "iframe", iframeUrl: info.embedUrl, provider: "Google Maps" };
    }

    const apiKey = process.env.GOOGLE_CLOUD_API_KEY;
    if (apiKey && info?.query) {
      let iframeUrl = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encodeURIComponent(info.query)}`;
      if (info.zoom) {
        iframeUrl += `&zoom=${info.zoom}`;
      }
      return {
        type: "iframe",
        iframeUrl,
        provider: "Google Maps"
      };
    }

    // Fallback embed iframe URL (guarantees Google Maps always renders as an embedded map iframe)
    const fallbackQuery = info?.query || cleanUrl;
    const fallbackEmbedUrl = cleanUrl.includes("/maps/embed")
      ? cleanUrl
      : `https://maps.google.com/maps?q=${encodeURIComponent(fallbackQuery)}&output=embed`;

    return {
      type: "iframe",
      iframeUrl: fallbackEmbedUrl,
      provider: "Google Maps"
    };
  }

  // 2. Static Iframe Patterns (YouTube, Spotify, Figma, CodePen, Loom, etc.)
  const staticIframe = matchStaticIframePattern(cleanUrl);
  if (staticIframe) {
    return { type: "iframe", iframeUrl: staticIframe };
  }

  // 3. Known oEmbed Endpoints (Twitter, SpeakerDeck, TikTok, etc.)
  const knownOembedEndpoint = getKnownOembedEndpoint(cleanUrl);
  if (knownOembedEndpoint) {
    try {
      const data = await $fetch<any>(knownOembedEndpoint, {
        timeout: 4000
      });
      if (data && data.html) {
        return {
          type: "oembed",
          html: data.html,
          provider: data.provider_name,
          title: data.title
        };
      }
    } catch {
      // Fall through to autodiscovery / bookmark scraping
    }
  }

  // 4. HTML Autodiscovery & OpenGraph Scraping
  try {
    const htmlContent = await $fetch<string>(cleanUrl, {
      timeout: 4000,
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      }
    });

    if (typeof htmlContent === "string") {
      // Check for oEmbed link tag autodiscovery
      const oembedLinkMatch = htmlContent.match(/<link[^>]+type=["']application\/json\+oembed["'][^>]+href=["']([^"']+)["']/i) || htmlContent.match(/<link[^>]+href=["']([^"']+)["'][^>]+type=["']application\/json\+oembed["']/i);
      if (oembedLinkMatch) {
        const oembedUrl = oembedLinkMatch[1];
        try {
          const oembedData = await $fetch<any>(oembedUrl, { timeout: 3000 });
          if (oembedData && oembedData.html) {
            return {
              type: "oembed",
              html: oembedData.html,
              provider: oembedData.provider_name,
              title: oembedData.title
            };
          }
        } catch {
          // Ignore oEmbed fetch error, fallback to OpenGraph
        }
      }

      // OpenGraph / Bookmark metadata scraping
      const og = parseOpenGraphMeta(htmlContent, cleanUrl);
      if (og.title) {
        return {
          type: "bookmark",
          title: og.title,
          description: og.description,
          image: og.image,
          siteName: og.siteName,
          favicon: og.favicon,
          url: cleanUrl
        };
      }
    }
  } catch {
    // Fall through to fallback
  }

  // 5. Ultimate Fallback
  return { type: "fallback", url: cleanUrl };
}
