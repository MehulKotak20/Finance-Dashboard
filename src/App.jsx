import { useApp } from "./context/AppContext";
import { Auth } from "./components/Auth";
import { DashboardLayout } from "./components/DashboardLayout";
import { SummaryCards } from "./components/SummaryCards";
import { BalanceTrendChart } from "./components/BalanceTrendChart";
import { CategoryBreakdownChart } from "./components/CategoryBreakdownChart";
import { TransactionsList } from "./components/TransactionsList";
import { Insights } from "./components/Insights";

function App() {
  const { user, transactions, loading } = useApp();

  if (!user) {
    return <Auth />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <SummaryCards transactions={transactions} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <BalanceTrendChart transactions={transactions} />
          <CategoryBreakdownChart transactions={transactions} />
        </div>

        <Insights transactions={transactions} />

        <TransactionsList />
      </div>
    </DashboardLayout>
  );
}

export default App;
