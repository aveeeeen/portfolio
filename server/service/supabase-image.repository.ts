import { getSupabaseClient } from "../utils/supabase";

export interface EventImageRecord {
  event_id: string;
  storage_path: string;
  public_url: string;
  notion_updated_at: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * Data Access Layer (Repository) for Supabase `event_images` table.
 * Strictly handles database read/write queries without business logic or side-effects.
 */
export const SupabaseImageRepository = {
  /**
   * Bulk fetch cached image records for a given list of event IDs in a single query.
   */
  async getImagesByEventIds(eventIds: string[]): Promise<Map<string, EventImageRecord>> {
    const resultMap = new Map<string, EventImageRecord>();
    if (!eventIds || eventIds.length === 0) {
      return resultMap;
    }

    const supabase = getSupabaseClient();
    if (!supabase) {
      return resultMap;
    }

    try {
      const { data, error } = await supabase
        .from("event_images")
        .select("event_id, storage_path, public_url, notion_updated_at")
        .in("event_id", eventIds);

      if (error) {
        console.error("Failed to bulk fetch event_images from Supabase DB:", error);
        return resultMap;
      }

      if (data) {
        for (const record of data as EventImageRecord[]) {
          resultMap.set(record.event_id, record);
        }
      }
    } catch (err) {
      console.error("Unexpected error in getImagesByEventIds:", err);
    }

    return resultMap;
  },

  /**
   * Bulk upsert image records into the `event_images` table.
   */
  async upsertImages(records: EventImageRecord[]): Promise<void> {
    if (!records || records.length === 0) {
      return;
    }

    const supabase = getSupabaseClient();
    if (!supabase) {
      return;
    }

    try {
      const payload = records.map(record => ({
        event_id: record.event_id,
        storage_path: record.storage_path,
        public_url: record.public_url,
        notion_updated_at: record.notion_updated_at,
        updated_at: new Date().toISOString()
      }));

      const { error } = await supabase
        .from("event_images")
        .upsert(payload, { onConflict: "event_id" });

      if (error) {
        console.error("Failed to bulk upsert event_images records:", error);
      }
    } catch (err) {
      console.error("Unexpected error in upsertImages:", err);
    }
  }
};
