// utils/mergeWeekDays.js

export function mergeDaysWithWeek(days, weekStartISO) {
  const base = parseISO(weekStartISO);
  if (!base) return [];

  const startUTC = new Date(Date.UTC(base.year, base.month - 1, base.day));

  return days.map((d, i) => {
    const dt = new Date(startUTC.getTime() + i * 86400000); // +i days
    const iso = dt.toISOString().slice(0, 10);              // YYYY-MM-DD (UTC)
    return {
      ...d,
      iso,                                 // e.g., "2024-08-19"
      day: dt.getUTCDate(),                // e.g., 19
      date: formatDateShortTitle(iso),     // e.g., "19th Aug"
    };
  });
}

/* -------- helpers (UTC-safe + ordinals) -------- */

function parseISO(s) {
  if (typeof s !== "string") return null;
  const m = s.trim().match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return null;
  const year = +m[1], month = +m[2], day = +m[3];
  const dt = new Date(Date.UTC(year, month - 1, day));
  if (
    dt.getUTCFullYear() !== year ||
    dt.getUTCMonth() + 1 !== month ||
    dt.getUTCDate() !== day
  ) return null;
  return { year, month, day };
}

function formatDateShortTitle(iso) {
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return "";
  const year = +m[1], month = +m[2], day = +m[3];

  const dt = new Date(Date.UTC(year, month - 1, day));
  if (
    dt.getUTCFullYear() !== year ||
    dt.getUTCMonth() + 1 !== month ||
    dt.getUTCDate() !== day
  ) return "";

  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${ordinal(day)} ${months[month - 1]}`;
}

function ordinal(n) {
  const v = n % 100;
  if (v >= 11 && v <= 13) return `${n}th`;
  switch (n % 10) {
    case 1: return `${n}st`;
    case 2: return `${n}nd`;
    case 3: return `${n}rd`;
    default: return `${n}th`;
  }
}

// --- Generic date utilities for invoices (UTC-safe) ---

/**
 * Convert any date-like value (ISO string with time, Date, or YYYY-MM-DD) to a plain
 * UTC YYYY-MM-DD string. Returns empty string on invalid input.
 */
export function toISODateOnly(value) {
  if (!value) return "";
  if (typeof value === "string") {
    const justDate = value.match(/^\d{4}-\d{2}-\d{2}$/);
    if (justDate) return value; // already YYYY-MM-DD
  }
  const d = new Date(value);
  if (isNaN(d.getTime())) return "";
  // Use UTC to avoid timezone shifts
  return d.toISOString().slice(0, 10);
}

/**
 * Format a date-like value as a human-readable short date using UTC parts, e.g. "24 Oct 2025".
 * Falls back to "" if input is invalid.
 */
export function toDisplayDate(value) {
  const iso = toISODateOnly(value);
  if (!iso) return "";
  const [y, m, d] = iso.split('-').map(Number);
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${d} ${months[m - 1]} ${y}`;
}


export const formatDate = (dateStr) => {
  const d = new Date(dateStr);

  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");

  return `${day}-${month}-${d.getFullYear()}`;
};

/**
 * Return a human-friendly relative time string for a date string, e.g.
 * "just now", "5 min ago", "2 hours ago", "Yesterday", "3 days ago", or
 * falls back to toDisplayDate(dateStr) beyond a week.
 */
export const timeAgo = (dateStr) => {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";

  const diffMs = Date.now() - d.getTime();
  const diffSec = Math.floor(diffMs / 1000);

  if (diffSec < 60) return "just now";

  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin} min ago`;

  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour} hours ago`;

  const diffDay = Math.floor(diffHour / 24);
  if (diffDay === 1) return "Yesterday";
  if (diffDay < 7) return `${diffDay} days ago`;

  return toDisplayDate(dateStr);
};