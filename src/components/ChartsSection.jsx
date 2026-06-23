import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend,
} from 'recharts';
import { formatHours } from '../utils/parseHours';

const CYAN_SHADES = ['#06b6d4', '#0891b2', '#0e7490', '#155e75', '#164e63', '#a5f3fc'];
const COMP_COLORS = { Completed: '#10b981', Upcoming: '#3b82f6', 'Not Added': '#f59e0b' };

function ChartCard({ title, children, className = '' }) {
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-100 p-4 ${className}`}>
      <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-4">{title}</h3>
      {children}
    </div>
  );
}

const CustomTooltip = ({ active, payload, label, unit = 'h' }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg px-3 py-2 text-sm">
      <p className="font-semibold text-gray-700 mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }} className="font-medium">
          {p.name}: {typeof p.value === 'number' ? `${p.value}${unit}` : p.value}
        </p>
      ))}
    </div>
  );
};

const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }) => {
  if (percent < 0.05) return null;
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight="600">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export default function ChartsSection({ chartData }) {
  const { employeeHours, monthHours, dateHours, approvalData, compData } = chartData;

  return (
    <div className="space-y-4">
      {/* Row 1: Employee bar + Month column */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartCard title="Employee-wise Total Hours">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={employeeHours} layout="vertical" margin={{ left: 8, right: 20, top: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
              <XAxis type="number" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false}
                tickFormatter={v => `${v}h`} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#475569' }} axisLine={false}
                tickLine={false} width={90} />
              <Tooltip content={<CustomTooltip unit="h" />} cursor={{ fill: '#f0f9ff' }} />
              <Bar dataKey="hours" name="Hours" radius={[0, 6, 6, 0]} maxBarSize={28}>
                {employeeHours.map((_, i) => (
                  <Cell key={i} fill={CYAN_SHADES[i % CYAN_SHADES.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Month-wise Total Hours">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={monthHours} margin={{ left: 0, right: 10, top: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#475569' }} axisLine={false} tickLine={false}
                angle={-30} textAnchor="end" interval={0} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false}
                tickFormatter={v => `${v}h`} />
              <Tooltip content={<CustomTooltip unit="h" />} cursor={{ fill: '#f0f9ff' }} />
              <Bar dataKey="hours" name="Hours" fill="#06b6d4" radius={[6, 6, 0, 0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Row 2: Date line chart (full width) */}
      <ChartCard title="Date-wise Work Hours (Last 30 Dates)">
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={dateHours} margin={{ left: 0, right: 10, top: 5, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="date" tick={{ fontSize: 9, fill: '#475569' }} axisLine={false} tickLine={false}
              angle={-40} textAnchor="end" interval={Math.max(0, Math.floor(dateHours.length / 12))} />
            <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false}
              tickFormatter={v => `${v}h`} />
            <Tooltip content={<CustomTooltip unit="h" />} />
            <Line type="monotone" dataKey="hours" name="Hours" stroke="#06b6d4" strokeWidth={2.5}
              dot={{ fill: '#06b6d4', r: 4, strokeWidth: 0 }} activeDot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Row 3: Pie + Donut + Top employees */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {/* Approval pie */}
        <ChartCard title="Approval Summary">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={approvalData} cx="50%" cy="50%" outerRadius={80} dataKey="value"
                nameKey="name" labelLine={false} label={renderCustomLabel}>
                {approvalData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
              </Pie>
              <Tooltip formatter={(v, n) => [`${v} entries`, n]} />
              <Legend iconType="circle" iconSize={10} formatter={(v) => (
                <span style={{ fontSize: 12, color: '#475569' }}>{v}</span>
              )} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Compensatory donut */}
        <ChartCard title="Compensatory Status">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={compData} cx="50%" cy="50%" innerRadius={50} outerRadius={80}
                dataKey="value" nameKey="name" labelLine={false} label={renderCustomLabel}>
                {compData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
              </Pie>
              <Tooltip formatter={(v, n) => [`${v} entries`, n]} />
              <Legend iconType="circle" iconSize={10} formatter={(v) => (
                <span style={{ fontSize: 12, color: '#475569' }}>{v}</span>
              )} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Top employees table */}
        <ChartCard title="Top Employees by Weekend Hours">
          <div className="space-y-2">
            {employeeHours.slice(0, 6).map((emp, i) => {
              const maxHours = employeeHours[0]?.hours || 1;
              const pct = Math.round((emp.hours / maxHours) * 100);
              return (
                <div key={emp.name}>
                  <div className="flex justify-between text-xs mb-1">
                    <div className="flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-cyan-100 text-cyan-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                        {i + 1}
                      </span>
                      <span className="font-medium text-gray-700 truncate">{emp.name}</span>
                    </div>
                    <span className="font-bold text-cyan-700 ml-2 flex-shrink-0">{emp.hours}h</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all"
                      style={{ width: `${pct}%`, backgroundColor: CYAN_SHADES[i % CYAN_SHADES.length] }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </ChartCard>
      </div>
    </div>
  );
}
