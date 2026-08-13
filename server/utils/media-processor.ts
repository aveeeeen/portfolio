import { getSupabaseClient } from "./supabase";

const BUCKET_NAME = "event-images";

export interface ProcessedFlyerResult {
  storagePath: string;
  publicUrl: string;
}

/**
 * Utility / Infrastructure Layer for Media Side-Effects.
 * Handles fetching image buffers, WebP conversion via sharp, and Storage uploads.
 */
export async function convertAndUploadFlyer(
  eventId: string,
  rawImageUrl: string
): Promise<ProcessedFlyerResult | null> {
  if (!eventId || !rawImageUrl) {
    return null;
  }

  const supabase = getSupabaseClient();
  if (!supabase) {
    return null;
  }

  try {
    // 1. Download image buffer from Notion temporary URL
    const response = await fetch(rawImageUrl);
    if (!response.ok) {
      console.warn(`Failed to fetch raw image from Notion URL for event ${eventId}: ${response.statusText}`);
      return null;
    }

    const arrayBuffer = await response.arrayBuffer();
    const rawBuffer = Buffer.from(arrayBuffer);

    // 2. Convert buffer to WebP format using sharp
    let webpBuffer: Buffer = rawBuffer;
    let contentType = "image/webp";
    try {
      const sharpModule = await import("sharp");
      const sharp = sharpModule.default || sharpModule;
      webpBuffer = await sharp(rawBuffer)
        .webp({ quality: 80 })
        .toBuffer();
    } catch (conversionErr) {
      console.error("Failed to convert image to WebP with sharp, falling back to raw format:", conversionErr);
      contentType = response.headers.get("content-type") || "image/jpeg";
    }

    // 3. Upload buffer to Supabase Storage
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
      return null;
    }

    // 4. Get permanent public URL from Storage
    const { data: publicUrlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(storagePath);

    return {
      storagePath,
      publicUrl: publicUrlData.publicUrl
    };
  } catch (err) {
    console.error(`Unexpected error processing media for event ${eventId}:`, err);
    return null;
  }
}
