import { PhotonImage, resize, SamplingFilter } from "@cf-wasm/photon";
import { getSupabaseClient } from "./supabase";

const BUCKET_NAME = "event-images";
const MAX_LONG_EDGE = 1200;

export interface ProcessedFlyerResult {
  storagePath: string;
  publicUrl: string;
}

/**
 * Converts an image buffer (PNG, JPEG, WebP) to WebP format using @cf-wasm/photon.
 * - If the long edge (width or height) is 1200px or greater, it resizes the image to 1200px long edge while preserving aspect ratio.
 * - CRITICAL: Immediately frees the original large image from WASM memory right after resizing to minimize memory peak and avoid Cloudflare Workers' 128MB RAM limit.
 */
export async function convertBufferToWebp(inputBuffer: ArrayBuffer | Buffer): Promise<Buffer> {
  let uint8: Uint8Array;
  if (inputBuffer instanceof Uint8Array) {
    uint8 = inputBuffer;
  } else if (inputBuffer instanceof ArrayBuffer) {
    uint8 = new Uint8Array(inputBuffer);
  } else if (Buffer.isBuffer(inputBuffer)) {
    uint8 = new Uint8Array(
      inputBuffer.buffer,
      inputBuffer.byteOffset,
      inputBuffer.byteLength
    );
  } else {
    uint8 = new Uint8Array(inputBuffer);
  }

  let photonImage: PhotonImage | null = null;
  let resizedImage: PhotonImage | null = null;

  try {
    photonImage = PhotonImage.new_from_byteslice(uint8);

    const origWidth = photonImage.get_width();
    const origHeight = photonImage.get_height();
    const longEdge = Math.max(origWidth, origHeight);

    let imageToConvert = photonImage;

    // Resize if long edge is 1200px or greater
    if (longEdge >= MAX_LONG_EDGE) {
      let targetWidth: number;
      let targetHeight: number;

      if (origWidth >= origHeight) {
        targetWidth = MAX_LONG_EDGE;
        targetHeight = Math.round((origHeight * MAX_LONG_EDGE) / origWidth);
      } else {
        targetHeight = MAX_LONG_EDGE;
        targetWidth = Math.round((origWidth * MAX_LONG_EDGE) / origHeight);
      }

      // Resize using Triangle (bilinear) filter for optimal memory footprint and speed
      resizedImage = resize(photonImage, targetWidth, targetHeight, SamplingFilter.Triangle);

      // CRITICAL: Free original large image from WASM memory IMMEDIATELY before generating WebP!
      photonImage.free();
      photonImage = null;

      imageToConvert = resizedImage;
    }

    const webpBytes = imageToConvert.get_bytes_webp();

    // CRITICAL: Immediately release WASM memory as soon as WebP bytes are extracted!
    imageToConvert.free();
    if (resizedImage) {
      resizedImage = null;
    }
    if (photonImage) {
      photonImage = null;
    }

    return Buffer.from(webpBytes);
  } catch (err) {
    console.error("Photon WebP conversion error:", err);
    throw err;
  } finally {
    // CRITICAL: Fallback cleanup if error occurred before manual free
    if (resizedImage) {
      resizedImage.free();
      resizedImage = null;
    }
    if (photonImage) {
      photonImage.free();
      photonImage = null;
    }
  }
}

/**
 * Utility / Infrastructure Layer for Media Side-Effects.
 * Fetches image buffers from Notion, converts them to WebP via @cf-wasm/photon (resized to max 1200px long edge),
 * and uploads them to Supabase Storage.
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
    // 1. Download raw image buffer from Notion temporary URL
    const response = await fetch(rawImageUrl);
    if (!response.ok) {
      console.warn(`Failed to fetch raw image from Notion URL for event ${eventId}: ${response.statusText}`);
      return null;
    }

    const arrayBuffer = await response.arrayBuffer();

    // 2. Convert buffer to WebP (max 1200px long edge) using @cf-wasm/photon
    let webpBuffer: Buffer;
    let contentType = "image/webp";
    try {
      webpBuffer = await convertBufferToWebp(arrayBuffer);
    } catch (conversionErr) {
      console.error(`Failed to convert image to WebP using Photon for event ${eventId}:`, conversionErr);
      webpBuffer = Buffer.from(arrayBuffer);
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
