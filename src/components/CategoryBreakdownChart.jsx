import { useMemo } from "react";

const COLORS = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
  "#14b8a6",
  "#f97316",
];

export function CategoryBreakdownChart({ transactions }) {
  const categoryData = useMemo(() => {
    const expenses = transactions.filter((t) => t.type === "expense");

    const categoryTotals = expenses.reduce((acc, t) => {
      const amount = Number(t.amount);
      acc[t.category] = (acc[t.category] || 0) + amount;
      return acc;
    }, {});

    const total = Object.values(categoryTotals).reduce(
      (sum, val) => sum + val,
      0,
    );

    return Object.entries(categoryTotals)
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: total > 0 ? (amount / total) * 100 : 0,
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [transactions]);

  if (categoryData.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Spending by Category
        </h3>
        <div className="h-64 flex items-center justify-center text-gray-500">
          No expense data available
        </div>
      </div>
    );
  }

  const size = 200;
  const centerX = size / 2;
  const centerY = size / 2;
  const radius = size / 2 - 10;

  let currentAngle = -90;

  const slices = categoryData.map((data, index) => {
    const startAngle = currentAngle;
    const sliceAngle = (data.percentage / 100) * 360;
    const endAngle = startAngle + sliceAngle;

    currentAngle = endAngle;

    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;

    const x1 = centerX + radius * Math.cos(startRad);
    const y1 = centerY + radius * Math.sin(startRad);
    const x2 = centerX + radius * Math.cos(endRad);
    const y2 = centerY + radius * Math.sin(endRad);

    const largeArcFlag = sliceAngle > 180 ? 1 : 0;

    const pathD = [
      `M ${centerX} ${centerY}`,
      `L ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
      "Z",
    ].join(" ");

    return {
      ...data,
      pathD,
      color: COLORS[index % COLORS.length],
    };
  });

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 dark:bg-gray-700 dark:text-white">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 dark:text-white">
        Spending by Category
      </h3>

      <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6">
        <svg viewBox={`0 0 ${size} ${size}`} className="w-full max-w-[200px]">
          {slices.map((slice, index) => (
            <path
              key={index}
              d={slice.pathD}
              fill={slice.color}
              className="hover:opacity-80 transition-opacity cursor-pointer"
            />
          ))}
        </svg>

        <div className="flex-1 w-full space-y-2">
          {slices.map((slice, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
            >
              <div className="flex items-center space-x-3">
                <div
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: slice.color }}
                />
                <span className="text-sm font-medium text-gray-700 dark:text-white">
                  {slice.category}
                </span>
              </div>

              <div className="text-right">
                <div className="text-sm font-semibold text-gray-900 dark:text-white">
                  ₹
                  {slice.amount.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {slice.percentage.toFixed(1)}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
