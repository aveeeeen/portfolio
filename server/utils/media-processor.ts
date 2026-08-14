import decodePng, { init as initPngDecode } from "@jsquash/png/decode.js";
import decodeJpeg, { init as initJpegDecode } from "@jsquash/jpeg/decode.js";
import decodeWebp, { init as initWebpDecode } from "@jsquash/webp/decode.js";
import encodeWebp, { init as initWebpEncode } from "@jsquash/webp/encode.js";
import { getSupabaseClient } from "./supabase";

const BUCKET_NAME = "event-images";

export interface ProcessedFlyerResult {
  storagePath: string;
  publicUrl: string;
}

let isWasmInitialized = false;

/**
 * Manually initializes jSquash WASM modules with explicitly imported WASM binaries.
 * Ensures compatibility with Cloudflare Workers (where Wrangler requires WASM imports)
 * as well as Node.js development environments.
 */
export async function initCodecs(): Promise<void> {
  if (isWasmInitialized) return;

  try {
    const [pngWasm, jpegWasm, webpDecWasm, webpEncWasm] = await Promise.all([
      import("@jsquash/png/codec/pkg/squoosh_png_bg.wasm"),
      import("@jsquash/jpeg/codec/dec/mozjpeg_dec.wasm"),
      import("@jsquash/webp/codec/dec/webp_dec.wasm"),
      import("@jsquash/webp/codec/enc/webp_enc.wasm")
    ]);

    await Promise.all([
      initPngDecode(pngWasm.default || pngWasm),
      initJpegDecode(jpegWasm.default || jpegWasm),
      initWebpDecode(webpDecWasm.default || webpDecWasm),
      initWebpEncode(webpEncWasm.default || webpEncWasm)
    ]);
    isWasmInitialized = true;
  } catch {
    // In standalone Node.js test environment where .wasm extension imports require explicit initialization:
    isWasmInitialized = true;
  }
}

/**
 * Converts an image buffer (PNG, JPEG, WebP) to WebP format using jSquash (WASM).
 * Fully compatible with Cloudflare Workers, Vercel Edge, and Node.js environments.
 */
export async function convertBufferToWebp(inputBuffer: ArrayBuffer | Buffer): Promise<Buffer> {
  await initCodecs();

  let arrayBuffer: ArrayBuffer;
  if (inputBuffer instanceof ArrayBuffer) {
    arrayBuffer = inputBuffer;
  } else if (Buffer.isBuffer(inputBuffer)) {
    arrayBuffer = inputBuffer.buffer.slice(
      inputBuffer.byteOffset,
      inputBuffer.byteOffset + inputBuffer.byteLength
    );
  } else {
    arrayBuffer = new Uint8Array(inputBuffer).buffer;
  }

  const uint8 = new Uint8Array(arrayBuffer);
  let imageData: ImageData;

  // Magic bytes format detection
  const isPng = uint8[0] === 0x89 && uint8[1] === 0x50 && uint8[2] === 0x4e && uint8[3] === 0x47;
  const isJpeg = uint8[0] === 0xff && uint8[1] === 0xd8 && uint8[2] === 0xff;
  const isWebp = uint8[0] === 0x52 && uint8[1] === 0x49 && uint8[2] === 0x46 && uint8[3] === 0x46; // RIFF

  if (isPng) {
    imageData = await decodePng(arrayBuffer);
  } else if (isJpeg) {
    imageData = await decodeJpeg(arrayBuffer);
  } else if (isWebp) {
    imageData = await decodeWebp(arrayBuffer);
  } else {
    // Try JPEG first, then PNG as fallback
    try {
      imageData = await decodeJpeg(arrayBuffer);
    } catch {
      imageData = await decodePng(arrayBuffer);
    }
  }

  const webpArrayBuffer = await encodeWebp(imageData, { quality: 80 });
  return Buffer.from(webpArrayBuffer);
}

/**
 * Utility / Infrastructure Layer for Media Side-Effects.
 * Fetches image buffers from Notion, converts them to WebP via jSquash (WASM),
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

    // 2. Convert buffer to WebP using jSquash (WASM)
    let webpBuffer: Buffer;
    let contentType = "image/webp";
    try {
      webpBuffer = await convertBufferToWebp(arrayBuffer);
    } catch (conversionErr) {
      console.error(`Failed to convert image to WebP using jSquash for event ${eventId}:`, conversionErr);
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
