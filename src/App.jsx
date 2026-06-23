import { Clock, Timer } from 'lucide-react';
import { useDashboardData } from './hooks/useDashboardData';
import { formatHours } from './utils/parseHours';
import DashboardHeader from './components/DashboardHeader';
import KPICard from './components/KPICard';
import Filters from './components/Filters';
import DataTable from './components/DataTable';

export default function App() {
  const {
    filteredData, kpis, meta,
    filters, setFilters,
    addRecord, updateRecord, deleteRecord, resetData,
  } = useDashboardData();

  return (
    <div className="min-h-screen bg-slate-50">
      <DashboardHeader data={filteredData} />

      <main className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* KPI Cards */}
        <section>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
            <KPICard
              title="Total Time"
              value={formatHours(kpis.totalHours)}
              subtitle="Total approved work time"
              icon={Clock}
              color="cyan"
            />
            <KPICard
              title="Remaining Time"
              value={formatHours(kpis.remainingHours)}
              subtitle="Time still pending"
              icon={Timer}
              color="blue"
            />
          </div>
        </section>

        {/* Filters */}
        <Filters filters={filters} setFilters={setFilters} meta={meta} />

        {/* All Records Table */}
        <section>
          <DataTable
            data={filteredData}
            filters={filters}
            setFilters={setFilters}
            onAdd={addRecord}
            onEdit={updateRecord}
            onDelete={deleteRecord}
            onReset={resetData}
            employees={meta.employees}
          />
        </section>

        <footer className="text-center text-xs text-gray-400 pb-4 no-print">
          Andrew Team &ndash; Weekend Work Hours Dashboard &bull; Data sourced from internal records
        </footer>
      </main>
    </div>
  );
}
