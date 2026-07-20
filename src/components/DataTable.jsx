import { useState, useMemo } from 'react';
import { Search, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Plus, Pencil, Trash2, RotateCcw } from 'lucide-react';
import { formatMinutes } from '../utils/parseHours';
import { getStatusColor, getApprovalColor, formatDisplayDate } from '../utils/statusUtils';
import RecordModal from './RecordModal';

const PAGE_SIZES = [10, 25, 50];

function StatusBadge({ status }) {
  const c = getStatusColor(status);
  return (
    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold border ${c.bg} ${c.text} ${c.border}`}>
      {status}
    </span>
  );
}

function ApprovalBadge({ approval }) {
  const c = getApprovalColor(approval);
  return (
    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${c.bg} ${c.text}`}>
      {approval || '—'}
    </span>
  );
}

function SortIcon({ col, sortCol, sortDir }) {
  if (sortCol !== col) return <ChevronUp className="w-3 h-3 text-gray-300" />;
  return sortDir === 'asc'
    ? <ChevronUp className="w-3 h-3 text-cyan-600" />
    : <ChevronDown className="w-3 h-3 text-cyan-600" />;
}

const COLUMNS = [
  { key: 'date',              label: 'Date' },
  { key: 'employeeName',      label: 'Employee' },
  { key: 'startTime',         label: 'Start' },
  { key: 'endTime',           label: 'End' },
  { key: 'earnedMinutes',     label: 'Earned' },
  { key: 'usedMinutes',       label: 'Used' },
  { key: 'remainingMinutes',  label: 'Remaining' },
  { key: 'muneebApproval',    label: 'Approval' },
  { key: 'compensatoryStatus',label: 'Status' },
];

