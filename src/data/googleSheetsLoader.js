/**
 * Live Google Sheets CSV loader for the Andrew Team Weekend Work Hours sheet.
 *
 * HOW TO ENABLE LIVE DATA:
 * 1. In Google Sheets → File → Share → Publish to web → Sheet1 → CSV → Publish
 * 2. The URL below is already set to the correct sheet.
 * 3. In useDashboardData.js replace:
 *      import { RAW_DATA } from '../data/sampleData';
 *    with:
 *      import { fetchSheetData } from '../data/googleSheetsLoader';
 *    and wrap the hook to call fetchSheetData() in a useEffect, storing the
 *    result in local state before passing to enrichData().
 */

export const SHEET_CSV_URL =
  'https://docs.google.com/spreadsheets/d/1RCNHuYKto29z3NarNNUA4S_OlYoHZSjAhfIufY4Jybs/export?format=csv&gid=1409789558';

export async function fetchSheetData() {
  const res = await fetch(SHEET_CSV_URL);
  if (!res.ok) throw new Error(`Sheet fetch failed: ${res.status}`);
  const text = await res.text();
  return parseCSV(text);
}

function parseCSV(csvText) {
  const lines = csvText.trim().split('\n');
  if (lines.length < 2) return [];

  const firstLine = lines[0].toLowerCase();
  const hasHeader = firstLine.includes('date') || firstLine.includes('employee');
  const dataLines = hasHeader ? lines.slice(1) : lines;

  return dataLines
    .map(line => {
      const cols = parseCSVLine(line);
      if (cols.length < 5) return null;
      return {
        date:              (cols[0] || '').trim(),
        employeeName:      (cols[1] || '').trim(),
        startTime:         (cols[2] || '').trim(),
        endTime:           (cols[3] || '').trim(),
        totalHours:        (cols[4] || '').trim(),
        muneebApproval:    (cols[5] || '').trim(),
        compensatoryDate:  (cols[6] || '').trim(),
      };
    })
    .filter(Boolean)
    .filter(r => r.date && r.employeeName);
}

function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') { current += '"'; i++; }
      else inQuotes = !inQuotes;
    } else if (ch === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += ch;
    }
  }
  result.push(current);
  return result;
}
