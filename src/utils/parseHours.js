/**
 * Parses messy "Total Hours" strings into a numeric float (hours).
 * Handles all formats seen in the Andrew Team sheet:
 *   "5 hours", "1 Hour", "1 Hour 10 mins", "4.5hour", "40 Mins",
 *   "45 minutes", "30min", "3 HOURS 25 MIN", "9Hours",
 *   "1 hour5 mins", "1 hour30  mins", "1 hour 4 min", "1.5 hours"
 */
export function parseHours(raw) {
  if (raw === null || raw === undefined || raw === '') return 0;
  if (typeof raw === 'number') return raw;

  const str = String(raw).trim().toLowerCase().replace(/\s+/g, ' ');

  // Pure decimal (e.g. "4.5")
  if (/^\d+(\.\d+)?$/.test(str)) return parseFloat(str);

  let totalHours = 0;

  // Hours: matches "5 hours", "4.5hour", "9Hours", "1 Hr", "2h"
  // Also handles no-space like "1hour5" before mins
  const hoursMatch = str.match(/(\d+(?:\.\d+)?)\s*(?:hours?|hrs?|h(?![a-z0-9]))/);
  if (hoursMatch) totalHours += parseFloat(hoursMatch[1]);

  // Minutes: matches "10 mins", "40 min", "30min", "45 minutes", "5 Mins"
  // Also handles "1 hour5 mins" (digit runs into word without space)
  const minsMatch = str.match(/(\d+(?:\.\d+)?)\s*(?:minutes?|mins?|min(?![a-z])|m(?=\b|\d|$))/);
  if (minsMatch) {
    // Avoid double-counting if the match is the hours part
    const mPos = str.indexOf(minsMatch[0]);
    const hEnd = hoursMatch ? str.indexOf(hoursMatch[0]) + hoursMatch[0].length : -1;
    if (mPos >= hEnd) {
      totalHours += parseFloat(minsMatch[1]) / 60;
    }
  }

  // Fallback: single number with no unit
  if (totalHours === 0) {
    const numMatch = str.match(/(\d+(?:\.\d+)?)/);
    if (numMatch) totalHours = parseFloat(numMatch[1]);
  }

  return Math.round(totalHours * 100) / 100;
}

export function formatHours(hours) {
  if (!hours || hours === 0) return '0h';
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

/**
 * Formats a duration given in MINUTES as a clean "Xh YYm" string.
 *   120 → "2h 00m"   30 → "30m"   90 → "1h 30m"   0 → "0m"
 * Minutes are zero-padded to 2 digits when hours are present.
 */
export function formatMinutes(totalMinutes) {
  const total = Math.max(0, Math.round(Number(totalMinutes) || 0));
  const h = Math.floor(total / 60);
  const m = total % 60;
  if (h === 0) return `${m}m`;
  return `${h}h ${String(m).padStart(2, '0')}m`;
}
