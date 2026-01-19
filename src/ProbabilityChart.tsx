import React from "react";

interface ProbabilityChartProps {
  cdp: { [damage: number]: number };
  maxDamage: number;
}

const ProbabilityChart: React.FC<ProbabilityChartProps> = ({
  cdp,
  maxDamage,
}) => {
  const chartData = Array.from({ length: maxDamage + 2 }, (_, i) => ({
    damage: i,
    prob: cdp[i] || 0,
  }));

  const yAxisLabels = [0, 20, 40, 60, 80, 100];
  const horizontalLines = [50, 66, 80];

  return (
    <div className="bg-gray-800 p-4 md:p-6 rounded-xl shadow-lg border border-gray-700 mt-6">
      <h2 className="text-sm font-semibold text-gray-400 mb-4 uppercase tracking-wider">
        Cumulative Outcome Probabilities
      </h2>
      <div className="flex space-x-2 h-64">
        {/* Y-Axis */}
        <div className="flex flex-col-reverse justify-between text-xs text-gray-400 relative pr-2">
          {yAxisLabels.map((val) => (
            <span key={val} style={{ transform: "translateY(50%)" }}>
              {val}%
            </span>
          ))}
        </div>

        {/* Chart Area */}
        <div className="flex-grow h-full border-b border-l border-gray-600 relative">
          {/* Horizontal Lines */}
          {horizontalLines.map((val) => (
            <div
              key={val}
              className="absolute w-full border-t border-dashed border-gray-600"
              style={{ bottom: `${val}%` }}
            ></div>
          ))}

          {/* Bars */}
          <div className="w-full h-full flex justify-around items-end">
            {chartData.map(({ damage, prob }) => (
              <div key={damage} className="flex-1 flex flex-col items-center">
                <div
                  className="w-4/5 bg-blue-500 rounded-t-sm"
                  style={{ height: `${prob * 100}%` }}
                  title={`Prob (>=${damage}): ${(prob * 100).toFixed(1)}%`}
                ></div>
                <span className="text-xs text-gray-400 mt-1">{damage}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProbabilityChart;
