export default function KPICard({ title, value, subtitle, icon: Icon, color = 'cyan' }) {
  const colorMap = {
    cyan:    { card: 'border-l-cyan-500',   icon: 'bg-cyan-50 text-cyan-600',   val: 'text-cyan-700' },
    blue:    { card: 'border-l-blue-500',   icon: 'bg-blue-50 text-blue-600',   val: 'text-blue-700' },
    emerald: { card: 'border-l-emerald-500',icon: 'bg-emerald-50 text-emerald-600', val: 'text-emerald-700' },
    violet:  { card: 'border-l-violet-500', icon: 'bg-violet-50 text-violet-600',   val: 'text-violet-700' },
    amber:   { card: 'border-l-amber-500',  icon: 'bg-amber-50 text-amber-600',  val: 'text-amber-700' },
    rose:    { card: 'border-l-rose-500',   icon: 'bg-rose-50 text-rose-600',   val: 'text-rose-700' },
    sky:     { card: 'border-l-sky-500',    icon: 'bg-sky-50 text-sky-600',     val: 'text-sky-700' },
  };
  const c = colorMap[color] || colorMap.cyan;

  return (
    <div className={`group relative bg-white rounded-xl shadow-sm border border-gray-100 border-l-4 ${c.card} p-5 h-full min-h-[150px] flex flex-col items-center justify-center text-center cursor-default transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5`}>
      {/* Icon — consistently pinned to the top-right corner */}
      {Icon && (
        <div className={`absolute top-3 right-3 w-10 h-10 rounded-lg flex items-center justify-center transition-transform duration-200 group-hover:scale-110 ${c.icon}`}>
          <Icon className="w-5 h-5" />
        </div>
      )}

      {/* Centered content: title, value, subtitle */}
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{title}</p>
      <p className={`text-3xl sm:text-4xl font-bold mt-2 leading-tight ${c.val}`}>{value}</p>
      {subtitle && <p className="text-xs text-gray-500 mt-2 px-2">{subtitle}</p>}
    </div>
  );
}
