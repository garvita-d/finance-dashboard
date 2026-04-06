import { useQuery } from "@tanstack/react-query";
import { fetchTransactions } from "./mutations";
import { useAppContext } from "../../context/AppContext";

export const useGetTransactions = () => {
  const { user } = useAppContext();

  return useQuery({
    queryKey: ["transactions", user?.id],
    queryFn: fetchTransactions,
    enabled: !!user,
    staleTime: 30000,
  });
};
