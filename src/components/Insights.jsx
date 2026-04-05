import { useMemo } from "react";
import { TrendingUp, TrendingDown, AlertCircle } from "lucide-react";

export function Insights({ transactions }) {
  const insights = useMemo(() => {
    const expenses = transactions.filter((t) => t.type === "expense");
    const income = transactions.filter((t) => t.type === "income");

    const categoryTotals = expenses.reduce((acc, t) => {
      const amount = Number(t.amount);
      acc[t.category] = (acc[t.category] || 0) + amount;
      return acc;
    }, {});

    const highestSpendingCategory = Object.entries(categoryTotals).sort(
      (a, b) => b[1] - a[1],
    )[0];

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    const currentMonthExpenses = expenses
      .filter((t) => {
        const date = new Date(t.date);
        return (
          date.getMonth() === currentMonth && date.getFullYear() === currentYear
        );
      })
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const lastMonthExpenses = expenses
      .filter((t) => {
        const date = new Date(t.date);
        return (
          date.getMonth() === lastMonth && date.getFullYear() === lastMonthYear
        );
      })
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const currentMonthIncome = income
      .filter((t) => {
        const date = new Date(t.date);
        return (
          date.getMonth() === currentMonth && date.getFullYear() === currentYear
        );
      })
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const expenseChange =
      lastMonthExpenses > 0
        ? ((currentMonthExpenses - lastMonthExpenses) / lastMonthExpenses) * 100
        : 0;

    const savingsRate =
      currentMonthIncome > 0
        ? ((currentMonthIncome - currentMonthExpenses) / currentMonthIncome) *
          100
        : 0;

    const averageDailyExpense =
      expenses.length > 0
        ? expenses.reduce((sum, t) => sum + Number(t.amount), 0) /
          Math.max(
            (new Date().getTime() -
              new Date(
                Math.min(...expenses.map((t) => new Date(t.date).getTime())),
              ).getTime()) /
              (1000 * 60 * 60 * 24),
            1,
          )
        : 0;

    return {
      highestSpendingCategory: highestSpendingCategory
        ? {
            category: highestSpendingCategory[0],
            amount: highestSpendingCategory[1],
          }
        : null,
      expenseChange,
      savingsRate,
      averageDailyExpense,
      currentMonthExpenses,
      lastMonthExpenses,
    };
  }, [transactions]);

  if (transactions.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 dark:bg-gray-700 dark:text-white">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 dark:text-white
      ">Insights</h3>

      <div className="space-y-4">
        {insights.highestSpendingCategory && (
          <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg dark:bg-orange-100 dark:border-orange-300">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-orange-900 dark:text-orange-900">
                  Highest Spending Category
                </h4>
                <p className="text-sm text-orange-800 mt-1 dark:text-orange-800">
                  You've spent{" "}
                  <span className="font-bold">
                    ₹
                    {insights.highestSpendingCategory.amount.toLocaleString(
                      "en-US",
                      { minimumFractionDigits: 2 },
                    )}
                  </span>{" "}
                  on{" "}
                  <span className="font-bold">
                    {insights.highestSpendingCategory.category}
                  </span>
                </p>
              </div>
            </div>
          </div>
        )}

        {insights.lastMonthExpenses > 0 && (
          <div
            className={`p-4 rounded-lg border ${
              insights.expenseChange > 0
                ? "bg-red-50 border-red-200 dark:bg-red-100 dark:border-red-300"
                : "bg-green-50 border-green-200 dark:bg-green-100 dark:border-green-300"
            }`}
          >
            <div className="flex items-start space-x-3">
              {insights.expenseChange > 0 ? (
                <TrendingUp className="w-5 h-5 text-red-600 mt-0.5 " />
              ) : (
                <TrendingDown className="w-5 h-5 text-green-600 mt-0.5" />
              )}

              <div>
                <h4
                  className={`font-semibold ${
                    insights.expenseChange > 0
                      ? "text-red-900"
                      : "text-green-900"
                  }`}
                >
                  Monthly Comparison
                </h4>

                <p
                  className={`text-sm mt-1 ${
                    insights.expenseChange > 0
                      ? "text-red-800"
                      : "text-green-800"
                  }`}
                >
                  Your expenses have{" "}
                  {insights.expenseChange > 0 ? "increased" : "decreased"} by{" "}
                  <span className="font-bold">
                    {Math.abs(insights.expenseChange).toFixed(1)}%
                  </span>{" "}
                  compared to last month (
                  {insights.expenseChange > 0 ? "+" : "-"}$
                  {Math.abs(
                    insights.currentMonthExpenses - insights.lastMonthExpenses,
                  ).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                  })}
                  )
                </p>
              </div>
            </div>
          </div>
        )}

        {insights.savingsRate !== 0 && (
          <div
            className={`p-4 rounded-lg border ${
              insights.savingsRate > 20
                ? "bg-green-50 border-green-200 dark:bg-green-100 dark:border-green-300"
                : insights.savingsRate > 0
                  ? "bg-blue-50 border-blue-200 dark:bg-blue-100 dark:border-blue-300"
                  : "bg-red-50 border-red-200 dark:bg-red-100 dark:border-red-300"
            }`}
          >
            <div className="flex items-start space-x-3">
              <TrendingUp
                className={`w-5 h-5 mt-0.5 ${
                  insights.savingsRate > 20
                    ? "text-green-600"
                    : insights.savingsRate > 0
                      ? "text-blue-600"
                      : "text-red-600"
                }`}
              />

              <div>
                <h4
                  className={`font-semibold ${
                    insights.savingsRate > 20
                      ? "text-green-900"
                      : insights.savingsRate > 0
                        ? "text-blue-900"
                        : "text-red-900"
                  }`}
                >
                  Savings Rate
                </h4>

                <p
                  className={`text-sm mt-1 ${
                    insights.savingsRate > 20
                      ? "text-green-800"
                      : insights.savingsRate > 0
                        ? "text-blue-800"
                        : "text-red-800"
                  }`}
                >
                  {insights.savingsRate > 0 ? (
                    <>
                      You're saving{" "}
                      <span className="font-bold">
                        {insights.savingsRate.toFixed(1)}%
                      </span>{" "}
                      of your income this month
                      {insights.savingsRate > 20 ? " - Great job!" : ""}
                    </>
                  ) : (
                    <>
                      You're spending more than you earn this month. Consider
                      reviewing your expenses.
                    </>
                  )}
                </p>
              </div>
            </div>
          </div>
        )}

        {insights.averageDailyExpense > 0 && (
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <h4 className="font-semibold text-gray-900">
              Average Daily Spending
            </h4>
            <p className="text-sm text-gray-700 mt-1">
              You spend an average of{" "}
              <span className="font-bold">
                ${insights.averageDailyExpense.toFixed(2)}
              </span>{" "}
              per day
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
