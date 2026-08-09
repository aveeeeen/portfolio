import type { EventBlocksResult, ListEventInput, ListEventResult, Pagination, PaginationInput } from "./event.service.types";
import * as EventRepository from "./event.repository";
import { resolveEmbed } from "./embed.service";
import { fetchOgpMeta } from "./ogp.service";

async function enrichBlocksWithEmbeds(blocks: any[]): Promise<void> {
  if (!blocks || !Array.isArray(blocks)) return;

  const promises: Promise<void>[] = [];

  for (const block of blocks) {
    if (block.type === "embed" && block.embed?.url) {
      promises.push(
        resolveEmbed(block.embed.url).then((res) => {
          block.embedData = res;
        })
      );
    } else if (block.type === "bookmark" || block.type === "link_preview") {
      const url = block.bookmark?.url || block.link_preview?.url;
      if (url) {
        if (url.includes("embed")) {
          promises.push(
            resolveEmbed(url).then((res) => {
              block.embedData = res;
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
  console.log(input);
  const result = await EventRepository.getManyEvents(input);
  return result
}

export const getPaginationData = async (input: PaginationInput): Promise<Pagination> => {
  const pagination = await EventRepository.getAllPagesAndCursors(input);
  return pagination
}

export const getEventBlocksById = async (id: string): Promise<EventBlocksResult> => {
  const event = await EventRepository.getEventBlocksById(id);
  await enrichBlocksWithEmbeds(event.blocks);
  return event;
}

