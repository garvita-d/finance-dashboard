export const TRANSACTION_TYPES = {
  INCOME: "income",
  EXPENSE: "expense",
};

export const CATEGORIES = [
  "Household",
  "Food",
  "Clothing",
  "Entertainment",
  "Transport",
  "Health",
  "Savings",
  "Investment",
  "Salary",
  "Bonus",
  "Allowance",
  "Other",
];

export const CATEGORY_COLORS = {
  Household: "#4f46e5",
  Food: "#10b981",
  Clothing: "#f59e0b",
  Entertainment: "#f97316",
  Transport: "#06b6d4",
  Health: "#ec4899",
  Savings: "#8b5cf6",
  Investment: "#14b8a6",
  Salary: "#22c55e",
  Bonus: "#84cc16",
  Allowance: "#a78bfa",
  Other: "#9ca3af",
};

export const DATE_FORMAT = "DD MMM YYYY";

export const STORAGE_KEY = "financeAppData";
export const ROLE_STORAGE_KEY = "financeAppRole";

export const INITIAL_TRANSACTIONS = [
  {
    id: "1",
    date: "2023-04-06",
    description: "Lunch money",
    amount: 10,
    type: "expense",
    category: "Food",
  },
  {
    id: "2",
    date: "2023-04-05",
    description: "April Bonus",
    amount: 500,
    type: "income",
    category: "Bonus",
  },
  {
    id: "3",
    date: "2023-04-05",
    description: "Allowance",
    amount: 500,
    type: "income",
    category: "Allowance",
  },
  {
    id: "4",
    date: "2023-04-05",
    description: "Pay David",
    amount: 50,
    type: "expense",
    category: "Other",
  },
  {
    id: "5",
    date: "2023-04-04",
    description: "Netflix subscription",
    amount: 10,
    type: "expense",
    category: "Entertainment",
  },
  {
    id: "6",
    date: "2023-04-04",
    description: "Grocery Shopping",
    amount: 120,
    type: "expense",
    category: "Food",
  },
  {
    id: "7",
    date: "2023-04-03",
    description: "Monthly Salary",
    amount: 5000,
    type: "income",
    category: "Salary",
  },
  {
    id: "8",
    date: "2023-04-03",
    description: "Electricity Bill",
    amount: 85,
    type: "expense",
    category: "Household",
  },
  {
    id: "9",
    date: "2023-04-02",
    description: "Gym Membership",
    amount: 40,
    type: "expense",
    category: "Health",
  },
  {
    id: "10",
    date: "2023-04-02",
    description: "Bus Pass",
    amount: 30,
    type: "expense",
    category: "Transport",
  },
  {
    id: "11",
    date: "2023-04-01",
    description: "Investment Return",
    amount: 300,
    type: "income",
    category: "Investment",
  },
  {
    id: "12",
    date: "2023-04-01",
    description: "New Shirt",
    amount: 45,
    type: "expense",
    category: "Clothing",
  },
  {
    id: "13",
    date: "2023-03-31",
    description: "March Salary",
    amount: 5000,
    type: "income",
    category: "Salary",
  },
  {
    id: "14",
    date: "2023-03-30",
    description: "Restaurant Dinner",
    amount: 75,
    type: "expense",
    category: "Food",
  },
  {
    id: "15",
    date: "2023-03-28",
    description: "Savings Deposit",
    amount: 800,
    type: "expense",
    category: "Savings",
  },
];

export const CHART_DAYS = 7;
