import React from "react";

interface ProbabilityChartProps {
  dp: { [damage: number]: number };
  maxDamage: number;
}

const ProbabilityChart: React.FC<ProbabilityChartProps> = ({
  dp,
  maxDamage,
}) => {
  const chartData = Array.from({ length: maxDamage + 2 }, (_, i) => ({
    damage: i,
    prob: dp[i] || 0,
  }));

  const yAxisLabels = [0, 20, 40, 60, 80, 100];
  const horizontalLines = [50, 66, 80];

  return (
    <div className="bg-gray-800 p-4 md:p-6 rounded-xl shadow-lg border border-gray-700 mt-6">
      <h2 className="text-sm font-semibold text-gray-400 mb-4 uppercase tracking-wider">
        Outcome Probabilities
      </h2>
      <div className="flex space-x-2 items-end h-64">
        {/* Y-Axis */}
        <div className="h-full flex flex-col justify-between text-xs text-gray-400 relative">
          {yAxisLabels.map((val) => (
            <span key={val} className="-mb-2">
              {val}%
            </span>
          ))}
          <div className="absolute top-0 left-8 right-0 bottom-4 border-l border-gray-600">
            {horizontalLines.map((val) => (
              <div
                key={val}
                className="absolute w-full border-t border-dashed border-gray-600"
                style={{ bottom: `${val}%` }}
              ></div>
            ))}
          </div>
        </div>

        {/* Bars */}
        <div className="flex-grow h-full flex items-end border-b border-gray-600 relative">
          <div className="w-full h-full flex justify-around items-end">
            {chartData.map(({ damage, prob }) => (
              <div key={damage} className="flex-1 flex flex-col items-center">
                <div
                  className="w-4/5 bg-blue-500 rounded-t-sm"
                  style={{ height: `${prob * 100}%` }}
                  title={`Prob: ${(prob * 100).toFixed(1)}%`}
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
