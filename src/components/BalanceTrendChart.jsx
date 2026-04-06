import { useMemo } from "react";

export function BalanceTrendChart({ transactions }) {
  const chartData = useMemo(() => {
    const sortedTransactions = [...transactions].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );

    const dailyBalances = [];
    let runningBalance = 0;

    sortedTransactions.forEach((transaction) => {
      const amount = Number(transaction.amount);
      runningBalance += transaction.type === "income" ? amount : -amount;

      const existingDay = dailyBalances.find(
        (d) => d.date === transaction.date,
      );

      if (existingDay) {
        existingDay.balance = runningBalance;
      } else {
        dailyBalances.push({
          date: transaction.date,
          balance: runningBalance,
        });
      }
    });

    return dailyBalances.slice(-30);
  }, [transactions]);

  if (chartData.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Balance Trend
        </h3>
        <div className="h-64 flex items-center justify-center text-gray-500">
          No transaction data available
        </div>
      </div>
    );
  }

  const maxBalance = Math.max(...chartData.map((d) => d.balance), 0);
  const minBalance = Math.min(...chartData.map((d) => d.balance), 0);
  const range = maxBalance - minBalance || 1;

  const width = 800;
  const height = 300;
  const padding = { top: 20, right: 20, bottom: 40, left: 60 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const points = chartData.map((d, i) => {
    const x = padding.left + (i / (chartData.length - 1 || 1)) * chartWidth;
    const y =
      padding.top +
      chartHeight -
      ((d.balance - minBalance) / range) * chartHeight;

    return { x, y, ...d };
  });

  const pathD = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");

  const areaD = `${pathD} L ${
    points[points.length - 1].x
  } ${height - padding.bottom} L ${padding.left} ${height - padding.bottom} Z`;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 dark:bg-gray-700 dark:text-white">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 dark:text-white">
        Balance Trend
      </h3>

      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
          <defs>
            <linearGradient
              id="balanceGradient"
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop
                offset="0%"
                style={{ stopColor: "#3b82f6", stopOpacity: 0.2 }}
              />
              <stop
                offset="100%"
                style={{ stopColor: "#3b82f6", stopOpacity: 0 }}
              />
            </linearGradient>
          </defs>

          <path d={areaD} fill="url(#balanceGradient)" />

          <path d={pathD} fill="none" stroke="#3b82f6" strokeWidth="2" />

          {points.map((p, i) => (
            <g key={i}>
              <circle
                cx={p.x}
                cy={p.y}
                r="4"
                fill="#3b82f6"
                className="hover:r-6 transition-all cursor-pointer"
              />
            </g>
          ))}

          <line
            x1={padding.left}
            y1={height - padding.bottom}
            x2={width - padding.right}
            y2={height - padding.bottom}
            stroke="#e5e7eb"
            strokeWidth="1"
          />

          <line
            x1={padding.left}
            y1={padding.top}
            x2={padding.left}
            y2={height - padding.bottom}
            stroke="#e5e7eb"
            strokeWidth="1"
          />

          {[0, 0.25, 0.5, 0.75, 1].map((percent) => {
            const value = minBalance + range * percent;
            const y = padding.top + chartHeight * (1 - percent);

            return (
              <g key={percent}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={width - padding.right}
                  y2={y}
                  stroke="#f3f4f6"
                  strokeWidth="1"
                />
                <text
                  x={padding.left - 10}
                  y={y + 5}
                  textAnchor="end"
                  fontSize="12"
                  fill="#6b7280"
                >
                  ₹{value.toFixed(0)}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="text-xs text-gray-500 text-center mt-2">
        Last {chartData.length} days
      </div>
    </div>
  );
}
