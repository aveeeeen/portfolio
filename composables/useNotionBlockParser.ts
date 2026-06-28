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

  // ─── Color helpers ───

  const getTextColorStyle = (color: string): string => {
    if (color === "default" || !color) return "";

    const textColors: Record<string, string> = {
      gray: "color: #787774",
      brown: "color: #9f6b53",
      orange: "color: #d9730d",
      yellow: "color: #cb912f",
      green: "color: #448361",
      blue: "color: #337ea9",
      purple: "color: #9065b0",
      pink: "color: #c14c8a",
      red: "color: #d44c47",
    };

    const bgColors: Record<string, string> = {
      gray_background: "background-color: #f1f1ef",
      brown_background: "background-color: #f4eeeb",
      orange_background: "background-color: #fbecdd",
      yellow_background: "background-color: #fbf3db",
      green_background: "background-color: #edf3f0",
      blue_background: "background-color: #ebf2f6",
      purple_background: "background-color: #f5f0f7",
      pink_background: "background-color: #f9eef3",
      red_background: "background-color: #fdebec",
    };

    return textColors[color] || bgColors[color] || "";
  };

  const getBlockColorStyle = (color: string): string => {
    if (color === "default" || !color) return "";

    const style = getTextColorStyle(color);
    if (!style) return "";

    if (color.endsWith("_background")) {
      return ` style="${style}; padding: 12px 16px; border-radius: 6px; margin: 4px 0;"`;
    }

    return ` style="${style}"`;
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
          text = `<a href="${item.text.link.url}" target="_blank" rel="noopener noreferrer" style="color: #0b6e99; text-decoration: underline;">${text}</a>`;
        }
      } else if (item.type === "mention") {
        text = renderMention(item);
      } else if (item.type === "equation") {
        const expr = escapeHtml(item.equation?.expression || "");
        text = `<code class="notion-inline-math" style="padding: 2px 4px; font-style: italic; font-family: serif;">${expr}</code>`;
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

    const mentionStyle = `background-color: rgba(15, 15, 15, 0.08); padding: 2px 6px; border-radius: 4px; font-size: 0.9em; display: inline-flex; align-items: center; gap: 4px;`;

    switch (mention.type) {
      case "user":
        return `<span class="notion-mention notion-mention-user" style="${mentionStyle} font-weight: 500;">👤 ${plainText}</span>`;
      case "page":
        return `<span class="notion-mention notion-mention-page" style="${mentionStyle}">📄 <a href="${item.href || ""}" style="color: inherit; text-decoration: none;">${plainText}</a></span>`;
      case "database":
        return `<span class="notion-mention notion-mention-database" style="${mentionStyle}">🗃️ <a href="${item.href || ""}" style="color: inherit; text-decoration: none;">${plainText}</a></span>`;
      case "date": {
        const start = mention.date?.start || "";
        const end = mention.date?.end || "";
        const display = end ? `${start} → ${end}` : start;
        return `<span class="notion-mention notion-mention-date" style="${mentionStyle}">🗓️ ${display}</span>`;
      }
      case "link_preview":
        return `<span class="notion-mention notion-mention-link" style="${mentionStyle}">🔗 <a href="${mention.link_preview?.url || ""}" target="_blank" rel="noopener noreferrer" style="color: inherit; text-decoration: none;">${plainText}</a></span>`;
      default:
        return plainText;
    }
  };

  const applyAnnotations = (text: string, annotations: RichTextItem["annotations"]): string => {
    if (!annotations) return text;

    if (annotations.code) {
      text = `<code style="background-color: rgba(15, 15, 15, 0.05); padding: 2px 4px; border-radius: 3px; font-family: monospace; font-size: 0.9em;">${text}</code>`;
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
      text = `<span style="text-decoration: underline;">${text}</span>`;
    }
    if (annotations.color && annotations.color !== "default") {
      const colorStyle = getTextColorStyle(annotations.color);
      if (colorStyle) {
        text = `<span style="${colorStyle}">${text}</span>`;
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
      return url ? `<img src="${url}" alt="icon" style="width: 1.2em; height: 1.2em; object-fit: contain;">` : "";
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
        html += `<ul style="list-style-type: disc; padding-left: 24px; margin-bottom: 8px;">\n`;
        while (i < blocks.length && blocks[i].type === "bulleted_list_item") {
          html += renderBlock(blocks[i]);
          i++;
        }
        html += `</ul>\n`;
        continue;
      }

      if (block.type === "numbered_list_item") {
        html += `<ol style="list-style-type: decimal; padding-left: 24px; margin-bottom: 8px;">\n`;
        while (i < blocks.length && blocks[i].type === "numbered_list_item") {
          html += renderBlock(blocks[i]);
          i++;
        }
        html += `</ol>\n`;
        continue;
      }

      if (block.type === "to_do") {
        html += `<ul class="notion-todo-list" style="list-style-type: none; padding-left: 0; margin-bottom: 8px;">\n`;
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
        return `<hr style="border: none; border-top: 1px solid rgba(55, 53, 47, 0.09); margin: 16px 0;">\n`;
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
        return renderBookmark(typeData);
      case "embed":
        return renderEmbed(typeData);
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
        return `<div style="margin: 4px 0; display: inline-flex; align-items: center; gap: 6px; padding: 6px 10px; border: 1px solid rgba(55, 53, 47, 0.09); border-radius: 4px; background-color: #f7f6f3; font-size: 0.95em;">📄 ${escapeHtml(typeData?.title || "Untitled")}</div>\n`;
      case "child_database":
        return `<div style="margin: 4px 0; display: inline-flex; align-items: center; gap: 6px; padding: 6px 10px; border: 1px solid rgba(55, 53, 47, 0.09); border-radius: 4px; background-color: #f7f6f3; font-size: 0.95em;">🗃️ ${escapeHtml(typeData?.title || "Untitled")}</div>\n`;
      case "link_preview":
        return `<div style="margin: 8px 0; padding: 12px; border: 1px solid rgba(55, 53, 47, 0.09); border-radius: 6px;"><a href="${typeData?.url || ""}" target="_blank" rel="noopener noreferrer" style="color: #0b6e99; text-decoration: underline; word-break: break-all;">${escapeHtml(typeData?.url || "")}</a></div>\n`;
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
    const colorStyle = getBlockColorStyle(data?.color || "default");
    const isEmpty = !richText && !childrenHtml;

    if (isEmpty) {
      return `<div style="height: 1em;"></div>\n`;
    }

    return `<p${colorStyle || ` style="margin-top: 4px; margin-bottom: 4px; min-height: 1em; line-height: 1.6;"`}>${richText}${childrenHtml ? "\n" + childrenHtml : ""}</p>\n`;
  };

  const renderHeading = (data: any, level: number, childrenHtml: string, blockId: string): string => {
    const richText = renderRichText(data?.rich_text || []);
    const id = blockId;
    const colorStyle = getBlockColorStyle(data?.color || "default");
    const isToggleable = data?.is_toggleable === true;

    const fontSizes: Record<number, string> = {
      1: "1.8em",
      2: "1.5em",
      3: "1.25em",
      4: "1.1em",
    };
    const margins: Record<number, string> = {
      1: "margin-top: 1.5em; margin-bottom: 0.5em;",
      2: "margin-top: 1.4em; margin-bottom: 0.4em;",
      3: "margin-top: 1.3em; margin-bottom: 0.3em;",
      4: "margin-top: 1.2em; margin-bottom: 0.2em;",
    };

    const fontSize = fontSizes[level] || "1em";
    const margin = margins[level] || "";
    const tag = `h${level}`;

    if (isToggleable) {
      return `<details${colorStyle} id="${id}" class="notion-toggle-${tag}" style="${margin}"><summary style="cursor: pointer; outline: none; font-weight: bold; font-size: ${fontSize}; display: list-item;"><${tag} style="display: inline; font-size: 1em; margin: 0; padding: 0;">${richText}</${tag}></summary>\n<div style="padding-left: 20px; margin-top: 8px;">\n${childrenHtml}</div>\n</details>\n`;
    }

    return `<${tag}${colorStyle || ` style="font-size: ${fontSize}; ${margin} font-weight: bold;"`} id="${id}">${richText}</${tag}>\n`;
  };

  const renderListItem = (data: any, childrenHtml: string): string => {
    const richText = renderRichText(data?.rich_text || []);
    const colorStyle = getBlockColorStyle(data?.color || "default");
    return `<li${colorStyle || ` style="margin-bottom: 4px;"`}>${richText}${childrenHtml ? "\n" + childrenHtml : ""}</li>\n`;
  };

  const renderTodo = (data: any, childrenHtml: string): string => {
    const richText = renderRichText(data?.rich_text || []);
    const checked = data?.checked === true;
    const colorStyle = getBlockColorStyle(data?.color || "default");
    const checkbox = `<input type="checkbox" disabled${checked ? " checked" : ""} style="margin-right: 8px; vertical-align: middle;">`;
    return `<li${colorStyle || ` style="margin-bottom: 6px; list-style-type: none; display: flex; align-items: center;"`}><label style="display: inline-flex; align-items: center;">${checkbox}<span style="${checked ? "text-decoration: line-through; opacity: 0.6;" : ""}">${richText}</span></label>${childrenHtml ? "\n" + childrenHtml : ""}</li>\n`;
  };

  const renderToggle = (data: any, childrenHtml: string): string => {
    const richText = renderRichText(data?.rich_text || []);
    const colorStyle = getBlockColorStyle(data?.color || "default");
    return `<details${colorStyle || ` style="margin: 6px 0;"`} class="notion-toggle"><summary style="cursor: pointer; outline: none; display: list-item; font-weight: 500;">${richText}</summary>\n<div style="padding-left: 20px; margin-top: 6px;">\n${childrenHtml}</div></details>\n`;
  };

  const renderQuote = (data: any, childrenHtml: string): string => {
    const richText = renderRichText(data?.rich_text || []);
    const colorStyle = getBlockColorStyle(data?.color || "default");
    return `<blockquote${colorStyle || ` style="border-left: 3px solid #37352f; padding-left: 14px; margin: 12px 0; color: inherit;"`}>${richText}${childrenHtml ? "\n" + childrenHtml : ""}</blockquote>\n`;
  };

  const renderCallout = (data: any, childrenHtml: string): string => {
    const richText = renderRichText(data?.rich_text || []);
    const icon = getIconHtml(data?.icon) || "💡";
    const color = data?.color || "default";
    const isBg = color.endsWith("_background");
    const colorStyle = getTextColorStyle(color);

    const baseStyle = `display: flex; gap: 12px; padding: 16px; border-radius: 8px; margin: 12px 0; align-items: flex-start;`;
    const borderStyle = isBg ? "" : "border: 1px solid rgba(55, 53, 47, 0.09);";
    const fullStyle = `${baseStyle} ${borderStyle} ${colorStyle}`.trim();

    return `<div style="${fullStyle}" class="notion-callout">\n  <span style="font-size: 1.2em; line-height: 1.2; user-select: none;">${icon}</span>\n  <div style="flex: 1; min-width: 0;">\n${richText ? `    <p style="margin: 0;">${richText}</p>\n` : ""}${childrenHtml}  </div>\n</div>\n`;
  };

  const renderCode = (data: any): string => {
    const richText = (data?.rich_text || []).map((rt: RichTextItem) => rt.plain_text).join("");
    const escaped = escapeHtml(richText);
    const language = data?.language || "";
    const caption = renderRichText(data?.caption || []);

    let html = `<pre style="background-color: #f7f6f3; padding: 16px; border-radius: 8px; font-family: monospace; font-size: 0.9em; overflow-x: auto; border: 1px solid rgba(15, 15, 15, 0.05); margin: 12px 0;"><code class="language-${language}">${escaped}</code></pre>\n`;

    if (caption) {
      html += `<div style="font-size: 0.85em; opacity: 0.6; margin-top: -8px; margin-bottom: 12px;">${caption}</div>\n`;
    }

    return html;
  };

  const renderImage = (data: any): string => {
    const url = getFileUrl(data);
    const caption = renderRichText(data?.caption || []);

    return `<figure style="margin: 16px 0; text-align: center;" class="notion-image-figure">\n  <img src="${url}" alt="${caption ? caption.replace(/<[^>]*>/g, "") : ""}" style="max-width: 100%; border-radius: 6px; display: block; margin: 0 auto;">\n  ${caption ? `<figcaption style="font-size: 0.85em; opacity: 0.6; margin-top: 6px;">${caption}</figcaption>` : ""}\n</figure>\n`;
  };

  const renderVideo = (data: any): string => {
    const url = getFileUrl(data);
    const caption = renderRichText(data?.caption || []);

    // YouTube embed support
    const youtubeMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]+)/);
    if (youtubeMatch) {
      return `<div style="margin: 12px 0; display: flex; flex-direction: column; gap: 6px;" class="notion-media notion-video"><iframe src="https://www.youtube.com/embed/${youtubeMatch[1]}" style="width: 100%; aspect-ratio: 16/9; border: none; border-radius: 4px;" allowfullscreen></iframe>${caption ? `<div style="font-size: 0.85em; opacity: 0.6;">${caption}</div>` : ""}</div>\n`;
    }

    return `<div style="margin: 12px 0; display: flex; flex-direction: column; gap: 6px;" class="notion-media notion-video"><video src="${url}" controls style="max-width: 100%; border-radius: 4px;"></video>${caption ? `<div style="font-size: 0.85em; opacity: 0.6;">${caption}</div>` : ""}</div>\n`;
  };

  const renderAudio = (data: any): string => {
    const url = getFileUrl(data);
    const caption = renderRichText(data?.caption || []);
    return `<div style="margin: 12px 0; display: flex; flex-direction: column; gap: 6px;" class="notion-media notion-audio"><audio src="${url}" controls style="width: 100%;"></audio>${caption ? `<div style="font-size: 0.85em; opacity: 0.6;">${caption}</div>` : ""}</div>\n`;
  };

  const renderFile = (data: any): string => {
    const url = getFileUrl(data);
    const caption = renderRichText(data?.caption || []);
    const name = data?.name || "Download file";
    return `<div style="margin: 8px 0; display: flex; align-items: center; gap: 8px; padding: 12px; border: 1px solid rgba(55, 53, 47, 0.09); border-radius: 6px; background-color: #f7f6f3;" class="notion-media notion-file"><span style="font-size: 1.2em;">📎</span><a href="${url}" target="_blank" style="font-size: 0.9em; font-weight: 500; color: inherit; text-decoration: none;">${escapeHtml(name)}</a>${caption ? `<span style="font-size: 0.85em; opacity: 0.6; margin-left: auto;">${caption}</span>` : ""}</div>\n`;
  };

  const renderPdf = (data: any): string => {
    const url = getFileUrl(data);
    const caption = renderRichText(data?.caption || []);
    return `<div style="margin: 12px 0; display: flex; flex-direction: column; gap: 6px;" class="notion-media notion-pdf"><iframe src="${url}" style="width: 100%; height: 500px; border: 1px solid rgba(55, 53, 47, 0.09); border-radius: 6px;"></iframe>${caption ? `<div style="font-size: 0.85em; opacity: 0.6;">${caption}</div>` : ""}</div>\n`;
  };

  const renderBookmark = (data: any): string => {
    const url = data?.url || "";
    const caption = renderRichText(data?.caption || []);
    return `<div style="margin: 8px 0; padding: 12px; border: 1px solid rgba(55, 53, 47, 0.09); border-radius: 6px;"><a href="${url}" target="_blank" rel="noopener noreferrer" style="color: #0b6e99; text-decoration: underline; word-break: break-all;">${escapeHtml(url)}</a>${caption ? `<div style="font-size: 0.85em; opacity: 0.6; margin-top: 4px;">${caption}</div>` : ""}</div>\n`;
  };

  const renderEmbed = (data: any): string => {
    const url = data?.url || "";
    return `<div style="margin: 12px 0;"><iframe src="${url}" style="width: 100%; min-height: 300px; border: 1px solid rgba(55, 53, 47, 0.09); border-radius: 6px;" allowfullscreen></iframe></div>\n`;
  };

  const renderEquation = (data: any): string => {
    const expression = data?.expression || "";
    return `<div style="text-align: center; margin: 12px 0; font-family: serif; font-size: 1.1em; overflow-x: auto; padding: 8px 0;">$$ ${escapeHtml(expression)} $$</div>\n`;
  };

  const renderTable = (data: any, children: NotionBlock[]): string => {
    const hasColumnHeader = data?.has_column_header === true;
    const hasRowHeader = data?.has_row_header === true;

    let html = `<table style="border-collapse: collapse; width: 100%; margin: 16px 0; font-size: 0.9em;">\n`;

    children.forEach((row, rowIndex) => {
      if (row.type !== "table_row") return;
      const cells: RichTextItem[][] = row.table_row?.cells || [];

      html += `  <tr>\n`;
      cells.forEach((cell, colIndex) => {
        const isHeader = (hasColumnHeader && rowIndex === 0) || (hasRowHeader && colIndex === 0);
        const tag = isHeader ? "th" : "td";
        const cellStyle = isHeader
          ? `style="border: 1px solid rgba(55, 53, 47, 0.09); padding: 8px 12px; background-color: #f7f6f3; font-weight: 600; text-align: left;"`
          : `style="border: 1px solid rgba(55, 53, 47, 0.09); padding: 8px 12px; text-align: left;"`;
        const cellContent = renderRichText(cell);
        html += `    <${tag} ${cellStyle}>${cellContent}</${tag}>\n`;
      });
      html += `  </tr>\n`;
    });

    html += `</table>\n`;
    return html;
  };

  const renderColumnList = (children: NotionBlock[]): string => {
    let html = `<div style="display: flex; gap: 24px; flex-wrap: wrap; margin: 12px 0; width: 100%;" class="notion-columns">\n`;
    for (const child of children) {
      if (child.type === "column") {
        html += renderBlock(child);
      }
    }
    html += `</div>\n`;
    return html;
  };

  const renderColumn = (childrenHtml: string): string => {
    return `<div style="flex: 1 1 200px; min-width: 0;" class="notion-column">\n${childrenHtml}</div>\n`;
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
