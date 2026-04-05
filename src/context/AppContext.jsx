import { createContext, useContext, useState, useEffect } from "react";

const AppContext = createContext();

const getLocal = (key) => JSON.parse(localStorage.getItem(key) || "null");
const setLocal = (key, value) =>
  localStorage.setItem(key, JSON.stringify(value));

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState("admin");
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filterType, setFilterType] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark",
  );

  useEffect(() => {
    const savedUser = getLocal("user");
    const savedRole = getLocal("role");

    if (savedUser) {
      setUser(savedUser);
      setUserRole(savedRole || "admin");
      fetchTransactions(savedUser.id);
    }

    setLoading(false);
  }, []);

  const fetchTransactions = async (userId) => {
    const all = getLocal("transactions") || [];
    const userTx = all.filter((t) => t.user_id === userId);
    setTransactions(userTx);
  };

  const refreshTransactions = async () => {
    if (user) {
      await fetchTransactions(user.id);
    }
  };

  const addTransaction = async (transaction) => {
    if (!user) return;

    const all = getLocal("transactions") || [];

    const newTx = {
      ...transaction,
      id: crypto.randomUUID(),
      user_id: user.id,
      created_at: new Date().toISOString(),
    };

    setLocal("transactions", [...all, newTx]);
    await refreshTransactions();
  };

  const updateTransaction = async (id, updated) => {
    const all = getLocal("transactions") || [];

    const newList = all.map((t) => (t.id === id ? { ...t, ...updated } : t));

    setLocal("transactions", newList);
    await refreshTransactions();
  };

  const deleteTransaction = async (id) => {
    const all = getLocal("transactions") || [];

    const newList = all.filter((t) => t.id !== id);

    setLocal("transactions", newList);
    await refreshTransactions();
  };

  const signUp = async (email, password) => {
    const users = getLocal("users") || [];

    const exists = users.find((u) => u.email === email);
    if (exists) throw new Error("User already exists");

    const newUser = {
      id: crypto.randomUUID(),
      email,
      password,
      role: "user",
    };

    setLocal("users", [...users, newUser]);
  };

  const signIn = async (email, password) => {
    const users = getLocal("users") || [];

    const found = users.find(
      (u) => u.email === email && u.password === password,
    );

    if (!found) throw new Error("Invalid credentials");

    const loggedInUser = { id: found.id, email: found.email };

    setLocal("user", loggedInUser);
    setLocal("role", found.role);

    setUser(loggedInUser);
    setUserRole(found.role);

    await fetchTransactions(found.id);
  };

  const signOut = async () => {
    localStorage.removeItem("user");
    localStorage.removeItem("role");

    setUser(null);
    setTransactions([]);
  };

  return (
    <AppContext.Provider
      value={{
        user,
        userRole,
        setUserRole,
        transactions,
        loading,
        filterType,
        setFilterType,
        searchQuery,
        setSearchQuery,
        sortField,
        setSortField,
        sortOrder,
        setSortOrder,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        signIn,
        signUp,
        signOut,
        refreshTransactions,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
}
