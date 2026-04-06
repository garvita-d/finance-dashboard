import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
dayjs.extend(isSameOrAfter);
import { ROLE_STORAGE_KEY } from "../constants";

export const loadRole = () => {
  return localStorage.getItem(ROLE_STORAGE_KEY) || "admin";
};

export const saveRole = (role) => {
  localStorage.setItem(ROLE_STORAGE_KEY, role);
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amount);
};

export const getTotalIncome = (transactions) =>
  transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

export const getTotalExpenses = (transactions) =>
  transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

export const getBalance = (transactions) =>
  getTotalIncome(transactions) - getTotalExpenses(transactions);

export const getBalanceTrend = (transactions, days) => {
  const result = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = dayjs().subtract(i, "day");
    const dateStr = date.format("YYYY-MM-DD");
    const label = date.format("DD MMM");
    const dayTx = transactions.filter((t) => t.date === dateStr);
    const income = dayTx
      .filter((t) => t.type === "income")
      .reduce((s, t) => s + t.amount, 0);
    const expense = dayTx
      .filter((t) => t.type === "expense")
      .reduce((s, t) => s + t.amount, 0);
    result.push({ label, income, expense, net: income - expense });
  }
  return result;
};

export const getCategoryBreakdown = (transactions) => {
  const expenses = transactions.filter((t) => t.type === "expense");
  const map = {};
  expenses.forEach((t) => {
    map[t.category] = (map[t.category] || 0) + t.amount;
  });
  const total = Object.values(map).reduce((s, v) => s + v, 0);
  return Object.entries(map)
    .map(([name, value]) => ({
      name,
      value,
      percent: total ? ((value / total) * 100).toFixed(1) : 0,
    }))
    .sort((a, b) => b.value - a.value);
};

export const getMonthlyComparison = (transactions) => {
  const months = {};
  transactions.forEach((t) => {
    const month = dayjs(t.date).format("MMM YYYY");
    if (!months[month]) months[month] = { income: 0, expense: 0 };
    if (t.type === "income") months[month].income += t.amount;
    else months[month].expense += t.amount;
  });
  return Object.entries(months)
    .map(([month, data]) => ({ month, ...data }))
    .slice(-6);
};

export const generateId = () => Math.random().toString(36).substr(2, 9);

export const exportToCSV = (transactions) => {
  const headers = ["Date", "Description", "Category", "Type", "Amount"];
  const rows = transactions.map((t) => [
    t.date,
    t.description,
    t.category,
    t.type,
    t.amount,
  ]);
  const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "transactions.csv";
  a.click();
  URL.revokeObjectURL(url);
};

export const exportToJSON = (transactions) => {
  const json = JSON.stringify(transactions, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "transactions.json";
  a.click();
  URL.revokeObjectURL(url);
};

export const getPercentChange = (current, previous) => {
  if (previous === 0 && current === 0)
    return { percent: "0.00", isPositive: true };
  if (previous === 0) return { percent: "100.00", isPositive: current > 0 };
  const change = ((current - previous) / Math.abs(previous)) * 100;
  return {
    percent: Math.abs(change).toFixed(2),
    isPositive: change >= 0,
  };
};

export const getLastMonthTransactions = (transactions) => {
  const now = dayjs();
  const startOfThisMonth = now.startOf("month");
  const startOfLastMonth = startOfThisMonth.subtract(1, "month");

  return transactions.filter((t) => {
    const d = dayjs(t.date);
    return d.isBefore(startOfThisMonth) && d.isSameOrAfter(startOfLastMonth);
  });
};

export const getThisMonthTransactions = (transactions) => {
  const startOfThisMonth = dayjs().startOf("month");
  return transactions.filter((t) =>
    dayjs(t.date).isSameOrAfter(startOfThisMonth),
  );
};
