# 💸 Finance Dashboard

A modern, responsive finance dashboard built with **React + Vite + Tailwind CSS**.
Track income, expenses, and insights with a clean UI and dark mode support.

---

## 🚀 Features

* 🔐 Local authentication (no backend)
* 💰 Add / edit / delete transactions
* 📊 Balance trend chart (custom SVG)
* 🧾 Category-wise expense breakdown
* 📈 Insights (monthly comparison, savings rate, etc.)
* 🌙 Dark mode (persistent using localStorage)
* 👤 Role-based UI (Admin / Viewer)
* 📱 Fully responsive design (mobile + desktop)

---

## 🛠️ Tech Stack

* ⚛️ React (Vite)
* 🎨 Tailwind CSS
* 📦 Context API (state management)
* 💾 LocalStorage (data persistence)
* 🎯 Lucide Icons

---

## 📂 Project Structure

```
src/
│── components/
│   ├── Auth.jsx
│   ├── DashboardLayout.jsx
│   ├── SummaryCards.jsx
│   ├── BalanceTrendChart.jsx
│   ├── CategoryBreakdownChart.jsx
│   ├── TransactionsList.jsx
│   ├── TransactionModal.jsx
│   └── Insights.jsx
│
│── context/
│   └── AppContext.jsx
│
│── App.jsx
│── main.jsx
```

---

## ⚙️ Installation & Setup

```bash
# Clone repo
git clone <your-repo-url>

# Go to project
cd finance-dashboard

# Install dependencies
npm install

# Run project
npm run dev
```

---

## 🧠 How it works

* All data is stored in **localStorage**
* No backend required
* Role & theme persist across sessions
* Transactions are filtered per user

---

## 🌙 Dark Mode

* Toggle from header
* Stored in localStorage
* Uses Tailwind `dark` class strategy


## 🙌 Author

Built with ❤️ by **Mehul**

---

## 📜 License

This project is open-source and free to use.
