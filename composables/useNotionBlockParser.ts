/**
 * useNotionBlockParser
 *
 * Converts Notion Block Objects into HTML.
 * Designed to work with blocks fetched via blocks.children.list() API.
 */

// Re-use a minimal type that matches what the server sends
// (BlockObjectResponse + children). We don't import from @notionhq/client
// because this runs on the client side.
interface RichTextItem {
  type: string;
  text?: {
    content: string;
    link?: { url: string } | null;
  };
  mention?: {
    type: string;
    user?: { id: string };
    page?: { id: string };
    database?: { id: string };
    date?: { start: string; end?: string | null };
    link_preview?: { url: string };
  };
  equation?: {
    expression: string;
  };
  annotations: {
    bold: boolean;
    italic: boolean;
    strikethrough: boolean;
    underline: boolean;
    code: boolean;
    color: string;
  };
  plain_text: string;
  href?: string | null;
}

interface NotionBlock {
  id: string;
  type: string;
  has_children: boolean;
  children: NotionBlock[];
  [key: string]: any;
}

export function useNotionBlockParser() {
  const $img = useImage();

  // ─── Color helpers ───

  const getTextColorClass = (color: string): string => {
    if (color === "default" || !color) return "";
    if (color.endsWith("_background")) {
      return `notion-bg-${color.replace("_background", "")}`;
    }
    return `notion-color-${color}`;
  };

  const getBlockColorClass = (color: string): string => {
    const cls = getTextColorClass(color);
    return cls ? ` class="${cls}"` : "";
  };

  // ─── Rich text rendering ───

  const escapeHtml = (str: string): string => {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  };

  const renderRichText = (richTextItems: RichTextItem[]): string => {
    if (!richTextItems || richTextItems.length === 0) return "";

    return richTextItems.map(item => {
      let text = "";

      if (item.type === "text") {
        text = escapeHtml(item.text?.content || "");
        if (item.text?.link) {
          text = `<a href="${item.text.link.url}" target="_blank" rel="noopener noreferrer">${text}</a>`;
          if (escapeHtml(item.text.link.url).includes("embed")) text = `<div class="notion-embed">\n  <iframe src="${item.text.link.url || ""}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`;
        }
      } else if (item.type === "mention") {
        text = renderMention(item);
      } else if (item.type === "equation") {
        const expr = escapeHtml(item.equation?.expression || "");
        text = `<code class="notion-inline-math">${expr}</code>`;
      } else {
        text = escapeHtml(item.plain_text || "");
      }

      text = applyAnnotations(text, item.annotations);
      return text;
    }).join("");
  };

  const renderMention = (item: RichTextItem): string => {
    const mention = item.mention;
    const plainText = escapeHtml(item.plain_text || "");

    if (!mention) return plainText;

    switch (mention.type) {
      case "user":
        return `<span class="notion-mention notion-mention-user">👤 ${plainText}</span>`;
      case "page":
        return `<span class="notion-mention notion-mention-page">📄 <a href="${item.href || ""}">${plainText}</a></span>`;
      case "database":
        return `<span class="notion-mention notion-mention-database">🗃️ <a href="${item.href || ""}">${plainText}</a></span>`;
      case "date": {
        const start = mention.date?.start || "";
        const end = mention.date?.end || "";
        const display = end ? `${start} → ${end}` : start;
        return `<span class="notion-mention notion-mention-date">🗓️ ${display}</span>`;
      }
      case "link_preview":
        return `<span class="notion-mention notion-mention-link">🔗 <a href="${mention.link_preview?.url || ""}" target="_blank" rel="noopener noreferrer">${plainText}</a></span>`;
      default:
        return plainText;
    }
  };

  const applyAnnotations = (text: string, annotations: RichTextItem["annotations"]): string => {
    if (!annotations) return text;

    if (annotations.code) {
      text = `<code>${text}</code>`;
    }
    if (annotations.bold) {
      text = `<strong>${text}</strong>`;
    }
    if (annotations.italic) {
      text = `<em>${text}</em>`;
    }
    if (annotations.strikethrough) {
      text = `<del>${text}</del>`;
    }
    if (annotations.underline) {
      text = `<span class="notion-underline">${text}</span>`;
    }
    if (annotations.color && annotations.color !== "default") {
      const colorClass = getTextColorClass(annotations.color);
      if (colorClass) {
        text = `<span class="${colorClass}">${text}</span>`;
      }
    }

    return text;
  };

  // ─── File URL extraction ───

  const getFileUrl = (fileObj: any): string => {
    if (!fileObj) return "";
    if (fileObj.type === "external") {
      return fileObj.external?.url || "";
    }
    if (fileObj.type === "file") {
      return fileObj.file?.url || "";
    }
    if (fileObj.type === "file_upload") {
      return fileObj.file_upload?.url || "";
    }
    return "";
  };

  // ─── Icon rendering ───

  const getIconHtml = (icon: any): string => {
    if (!icon) return "";
    if (icon.type === "emoji") {
      return icon.emoji || "";
    }
    if (icon.type === "external" || icon.type === "file") {
      const url = getFileUrl(icon);
      return url ? `<img src="${url}" alt="icon" class="notion-icon">` : "";
    }
    return "";
  };

  // ─── Heading ID generation ───

  const generateHeadingId = (text: string): string => {
    return text
      .toLowerCase()
      .replace(/<[^>]*>/g, "")
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  // ─── Block rendering ───

  const renderBlocks = (blocks: NotionBlock[]): string => {
    let html = "";
    let i = 0;

    while (i < blocks.length) {
      const block = blocks[i];

      // Group consecutive list items
      if (block.type === "bulleted_list_item") {
        html += `<ul>\n`;
        while (i < blocks.length && blocks[i].type === "bulleted_list_item") {
          html += renderBlock(blocks[i]);
          i++;
        }
        html += `</ul>\n`;
        continue;
      }

      if (block.type === "numbered_list_item") {
        html += `<ol>\n`;
        while (i < blocks.length && blocks[i].type === "numbered_list_item") {
          html += renderBlock(blocks[i]);
          i++;
        }
        html += `</ol>\n`;
        continue;
      }

      if (block.type === "to_do") {
        html += `<ul class="notion-todo-list">\n`;
        while (i < blocks.length && blocks[i].type === "to_do") {
          html += renderBlock(blocks[i]);
          i++;
        }
        html += `</ul>\n`;
        continue;
      }

      html += renderBlock(block);
      i++;
    }

    return html;
  };

  const renderBlock = (block: NotionBlock): string => {
    const typeData = block[block.type];
    const childrenHtml = block.children.length > 0 ? renderBlocks(block.children) : "";

    switch (block.type) {
      case "paragraph":
        return renderParagraph(typeData, childrenHtml);
      case "heading_1":
        return renderHeading(typeData, 1, childrenHtml, block.id);
      case "heading_2":
        return renderHeading(typeData, 2, childrenHtml, block.id);
      case "heading_3":
        return renderHeading(typeData, 3, childrenHtml, block.id);
      case "heading_4":
        return renderHeading(typeData, 4, childrenHtml, block.id);
      case "bulleted_list_item":
        return renderListItem(typeData, childrenHtml);
      case "numbered_list_item":
        return renderListItem(typeData, childrenHtml);
      case "to_do":
        return renderTodo(typeData, childrenHtml);
      case "toggle":
        return renderToggle(typeData, childrenHtml);
      case "quote":
        return renderQuote(typeData, childrenHtml);
      case "callout":
        return renderCallout(typeData, childrenHtml);
      case "code":
        return renderCode(typeData);
      case "divider":
        return `<hr>\n`;
      case "image":
        return renderImage(typeData);
      case "video":
        return renderVideo(typeData);
      case "audio":
        return renderAudio(typeData);
      case "file":
        return renderFile(typeData);
      case "pdf":
        return renderPdf(typeData);
      case "bookmark":
        return renderBookmark(typeData, (block as any).ogpData, (block as any).embedData);
      case "embed":
        return renderEmbed(typeData, (block as any).embedData);
      case "equation":
        return renderEquation(typeData);
      case "table":
        return renderTable(typeData, block.children);
      case "column_list":
        return renderColumnList(block.children);
      case "column":
        return renderColumn(childrenHtml);
      case "synced_block":
        return childrenHtml;
      case "table_of_contents":
        return "";
      case "child_page":
        return `<div class="notion-child-block">📄 ${escapeHtml(typeData?.title || "Untitled")}</div>\n`;
      case "child_database":
        return `<div class="notion-child-block">🗃️ ${escapeHtml(typeData?.title || "Untitled")}</div>\n`;
      case "link_preview":
        return renderLinkPreview(typeData, (block as any).ogpData, (block as any).embedData);
      case "breadcrumb":
        return "";
      case "unsupported":
        return "";
      default:
        return "";
    }
  };

  // ─── Individual block renderers ───

  const renderParagraph = (data: any, childrenHtml: string): string => {
    const richText = renderRichText(data?.rich_text || []);
    const colorClass = getBlockColorClass(data?.color || "default");
    const isEmpty = !richText && !childrenHtml;

    if (isEmpty) {
      return `<div class="notion-empty-paragraph"></div>\n`;
    }

    return `<p${colorClass}>${richText}${childrenHtml ? "\n" + childrenHtml : ""}</p>\n`;
  };

  const renderHeading = (data: any, level: number, childrenHtml: string, blockId: string): string => {
    const richText = renderRichText(data?.rich_text || []);
    const id = blockId;
    const colorClass = getBlockColorClass(data?.color || "default");
    const isToggleable = data?.is_toggleable === true;
    const tag = `h${level}`;

    if (isToggleable) {
      return `<details${colorClass} id="${id}" class="notion-toggle-${tag}"><summary><${tag}>${richText}</${tag}></summary>\n<div>\n${childrenHtml}</div>\n</details>\n`;
    }

    return `<${tag}${colorClass} id="${id}">${richText}</${tag}>\n`;
  };

  const renderListItem = (data: any, childrenHtml: string): string => {
    const richText = renderRichText(data?.rich_text || []);
    const colorClass = getBlockColorClass(data?.color || "default");
    return `<li${colorClass}>${richText}${childrenHtml ? "\n" + childrenHtml : ""}</li>\n`;
  };

  const renderTodo = (data: any, childrenHtml: string): string => {
    const richText = renderRichText(data?.rich_text || []);
    const checked = data?.checked === true;
    const colorClass = getBlockColorClass(data?.color || "default");
    const checkbox = `<input type="checkbox" disabled${checked ? " checked" : ""}>`;
    return `<li${colorClass}><label>${checkbox}<span class="${checked ? "notion-todo-checked" : ""}">${richText}</span></label>${childrenHtml ? "\n" + childrenHtml : ""}</li>\n`;
  };

  const renderToggle = (data: any, childrenHtml: string): string => {
    const richText = renderRichText(data?.rich_text || []);
    const colorClass = getBlockColorClass(data?.color || "default");
    return `<details${colorClass} class="notion-toggle"><summary>${richText}</summary>\n<div>\n${childrenHtml}</div></details>\n`;
  };

  const renderQuote = (data: any, childrenHtml: string): string => {
    const richText = renderRichText(data?.rich_text || []);
    const colorClass = getBlockColorClass(data?.color || "default");
    return `<blockquote${colorClass}>${richText}${childrenHtml ? "\n" + childrenHtml : ""}</blockquote>\n`;
  };

  const renderCallout = (data: any, childrenHtml: string): string => {
    const richText = renderRichText(data?.rich_text || []);
    const icon = getIconHtml(data?.icon) || "💡";
    const color = data?.color || "default";
    const colorClass = getTextColorClass(color);

    return `<div class="notion-callout${colorClass ? ' ' + colorClass : ''}">\n  <span class="notion-callout-icon">${icon}</span>\n  <div class="notion-callout-content">\n${richText ? `    <p>${richText}</p>\n` : ""}${childrenHtml}  </div>\n</div>\n`;
  };

  const renderCode = (data: any): string => {
    const richText = (data?.rich_text || []).map((rt: RichTextItem) => rt.plain_text).join("");
    const escaped = escapeHtml(richText);
    const language = data?.language || "";
    const caption = renderRichText(data?.caption || []);

    let html = `<pre><code class="language-${language}">${escaped}</code></pre>\n`;

    if (caption) {
      html += `<div class="notion-caption">${caption}</div>\n`;
    }

    return html;
  };

  const renderImage = (data: any): string => {
    const url = getFileUrl(data);
    const caption = renderRichText(data?.caption || []);
    let imgUrl = url;
    try {
      imgUrl = $img(url, { format: 'webp' });
    } catch {
      imgUrl = url;
    }

    return `<figure class="notion-image-figure">\n  <img src="${imgUrl}" alt="${caption ? caption.replace(/<[^>]*>/g, "") : ""}" loading="lazy" decoding="async">\n  ${caption ? `<figcaption>${caption}</figcaption>` : ""}\n</figure>\n`;
  };

  const parseTimestampToSeconds = (ts: string): number | null => {
    if (!ts) return null;
    const clean = ts.replace(/s$/i, "").trim();
    if (/^\d+$/.test(clean)) {
      return parseInt(clean, 10);
    }
    const match = clean.match(/(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s?)?/i);
    if (match && (match[1] || match[2] || match[3])) {
      const h = parseInt(match[1] || "0", 10);
      const m = parseInt(match[2] || "0", 10);
      const s = parseInt(match[3] || "0", 10);
      return h * 3600 + m * 60 + s;
    }
    return null;
  };

  const formatYouTubeEmbedUrl = (url: string): string | null => {
    if (!url) return null;

    const youtubeMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([a-zA-Z0-9_-]+)/);
    if (!youtubeMatch) return null;

    const videoId = youtubeMatch[1];
    let embedUrl = `https://www.youtube.com/embed/${videoId}`;

    let startSec: number | null = null;
    try {
      const parsed = new URL(url);
      const tParam = parsed.searchParams.get("t") || parsed.searchParams.get("start") || parsed.hash.replace(/^#/, "").match(/(?:t|start)=([^&]+)/)?.[1];
      if (tParam) {
        startSec = parseTimestampToSeconds(tParam);
      }
    } catch {
      const tMatch = url.match(/[?&#](?:t|start)=([^&#]+)/);
      if (tMatch) {
        startSec = parseTimestampToSeconds(tMatch[1]);
      }
    }

    if (startSec !== null && !isNaN(startSec) && startSec > 0) {
      embedUrl += `?start=${startSec}`;
    }

    return embedUrl;
  };

  const renderVideo = (data: any): string => {
    const url = getFileUrl(data);
    const caption = renderRichText(data?.caption || []);

    // YouTube embed support
    const ytEmbedUrl = formatYouTubeEmbedUrl(url);
    if (ytEmbedUrl) {
      return `<div class="notion-media notion-video"><iframe src="${escapeHtml(ytEmbedUrl)}" allowfullscreen></iframe>${caption ? `<div class="notion-caption">${caption}</div>` : ""}</div>\n`;
    }

    return `<div class="notion-media notion-video"><video src="${url}" controls></video>${caption ? `<div class="notion-caption">${caption}</div>` : ""}</div>\n`;
  };

  const renderAudio = (data: any): string => {
    const url = getFileUrl(data);
    const caption = renderRichText(data?.caption || []);
    return `<div class="notion-media notion-audio"><audio src="${url}" controls></audio>${caption ? `<div class="notion-caption">${caption}</div>` : ""}</div>\n`;
  };

  const renderFile = (data: any): string => {
    const url = getFileUrl(data);
    const caption = renderRichText(data?.caption || []);
    const name = data?.name || "Download file";
    return `<div class="notion-media notion-file"><span class="notion-file-icon">📎</span><a href="${url}" target="_blank">${escapeHtml(name)}</a>${caption ? `<span class="notion-caption">${caption}</span>` : ""}</div>\n`;
  };

  const renderPdf = (data: any): string => {
    const url = getFileUrl(data);
    const caption = renderRichText(data?.caption || []);
    return `<div class="notion-media notion-pdf"><iframe src="${url}"></iframe>${caption ? `<div class="notion-caption">${caption}</div>` : ""}</div>\n`;
  };

  const renderOgpCard = (ogp: any, caption: string): string => {
    if (!ogp) return "";

    const siteName = ogp.siteName ? escapeHtml(ogp.siteName) : null;
    const title = ogp.title ? escapeHtml(ogp.title) : null;
    const description = ogp.description ? escapeHtml(ogp.description) : null;
    const image = ogp.image ? escapeHtml(ogp.image) : null;
    const url = escapeHtml(ogp.url || "");

    const hasAnyMeta = title || description || siteName || image;

    if (!hasAnyMeta) {
      return `<div class="notion-embed notion-bookmark-card"><a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>${caption ? `<div class="notion-caption">${caption}</div>` : ""}</div>\n`;
    }

    return `<div class="notion-embed notion-bookmark-card">
  <a href="${url}" target="_blank" rel="noopener noreferrer" class="notion-bookmark-card-link">
    <div class="notion-bookmark-card-content">
      ${title ? `<div class="notion-bookmark-card-title">${title}</div>` : ""}
      ${description ? `<div class="notion-bookmark-card-description">${description}</div>` : ""}
      ${siteName ? `<div class="notion-bookmark-card-site"><span>${siteName}</span></div>` : ""}
    </div>
    ${image ? `<div class="notion-bookmark-card-image" style="background-image: url('${image}');"></div>` : ""}
  </a>
  ${caption ? `<div class="notion-caption">${caption}</div>` : ""}
</div>\n`;
  };

  const isGoogleMapsUrl = (url: string): boolean => {
    return (
      url.includes("google.com/maps") ||
      url.includes("maps.google.com") ||
      url.includes("maps.app.goo.gl") ||
      url.includes("goo.gl/maps")
    );
  };

  const renderBookmark = (data: any, ogpData?: any, embedData?: any): string => {
    const url = data?.url || "";
    const caption = renderRichText(data?.caption || []);

    // 1. If server provided embedData
    if (embedData) {
      if (embedData.type === "iframe" && embedData.iframeUrl) {
        return `<div class="notion-embed">\n  <iframe src="${escapeHtml(embedData.iframeUrl)}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>\n  ${caption ? `<div class="notion-caption">${caption}</div>` : ""}\n</div>\n`;
      }
      if (embedData.type === "bookmark") {
        if (isGoogleMapsUrl(url) || isGoogleMapsUrl(embedData.url || "")) {
          const targetUrl = embedData.url || url;
          return `<div class="notion-embed notion-bookmark-card"><a href="${escapeHtml(targetUrl)}" target="_blank" rel="noopener noreferrer">Google Maps で場所を開く</a>${caption ? `<div class="notion-caption">${caption}</div>` : ""}</div>\n`;
        }
        return renderOgpCard(embedData, caption);
      }
      return renderEmbedResult(embedData, caption, url, false);
    }

    // 2. Client-side iframe formatting fallback
    const formatted = formatEmbedUrl(url);
    if (formatted && formatted !== url) {
      return `<div class="notion-embed">\n  <iframe src="${escapeHtml(formatted)}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>\n  ${caption ? `<div class="notion-caption">${caption}</div>` : ""}\n</div>\n`;
    }

    if (ogpData) {
      return renderOgpCard(ogpData, caption);
    }

    // 3. Simple Link Card Fallback
    const linkTitle = isGoogleMapsUrl(url) ? "Google Maps で開く" : url;
    return `<div class="notion-embed notion-bookmark-card"><a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(linkTitle)}</a>${caption ? `<div class="notion-caption">${caption}</div>` : ""}</div>\n`;
  };

  const formatEmbedUrl = (url: string): string => {
    if (!url) return "";

    // YouTube: watch?v=ID, youtu.be/ID, shorts/ID, or live/ID with timestamp
    const ytEmbedUrl = formatYouTubeEmbedUrl(url);
    if (ytEmbedUrl) {
      return ytEmbedUrl;
    }

    // Spotify: open.spotify.com/track/ID -> open.spotify.com/embed/track/ID
    const spotifyMatch = url.match(/open\.spotify\.com\/(track|album|playlist|episode|artist)\/([a-zA-Z0-9]+)/);
    if (spotifyMatch) {
      return `https://open.spotify.com/embed/${spotifyMatch[1]}/${spotifyMatch[2]}`;
    }

    // Figma: figma.com/file/... or /design/... -> figma.com/embed?embed_host=share&url=...
    if (url.includes("figma.com/")) {
      return `https://www.figma.com/embed?embed_host=share&url=${encodeURIComponent(url)}`;
    }

    // CodePen: codepen.io/user/pen/id -> codepen.io/user/embed/id
    const codepenMatch = url.match(/codepen\.io\/([^/]+)\/(?:pen|embed)\/([a-zA-Z0-9]+)/);
    if (codepenMatch) {
      return `https://codepen.io/${codepenMatch[1]}/embed/${codepenMatch[2]}?default-tab=result`;
    }

    // Vimeo: vimeo.com/id -> player.vimeo.com/video/id
    const vimeoMatch = url.match(/vimeo\.com\/(?:video\/)?([0-9]+)/);
    if (vimeoMatch) {
      return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
    }

    // Loom: loom.com/share/id -> loom.com/embed/id
    const loomMatch = url.match(/loom\.com\/(?:share|embed)\/([a-zA-Z0-9]+)/);
    if (loomMatch) {
      return `https://www.loom.com/embed/${loomMatch[1]}`;
    }

    // SoundCloud
    if (url.includes("soundcloud.com/")) {
      return `https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}`;
    }

    // Google Maps
    if (url.includes("google.com/maps") || url.includes("maps.google.com") || url.includes("maps.app.goo.gl") || url.includes("goo.gl/maps")) {
      if (url.includes("/maps/embed")) return url;

      // Priority 1: Extract 3d/4d coordinates in data param (!3d34.7120857!4d135.5082373)
      const dataMatch = url.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/);
      if (dataMatch) {
        return `https://maps.google.com/maps?q=${dataMatch[1]},${dataMatch[2]}&z=15&output=embed`;
      }

      // Priority 2: Extract @lat,lng
      const coordMatch = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
      if (coordMatch) {
        return `https://maps.google.com/maps?q=${coordMatch[1]},${coordMatch[2]}&z=15&output=embed`;
      }

      // Priority 3: Extract place name from /place/Name/
      const placeMatch = url.match(/\/place\/([^/@]+)/);
      if (placeMatch && placeMatch[1]) {
        const name = decodeURIComponent(placeMatch[1].replace(/\+/g, " ")).trim();
        if (name && name !== "@") {
          return `https://maps.google.com/maps?q=${encodeURIComponent(name)}&output=embed`;
        }
      }

      // If it's a shortlink without coordinates, return url unchanged so server embedData is used
      if (url.includes("maps.app.goo.gl") || url.includes("goo.gl/maps")) {
        return url;
      }

      return `https://maps.google.com/maps?q=${encodeURIComponent(url)}&output=embed`;
    }

    // CodeSandbox: codesandbox.io/s/id -> codesandbox.io/embed/id
    const csbMatch = url.match(/codesandbox\.io\/s\/([a-zA-Z0-9_-]+)/);
    if (csbMatch) {
      return `https://codesandbox.io/embed/${csbMatch[1]}`;
    }

    return url;
  };

  const isShortlinkUrl = (url: string): boolean => {
    return url.includes("maps.app.goo.gl") || url.includes("goo.gl/maps");
  };

  const renderEmbedResult = (embedData: any, caption: string, rawUrl: string, isEmbedBlock = false): string => {
    const forceEmbed = isEmbedBlock || rawUrl.includes("embed");

    if (!embedData || embedData.type === "fallback") {
      const formatted = formatEmbedUrl(rawUrl);
      const targetIframeSrc = (formatted && formatted !== rawUrl) ? formatted : rawUrl;

      if (!isShortlinkUrl(targetIframeSrc) && (forceEmbed || (formatted && formatted !== rawUrl))) {
        return `<div class="notion-embed">\n  <iframe src="${escapeHtml(targetIframeSrc)}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>\n  ${caption ? `<div class="notion-caption">${caption}</div>` : ""}\n</div>\n`;
      }

      const displayTitle = isGoogleMapsUrl(rawUrl) ? "Google Maps で場所を開く" : rawUrl;
      return `<div class="notion-embed notion-bookmark-card"><a href="${escapeHtml(rawUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(displayTitle)}</a>${caption ? `<div class="notion-caption">${caption}</div>` : ""}</div>\n`;
    }

    if (embedData.type === "oembed") {
      return `<div class="notion-embed notion-oembed">\n  ${embedData.html}\n  ${caption ? `<div class="notion-caption">${caption}</div>` : ""}\n</div>\n`;
    }

    if (embedData.type === "iframe") {
      return `<div class="notion-embed notion-iframe">\n  <iframe src="${escapeHtml(embedData.iframeUrl)}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>\n  ${caption ? `<div class="notion-caption">${caption}</div>` : ""}\n</div>\n`;
    }

    if (embedData.type === "bookmark") {
      if (forceEmbed) {
        const formatted = formatEmbedUrl(rawUrl);
        const targetIframeSrc = (formatted && formatted !== rawUrl) ? formatted : rawUrl;
        if (!isShortlinkUrl(targetIframeSrc) && formatted && formatted !== rawUrl) {
          return `<div class="notion-embed">\n  <iframe src="${escapeHtml(targetIframeSrc)}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>\n  ${caption ? `<div class="notion-caption">${caption}</div>` : ""}\n</div>\n`;
        }
      }

      return renderOgpCard({
        url: embedData.url || rawUrl,
        title: embedData.title,
        description: embedData.description,
        siteName: embedData.siteName,
        image: embedData.image
      }, caption);
    }

    const displayTitle = isGoogleMapsUrl(rawUrl) ? "Google Maps で場所を開く" : rawUrl;
    return `<div class="notion-embed notion-bookmark-card"><a href="${escapeHtml(rawUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(displayTitle)}</a>${caption ? `<div class="notion-caption">${caption}</div>` : ""}</div>\n`;
  };

  const renderEmbed = (data: any, embedData?: any): string => {
    const url = data?.url || "";
    if (!url) return "";
    const caption = renderRichText(data?.caption || []);
    if (embedData) {
      return renderEmbedResult(embedData, caption, url, true);
    }
    const embedUrl = formatEmbedUrl(url);
    const targetSrc = (embedUrl && embedUrl !== url) ? embedUrl : url;
    if (isShortlinkUrl(targetSrc)) {
      return `<div class="notion-embed notion-bookmark-card"><a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">Google Maps で場所を開く</a>${caption ? `<div class="notion-caption">${caption}</div>` : ""}</div>\n`;
    }
    return `<div class="notion-embed">\n  <iframe src="${escapeHtml(targetSrc)}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>\n  ${caption ? `<div class="notion-caption">${caption}</div>` : ""}\n</div>\n`;
  };

  const renderLinkPreview = (data: any, ogpData?: any, embedData?: any): string => {
    const url = data?.url || "";
    if (!url) return "";
    const caption = renderRichText(data?.caption || []);

    if (url.includes("embed")) {
      return `<div class="notion-embed">\n  <iframe src="${escapeHtml(url)}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>\n  ${caption ? `<div class="notion-caption">${caption}</div>` : ""}\n</div>\n`;
    }

    if (ogpData) {
      return renderOgpCard(ogpData, caption);
    }

    if (embedData) {
      return renderEmbedResult(embedData, caption, url, false);
    }

    const formatted = formatEmbedUrl(url);
    if (formatted && formatted !== url) {
      return `<div class="notion-embed">\n  <iframe src="${escapeHtml(formatted)}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>\n  ${caption ? `<div class="notion-caption">${caption}</div>` : ""}\n</div>\n`;
    }
    return `<div class="notion-embed notion-bookmark-card"><a href="${url}" target="_blank" rel="noopener noreferrer">${escapeHtml(url)}</a>${caption ? `<div class="notion-caption">${caption}</div>` : ""}</div>\n`;
  };

  const renderEquation = (data: any): string => {
    const expression = data?.expression || "";
    return `<div class="notion-equation">$$ ${escapeHtml(expression)} $$</div>\n`;
  };

  const renderTable = (data: any, children: NotionBlock[]): string => {
    const hasColumnHeader = data?.has_column_header === true;
    const hasRowHeader = data?.has_row_header === true;

    let html = `<table class="notion-table">\n`;

    children.forEach((row, rowIndex) => {
      if (row.type !== "table_row") return;
      const cells: RichTextItem[][] = row.table_row?.cells || [];

      html += `  <tr>\n`;
      cells.forEach((cell, colIndex) => {
        const isHeader = (hasColumnHeader && rowIndex === 0) || (hasRowHeader && colIndex === 0);
        const tag = isHeader ? "th" : "td";
        const cellContent = renderRichText(cell);
        html += `    <${tag}>${cellContent}</${tag}>\n`;
      });
      html += `  </tr>\n`;
    });

    html += `</table>\n`;
    return html;
  };

  const renderColumnList = (children: NotionBlock[]): string => {
    let html = `<div class="notion-columns">\n`;
    for (const child of children) {
      if (child.type === "column") {
        html += renderBlock(child);
      }
    }
    html += `</div>\n`;
    return html;
  };

  const renderColumn = (childrenHtml: string): string => {
    return `<div class="notion-column">\n${childrenHtml}</div>\n`;
  };

  // ─── Table of Contents extraction ───

  const getTableOfContents = (blocks: NotionBlock[]) => {
    const flat: { id: string; text: string; depth: number }[] = [];

    const extractHeadings = (blockList: NotionBlock[]) => {
      for (const block of blockList) {
        if (block.type === "heading_1" || block.type === "heading_2" || block.type === "heading_3") {
          const depth = block.type === "heading_1" ? 1 : block.type === "heading_2" ? 2 : 3;
          const plainText = (block[block.type]?.rich_text || [])
            .map((rt: RichTextItem) => rt.plain_text)
            .join("");
          const id = block.id;
          flat.push({ id, text: plainText, depth });
        }
        // Don't recurse into children for TOC (headings are top-level)
      }
    };

    extractHeadings(blocks);

    const rootLinks: any[] = [];
    let currentRoot: any = null;

    for (const item of flat) {
      if (item.depth === 1 || item.depth === 2) {
        currentRoot = { id: item.id, text: item.text, children: [] };
        rootLinks.push(currentRoot);
      } else if (item.depth === 3 && currentRoot) {
        currentRoot.children.push({ id: item.id, text: item.text });
      }
    }

    return rootLinks;
  };

  // ─── Main parse function ───

  const parse = (blocks: NotionBlock[]): string => {
    if (!blocks || blocks.length === 0) return "";
    return renderBlocks(blocks);
  };

  return {
    parse,
    renderRichText,
    getTableOfContents,
  };
}
