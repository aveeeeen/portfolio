import { SupabaseImageRepository, type EventImageRecord } from "./supabase-image.repository";
import { convertAndUploadFlyer } from "../utils/media-processor";

export interface SyncTargetEvent {
  id: string;
  rawImageUrl: string;
  updatedAt: string; // Notion last_edited_time
}

/**
 * Domain / Application Layer Service for Batch Event Flyer Image Synchronization.
 *
 * Pipeline Flow:
 * 1. Bulk query Supabase DB for all event IDs in single SELECT (1 query).
 * 2. Compare timestamps in pure business logic.
 * 3. Separate cached valid items vs stale/missing items requiring upload.
 * 4. Execute image processing (WebP conversion + Storage upload) SEQUENTIALLY to keep memory usage under 128MB limit in Cloudflare Workers.
 * 5. Bulk upsert updated metadata records into DB.
 */
export const EventImageSyncService = {
  /**
   * Batch sync flyer images for a list of event objects.
   * Returns a Map<eventId, permanentPublicUrl>.
   */
  async syncFlyerImagesForEvents(
    events: SyncTargetEvent[]
  ): Promise<Map<string, string>> {
    const urlMap = new Map<string, string>();

    // 1. Filter events that actually have a flyer image
    const validEvents = events.filter(e => e.id && e.rawImageUrl);
    if (validEvents.length === 0) {
      return urlMap;
    }

    const eventIds = validEvents.map(e => e.id);

    // 2. Bulk fetch cached records from Supabase DB in a single SQL query
    const cachedMap = await SupabaseImageRepository.getImagesByEventIds(eventIds);

    const staleEvents: SyncTargetEvent[] = [];

    // 3. Pure Business Logic: Compare timestamps to determine cached vs stale items
    for (const event of validEvents) {
      const cachedRecord = cachedMap.get(event.id);
      if (cachedRecord && cachedRecord.public_url) {
        const cachedDate = new Date(cachedRecord.notion_updated_at).getTime();
        const notionDate = new Date(event.updatedAt).getTime();

        if (cachedDate >= notionDate) {
          // Cache is fresh! Use cached permanent URL
          urlMap.set(event.id, cachedRecord.public_url);
          continue;
        }
      }

      // Cache missing or stale: Needs WebP conversion and Storage upload
      staleEvents.push(event);
    }

    // 4. Side-Effects: Process media conversion sequentially to protect Cloudflare Workers 128MB RAM limit
    if (staleEvents.length > 0) {
      const dbRecordsToUpsert: EventImageRecord[] = [];

      for (const event of staleEvents) {
        const processed = await convertAndUploadFlyer(event.id, event.rawImageUrl);
        if (processed) {
          urlMap.set(event.id, processed.publicUrl);
          dbRecordsToUpsert.push({
            event_id: event.id,
            storage_path: processed.storagePath,
            public_url: processed.publicUrl,
            notion_updated_at: new Date(event.updatedAt).toISOString()
          });
        } else {
          // Fallback to raw Notion URL if upload fails
          urlMap.set(event.id, event.rawImageUrl);
        }
      }

      // 5. Bulk upsert updated metadata records into Supabase DB
      if (dbRecordsToUpsert.length > 0) {
        await SupabaseImageRepository.upsertImages(dbRecordsToUpsert);
      }
    }

    return urlMap;
  }
};
