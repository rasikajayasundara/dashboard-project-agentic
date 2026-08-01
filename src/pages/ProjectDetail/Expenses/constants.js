// Fallback rate used only if state.metadata.settings.EXPENSE_MILEAGE_RATE_PER_KM
// hasn't loaded yet (metadata is fetched on login, see metadataSlice/saga.js).
export const DEFAULT_MILEAGE_RATE = 1.25;

// Used for the live in-modal "X km × $1.25/km = $Y" preview shown while typing,
// before the server confirms the real rateApplied/amount on save.
export const calcMileageCost = (km, rate = DEFAULT_MILEAGE_RATE) => Number(km || 0) * rate;

// The API's `attachments` field has been observed in multiple shapes across deployments:
// an array of bare document IDs (as documented), a single bare document ID, and (current)
// a single expanded object `{ id, name, link }`. Normalize all of them into a consistent
// array of `{ documentId, name, url }` — `name`/`url` are undefined for the bare-ID shapes,
// so callers still fall back to session-cached upload metadata for those.
export function normalizeAttachments(raw) {
  if (raw == null) return [];
  const list = Array.isArray(raw) ? raw : [raw];
  return list
    .filter((item) => item != null)
    .map((item) => {
      if (typeof item === "object") {
        return { documentId: item.id ?? item.documentId, name: item.name, url: item.link ?? item.url };
      }
      return { documentId: item, name: undefined, url: undefined };
    });
}

// For write payloads (POST/PUT `attachments` field) — just the ID(s), any shape in.
export function normalizeAttachmentIds(raw) {
  return normalizeAttachments(raw)
    .map((a) => a.documentId)
    .filter((id) => id != null);
}

// Attachments can be an image or a PDF — checked by extension since the API's
// `attachments` shapes don't carry a mime type, only name/url.
export function isPdfAttachment(attachment) {
  const candidate = attachment?.name || attachment?.url || "";
  return candidate.toLowerCase().endsWith(".pdf");
}
