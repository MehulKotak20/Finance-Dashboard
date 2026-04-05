import { useApp } from "../context/AppContext";
import { DollarSign, LogOut, Shield, Eye } from "lucide-react";
import { useEffect, useState } from "react";

export function DashboardLayout({ children }) {
  const { user, userRole, setUserRole, signOut } = useApp();
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark",
  );

    useEffect(() => {
      if (darkMode) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }
    }, [darkMode]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="w-full bg-white border-b border-gray-200 sticky top-0 z-10 dark:bg-gray-800 dark:border-gray-700">
        <div className="w-full px-3 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 rounded-lg p-2">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Finance Dashboard
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center bg-gray-100 rounded-lg p-1 dark:bg-gray-700">
                <button
                  onClick={() => setUserRole("viewer")}
                  className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    userRole === "viewer"
                      ? "bg-white text-gray-900 shadow-sm dark:bg-gray-600 dark:text-white"
                      : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                  }`}
                >
                  <Eye className="w-4 h-4" />
                  <span>Viewer</span>
                </button>

                <button
                  onClick={() => setUserRole("admin")}
                  className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    userRole === "admin"
                      ? "bg-white text-gray-900 shadow-sm dark:bg-gray-600 dark:text-white"
                      : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                  }`}
                >
                  <Shield className="w-4 h-4" />
                  <span>Admin</span>
                </button>
              </div>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="px-3 py-2 rounded-lg bg-gray-200 dark:bg-gray-700"
              >
                {darkMode ? "🌙 Dark" : "☀️ Light"}
              </button>

              <div className="text-sm text-gray-600 hidden sm:block dark:text-gray-400">
                {user?.email}
              </div>

              <button
                onClick={() => signOut()}
                className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="w-full  px-3 sm:px-6 lg:px-8 py-6 sm:py-8 dark:bg-gray-900 dark:text-white">
        {children}
      </main>
    </div>
  );
}