export default function DataTable({
  data, filters, setFilters,
  onAdd, onEdit, onDelete, onReset,
  employees, isAdmin = false,
}) {
  const [sortCol, setSortCol] = useState('date');
  const [sortDir, setSortDir] = useState('desc');
  const [page, setPage]       = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [modal, setModal]     = useState({ open: false, record: null });

  function handleSort(col) {
    if (sortCol === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortCol(col); setSortDir('asc'); }
    setPage(1);
  }

  const sorted = useMemo(() => {
    return [...data].sort((a, b) => {
      const av = a[sortCol] ?? '';
      const bv = b[sortCol] ?? '';
      if (typeof av === 'number') return sortDir === 'asc' ? av - bv : bv - av;
      return sortDir === 'asc'
        ? String(av).localeCompare(String(bv))
        : String(bv).localeCompare(String(av));
    });
  }, [data, sortCol, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const paginated  = sorted.slice((page - 1) * pageSize, page * pageSize);
  const pageStart  = sorted.length === 0 ? 0 : (page - 1) * pageSize + 1;
  const pageEnd    = Math.min(page * pageSize, sorted.length);

  function openAdd() { setModal({ open: true, record: null }); }
  function openEdit(row) { setModal({ open: true, record: row }); }

  function handleDelete(row) {
    if (window.confirm(`Delete record for ${row.employeeName} on ${formatDisplayDate(row.date)}?`)) {
      onDelete(row.id);
    }
  }

  async function handleSave(raw) {
    if (modal.record) {
      onEdit(modal.record.id, raw);
      setModal({ open: false, record: null });
      return;
    }
    const { employeeNames, ...rest } = raw;
    const names = employeeNames || [];
    const records = names.map(employeeName => ({ ...rest, employeeName }));
    await onAdd(records.length === 1 ? records[0] : records);
    setModal({ open: false, record: null });
    if (names.length > 1) alert(`${names.length} records created successfully.`);
  }

  function handleSearch(val) {
    setFilters(prev => ({ ...prev, search: val }));
    setPage(1);
  }

  return (
    <>
      {modal.open && (
        <RecordModal
          record={modal.record}
          employees={employees}
          onSave={handleSave}
          onClose={() => setModal({ open: false, record: null })}
        />
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        {/* ── Toolbar ── */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 border-b border-gray-100 no-print">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider">All Records</h3>
            {/* Write actions are admin-only. Viewers don't see these at all. */}
            {isAdmin && (
              <>
                <button
                  onClick={openAdd}
                  className="flex items-center gap-1.5 bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Record
                </button>
                <button
                  onClick={onReset}
                  title="Reset to original sample data"
                  className="flex items-center gap-1.5 border border-gray-200 text-gray-500 hover:bg-gray-50 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Reset Data
                </button>
              </>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search records…"
                value={filters.search}
                onChange={e => handleSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
              />
            </div>
            <select
              value={pageSize}
              onChange={e => { setPageSize(Number(e.target.value)); setPage(1); }}
              className="border border-gray-200 rounded-lg px-2 py-2 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            >
              {PAGE_SIZES.map(s => <option key={s} value={s}>{s} rows</option>)}
            </select>
          </div>
        </div>

        {/* ── Table ── */}
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {COLUMNS.map(col => (
                  <th
                    key={col.key}
                    onClick={() => handleSort(col.key)}
                    className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700 whitespace-nowrap select-none"
                  >
                    <div className="flex items-center gap-1">
                      {col.label}
                      <SortIcon col={col.key} sortCol={sortCol} sortDir={sortDir} />
                    </div>
                  </th>
                ))}
                {/* Actions column — admin only, not sortable */}
                {isAdmin && (
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={COLUMNS.length + (isAdmin ? 1 : 0)} className="px-4 py-12 text-center text-gray-400 text-sm">
                    No records match your filters.
                  </td>
                </tr>
              ) : paginated.map((row, i) => (
                <tr
                  key={row.id}
                  className={`hover:bg-cyan-50/30 transition-colors ${i % 2 === 0 ? '' : 'bg-gray-50/40'}`}
                >
                  <td className="px-4 py-3 text-gray-700 whitespace-nowrap font-medium">{formatDisplayDate(row.date)}</td>
                  <td className="px-4 py-3 text-gray-800 font-semibold whitespace-nowrap">{row.employeeName}</td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{row.startTime || '—'}</td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{row.endTime || '—'}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="font-bold text-cyan-700">{formatMinutes(row.earnedMinutes)}</span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap font-medium text-gray-700">
                    {formatMinutes(row.usedMinutes)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`font-bold ${row.remainingMinutes > 0 ? 'text-blue-700' : 'text-gray-400'}`}>
                      {formatMinutes(row.remainingMinutes)}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <ApprovalBadge approval={row.muneebApproval} />
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <StatusBadge status={row.compensatoryStatus} />
                  </td>
                  {/* Edit / Delete — admin only */}
                  {isAdmin && (
                    <td className="px-4 py-3 whitespace-nowrap no-print">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openEdit(row)}
                          title="Edit record"
                          className="p-1.5 rounded-lg text-gray-400 hover:text-cyan-600 hover:bg-cyan-50 transition-colors"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(row)}
                          title="Delete record"
                          className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ── Pagination ── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 px-4 py-3 border-t border-gray-100 no-print">
          <p className="text-xs text-gray-500">
            {sorted.length === 0
              ? 'No records'
              : `Showing ${pageStart}–${pageEnd} of ${sorted.length} records`}
          </p>
          <div className="flex items-center gap-1">
            <button onClick={() => setPage(1)} disabled={page === 1}
              className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed text-gray-600">
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let p;
              if (totalPages <= 5) p = i + 1;
              else if (page <= 3) p = i + 1;
              else if (page >= totalPages - 2) p = totalPages - 4 + i;
              else p = page - 2 + i;
              return (
                <button key={p} onClick={() => setPage(p)}
                  className={`w-7 h-7 rounded text-xs font-medium transition-colors ${
                    page === p ? 'bg-cyan-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                  }`}>
                  {p}
                </button>
              );
            })}
            <button onClick={() => setPage(totalPages)} disabled={page === totalPages}
              className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed text-gray-600">
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
