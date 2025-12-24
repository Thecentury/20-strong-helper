import { useState, useMemo } from "react";

type DieColor = "yellow" | "green" | "blue" | "purple" | "red";

interface DieStats {
  color: DieColor;
  label: string;
  cssColor: string;
  probabilities: { [damage: number]: number }; // Damage value -> Probability
  expectedValue: number;
}

const DICE_STATS: Record<DieColor, DieStats> = {
  yellow: {
    color: "yellow",
    label: "Yellow",
    cssColor: "bg-yellow-400 hover:bg-yellow-500 text-black",
    probabilities: { 0: 4 / 6, 1: 1 / 6, 2: 1 / 6 },
    expectedValue: (1 * 1 + 1 * 2) / 6,
  },
  green: {
    color: "green",
    label: "Green",
    cssColor: "bg-green-500 hover:bg-green-600 text-white",
    probabilities: { 0: 3 / 6, 1: 2 / 6, 2: 1 / 6 },
    expectedValue: (2 * 1 + 1 * 2) / 6,
  },
  blue: {
    color: "blue",
    label: "Blue",
    cssColor: "bg-blue-500 hover:bg-blue-600 text-white",
    probabilities: { 0: 2 / 6, 1: 3 / 6, 2: 1 / 6 },
    expectedValue: (3 * 1 + 1 * 2) / 6,
  },
  purple: {
    color: "purple",
    label: "Purple",
    cssColor: "bg-purple-600 hover:bg-purple-700 text-white",
    probabilities: { 0: 1 / 6, 1: 4 / 6, 2: 1 / 6 },
    expectedValue: (4 * 1 + 1 * 2) / 6,
  },
  red: {
    color: "red",
    label: "Red",
    cssColor: "bg-red-600 hover:bg-red-700 text-white",
    probabilities: { 0: 0 / 6, 1: 5 / 6, 2: 1 / 6 },
    expectedValue: (5 * 1 + 1 * 2) / 6,
  },
};

function App() {
  const [selectedDice, setSelectedDice] = useState<DieColor[]>([]);
  const [monsterHealth, setMonsterHealth] = useState<number | "">("");

  const addDie = (color: DieColor) => {
    setSelectedDice((prev) => {
      const next = [...prev, color];
      const order = Object.keys(DICE_STATS) as DieColor[];
      return next.sort((a, b) => order.indexOf(a) - order.indexOf(b));
    });
  };

  const removeDie = (index: number) => {
    setSelectedDice((prev) => prev.filter((_, i) => i !== index));
  };

  const resetDice = () => {
    setSelectedDice([]);
  };

  const stats = useMemo(() => {
    // 1. Calculate Mean Expected Damage
    const mean = selectedDice.reduce(
      (sum, color) => sum + DICE_STATS[color].expectedValue,
      0,
    );

    // 2. Calculate Probability Distribution
    // dp[d] = probability of dealing exactly d damage
    let dp: { [damage: number]: number } = { 0: 1.0 };

    for (const color of selectedDice) {
      const dieProbs = DICE_STATS[color].probabilities;
      const newDp: { [damage: number]: number } = {};

      for (const [currentDamageStr, currentProb] of Object.entries(dp)) {
        const currentDamage = parseInt(currentDamageStr);
        for (const [dieDamageStr, dieProb] of Object.entries(dieProbs)) {
          const dieDamage = parseInt(dieDamageStr);
          const totalDamage = currentDamage + dieDamage;
          newDp[totalDamage] =
            (newDp[totalDamage] || 0) + currentProb * dieProb;
        }
      }
      dp = newDp;
    }

    // 3. Calculate Kill Probability
    let killProbability = 0;
    if (monsterHealth !== "" && typeof monsterHealth === "number") {
      for (const [damageStr, prob] of Object.entries(dp)) {
        if (parseInt(damageStr) >= monsterHealth) {
          killProbability += prob;
        }
      }
    }

    return { mean, killProbability, dp };
  }, [selectedDice, monsterHealth]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4 font-sans flex flex-col items-center">
      <header className="mb-6 text-center">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-red-500">
          20 Strong Helper
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          Dice Probability Calculator
        </p>
      </header>

      <main className="w-full max-w-md space-y-6">
        {/* Dice Selection */}
        <div className="bg-gray-800 p-4 rounded-xl shadow-lg border border-gray-700">
          <h2 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wider">
            Add Dice
          </h2>
          <div className="flex justify-between gap-2">
            {(Object.keys(DICE_STATS) as DieColor[]).map((color) => (
              <button
                key={color}
                onClick={() => addDie(color)}
                className={`w-12 h-12 rounded-full shadow-md transition-transform transform active:scale-95 flex items-center justify-center font-bold text-lg ${DICE_STATS[color].cssColor}`}
                aria-label={`Add ${color} die`}
              >
                +
              </button>
            ))}
          </div>
        </div>

        {/* Selected Dice Display */}
        <div className="bg-gray-800 p-4 rounded-xl shadow-lg border border-gray-700 min-h-[100px]">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
              Selected Pool ({selectedDice.length})
            </h2>
            {selectedDice.length > 0 && (
              <button
                onClick={resetDice}
                className="text-xs text-red-400 hover:text-red-300 underline"
              >
                Reset
              </button>
            )}
          </div>

          {selectedDice.length === 0 ? (
            <div className="text-center text-gray-600 py-4 italic">
              No dice selected
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {selectedDice.map((color, idx) => (
                <button
                  key={`${color}-${idx}`}
                  onClick={() => removeDie(idx)}
                  className={`w-8 h-8 rounded-full shadow-sm flex items-center justify-center text-xs font-bold ring-2 ring-gray-800 ${DICE_STATS[color].cssColor}`}
                  title="Remove"
                >
                  {/* Using initial or simple circle */}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Monster Health Input */}
        <div className="bg-gray-800 p-4 rounded-xl shadow-lg border border-gray-700">
          <h2 className="text-sm font-semibold text-gray-400 mb-2 uppercase tracking-wider">
            Monster Health
          </h2>
          <input
            type="number"
            min="1"
            value={monsterHealth}
            onChange={(e) =>
              setMonsterHealth(
                e.target.value === "" ? "" : parseInt(e.target.value),
              )
            }
            className="w-full bg-gray-900 border border-gray-600 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
            placeholder="Enter HP..."
          />
        </div>

        {/* Results */}
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 space-y-4">
          <div className="flex justify-between items-end border-b border-gray-700 pb-4">
            <span className="text-gray-400">Expected Damage</span>
            <span className="text-3xl font-bold text-white">
              {stats.mean.toFixed(2)}
            </span>
          </div>

          <div className="flex justify-between items-end">
            <span className="text-gray-400">Kill Probability</span>
            <span
              className={`text-4xl font-bold ${stats.killProbability > 0.8 ? "text-green-400" : stats.killProbability > 0.5 ? "text-yellow-400" : "text-red-400"}`}
            >
              {(stats.killProbability * 100).toFixed(1)}%
            </span>
          </div>
          {monsterHealth === "" && (
            <p className="text-xs text-gray-500 text-center mt-2">
              Enter Monster Health to see probability
            </p>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
