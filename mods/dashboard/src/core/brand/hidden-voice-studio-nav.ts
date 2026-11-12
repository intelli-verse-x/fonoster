/**
 * Voice Studio nav items hidden for brand users.
 * Root / admin (DASHBOARD_ROOT_EMAIL) keeps the full sidebar.
 */

export const BRAND_HIDDEN_NAV_LABELS = [
  "SIP Network",
  "Secrets",
  "API Keys"
] as const;

/** Path fragments brand users must not open. */
export const BRAND_HIDDEN_PATH_FRAGMENTS = [
  "/sip-network",
  "/secrets",
  "/api-keys"
] as const;

export function isVoiceStudioAdmin(userEmail?: string | null): boolean {
  const root = String(import.meta.env.DASHBOARD_ROOT_EMAIL || "")
    .trim()
    .toLowerCase();
  if (!root || !userEmail) return false;
  return userEmail.trim().toLowerCase() === root;
}

export function isBrandHiddenNavLabel(
  label: string,
  userEmail?: string | null
): boolean {
  if (isVoiceStudioAdmin(userEmail)) return false;
  return (BRAND_HIDDEN_NAV_LABELS as readonly string[]).includes(label);
}

export function isBrandHiddenPath(
  pathname: string,
  userEmail?: string | null
): boolean {
  if (isVoiceStudioAdmin(userEmail)) return false;
  return BRAND_HIDDEN_PATH_FRAGMENTS.some((fragment) =>
    pathname.includes(fragment)
  );
}
