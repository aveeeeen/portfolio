import { URL } from "url";

export type EmbedResult =
  | { type: "oembed"; html: string; provider?: string; title?: string; resolvedUrl?: string }
  | { type: "iframe"; iframeUrl: string; provider?: string; resolvedUrl?: string }
  | { type: "bookmark"; title: string; description?: string; image?: string; siteName?: string; favicon?: string; url: string; resolvedUrl?: string }
  | { type: "fallback"; url: string; resolvedUrl?: string };

/**
 * Extract location/query from a Google Maps URL, resolving shortlinks if necessary.
 */
async function extractGoogleMapsInfo(urlStr: string): Promise<{ query?: string; zoom?: string; embedUrl?: string; resolvedUrl?: string } | null> {
  let targetUrl = urlStr.trim();

  // Helper to extract nested Google Maps URL from query parameters (link, continue, q, url)
  const unwrapNestedUrl = (u: string): string => {
    try {
      const parsed = new URL(u);
      const nested = parsed.searchParams.get("link") || parsed.searchParams.get("continue") || parsed.searchParams.get("url");
      if (nested && (nested.includes("google.com/maps") || nested.includes("maps.google.com") || nested.includes("place"))) {
        return decodeURIComponent(nested);
      }
    } catch {
      // Ignore URL parse error
    }
    return u;
  };

  targetUrl = unwrapNestedUrl(targetUrl);

  // 1. Resolve shortened URLs (maps.app.goo.gl or goo.gl/maps or google.com/url) via HTTP GET request
  if (targetUrl.includes("maps.app.goo.gl") || targetUrl.includes("goo.gl/maps") || targetUrl.includes("google.com/url")) {
    try {
      // 1a. Try manual redirect with bot User-Agent (Firebase Dynamic Links returns 302 Location header for bots)
      const manualRes = await fetch(targetUrl, {
        method: "GET",
        redirect: "manual",
        headers: {
          "User-Agent": "facebookexternalhit/1.1"
        }
      });
      const loc = manualRes.headers.get("location");
      if (loc && loc.startsWith("http")) {
        targetUrl = unwrapNestedUrl(loc);
      } else {
        // 1b. Try with ?dfl=1 desktop fallback parameter
        const urlWithDfl = targetUrl.includes("?") ? `${targetUrl}&dfl=1` : `${targetUrl}?dfl=1`;
        const manualResDfl = await fetch(urlWithDfl, {
          method: "GET",
          redirect: "manual",
          headers: {
            "User-Agent": "facebookexternalhit/1.1"
          }
        });
        const locDfl = manualResDfl.headers.get("location");
        if (locDfl && locDfl.startsWith("http")) {
          targetUrl = unwrapNestedUrl(locDfl);
        } else {
          // 1c. Fallback GET with follow redirects
          const res = await fetch(targetUrl, {
            method: "GET",
            redirect: "follow",
            headers: {
              "User-Agent": "facebookexternalhit/1.1"
            }
          });
          if (res.url && res.url !== targetUrl) {
            targetUrl = unwrapNestedUrl(res.url);
          }
          const text = await res.text();
          const refreshMatch =
            text.match(/<meta[^>]+http-equiv=["']refresh["'][^>]+content=["']\d+;\s*url=["']?([^"'>]+)["']?/i) ||
            text.match(/(https:\/\/(?:www\.)?google\.[^"'\s<>]+\/maps\/place\/[^"'\s<>]+)/i) ||
            text.match(/(https:\/\/(?:www\.)?google\.[^"'\s<>]+\/maps\/[^"'\s<>]+)/i);

          if (refreshMatch) {
            targetUrl = unwrapNestedUrl(refreshMatch[1]);
          } else {
            const qMatch = text.match(/\/maps\/preview\/place\?[^"'\s<>]*q=([^&"'\s<>]+)/i);
            if (qMatch) {
              targetUrl = `https://www.google.com/maps/place/${qMatch[1]}`;
            }
          }
        }
      }
    } catch {
      // Continue with targetUrl
    }
  }

  // Handle consent.google.com or google.com/url redirects
  if (targetUrl.includes("consent.google.com") || targetUrl.includes("google.com/url")) {
    try {
      const u = new URL(targetUrl);
      const cont = u.searchParams.get("continue") || u.searchParams.get("q") || u.searchParams.get("url");
      if (cont && cont.includes("google.com/maps")) {
        targetUrl = decodeURIComponent(cont);
      }
    } catch {
      // Ignore URL parsing errors
    }
  }

  targetUrl = unwrapNestedUrl(targetUrl);

  const resolvedUrl = targetUrl !== urlStr ? targetUrl : undefined;

  // 2. Already an iframe embed URL (e.g. google.com/maps/embed?pb=...)
  if (targetUrl.includes("/maps/embed")) {
    return { embedUrl: targetUrl, resolvedUrl };
  }

  try {
    // Decode targetUrl in case parameters are URL-encoded
    const decodedUrl = decodeURIComponent(targetUrl);

    // 3. Priority 1: Check 3d/4d exact location coordinates in data parameter (!3d34.7120857!4d135.5082373)
    const dataMatch = decodedUrl.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/) || targetUrl.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/);
    if (dataMatch) {
      return { query: `${dataMatch[1]},${dataMatch[2]}`, zoom: "15", resolvedUrl };
    }

    // 4. Priority 2: Check @lat,lng coordinates in URL
    const coordMatch = decodedUrl.match(/@(-?\d+\.\d+),(-?\d+\.\d+)(?:,(\d+(?:\.\d+)?z))?/) || targetUrl.match(/@(-?\d+\.\d+),(-?\d+\.\d+)(?:,(\d+(?:\.\d+)?z))?/);
    if (coordMatch) {
      const coords = `${coordMatch[1]},${coordMatch[2]}`;
      const zoom = coordMatch[3] ? coordMatch[3].replace("z", "") : "15";
      return { query: coords, zoom, resolvedUrl };
    }

    const parsed = new URL(targetUrl);

    // 5. Priority 3: Check q or query search parameter
    let qParam = parsed.searchParams.get("q") || parsed.searchParams.get("query");
    if (qParam) {
      qParam = qParam.replace(/^@/, "").replace(/,\d+z$/, "").trim();
      if (qParam && !qParam.startsWith("http")) {
        return { query: qParam, resolvedUrl };
      }
    }

    // 6. Priority 4: Check place name from pathname: /place/Place+Name/
    const placeMatch = parsed.pathname.match(/\/place\/([^/@]+)/);
    if (placeMatch && placeMatch[1]) {
      const placeName = decodeURIComponent(placeMatch[1].replace(/\+/g, " ")).trim();
      if (placeName && placeName !== "@") {
        return { query: placeName, resolvedUrl };
      }
    }

    // 7. Priority 5: Check search query from pathname: /search/Search+Query/...
    const searchMatch = parsed.pathname.match(/\/search\/([^/@]+)/);
    if (searchMatch && searchMatch[1]) {
      const searchQuery = decodeURIComponent(searchMatch[1].replace(/\+/g, " ")).trim();
      if (searchQuery) {
        return { query: searchQuery, resolvedUrl };
      }
    }

    // 8. Priority 6: Check FTID or Place ID or search query in data parameter (!1s...)
    const ftidMatch = decodedUrl.match(/!1s(0x[0-9a-fA-F]+:0x[0-9a-fA-F]+)/);
    if (ftidMatch) {
      return { query: ftidMatch[1], zoom: "15", resolvedUrl };
    }

    return { resolvedUrl };
  } catch {
    return { resolvedUrl };
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
 * Extract OpenGraph metadata from HTML string for Bookmark card fallback
 */
function extractOpenGraphMetadata(htmlStr: string, targetUrl: string): { title?: string; description?: string; image?: string; siteName?: string; favicon?: string } {
  const getMetaTag = (attrName: string, attrVal: string): string | undefined => {
    const regex1 = new RegExp(`<meta[^>]+${attrName}=["']${attrVal}["'][^>]+content=["']([^"']+)["']`, "i");
    const regex2 = new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+${attrName}=["']${attrVal}["']`, "i");
    const match = htmlStr.match(regex1) || htmlStr.match(regex2);
    return match ? match[1] : undefined;
  };

  let title = getMetaTag("property", "og:title") || getMetaTag("name", "title");
  if (!title) {
    const titleMatch = htmlStr.match(/<title[^>]*>([^<]+)<\/title>/i);
    title = titleMatch ? titleMatch[1].trim() : undefined;
  }

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
      return { type: "iframe", iframeUrl: info.embedUrl, provider: "Google Maps", resolvedUrl: info.resolvedUrl };
    }

    if (info?.query) {
      const apiKey = process.env.GOOGLE_CLOUD_API_KEY;
      const isValidApiKey = apiKey && !apiKey.startsWith("secret_") && apiKey.length > 20;

      if (isValidApiKey) {
        let iframeUrl = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encodeURIComponent(info.query)}`;
        if (info.zoom) {
          iframeUrl += `&zoom=${info.zoom}`;
        }
        return {
          type: "iframe",
          iframeUrl,
          provider: "Google Maps",
          resolvedUrl: info.resolvedUrl
        };
      }

      let fallbackEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(info.query)}&output=embed`;
      if (info.zoom) {
        fallbackEmbedUrl += `&z=${info.zoom}`;
      }
      return {
        type: "iframe",
        iframeUrl: fallbackEmbedUrl,
        provider: "Google Maps",
        resolvedUrl: info.resolvedUrl
      };
    }

    return {
      type: "bookmark",
      title: "Google Maps",
      description: "Google マップで場所を表示します",
      siteName: "Google Maps",
      url: info?.resolvedUrl || cleanUrl,
      resolvedUrl: info?.resolvedUrl
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
