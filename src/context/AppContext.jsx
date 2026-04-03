import { createContext, useContext, useCallback, useState } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { notification } from "antd";
import {
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from "../api/transactions/mutations";
import { loadRole, saveRole } from "../utils/helpers";

const AppContext = createContext(null);

const getSystemTheme = () => {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

const loadTheme = () => {
  return localStorage.getItem("financeTheme") || getSystemTheme();
};

export const AppProvider = ({ children }) => {
  const queryClient = useQueryClient();
  const [role, setRole] = useState(loadRole);
  const [theme, setTheme] = useState(loadTheme);

  const addMutation = useMutation({
    mutationFn: (payload) => createTransaction(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
    onError: (err) => {
      notification.error({
        message: err.message || "Failed to add transaction",
      });
    },
  });

  const editMutation = useMutation({
    mutationFn: (payload) => updateTransaction(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
    onError: (err) => {
      notification.error({
        message: err.message || "Failed to update transaction",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteTransaction(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
    onError: (err) => {
      notification.error({
        message: err.message || "Failed to delete transaction",
      });
    },
  });

  const switchRole = useCallback((newRole) => {
    setRole(newRole);
    saveRole(newRole);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      localStorage.setItem("financeTheme", next);
      return next;
    });
  }, []);

  return (
    <AppContext.Provider
      value={{
        role,
        theme,
        switchRole,
        toggleTheme,
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
