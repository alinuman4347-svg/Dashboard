import { Lightbulb } from 'lucide-react';

export default function SummaryInsights({ insights }) {
  if (!insights || insights.length === 0) return null;

  return (
    <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl border border-cyan-100 shadow-sm p-4">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-7 h-7 bg-cyan-100 rounded-lg flex items-center justify-center">
          <Lightbulb className="w-4 h-4 text-cyan-600" />
        </div>
        <h3 className="text-sm font-semibold text-cyan-800 uppercase tracking-wider">Automatic Insights</h3>
      </div>
      <ul className="space-y-2">
        {insights.map((insight, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className="mt-1 w-4 h-4 rounded-full bg-cyan-200 text-cyan-700 text-xs font-bold flex items-center justify-center flex-shrink-0">
              {i + 1}
            </span>
            <p className="text-sm text-cyan-900 leading-relaxed">{insight}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
