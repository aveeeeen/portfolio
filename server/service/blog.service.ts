import type { ArticleBlocksResult, ArticleResult, ListArticleInput, ListArticleResult, Pagination, PaginationInput, Tag } from "./blog.service.types";
import * as BlogRepository from "./blog.repository";

export const listArticles = async (input: ListArticleInput): Promise<ListArticleResult[]> => {
  console.log(input);
  const result = await BlogRepository.getManyArticles(input);
  const transformedResult = result.map(page => {
    return {
      id: page.id,
      title: page.properties["Name"].title[0].plain_text,
      tags: page.properties["タグ"].multi_select.map(tag => {
        return {
          name: tag.name,
          id: tag.id
        }
      }),
      createdAt: page["created_time"],
      updatedAt: page["last_edited_time"],
    } as ListArticleResult
  })
  return transformedResult
}


export const getPaginationData = async (input: PaginationInput): Promise<Pagination> => {
  const pagination = await BlogRepository.getAllPagesAndCursors(input);
  return pagination
}

export const getArticleById = async (id: string): Promise<ArticleResult> => {
  const article = await BlogRepository.getArticleById(id);
  return article;
}

import { resolveEmbed } from "./embed.service";
import type { NotionBlock } from "./blog.service.types";

const extractExcerpt = (blocks: NotionBlock[]): string => {
  const paragraphs: string[] = [];
  for (const block of blocks) {
    if (block.type === 'paragraph') {
      const richText = (block as any).paragraph?.rich_text;
      if (richText && Array.isArray(richText)) {
        const text = richText
          .map((rt: any) => rt.plain_text || '')
          .join('')
          .trim();
        if (text) {
          paragraphs.push(text);
          if (paragraphs.length === 2) {
            break;
          }
        }
      }
    }
  }
  return paragraphs.join('\n\n');
}

import { fetchOgpMeta } from "./ogp.service";

function isEmbedOrMapsUrl(url: string): boolean {
  if (!url) return false;
  return (
    url.includes("embed") ||
    url.includes("google.com/maps") ||
    url.includes("maps.google.com") ||
    url.includes("maps.app.goo.gl") ||
    url.includes("goo.gl/maps") ||
    url.startsWith("https://strudel.cc") ||
    url.startsWith("http://strudel.cc")
  );
}

async function enrichBlocksWithEmbeds(blocks: NotionBlock[]): Promise<void> {
  if (!blocks || !Array.isArray(blocks)) return;

  const promises: Promise<void>[] = [];

  for (const block of blocks) {
    if (block.type === "embed" && block.embed?.url) {
      promises.push(
        resolveEmbed(block.embed.url).then((res) => {
          (block as any).embedData = res;
          if (res.resolvedUrl && block.embed) {
            block.embed.url = res.resolvedUrl;
          }
        })
      );
    } else if (block.type === "bookmark" || block.type === "link_preview") {
      const url = block.bookmark?.url || block.link_preview?.url;
      if (url) {
        if (isEmbedOrMapsUrl(url)) {
          promises.push(
            resolveEmbed(url).then((res) => {
              (block as any).embedData = res;
              if (res.resolvedUrl) {
                if (block.bookmark) block.bookmark.url = res.resolvedUrl;
                if (block.link_preview) block.link_preview.url = res.resolvedUrl;
              }
            })
          );
        } else {
          promises.push(
            fetchOgpMeta(url).then((ogp) => {
              (block as any).ogpData = ogp;
            })
          );
        }
      }
    }

    if (block.children && block.children.length > 0) {
      promises.push(enrichBlocksWithEmbeds(block.children));
    }
  }

  await Promise.all(promises);
}

export const getArticleBlocksById = async (id: string): Promise<ArticleBlocksResult> => {
  const article = await BlogRepository.getArticleBlocksById(id);
  await enrichBlocksWithEmbeds(article.blocks);
  return {
    ...article,
    excerpt: extractExcerpt(article.blocks)
  };
}

export const getAllTags = async (): Promise<Tag[]> => {
  const tags = await BlogRepository.getAllTags();
  return tags;
}