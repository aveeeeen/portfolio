import { EventImageSyncService } from "./event-image-sync.service";

/**
 * Lightweight helper delegating to EventImageSyncService for single items.
 */
export async function syncEventFlyerImage(
  eventId: string,
  rawImageUrl: string,
  lastEditedTime: string
): Promise<string> {
  const map = await EventImageSyncService.syncFlyerImagesForEvents([
    {
      id: eventId,
      rawImageUrl,
      updatedAt: lastEditedTime
    }
  ]);
  return map.get(eventId) || rawImageUrl;
}
