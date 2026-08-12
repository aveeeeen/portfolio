import { getSupabaseClient } from "../utils/supabase";

const BUCKET_NAME = "event-images";

/**
 * Ensures an event flyer image is stored in Supabase Storage as WebP
 * and persisted in Supabase Database.
 * 
 * If a valid (up-to-date) Supabase image URL exists, it returns the cached public URL.
 * Otherwise, downloads the Notion S3 image, converts it to WebP via sharp,
 * uploads to Supabase Storage, and updates the event_images database table.
 */
export async function syncEventFlyerImage(
  eventId: string,
  rawImageUrl: string,
  lastEditedTime: string
): Promise<string> {
  if (!eventId || !rawImageUrl) {
    return rawImageUrl;
  }

  const supabase = getSupabaseClient();
  if (!supabase) {
    return rawImageUrl;
  }

  try {
    // 1. Check existing record in Supabase Database
    const { data: existingRecord } = await supabase
      .from("event_images")
      .select("storage_path, public_url, notion_updated_at")
      .eq("event_id", eventId)
      .single();

    if (existingRecord && existingRecord.public_url) {
      const existingDate = new Date(existingRecord.notion_updated_at).getTime();
      const notionDate = new Date(lastEditedTime).getTime();

      // If Supabase record is newer or equal to Notion last_edited_time, use cached URL
      if (existingDate >= notionDate) {
        return existingRecord.public_url;
      }
    }

    // 2. Fetch raw image buffer from Notion temporary URL
    const response = await fetch(rawImageUrl);
    if (!response.ok) {
      console.warn(`Failed to fetch raw image from Notion URL for event ${eventId}: ${response.statusText}`);
      return rawImageUrl;
    }

    const arrayBuffer = await response.arrayBuffer();
    const rawBuffer = Buffer.from(arrayBuffer);

    // 3. Convert image buffer to WebP format using sharp
    let webpBuffer: Buffer = rawBuffer;
    let contentType = "image/webp";
    try {
      const sharpModule = await import("sharp");
      const sharp = sharpModule.default || sharpModule;
      webpBuffer = await sharp(rawBuffer)
        .webp({ quality: 80 })
        .toBuffer();
    } catch (conversionErr) {
      console.error("Failed to convert image to WebP with sharp, falling back to raw buffer:", conversionErr);
      contentType = response.headers.get("content-type") || "image/jpeg";
    }

    // 4. Upload WebP image buffer to Supabase Storage
    const fileExtension = contentType === "image/webp" ? "webp" : "jpg";
    const storagePath = `events/${eventId}.${fileExtension}`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(storagePath, webpBuffer, {
        contentType,
        upsert: true
      });

    if (uploadError) {
      console.error(`Failed to upload flyer image to Supabase Storage for event ${eventId}:`, uploadError);
      return rawImageUrl;
    }

    // 5. Get permanent Public URL from Supabase Storage
    const { data: publicUrlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(storagePath);

    const publicUrl = publicUrlData.publicUrl;

    // 6. Upsert metadata record in Supabase DB (event_images)
    const { error: upsertError } = await supabase
      .from("event_images")
      .upsert(
        {
          event_id: eventId,
          storage_path: storagePath,
          public_url: publicUrl,
          notion_updated_at: new Date(lastEditedTime).toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          onConflict: "event_id"
        }
      );

    if (upsertError) {
      console.error(`Failed to upsert event_images record for event ${eventId}:`, upsertError);
    }

    return publicUrl;
  } catch (err) {
    console.error(`Unexpected error syncing flyer image for event ${eventId}:`, err);
    return rawImageUrl;
  }
}
