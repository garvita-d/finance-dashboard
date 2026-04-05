import {
  createContext,
  useContext,
  useCallback,
  useState,
  useEffect,
} from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { notification } from "antd";
import {
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from "../api/transactions/mutations";
import { signOut, getSession } from "../api/auth/mutations";
import supabase from "../config/supabaseClient";

const AppContext = createContext(null);

const getInitialTheme = () => {
  const stored = localStorage.getItem("financeTheme");
  if (stored) return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

export const AppProvider = ({ children }) => {
  const queryClient = useQueryClient();
  const [theme, setTheme] = useState(getInitialTheme);
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("financeTheme", theme);
  }, [theme]);

  useEffect(() => {
    getSession().then((session) => {
      setUser(session?.user ?? null);
      setAuthLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        queryClient.invalidateQueries({ queryKey: ["transactions"] });
      },
    );

    return () => listener.subscription.unsubscribe();
  }, [queryClient]);

  const addMutation = useMutation({
    mutationFn: (payload) => createTransaction(payload),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["transactions"] }),
    onError: (err) =>
      notification.error({
        message: err.message || "Failed to add transaction",
      }),
  });

  const editMutation = useMutation({
    mutationFn: (payload) => updateTransaction(payload),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["transactions"] }),
    onError: (err) =>
      notification.error({
        message: err.message || "Failed to update transaction",
      }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteTransaction(id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["transactions"] }),
    onError: (err) =>
      notification.error({
        message: err.message || "Failed to delete transaction",
      }),
  });

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  }, []);

  const logout = useCallback(async () => {
    await signOut();
    queryClient.clear();
    notification.success({ message: "Signed out successfully" });
  }, [queryClient]);

  return (
    <AppContext.Provider
      value={{
        user,
        authLoading,
        theme,
        toggleTheme,
        logout,
        addTransaction: addMutation.mutate,
        editTransaction: editMutation.mutate,
        deleteTransaction: deleteMutation.mutate,
        isAdding: addMutation.isPending,
        isEditing: editMutation.isPending,
        isDeleting: deleteMutation.isPending,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
