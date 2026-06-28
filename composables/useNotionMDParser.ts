export interface NotionNode {
  type: string;
  content: string;
  attributes: Record<string, string>;
  children: NotionNode[];
  level: number;
}

export function useNotionMDParser() {
  const getColorStyle = (color: string): string => {
    const textColors: Record<string, string> = {
      gray: 'color: #787774',
      brown: 'color: #9f6b53',
      orange: 'color: #d9730d',
      yellow: 'color: #cb912f',
      green: 'color: #448361',
      blue: 'color: #337ea9',
      purple: 'color: #9065b0',
      pink: 'color: #c14c8a',
      red: 'color: #d44c47',
    };

    const bgColors: Record<string, string> = {
      gray_bg: 'background-color: #f1f1ef',
      brown_bg: 'background-color: #f4eeeb',
      orange_bg: 'background-color: #fbecdd',
      yellow_bg: 'background-color: #fbf3db',
      green_bg: 'background-color: #edf3f0',
      blue_bg: 'background-color: #ebf2f6',
      purple_bg: 'background-color: #f5f0f7',
      pink_bg: 'background-color: #f9eef3',
      red_bg: 'background-color: #fdebec',
    };

    if (textColors[color]) {
      return textColors[color];
    }
    if (bgColors[color]) {
      return bgColors[color];
    }
    return '';
  };

  const getBlockStyle = (attributes: Record<string, string>): string => {
    const color = attributes.color;
    if (!color) {
      return '';
    }

    const style = getColorStyle(color);
    if (!style) {
      return '';
    }

    if (color.endsWith('_bg')) {
      return ` style="${style}; padding: 12px 16px; border-radius: 6px; margin: 4px 0;"`;
    }

    return ` style="${style}"`;
  };

  const mergeStyles = (customStyleStr: string, defaultStyles: string): string => {
    if (!customStyleStr) {
      return ` style="${defaultStyles}"`;
    }
    const match = customStyleStr.match(/style="([^"]*)"/);
    if (!match) {
      return ` style="${defaultStyles}"`;
    }
    const custom = match[1].trim();
    const delimiter = custom && !custom.endsWith(';') ? ';' : '';
    return ` style="${custom}${delimiter} ${defaultStyles}"`;
  };

  const generateHeadingId = (text: string): string => {
    return text
      .toLowerCase()
      .replace(/<[^>]*>/g, '')
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const normalizeSrc = (src: string): string => {
    if (!src) {
      return src;
    }
    if (src.startsWith('file://')) {
      const rest = src.slice(7);
      try {
        const decoded = decodeURIComponent(rest);
        if (decoded.startsWith('{')) {
          const parsed = JSON.parse(decoded);
          if (parsed && parsed.source) {
            return parsed.source;
          }
        }
      } catch (e) {
        // Fallback to original src if JSON parsing fails
      }
    }
    return src;
  };

  const getTableOfContents = (markdown: string) => {
    if (!markdown) {
      return [];
    }
    const lines = markdown.replace(/\r\n/g, '\n').split('\n');
    const flat: { id: string; text: string; depth: number }[] = [];

    for (const line of lines) {
      let indentLevel = 0;
      while (indentLevel < line.length && line[indentLevel] === '\t') {
        indentLevel++;
      }
      const cleanLine = line.slice(indentLevel);

      let headingText = '';
      let depth = 0;

      if (cleanLine.startsWith('# ')) {
        headingText = cleanLine.slice(2);
        depth = 1;
      } else if (cleanLine.startsWith('## ')) {
        headingText = cleanLine.slice(3);
        depth = 2;
      } else if (cleanLine.startsWith('### ')) {
        headingText = cleanLine.slice(4);
        depth = 3;
      }

      if (depth > 0) {
        const attrIdx = headingText.indexOf('{');
        if (attrIdx !== -1) {
          headingText = headingText.substring(0, attrIdx).trim();
        }
        const cleanText = headingText.replace(/<[^>]*>/g, '').replace(/\\/g, '').trim();
        const id = generateHeadingId(cleanText);
        flat.push({ id, text: cleanText, depth });
      }
    }

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

  const parseInline = (text: string): string => {
    let parsed = text;

    // 1. Inline code
    const codeBlocks: string[] = [];
    parsed = parsed.replace(/`([^`]+)`/g, (match, code) => {
      codeBlocks.push(code);
      return `__CODE_BLOCK_${codeBlocks.length - 1}__`;
    });

    // 2. Inline math
    const mathBlocks: string[] = [];
    parsed = parsed.replace(/\$([^\$]+)\$/g, (match, math) => {
      mathBlocks.push(math);
      return `__MATH_BLOCK_${mathBlocks.length - 1}__`;
    });

    // 3. Spans
    parsed = parsed.replace(/<span([^>]*)>(.*?)<\/span>/g, (match, attrs, content) => {
      const isUnderline = attrs.includes('underline="true"');
      const colorMatch = attrs.match(/color="([^"]+)"/);
      const color = colorMatch ? colorMatch[1] : null;
      const styles = [];
      if (isUnderline) {
        styles.push('text-decoration: underline');
      }
      if (color) {
        styles.push(getColorStyle(color));
      }
      const styleAttr = styles.length > 0 ? ` style="${styles.join('; ')}"` : '';
      const classAttr = color ? ` class="notion-color-${color}"` : '';
      return `<span${classAttr}${styleAttr}>${content}</span>`;
    });

    // 4. Mentions
    parsed = parsed.replace(/<mention-user\s+url="([^"]+)"(?:\s*\/|>(.*?)<\/mention-user>)/g, (match, url, name) => {
      const displayName = name || 'User';
      return `<span class="notion-mention notion-mention-user" style="background-color: rgba(15, 15, 15, 0.08); padding: 2px 6px; border-radius: 4px; font-weight: 500; font-size: 0.9em; display: inline-flex; align-items: center; gap: 4px;">👤<a href="${url}" style="color: inherit; text-decoration: none;">${displayName}</a></span>`;
    });

    parsed = parsed.replace(/<mention-page\s+url="([^"]+)"(?:\s*\/|>(.*?)<\/mention-page>)/g, (match, url, name) => {
      const displayName = name || 'Page';
      return `<span class="notion-mention notion-mention-page" style="background-color: rgba(15, 15, 15, 0.08); padding: 2px 6px; border-radius: 4px; font-size: 0.9em; display: inline-flex; align-items: center; gap: 4px;">📄<a href="${url}" style="color: inherit; text-decoration: none;">${displayName}</a></span>`;
    });

    parsed = parsed.replace(/<mention-database\s+url="([^"]+)"(?:\s*\/|>(.*?)<\/mention-database>)/g, (match, url, name) => {
      const displayName = name || 'Database';
      return `<span class="notion-mention notion-mention-database" style="background-color: rgba(15, 15, 15, 0.08); padding: 2px 6px; border-radius: 4px; font-size: 0.9em; display: inline-flex; align-items: center; gap: 4px;">🗃️<a href="${url}" style="color: inherit; text-decoration: none;">${displayName}</a></span>`;
    });

    parsed = parsed.replace(/<mention-date\s+([^>]*)\/?>/g, (match, attrs) => {
      const startMatch = attrs.match(/start="([^"]+)"/);
      const endMatch = attrs.match(/end="([^"]+)"/);
      const timeMatch = attrs.match(/startTime="([^"]+)"/);
      const start = startMatch ? startMatch[1] : '';
      const end = endMatch ? endMatch[1] : '';
      const time = timeMatch ? ' ' + timeMatch[1] : '';
      const display = end ? `${start}${time} → ${end}` : `${start}${time}`;
      return `<span class="notion-mention notion-mention-date" style="background-color: rgba(15, 15, 15, 0.08); padding: 2px 6px; border-radius: 4px; font-size: 0.9em; display: inline-flex; align-items: center; gap: 4px;">🗓️ ${display}</span>`;
    });

    // 5. Links
    parsed = parsed.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" style="color: #0b6e99; text-decoration: underline;">$1</a>');

    // 6. Citations
    parsed = parsed.replace(/\[\^([^\]]+)\]/g, '<sup class="notion-citation" style="font-size: 0.75em; vertical-align: super; margin-left: 2px;"><a href="$1" target="_blank" rel="noopener noreferrer" style="color: #0b6e99; text-decoration: none;">[ref]</a></sup>');

    // 7. Bold
    parsed = parsed.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

    // 8. Italic
    parsed = parsed.replace(/\*([^*]+)\*/g, '<em>$1</em>');

    // 9. Strikethrough
    parsed = parsed.replace(/~~([^~]+)~~/g, '<del>$1</del>');

    // 10. Restore code blocks
    parsed = parsed.replace(/__CODE_BLOCK_(\d+)__/g, (match, index) => {
      const rawCode = codeBlocks[Number(index)];
      const escapedCode = rawCode
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
      return `<code style="background-color: rgba(15, 15, 15, 0.05); padding: 2px 4px; border-radius: 3px; font-family: monospace; font-size: 0.9em;">${escapedCode}</code>`;
    });

    // 11. Restore math blocks
    parsed = parsed.replace(/__MATH_BLOCK_(\d+)__/g, (match, index) => {
      const rawMath = mathBlocks[Number(index)];
      return `<code class="notion-inline-math" style="padding: 2px 4px; font-style: italic; font-family: serif;">${rawMath}</code>`;
    });

    // 12. Unescape escaped characters
    parsed = parsed.replace(/\\([\\*~`$\[\]<>{}|^])/g, '$1');

    return parsed;
  };

  const parseLine = (line: string): { type: string; content: string; attributes: Record<string, string>; level: number } => {
    let level = 0;
    while (level < line.length && line[level] === '\t') {
      level++;
    }
    const cleanLine = line.slice(level);

    let content = cleanLine;
    const attributes: Record<string, string> = {};
    const attrMatch = cleanLine.match(/\{([a-zA-Z0-9_\-]+="[^"]*"\s*)*\}\s*$/);
    if (attrMatch) {
      const attrStr = attrMatch[0];
      content = cleanLine.slice(0, -attrStr.length).trim();
      const pairs = attrStr.slice(1, -1).match(/[a-zA-Z0-9_\-]+="[^"]*"/g) || [];
      for (const pair of pairs) {
        const eqIdx = pair.indexOf('=');
        const key = pair.slice(0, eqIdx);
        const val = pair.slice(eqIdx + 2, -1);
        attributes[key] = val;
      }
    }

    let type = 'paragraph';

    let mediaMatch;
    if ((mediaMatch = content.match(/^<audio\s+src="([^"]+)"(?:\s+color="([^"]+)")?>([\s\S]*?)<\/audio>/))) {
      type = 'audio';
      attributes['src'] = normalizeSrc(mediaMatch[1]);
      if (mediaMatch[2]) {
        attributes['color'] = mediaMatch[2];
      }
      content = mediaMatch[3];
    } else if ((mediaMatch = content.match(/^<video\s+src="([^"]+)"(?:\s+color="([^"]+)")?>([\s\S]*?)<\/video>/))) {
      type = 'video';
      attributes['src'] = normalizeSrc(mediaMatch[1]);
      if (mediaMatch[2]) {
        attributes['color'] = mediaMatch[2];
      }
      content = mediaMatch[3];
    } else if ((mediaMatch = content.match(/^<file\s+src="([^"]+)"(?:\s+color="([^"]+)")?>([\s\S]*?)<\/file>/))) {
      type = 'file';
      attributes['src'] = normalizeSrc(mediaMatch[1]);
      if (mediaMatch[2]) {
        attributes['color'] = mediaMatch[2];
      }
      content = mediaMatch[3];
    } else if ((mediaMatch = content.match(/^<pdf\s+src="([^"]+)"(?:\s+color="([^"]+)")?>([\s\S]*?)<\/pdf>/))) {
      type = 'pdf';
      attributes['src'] = normalizeSrc(mediaMatch[1]);
      if (mediaMatch[2]) {
        attributes['color'] = mediaMatch[2];
      }
      content = mediaMatch[3];
    } else if ((mediaMatch = content.match(/^<page\s+url="([^"]+)"(?:\s+color="([^"]+)")?>([\s\S]*?)<\/page>/))) {
      type = 'page_ref';
      attributes['url'] = mediaMatch[1];
      if (mediaMatch[2]) {
        attributes['color'] = mediaMatch[2];
      }
      content = mediaMatch[3];
    } else if ((mediaMatch = content.match(/^<database\s+url="([^"]+)"(?:\s+inline="([^"]+)")?(?:\s+icon="([^"]+)")?(?:\s+color="([^"]+)")?>([\s\S]*?)<\/database>/))) {
      type = 'database_ref';
      attributes['url'] = mediaMatch[1];
      if (mediaMatch[2]) {
        attributes['inline'] = mediaMatch[2];
      }
      if (mediaMatch[3]) {
        attributes['icon'] = mediaMatch[3];
      }
      if (mediaMatch[4]) {
        attributes['color'] = mediaMatch[4];
      }
      content = mediaMatch[5];
    } else if ((mediaMatch = content.match(/^<table_of_contents(?:\s+color="([^"]+)")?\s*\/?>/))) {
      type = 'table_of_contents';
      if (mediaMatch[1]) {
        attributes['color'] = mediaMatch[1];
      }
      content = '';
    } else if ((mediaMatch = content.match(/^!\[([^\]]*)\]\((.+)\)$/))) {
      type = 'image';
      attributes['src'] = normalizeSrc(mediaMatch[2]);
      attributes['alt'] = mediaMatch[1];
      content = mediaMatch[1];
    } else if (content.startsWith('# ')) {
      type = 'h1';
      content = content.slice(2);
    } else if (content.startsWith('## ')) {
      type = 'h2';
      content = content.slice(3);
    } else if (content.startsWith('### ')) {
      type = 'h3';
      content = content.slice(4);
    } else if (content.startsWith('#### ')) {
      type = 'h4';
      content = content.slice(5);
    } else if (content.startsWith('- ') && !content.startsWith('- [ ]') && !content.startsWith('- [x]')) {
      type = 'bullet_list_item';
      content = content.slice(2);
    } else if (/^\d+\.\s/.test(content)) {
      const match = content.match(/^(\d+)\.\s/);
      type = 'numbered_list_item';
      if (match) {
        content = content.slice(match[0].length);
        attributes['number'] = match[1];
      }
    } else if (content.startsWith('- [ ] ')) {
      type = 'todo_item';
      attributes['checked'] = 'false';
      content = content.slice(6);
    } else if (content.startsWith('- [x] ')) {
      type = 'todo_item';
      attributes['checked'] = 'true';
      content = content.slice(6);
    } else if (content.startsWith('> ')) {
      type = 'quote';
      content = content.slice(2);
    } else if (content === '---') {
      type = 'divider';
      content = '';
    } else if (content === '<empty-block/>' || content === '') {
      type = 'empty';
      content = '';
    } else if (content.startsWith('<') && !content.startsWith('</') && content.endsWith('>')) {
      let singleLineMatch;
      if ((singleLineMatch = content.match(/^<([a-zA-Z0-9_\-]+)([^>]*)>(.*?)<\/([a-zA-Z0-9_\-]+)>$/))) {
        if (singleLineMatch[1] === singleLineMatch[4]) {
          type = singleLineMatch[1] === 'summary' ? 'summary' : 'tag_open';
          attributes['tagName'] = singleLineMatch[1];
          attributes['isSingleLine'] = 'true';
          const rawAttrs = singleLineMatch[2];
          const attrRegex = /([a-zA-Z0-9_\-]+)="([^"]*)"/g;
          let match;
          while ((match = attrRegex.exec(rawAttrs)) !== null) {
            attributes[match[1]] = match[2];
          }
          content = singleLineMatch[3];
          return { type, content, attributes, level };
        }
      }

      let summaryMatch;
      if ((summaryMatch = content.match(/^<summary>([\s\S]*?)<\/summary>/))) {
        type = 'summary';
        content = summaryMatch[1];
      } else {
        const tagMatch = content.match(/^<([a-zA-Z0-9_\-]+)(.*)>$/);
        if (tagMatch) {
          type = 'tag_open';
          attributes['tagName'] = tagMatch[1];
          const rawAttrs = tagMatch[2];
          const attrRegex = /([a-zA-Z0-9_\-]+)="([^"]*)"/g;
          let match;
          while ((match = attrRegex.exec(rawAttrs)) !== null) {
            attributes[match[1]] = match[2];
          }
          if (content.endsWith('/>')) {
            type = 'tag_self_closing';
          }
          content = '';
        }
      }
    } else if (content.startsWith('</') && content.endsWith('>')) {
      const tagMatch = content.match(/^<\/([a-zA-Z0-9_\-]+)>$/);
      if (tagMatch) {
        type = 'tag_close';
        attributes['tagName'] = tagMatch[1];
        content = '';
      }
    }

    return { type, content, attributes, level };
  };

  const groupTagBlock = (lines: string[], currentIndex: number, tagName: string) => {
    let i = currentIndex;
    const startLine = lines[i];
    let indentLevel = 0;
    while (indentLevel < startLine.length && startLine[indentLevel] === '\t') {
      indentLevel++;
    }

    const innerLines: string[] = [];
    let depth = 1;
    i++;

    const openRegex = new RegExp(`^\\t*<${tagName}\\b`);
    const closeRegex = new RegExp(`^\\t*</${tagName}>`);

    while (i < lines.length) {
      const line = lines[i];
      if (openRegex.test(line)) {
        depth++;
      } else if (closeRegex.test(line)) {
        depth--;
      }

      if (depth === 0) {
        break;
      }

      let nextIndent = 0;
      while (nextIndent < line.length && line[nextIndent] === '\t') {
        nextIndent++;
      }
      const stripTabs = Math.min(indentLevel + 1, nextIndent);
      innerLines.push(line.slice(stripTabs));
      i++;
    }

    return {
      content: innerLines.join('\n'),
      endIndex: i,
    };
  };

  const renderNodes = (nodes: NotionNode[]): string => {
    let html = '';
    let i = 0;
    while (i < nodes.length) {
      const node = nodes[i];

      if (node.type === 'bullet_list_item') {
        const listItems: NotionNode[] = [];
        while (i < nodes.length && nodes[i].type === 'bullet_list_item') {
          listItems.push(nodes[i]);
          i++;
        }
        html += `<ul style="list-style-type: disc; padding-left: 24px; margin-bottom: 8px;">\n`;
        for (const item of listItems) {
          html += renderNode(item);
        }
        html += `</ul>\n`;
        continue;
      }

      if (node.type === 'numbered_list_item') {
        const listItems: NotionNode[] = [];
        while (i < nodes.length && nodes[i].type === 'numbered_list_item') {
          listItems.push(nodes[i]);
          i++;
        }
        html += `<ol style="list-style-type: decimal; padding-left: 24px; margin-bottom: 8px;">\n`;
        for (const item of listItems) {
          html += renderNode(item);
        }
        html += `</ol>\n`;
        continue;
      }

      if (node.type === 'todo_item') {
        const listItems: NotionNode[] = [];
        while (i < nodes.length && nodes[i].type === 'todo_item') {
          listItems.push(nodes[i]);
          i++;
        }
        html += `<ul class="notion-todo-list" style="list-style-type: none; padding-left: 0; margin-bottom: 8px;">\n`;
        for (const item of listItems) {
          html += renderNode(item);
        }
        html += `</ul>\n`;
        continue;
      }

      html += renderNode(node);
      i++;
    }
    return html;
  };

  const renderNode = (node: NotionNode): string => {
    const style = getBlockStyle(node.attributes);
    const inlineContent = parseInline(node.content);
    const childrenHtml = node.children.length > 0 ? renderNodes(node.children) : '';

    switch (node.type) {
      case 'h1': {
        const cleanText = node.content.replace(/<[^>]*>/g, '').replace(/\\/g, '').trim();
        const id = generateHeadingId(cleanText);
        const tag = node.attributes.toggle === 'true' ? 'details' : 'h1';
        if (tag === 'details') {
          return `<details${style} id="${id}" class="notion-toggle-h1" style="margin-top: 1.5em; margin-bottom: 0.5em;"><summary style="cursor: pointer; outline: none; font-weight: bold; font-size: 1.8em; display: list-item;"><h1 style="display: inline; font-size: 1em; margin: 0; padding: 0;">${inlineContent}</h1></summary>\n<div style="padding-left: 20px; margin-top: 8px;">\n${childrenHtml}</div>\n</details>\n`;
        }
        return `<h1${mergeStyles(style, 'font-size: 1.8em; margin-top: 1.5em; margin-bottom: 0.5em; font-weight: bold;')} id="${id}">${inlineContent}</h1>\n`;
      }
      case 'h2': {
        const cleanText = node.content.replace(/<[^>]*>/g, '').replace(/\\/g, '').trim();
        const id = generateHeadingId(cleanText);
        const tag = node.attributes.toggle === 'true' ? 'details' : 'h2';
        if (tag === 'details') {
          return `<details${style} id="${id}" class="notion-toggle-h2" style="margin-top: 1.4em; margin-bottom: 0.4em;"><summary style="cursor: pointer; outline: none; font-weight: bold; font-size: 1.5em; display: list-item;"><h2 style="display: inline; font-size: 1em; margin: 0; padding: 0;">${inlineContent}</h2></summary>\n<div style="padding-left: 20px; margin-top: 8px;">\n${childrenHtml}</div>\n</details>\n`;
        }
        return `<h2${mergeStyles(style, 'font-size: 1.5em; margin-top: 1.4em; margin-bottom: 0.4em; font-weight: bold;')} id="${id}">${inlineContent}</h2>\n`;
      }
      case 'h3': {
        const cleanText = node.content.replace(/<[^>]*>/g, '').replace(/\\/g, '').trim();
        const id = generateHeadingId(cleanText);
        const tag = node.attributes.toggle === 'true' ? 'details' : 'h3';
        if (tag === 'details') {
          return `<details${style} id="${id}" class="notion-toggle-h3" style="margin-top: 1.3em; margin-bottom: 0.3em;"><summary style="cursor: pointer; outline: none; font-weight: bold; font-size: 1.25em; display: list-item;"><h3 style="display: inline; font-size: 1em; margin: 0; padding: 0;">${inlineContent}</h3></summary>\n<div style="padding-left: 20px; margin-top: 8px;">\n${childrenHtml}</div>\n</details>\n`;
        }
        return `<h3${mergeStyles(style, 'font-size: 1.25em; margin-top: 1.3em; margin-bottom: 0.3em; font-weight: bold;')} id="${id}">${inlineContent}</h3>\n`;
      }
      case 'h4': {
        const cleanText = node.content.replace(/<[^>]*>/g, '').replace(/\\/g, '').trim();
        const id = generateHeadingId(cleanText);
        const tag = node.attributes.toggle === 'true' ? 'details' : 'h4';
        if (tag === 'details') {
          return `<details${style} id="${id}" class="notion-toggle-h4" style="margin-top: 1.2em; margin-bottom: 0.2em;"><summary style="cursor: pointer; outline: none; font-weight: bold; font-size: 1.1em; display: list-item;"><h4 style="display: inline; font-size: 1em; margin: 0; padding: 0;">${inlineContent}</h4></summary>\n<div style="padding-left: 20px; margin-top: 8px;">\n${childrenHtml}</div>\n</details>\n`;
        }
        return `<h4${mergeStyles(style, 'font-size: 1.1em; margin-top: 1.2em; margin-bottom: 0.2em; font-weight: bold;')} id="${id}">${inlineContent}</h4>\n`;
      }
      case 'bullet_list_item':
        return `<li${mergeStyles(style, 'margin-bottom: 4px;')} >${inlineContent}${childrenHtml ? '\n' + childrenHtml : ''}</li>\n`;
      case 'numbered_list_item':
        return `<li${mergeStyles(style, 'margin-bottom: 4px;')} >${inlineContent}${childrenHtml ? '\n' + childrenHtml : ''}</li>\n`;
      case 'todo_item': {
        const checked = node.attributes.checked === 'true';
        const checkbox = `<input type="checkbox" disabled${checked ? ' checked' : ''} style="margin-right: 8px; vertical-align: middle;">`;
        return `<li${mergeStyles(style, 'margin-bottom: 6px; list-style-type: none; display: flex; align-items: center;')} ><label style="display: inline-flex; align-items: center;">${checkbox}<span style="${checked ? 'text-decoration: line-through; opacity: 0.6;' : ''}">${inlineContent}</span></label>${childrenHtml ? '\n' + childrenHtml : ''}</li>\n`;
      }
      case 'quote':
        return `<blockquote${mergeStyles(style, 'border-left: 3px solid #37352f; padding-left: 14px; margin: 12px 0; color: inherit;')} >${inlineContent}${childrenHtml ? '\n' + childrenHtml : ''}</blockquote>\n`;
      case 'paragraph':
        return `<p${mergeStyles(style, 'margin-top: 4px; margin-bottom: 4px; min-height: 1em; line-height: 1.6;')} >${inlineContent}${childrenHtml ? '\n' + childrenHtml : ''}</p>\n`;
      case 'divider':
        return `<hr style="border: none; border-top: 1px solid rgba(55, 53, 47, 0.09); margin: 16px 0;">\n`;
      case 'empty':
        return `<div style="height: 1em;"></div>\n`;
      case 'code': {
        const escaped = node.content.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        return `<pre style="background-color: #f7f6f3; padding: 16px; border-radius: 8px; font-family: monospace; font-size: 0.9em; overflow-x: auto; border: 1px solid rgba(15, 15, 15, 0.05); margin: 12px 0;"><code class="language-${node.attributes.language || ''}">${escaped}</code></pre>\n`;
      }
      case 'equation': {
        return `<div style="text-align: center; margin: 12px 0; font-family: serif; font-size: 1.1em; overflow-x: auto; padding: 8px 0;">$$ ${node.content} $$</div>\n`;
      }
      case 'markdown_table': {
        const rows = node.content.split('\n');
        let tableHtml = `<table style="border-collapse: collapse; width: 100%; margin: 16px 0; font-size: 0.9em;">\n`;
        let inHeader = true;
        for (const row of rows) {
          const cells = row.split('|').map(c => c.trim()).filter((c, idx, arr) => idx > 0 && idx < arr.length - 1);
          if (cells.length === 0) {
            continue;
          }
          if (cells.every(c => /^:?-+:?$/.test(c))) {
            inHeader = false;
            continue;
          }
          tableHtml += `  <tr>\n`;
          for (const cell of cells) {
            const cellContent = parseInline(cell);
            const cellTag = inHeader ? 'th' : 'td';
            const cellStyle = inHeader
              ? `style="border: 1px solid rgba(55, 53, 47, 0.09); padding: 8px 12px; background-color: #f7f6f3; font-weight: 600; text-align: left;"`
              : `style="border: 1px solid rgba(55, 53, 47, 0.09); padding: 8px 12px; text-align: left;"`;
            tableHtml += `    <${cellTag} ${cellStyle}>${cellContent}</${cellTag}>\n`;
          }
          tableHtml += `  </tr>\n`;
          inHeader = false;
        }
        tableHtml += `</table>\n`;
        return tableHtml;
      }
      case 'image': {
        const defaultImgStyle = `max-width: 100%; border-radius: 6px; display: block; margin: 0 auto;`;
        return `<figure${mergeStyles(style, 'margin: 16px 0; text-align: center;')} class="notion-image-figure">\n  <img src="${node.attributes.src}" alt="${node.attributes.alt || ''}" style="${defaultImgStyle}">\n  ${node.content ? '<figcaption style="font-size: 0.85em; opacity: 0.6; margin-top: 6px;">' + parseInline(node.content) + '</figcaption>' : ''}\n</figure>\n`;
      }
      case 'summary':
        return '';

      case 'tag_open': {
        const tagName = node.attributes.tagName;
        const innerColor = node.attributes.color;
        const tagStyle = getBlockStyle(node.attributes);

        if (tagName === 'callout') {
          const emoji = node.attributes.icon || '💡';
          const isBg = innerColor && innerColor.endsWith('_bg');
          const defaultStyle = isBg
            ? `display: flex; gap: 12px; padding: 16px; border-radius: 8px; margin: 12px 0; align-items: flex-start;`
            : `display: flex; gap: 12px; padding: 16px; border-radius: 8px; margin: 12px 0; border: 1px solid rgba(55, 53, 47, 0.09); align-items: flex-start;`;

          return `<div${mergeStyles(tagStyle, defaultStyle)} class="notion-callout">\n  <span style="font-size: 1.2em; line-height: 1.2; user-select: none;">${emoji}</span>\n  <div style="flex: 1; min-width: 0;">\n${inlineContent ? '    <p style="margin: 0;">' + inlineContent + '</p>\n' : ''}${childrenHtml}  </div>\n</div>\n`;
        }

        if (tagName === 'columns') {
          return `<div${mergeStyles(tagStyle, 'display: flex; gap: 24px; flex-wrap: wrap; margin: 12px 0; width: 100%;')} class="notion-columns" >\n${childrenHtml}</div>\n`;
        }

        if (tagName === 'column') {
          return `<div${mergeStyles(tagStyle, 'flex: 1 1 200px; min-width: 0;')} class="notion-column" >\n${childrenHtml}</div>\n`;
        }

        if (tagName === 'details') {
          let summaryText = 'Toggle';
          const summaryNode = node.children.find(c => c.type === 'summary');
          let remainingChildrenHtml = childrenHtml;
          if (summaryNode) {
            summaryText = summaryNode.content;
            const filteredChildren = node.children.filter(c => c !== summaryNode);
            remainingChildrenHtml = renderNodes(filteredChildren);
          }
          return `<details${mergeStyles(tagStyle, 'margin: 6px 0;')} class="notion-toggle" ><summary style="cursor: pointer; outline: none; display: list-item; font-weight: 500;">${parseInline(summaryText)}</summary>\n<div style="padding-left: 20px; margin-top: 6px;">\n${remainingChildrenHtml}</div></details>\n`;
        }

        if (tagName === 'summary') {
          return '';
        }

        if (tagName === 'synced_block' || tagName === 'synced_block_reference') {
          return `<div class="notion-synced-block" style="border-left: 2px solid rgba(55, 53, 47, 0.16); padding-left: 12px; margin: 12px 0;">\n${childrenHtml}</div>\n`;
        }

        if (tagName === 'table') {
          return `<table class="notion-table" style="border-collapse: collapse; width: 100%; margin: 16px 0;">\n${childrenHtml}</table>\n`;
        }

        if (tagName === 'colgroup') {
          return `<colgroup>\n${childrenHtml}</colgroup>\n`;
        }

        if (tagName === 'col') {
          return `<col${tagStyle}>\n`;
        }

        if (tagName === 'tr') {
          return `<tr${tagStyle}>\n${childrenHtml}</tr>\n`;
        }

        if (tagName === 'td') {
          const defaultTdStyle = `border: 1px solid rgba(55, 53, 47, 0.09); padding: 8px 12px; text-align: left; vertical-align: top;`;
          return `<td${mergeStyles(tagStyle, defaultTdStyle)}>${inlineContent}${childrenHtml}</td>\n`;
        }

        return `<div${tagStyle} class="notion-${tagName}">\n${inlineContent}${childrenHtml}</div>\n`;
      }

      case 'tag_self_closing': {
        const tagName = node.attributes.tagName;
        const tagStyle = getBlockStyle(node.attributes);
        if (tagName === 'table_of_contents') {
          return `<div class="notion-table-of-contents" style="margin: 12px 0; padding: 12px; border: 1px solid rgba(55, 53, 47, 0.09); border-radius: 6px; background-color: #f7f6f3;"><div style="font-weight: 600; margin-bottom: 8px;">Table of Contents</div><div class="toc-placeholder" style="font-style: italic; opacity: 0.6; font-size: 0.9em;">(Table of contents rendered dynamically)</div></div>\n`;
        }
        return `<div${tagStyle} class="notion-${tagName}"></div>\n`;
      }

      case 'audio': {
        return `<div${mergeStyles(style, 'margin: 12px 0; display: flex; flex-direction: column; gap: 6px;')} class="notion-media notion-audio"><audio src="${node.attributes.src}" controls style="width: 100%;"></audio>${node.content ? '<div style="font-size: 0.85em; opacity: 0.6;">' + parseInline(node.content) + '</div>' : ''}</div>\n`;
      }
      case 'video': {
        return `<div${mergeStyles(style, 'margin: 12px 0; display: flex; flex-direction: column; gap: 6px;')} class="notion-media notion-video"><video src="${node.attributes.src}" controls style="max-width: 100%; border-radius: 4px;"></video>${node.content ? '<div style="font-size: 0.85em; opacity: 0.6;">' + parseInline(node.content) + '</div>' : ''}</div>\n`;
      }
      case 'file': {
        return `<div${mergeStyles(style, 'margin: 8px 0; display: flex; align-items: center; gap: 8px; padding: 12px; border: 1px solid rgba(55, 53, 47, 0.09); border-radius: 6px; background-color: #f7f6f3;')} class="notion-media notion-file"><span style="font-size: 1.2em;">📎</span><a href="${node.attributes.src}" target="_blank" style="font-size: 0.9em; font-weight: 500; color: inherit; text-decoration: none;">${inlineContent || 'Download file'}</a></div>\n`;
      }
      case 'pdf': {
        return `<div${mergeStyles(style, 'margin: 12px 0; display: flex; flex-direction: column; gap: 6px;')} class="notion-media notion-pdf"><iframe src="${node.attributes.src}" style="width: 100%; height: 500px; border: 1px solid rgba(55, 53, 47, 0.09); border-radius: 6px;"></iframe>${node.content ? '<div style="font-size: 0.85em; opacity: 0.6;">' + parseInline(node.content) + '</div>' : ''}</div>\n`;
      }
      case 'page_ref': {
        return `<div${mergeStyles(style, 'margin: 4px 0; display: inline-flex; align-items: center; gap: 6px; padding: 6px 10px; border: 1px solid rgba(55, 53, 47, 0.09); border-radius: 4px; background-color: #f7f6f3; font-size: 0.95em;')} class="notion-ref notion-page-ref"><span style="font-size: 1em;">📄</span><a href="${node.attributes.url}" style="color: inherit; text-decoration: none; font-weight: 500;">${inlineContent || 'Linked Page'}</a></div>\n`;
      }
      case 'database_ref': {
        const icon = node.attributes.icon || '🗃️';
        return `<div${mergeStyles(style, 'margin: 4px 0; display: inline-flex; align-items: center; gap: 6px; padding: 6px 10px; border: 1px solid rgba(55, 53, 47, 0.09); border-radius: 4px; background-color: #f7f6f3; font-size: 0.95em;')} class="notion-ref notion-database-ref"><span style="font-size: 1em;">${icon}</span><a href="${node.attributes.url}" style="color: inherit; text-decoration: none; font-weight: 500;">${inlineContent || 'Linked Database'}</a></div>\n`;
      }

      default:
        return `<div${style}>${inlineContent}${childrenHtml}</div>\n`;
    }
  };

  const buildTree = (markdown: string): NotionNode[] => {
    if (!markdown) {
      return [];
    }

    const lines = markdown.replace(/\r\n/g, '\n').split('\n');
    const processedLines: any[] = [];
    let i = 0;

    while (i < lines.length) {
      const line = lines[i];
      let indentLevel = 0;
      while (indentLevel < line.length && line[indentLevel] === '\t') {
        indentLevel++;
      }
      const cleanLine = line.slice(indentLevel);

      // Check code block
      if (cleanLine.startsWith('```')) {
        const lang = cleanLine.slice(3).trim();
        const codeLines: string[] = [];
        i++;
        while (i < lines.length) {
          const nextLine = lines[i];
          let nextIndent = 0;
          while (nextIndent < nextLine.length && nextLine[nextIndent] === '\t') {
            nextIndent++;
          }
          const nextClean = nextLine.slice(nextIndent);
          if (nextClean === '```') {
            break;
          }
          codeLines.push(nextLine.slice(Math.min(indentLevel, nextIndent)));
          i++;
        }
        processedLines.push({
          type: 'code',
          content: codeLines.join('\n'),
          attributes: { language: lang },
          level: indentLevel,
        });
        i++;
        continue;
      }

      // Check equation block
      if (cleanLine === '$$') {
        const eqLines: string[] = [];
        i++;
        while (i < lines.length) {
          const nextLine = lines[i];
          let nextIndent = 0;
          while (nextIndent < nextLine.length && nextLine[nextIndent] === '\t') {
            nextIndent++;
          }
          const nextClean = nextLine.slice(nextIndent);
          if (nextClean === '$$') {
            break;
          }
          eqLines.push(nextLine.slice(Math.min(indentLevel, nextIndent)));
          i++;
        }
        processedLines.push({
          type: 'equation',
          content: eqLines.join('\n'),
          attributes: {},
          level: indentLevel,
        });
        i++;
        continue;
      }

      // Check standard markdown table
      if (cleanLine.startsWith('|')) {
        const tableLines: string[] = [];
        const currentIndent = indentLevel;
        while (i < lines.length) {
          const nextLine = lines[i];
          let nextIndent = 0;
          while (nextIndent < nextLine.length && nextLine[nextIndent] === '\t') {
            nextIndent++;
          }
          const nextClean = nextLine.slice(nextIndent);
          if (!nextClean.startsWith('|')) {
            break;
          }
          tableLines.push(nextClean);
          i++;
        }
        processedLines.push({
          type: 'markdown_table',
          content: tableLines.join('\n'),
          attributes: {},
          level: currentIndent,
        });
        continue;
      }

      // Group tag blocks
      const tagMatch = cleanLine.match(/^<([a-zA-Z0-9_\-]+)(.*)>$/);
      if (tagMatch && !cleanLine.startsWith('</') && !cleanLine.endsWith('/>')) {
        const tagName = tagMatch[1];
        const groupableTags = ['callout', 'details', 'columns', 'column', 'synced_block', 'synced_block_reference', 'table'];
        if (groupableTags.includes(tagName)) {
          const attributes: Record<string, string> = { tagName };
          const rawAttrs = tagMatch[2];
          const attrRegex = /([a-zA-Z0-9_\-]+)="([^"]*)"/g;
          let m;
          while ((m = attrRegex.exec(rawAttrs)) !== null) {
            attributes[m[1]] = m[2];
          }

          const { content, endIndex } = groupTagBlock(lines, i, tagName);
          processedLines.push({
            type: 'tag_open',
            content: '',
            attributes,
            level: indentLevel,
            innerContent: content,
          });
          i = endIndex + 1;
          continue;
        }
      }

      const parsed = parseLine(line);
      processedLines.push(parsed);
      i++;
    }

    const root: NotionNode = { type: 'root', content: '', attributes: {}, children: [], level: -1 };
    const stack: NotionNode[] = [root];

    for (const line of processedLines) {
      if (line.type === 'tag_close') {
        const tagName = line.attributes.tagName;
        while (stack.length > 1) {
          const top = stack[stack.length - 1];
          if (top.type === 'tag_open' && top.attributes.tagName === tagName) {
            stack.pop();
            break;
          }
          stack.pop();
        }
        continue;
      }

      const node: NotionNode = {
        type: line.type,
        content: line.content,
        attributes: { ...line.attributes },
        children: [],
        level: line.level,
      };

      if (line.innerContent !== undefined) {
        node.children = buildTree(line.innerContent);
      }

      while (stack.length > 1) {
        const top = stack[stack.length - 1];
        const isOpenTag = top.type === 'tag_open' && top.content === '';
        if (isOpenTag && node.level >= top.level) {
          break;
        }

        if (top.level >= node.level) {
          stack.pop();
        } else {
          break;
        }
      }

      const parent = stack[stack.length - 1];
      parent.children.push(node);

      const isPushable = node.type !== 'tag_self_closing' &&
                         (node.type !== 'tag_open' || node.content === '') &&
                         node.attributes.isSingleLine !== 'true' &&
                         line.innerContent === undefined &&
                         node.type !== 'divider' &&
                         node.type !== 'empty' &&
                         node.type !== 'code' &&
                         node.type !== 'equation' &&
                         node.type !== 'markdown_table' &&
                         node.type !== 'image' &&
                         node.type !== 'audio' &&
                         node.type !== 'video' &&
                         node.type !== 'file' &&
                         node.type !== 'pdf' &&
                         node.type !== 'page_ref' &&
                         node.type !== 'database_ref';

      if (isPushable) {
        stack.push(node);
      }
    }

    return root.children;
  };

  const parse = (markdown: string): string => {
    const tree = buildTree(markdown);
    return renderNodes(tree);
  };

  return {
    parse,
    parseInline,
    getTableOfContents,
  };
}
