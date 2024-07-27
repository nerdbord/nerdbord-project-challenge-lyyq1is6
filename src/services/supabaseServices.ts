import { supabase } from "@/app/helpers/supabaseClient";

export const addItem = async (
  userId: string,
  itemName: string,
  date: string,
  price: number
) => {
  const { data, error } = await supabase
    .from("items")
    .insert([
      { item_name: itemName, date: date, price: price, user_id: userId },
    ]);

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const getItems = async (userId: string) => {
  const { data, error } = await supabase
    .from("items")
    .select("*")
    .eq("user_id", userId);

  if (error) {
    throw new Error(error.message);
  }

  return data;
};
