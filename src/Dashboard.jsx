import { Clock, Timer, CheckCircle2 } from 'lucide-react';
import { useDashboardData } from './hooks/useDashboardData';
import { formatMinutes } from './utils/parseHours';
import { useAuth } from './auth/AuthContext';
import DashboardHeader from './components/DashboardHeader';
import KPICard from './components/KPICard';
import Filters from './components/Filters';
import DataTable from './components/DataTable';

export default function Dashboard() {
  const { isAdmin, user, logout } = useAuth();
  const {
    filteredData, kpis, meta,
    filters, setFilters,
    addRecord, updateRecord, deleteRecord, resetData,
  } = useDashboardData();

  return (
    <div className="min-h-screen bg-slate-50">
      <DashboardHeader
        data={filteredData}
        isAdmin={isAdmin}
        userEmail={user?.email}
        onLogout={logout}
      />

      <main className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* KPI Cards */}
        <section>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl">
            <KPICard
              title="Total Time"
              value={formatMinutes(kpis.totalMinutes)}
              subtitle="Total compensatory time earned"
              icon={Clock}
              color="cyan"
            />
            <KPICard
              title="Used Time"
              value={formatMinutes(kpis.usedMinutes)}
              subtitle="Compensatory time used"
              icon={CheckCircle2}
              color="emerald"
            />
            <KPICard
              title="Remaining Time"
              value={formatMinutes(kpis.remainingMinutes)}
              subtitle="Compensatory time still available"
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
            isAdmin={isAdmin}
          />
        </section>

        <footer className="text-center text-xs text-gray-400 pb-4 no-print">
          Andrew Team &ndash; Weekend Work Hours Dashboard &bull; Data sourced from internal records
        </footer>
      </main>
    </div>
  );
}
