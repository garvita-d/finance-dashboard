import supabase from "../../config/supabaseClient";

export const fetchTransactions = async () => {
  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .order("date", { ascending: false });
  if (error) throw error;
  return data;
};

export const createTransaction = async (payload) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("transactions")
    .insert([{ ...payload, user_id: user.id }])
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const updateTransaction = async ({ id, ...payload }) => {
  const { data, error } = await supabase
    .from("transactions")
    .update(payload)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const deleteTransaction = async (id) => {
  const { error } = await supabase.from("transactions").delete().eq("id", id);
  if (error) throw error;
  return id;
};
