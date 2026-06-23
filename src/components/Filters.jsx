import { X, SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';

export default function Filters({ filters, setFilters, meta }) {
  const [open, setOpen] = useState(true);

  function update(key, val) {
    setFilters(prev => ({ ...prev, [key]: val }));
  }

  function clearAll() {
    setFilters({ employee: '', dateFrom: '', dateTo: '', approval: '', month: '', search: '' });
  }

  const activeCount = Object.values(filters).filter(v => v !== '').length;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 no-print">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-3 text-left"
      >
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-cyan-600" />
          <span className="font-semibold text-gray-700 text-sm">Filters</span>
          {activeCount > 0 && (
            <span className="bg-cyan-100 text-cyan-700 text-xs font-bold px-2 py-0.5 rounded-full">
              {activeCount} active
            </span>
          )}
        </div>
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="px-4 pb-4 border-t border-gray-50">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 mt-3">
            {/* Employee */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Employee</label>
              <select
                value={filters.employee}
                onChange={e => update('employee', e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
              >
                <option value="">All Employees</option>
                {meta.employees.map(e => <option key={e} value={e}>{e}</option>)}
              </select>
            </div>

            {/* Month */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Month</label>
              <select
                value={filters.month}
                onChange={e => update('month', e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
              >
                <option value="">All Months</option>
                {meta.months.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>

            {/* Approval */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Approval</label>
              <select
                value={filters.approval}
                onChange={e => update('approval', e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
              >
                <option value="">All Status</option>
                <option value="approved">Approved</option>
                <option value="pending">Not Approved</option>
              </select>
            </div>

            {/* Date From */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Date From</label>
              <input
                type="date"
                value={filters.dateFrom}
                onChange={e => update('dateFrom', e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
              />
            </div>

            {/* Date To */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Date To</label>
              <input
                type="date"
                value={filters.dateTo}
                onChange={e => update('dateTo', e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
              />
            </div>

            {/* Clear */}
            <div className="flex items-end">
              <button
                onClick={clearAll}
                disabled={activeCount === 0}
                className="w-full flex items-center justify-center gap-1.5 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <X className="w-3.5 h-3.5" />
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
