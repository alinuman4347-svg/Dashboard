import { Download, Printer, RefreshCw } from 'lucide-react';
import { exportToCSV, printReport } from '../utils/exportUtils';

export default function DashboardHeader({ data }) {
  return (
    <header className="bg-gradient-to-r from-cyan-600 to-blue-700 text-white shadow-lg no-print">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
            <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
            </svg>
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Andrew Team</h1>
            <p className="text-cyan-100 text-sm font-medium">Weekend Work Hours Dashboard</p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => exportToCSV(data)}
            className="flex items-center gap-1.5 bg-white/15 hover:bg-white/25 transition-colors px-3 py-2 rounded-lg text-sm font-medium"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
          <button
            onClick={printReport}
            className="flex items-center gap-1.5 bg-white/15 hover:bg-white/25 transition-colors px-3 py-2 rounded-lg text-sm font-medium"
          >
            <Printer className="w-4 h-4" />
            Print Report
          </button>
          <div className="flex items-center gap-1.5 bg-white/15 px-3 py-2 rounded-lg text-sm">
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Last updated:</span>
            <span className="font-medium">{new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
