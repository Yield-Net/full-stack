import { CheckCircle, AlertCircle, Flame } from 'lucide-react';
import ExecuteStrategy from './ExecuteStrategy';

const riskBadgeColor = {
  low: "bg-green-100 text-green-800",
  medium: "bg-yellow-100 text-yellow-800",
  high: "bg-red-100 text-red-800"
};

const riskIcon = {
  low: <CheckCircle className="h-4 w-4 text-green-500 inline" />,
  medium: <AlertCircle className="h-4 w-4 text-yellow-500 inline" />,
  high: <Flame className="h-4 w-4 text-red-500 inline" />
};

export default function StrategyMetrics({ strategy }) {
  if (!strategy || !Array.isArray(strategy) || strategy.length === 0) {
    return (
      <div className="text-gray-500 text-sm">
        No strategy selected or strategy is empty.
      </div>
    );
  }

  const totalReturn = strategy.reduce((acc, s) => acc + s.estimated_return, 0);
  const avgApy = strategy.reduce(
    (acc, s) => acc + (s.expected_apy * s.allocation_percent) / 100,
    0
  );

  const riskCounts = strategy.reduce((acc, s) => {
    acc[s.risk_level] = (acc[s.risk_level] || 0) + s.allocation_percent;
    return acc;
  }, {});

  return (
    <div className="space-y-8">
      {/* Summary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <MetricCard title="Estimated Return" value={`$${totalReturn.toFixed(2)}`} />
        <MetricCard title="Average APY" value={`${avgApy.toFixed(2)}%`} />
      </div>

      {/* Risk Profile */}
      <div className="bg-white rounded-xl shadow p-6 border">
        <h4 className="text-base font-semibold text-gray-700 uppercase tracking-wide mb-4 border-b pb-2">
          Risk Allocation
        </h4>
        <div className="flex flex-wrap gap-4">
          {Object.entries(riskCounts).map(([level, percent]) => (
            <div
              key={level}
              className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${riskBadgeColor[level]}`}
            >
              {riskIcon[level]} <span className="capitalize">{level}</span>: {percent}%
            </div>
          ))}
        </div>
      </div>

      {/* Strategy Rationale */}
      <div className="bg-white rounded-xl shadow p-6 border">
        <h4 className="text-base font-semibold text-gray-700 uppercase tracking-wide mb-4 border-b pb-2">
          Strategy Breakdown
        </h4>
        <ul className="space-y-6">
          {strategy.map((s, idx) => (
            <li key={idx} className="text-sm text-gray-800 border-b pb-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-base font-semibold text-gray-900">
                    {s.protocol}
                  </p>
                  <p className="text-sm text-gray-600 italic">
                    {s.activity} using <span className="font-medium">{s.token}</span>
                  </p>
                </div>
                <div
                  className={`px-2 py-1 rounded text-xs font-medium flex items-center gap-1 ${riskBadgeColor[s.risk_level]}`}
                >
                  {riskIcon[s.risk_level]} <span className="capitalize">{s.risk_level}</span>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-2">{s.why}</p>

              {/* Execute Strategy Button */}
              <ExecuteStrategy idx={idx} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// Reusable summary card
function MetricCard({ title, value }) {
  return (
    <div className="bg-white rounded-xl shadow p-6 border">
      <h4 className="text-sm font-semibold tracking-wide text-gray-600 uppercase mb-1">
        {title}
      </h4>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
}