import type { EventBlocksResult, ListEventInput, ListEventResult, Pagination, PaginationInput } from "./event.service.types";
import * as EventRepository from "./event.repository";
import { resolveEmbed } from "./embed.service";
import { fetchOgpMeta } from "./ogp.service";
import { EventImageSyncService } from "./event-image-sync.service";

function isEmbedOrMapsUrl(url: string): boolean {
  if (!url) return false;
  return (
    url.includes("embed") ||
    url.includes("google.com/maps") ||
    url.includes("maps.google.com") ||
    url.includes("maps.app.goo.gl") ||
    url.includes("goo.gl/maps")
  );
}

async function enrichBlocksWithEmbeds(blocks: any[]): Promise<void> {
  if (!blocks || !Array.isArray(blocks)) return;

  const promises: Promise<void>[] = [];

  for (const block of blocks) {
    if (block.type === "embed" && block.embed?.url) {
      promises.push(
        resolveEmbed(block.embed.url).then((res) => {
          block.embedData = res;
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
              block.embedData = res;
              if (res.resolvedUrl) {
                if (block.bookmark) block.bookmark.url = res.resolvedUrl;
                if (block.link_preview) block.link_preview.url = res.resolvedUrl;
              }
            })
          );
        } else {
          promises.push(
            fetchOgpMeta(url).then((ogp) => {
              block.ogpData = ogp;
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

export const listEvents = async (input: ListEventInput): Promise<ListEventResult[]> => {
  const events = await EventRepository.getManyEvents(input);

  const syncTargets = events.map(e => ({
    id: e.id,
    rawImageUrl: e.imageUrl,
    updatedAt: e.updatedAt
  }));

  const syncedUrlMap = await EventImageSyncService.syncFlyerImagesForEvents(syncTargets);

  return events.map(e => ({
    ...e,
    imageUrl: syncedUrlMap.get(e.id) ?? e.imageUrl
  }));
};

export const getPaginationData = async (input: PaginationInput): Promise<Pagination> => {
  const pagination = await EventRepository.getAllPagesAndCursors(input);
  return pagination;
};

export const getEventBlocksById = async (id: string): Promise<EventBlocksResult> => {
  const event = await EventRepository.getEventBlocksById(id);
  await enrichBlocksWithEmbeds(event.blocks);

  if (event.imageUrl) {
    const syncedUrlMap = await EventImageSyncService.syncFlyerImagesForEvents([
      {
        id: event.id,
        rawImageUrl: event.imageUrl,
        updatedAt: event.updatedAt
      }
    ]);
    event.imageUrl = syncedUrlMap.get(event.id) ?? event.imageUrl;
  }

  return event;
};

