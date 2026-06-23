import { useState, useEffect, useMemo } from 'react';
import { X, Clock } from 'lucide-react';
import { getCompensatoryStatus, getStatusColor } from '../utils/statusUtils';

// Convert "8:00 PM" / "20:30" / "8:30" → "HH:MM" for <input type="time">.
function to24h(raw) {
  if (!raw) return '';
  const s = String(raw).trim().toUpperCase();
  const isPM = s.includes('PM');
  const isAM = s.includes('AM');
  const clean = s.replace('AM', '').replace('PM', '').trim();
  const parts = clean.split(':');
  if (parts.length < 2) return '';
  let h = parseInt(parts[0], 10);
  const m = parseInt(parts[1], 10);
  if (isNaN(h) || isNaN(m)) return '';
  if (isPM && h !== 12) h += 12;
  if (isAM && h === 12) h = 0;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

// Convert "17/1/26", "2026-04-09", etc. → "YYYY-MM-DD" for <input type="date">.
function toInputDate(raw) {
  if (!raw) return '';
  const s = String(raw).trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  // Try "/" or "-" separated parts
  const sep = s.includes('/') ? '/' : s.includes('-') ? '-' : null;
  if (sep) {
    const [a, b, c] = s.split(sep).map(p => p.trim());
    const ai = parseInt(a, 10), bi = parseInt(b, 10);
    let year = parseInt(c, 10);
    if (year < 100) year += 2000;
    // If a > 12 it must be DD; otherwise try MM/DD first (sheet convention)
    if (ai > 12) {
      const d = new Date(year, bi - 1, ai);
      if (!isNaN(d.getTime())) return `${year}-${String(bi).padStart(2,'0')}-${String(ai).padStart(2,'0')}`;
    } else {
      const d = new Date(year, ai - 1, bi);
      if (!isNaN(d.getTime())) return `${year}-${String(ai).padStart(2,'0')}-${String(bi).padStart(2,'0')}`;
    }
  }
  const d = new Date(raw);
  if (!isNaN(d.getTime())) {
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  }
  return '';
}

// Auto-calculate hours between two "HH:MM" (24h) strings. Returns "Xh Ym" or "".
function calcHoursStr(start24, end24) {
  if (!start24 || !end24) return '';
  const [sh, sm] = start24.split(':').map(Number);
  const [eh, em] = end24.split(':').map(Number);
  if (isNaN(sh) || isNaN(sm) || isNaN(eh) || isNaN(em)) return '';
  let diff = (eh * 60 + em) - (sh * 60 + sm);
  if (diff <= 0) diff += 24 * 60; // crossed midnight
  const h = Math.floor(diff / 60);
  const m = diff % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

const FIELD = 'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent bg-white';
const LABEL = 'block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1';

export default function RecordModal({ record, employees, onSave, onClose }) {
  const isEdit = record != null;
  const compIsYes = String(record?.compensatoryDate ?? '').trim().toLowerCase() === 'yes';

  const [form, setForm] = useState({
    date:             isEdit ? toInputDate(record.date)       : '',
    employeeName:     isEdit ? (record.employeeName || '')    : '',
    startTime:        isEdit ? to24h(record.startTime)        : '',
    endTime:          isEdit ? to24h(record.endTime)          : '',
    totalHours:       isEdit ? (record.totalHours || '')      : '',
    muneebApproval:   isEdit ? (record.muneebApproval || 'Yes') : 'Yes',
    compGiven:        isEdit ? compIsYes                      : false,
    compensatoryDate: isEdit && !compIsYes ? toInputDate(record.compensatoryDate) : '',
  });

  // Track whether the user manually edited the hours field.
  const [hoursLocked, setHoursLocked] = useState(isEdit && !!record?.totalHours);

  // Auto-calc hours whenever start or end changes, unless user locked it.
  useEffect(() => {
    if (hoursLocked) return;
    const calc = calcHoursStr(form.startTime, form.endTime);
    if (calc) setForm(f => ({ ...f, totalHours: calc }));
  }, [form.startTime, form.endTime, hoursLocked]);

  // Computed status preview — updates in real time as comp fields change.
  const computedStatus = useMemo(() => {
    if (form.compGiven) return 'Use Time';
    return getCompensatoryStatus(form.compensatoryDate);
  }, [form.compGiven, form.compensatoryDate]);

  const statusColors = getStatusColor(computedStatus);

  function set(key, val) { setForm(f => ({ ...f, [key]: val })); }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.date || !form.employeeName.trim()) return;
    onSave({
      date:             form.date,
      employeeName:     form.employeeName.trim(),
      startTime:        form.startTime,
      endTime:          form.endTime,
      totalHours:       form.totalHours || '0',
      muneebApproval:   form.muneebApproval,
      compensatoryDate: form.compGiven ? 'Yes' : form.compensatoryDate,
    });
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[92vh] overflow-y-auto scrollbar-thin">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10 rounded-t-2xl">
          <h2 className="text-base font-bold text-gray-800">
            {isEdit ? 'Edit Record' : 'Add New Record'}
          </h2>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {/* Date + Employee */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className={LABEL}>Date <span className="text-red-400">*</span></label>
              <input type="date" required value={form.date}
                onChange={e => set('date', e.target.value)}
                className={FIELD} />
            </div>
            <div>
              <label className={LABEL}>Employee <span className="text-red-400">*</span></label>
              <input
                list="emp-datalist" required
                value={form.employeeName}
                onChange={e => set('employeeName', e.target.value)}
                placeholder="Select or type name"
                className={FIELD}
              />
              <datalist id="emp-datalist">
                {employees.map(e => <option key={e} value={e} />)}
              </datalist>
            </div>
          </div>

          {/* Start + End Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={LABEL}>Start Time</label>
              <input type="time" value={form.startTime}
                onChange={e => { setHoursLocked(false); set('startTime', e.target.value); }}
                className={FIELD} />
            </div>
            <div>
              <label className={LABEL}>End Time</label>
              <input type="time" value={form.endTime}
                onChange={e => { setHoursLocked(false); set('endTime', e.target.value); }}
                className={FIELD} />
            </div>
          </div>

          {/* Total Hours + Approval */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={LABEL}>
                Total Hours
                {!hoursLocked && form.startTime && form.endTime && (
                  <span className="ml-1 text-cyan-500 font-normal normal-case text-xs">(auto)</span>
                )}
              </label>
              <div className="relative">
                <Clock className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                <input type="text" value={form.totalHours}
                  onChange={e => { setHoursLocked(true); set('totalHours', e.target.value); }}
                  placeholder="e.g. 2h 30m"
                  className={`${FIELD} pl-8`}
                />
              </div>
              {hoursLocked && form.startTime && form.endTime && (
                <button type="button" onClick={() => setHoursLocked(false)}
                  className="text-xs text-cyan-600 hover:underline mt-0.5">
                  Recalculate from times
                </button>
              )}
            </div>
            <div>
              <label className={LABEL}>Approval</label>
              <select value={form.muneebApproval}
                onChange={e => set('muneebApproval', e.target.value)}
                className={FIELD}>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
          </div>

          {/* Compensatory Date */}
          <div className="space-y-2">
            <label className={LABEL}>Compensatory Date</label>
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input type="checkbox" checked={form.compGiven}
                onChange={e => { set('compGiven', e.target.checked); if (e.target.checked) set('compensatoryDate', ''); }}
                className="w-4 h-4 rounded border-gray-300 accent-cyan-600"
              />
              <span className="text-sm text-gray-700">Comp. day already given — mark as Use Time</span>
            </label>
            {!form.compGiven && (
              <input type="date" value={form.compensatoryDate}
                onChange={e => set('compensatoryDate', e.target.value)}
                className={FIELD}
                placeholder="Leave blank if not scheduled"
              />
            )}
          </div>

          {/* Status preview */}
          <div className="flex items-center gap-2 py-1">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Auto Status:</span>
            <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold border ${statusColors.bg} ${statusColors.text} ${statusColors.border}`}>
              {computedStatus}
            </span>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose}
              className="flex-1 border border-gray-200 rounded-lg py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button type="submit"
              className="flex-1 bg-cyan-600 hover:bg-cyan-700 active:bg-cyan-800 text-white rounded-lg py-2.5 text-sm font-semibold transition-colors">
              {isEdit ? 'Save Changes' : 'Add Record'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
