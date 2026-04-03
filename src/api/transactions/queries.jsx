import { useQuery } from "@tanstack/react-query";
import { fetchTransactions } from "./mutations";

export const useGetTransactions = () => {
  return useQuery({
    queryKey: ["transactions"],
    queryFn: fetchTransactions,
  });
};
