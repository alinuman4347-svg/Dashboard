import { format, parse, isValid } from 'date-fns';

/**
 * Strips noise like "(Casual Leave)" appended to date strings in the sheet.
 */
function cleanDateStr(s) {
  return s.replace(/\(.*?\)/g, '').trim();
}

/**
 * Converts 2-digit year to 4-digit (20xx for 00–49, 19xx for 50–99).
 */
function expandYear(y) {
  const n = parseInt(y, 10);
  return n < 50 ? 2000 + n : 1900 + n;
}

/**
 * Parses the messy date formats seen in the Andrew Team sheet:
 *   DD/MM/YYYY, DD/M/YYYY, DD/M/YY, MM/DD/YYYY, MM/DD/YY,
 *   DD-MM-YY, d/M/yy, and native JS fallback.
 *
 * Strategy: try DD/MM first (Pakistan/UK convention), then MM/DD (US) as
 * fallback only when day > 12.
 */
export function parseDate(raw) {
  if (!raw) return null;
  const s = cleanDateStr(String(raw).trim());
  if (!s) return null;

  // Handle dash separator — normalise to slash
  const normalised = s.replace(/-/g, '/');

  // Split on slash
  const parts = normalised.split('/');
  if (parts.length === 3) {
    let [a, b, c] = parts.map(p => p.trim());

    // Expand 2-digit year
    if (c.length <= 2) c = String(expandYear(parseInt(c, 10)));

    const ai = parseInt(a, 10);
    const bi = parseInt(b, 10);
    const ci = parseInt(c, 10);

    // Try DD/MM/YYYY first (if a ≤ 31 and b ≤ 12)
    if (ai >= 1 && ai <= 31 && bi >= 1 && bi <= 12) {
      const d = new Date(ci, bi - 1, ai);
      if (isValid(d) && d.getFullYear() === ci && d.getMonth() === bi - 1 && d.getDate() === ai) {
        return d;
      }
    }
    // Fallback MM/DD/YYYY (if a ≤ 12 and b ≤ 31)
    if (ai >= 1 && ai <= 12 && bi >= 1 && bi <= 31) {
      const d = new Date(ci, ai - 1, bi);
      if (isValid(d) && d.getFullYear() === ci && d.getMonth() === ai - 1 && d.getDate() === bi) {
        return d;
      }
    }
  }

  // Named-month formats
  const namedFmts = ['MMMM d, yyyy', 'MMM d, yyyy', 'd MMM yyyy', 'dd MMM yyyy'];
  for (const fmt of namedFmts) {
    try {
      const d = parse(s, fmt, new Date());
      if (isValid(d)) return d;
    } catch {}
  }

  // Native fallback
  const fallback = new Date(s);
  return isValid(fallback) ? fallback : null;
}

/**
 * Returns "Use Time" when the compensatory time has already been used
 * (date is today or in the past, or explicitly marked "Yes").
 * Returns "Not Use" in every other case — future date, missing date, or unparseable.
 */
export function getCompensatoryStatus(compensatoryDate) {
  if (!compensatoryDate || String(compensatoryDate).trim() === '') return 'Not Use';
  const raw = String(compensatoryDate).trim().toLowerCase();
  if (raw === 'yes' || raw === 'y' || raw === 'done' || raw === 'given') return 'Use Time';
  const d = parseDate(compensatoryDate);
  if (!d) return 'Not Use';
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const comp = new Date(d);
  comp.setHours(0, 0, 0, 0);
  if (comp <= today) return 'Use Time';
  return 'Not Use';
}

/** True when the comp date field is empty / missing / "—". */
export function isCompDateMissing(compensatoryDate) {
  if (!compensatoryDate) return true;
  const s = String(compensatoryDate).trim();
  return s === '' || s === '—';
}

export function getStatusColor(status) {
  switch (status) {
    case 'Use Time': return { bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-200' };
    case 'Not Use':  return { bg: 'bg-amber-100',   text: 'text-amber-700',   border: 'border-amber-200' };
    default:         return { bg: 'bg-gray-100',    text: 'text-gray-600',    border: 'border-gray-200' };
  }
}

export function getApprovalColor(approval) {
  const val = String(approval || '').trim().toLowerCase();
  if (val === 'yes' || val === 'approved' || val === 'true') {
    return { bg: 'bg-emerald-100', text: 'text-emerald-700' };
  }
  return { bg: 'bg-red-100', text: 'text-red-700' };
}

export function isApproved(approval) {
  const val = String(approval || '').trim().toLowerCase();
  return val === 'yes' || val === 'approved' || val === 'true';
}

export function formatDisplayDate(dateStr) {
  if (!dateStr) return '—';
  const d = parseDate(dateStr);
  if (!d) return String(dateStr);
  return format(d, 'dd MMM yyyy');
}

export function getMonthYear(dateStr) {
  const d = parseDate(dateStr);
  if (!d) return 'Unknown';
  return format(d, 'MMM yyyy');
}

export function getMonthSortKey(dateStr) {
  const d = parseDate(dateStr);
  if (!d) return 0;
  return d.getFullYear() * 100 + (d.getMonth() + 1);
}

/**
 * Normalise employee names from the sheet:
 * - Trim whitespace
 * - Collapse "Husnain" / "Husnain " → "Husnain Bashir"
 * - Collapse "Muneeb" → "Muneeb Shafiq"
 * - Capitalise "suleman butt" → "Suleman Butt"
 */
export function normalizeEmployee(name) {
  if (!name) return '';
  const trimmed = name.trim();
  const lower = trimmed.toLowerCase();
  if (lower === 'husnain' || lower === 'husnain ') return 'Husnain Bashir';
  if (lower === 'muneeb') return 'Muneeb Shafiq';
  if (lower === 'suleman butt' || lower === 'suleman') return 'Suleman';
  // Title-case remaining
  return trimmed.replace(/\b\w/g, c => c.toUpperCase());
}
