/**
 * Helper to determine if Nitro cache should be bypassed.
 *
 * Behavior:
 * - If ENABLE_CACHE=false or DISABLE_CACHE=true in .env -> Bypass cache (cache disabled)
 * - If ENABLE_CACHE=true or DISABLE_CACHE=false in .env -> Do not bypass cache (cache enabled)
 * - Default: Bypass cache in development mode (NODE_ENV === 'development' or import.meta.dev)
 */
export const shouldBypassCache = (): boolean => {
  if (process.env.DISABLE_CACHE === "true" || process.env.ENABLE_CACHE === "false") {
    return true;
  }
  if (process.env.DISABLE_CACHE === "false" || process.env.ENABLE_CACHE === "true") {
    return false;
  }
  return process.env.NODE_ENV === "development" || !!import.meta.dev;
};
