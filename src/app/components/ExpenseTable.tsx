import React, { useEffect, useState } from "react";
import { getItems } from "@/services/supabaseServices";

type Item = {
  id: number;
  item_name: string;
  date: string;
  price: number;
  user_id: string;
};

type Props = {
  userId: string;
};

const ExpenseTable: React.FC<Props> = ({ userId }) => {
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getItems(userId);
        setItems(data);
      } catch (error) {
        console.error("Error fetching items:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (items.length === 0) {
    return <div>No data available</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead className="bg-gray-800 text-white">
          <tr>
            <th className="w-1/4 px-4 py-2">ID</th>
            <th className="w-1/2 px-4 py-2">Item Name</th>
            <th className="w-1/4 px-4 py-2">Date</th>
            <th className="w-1/4 px-4 py-2">Price</th>
          </tr>
        </thead>
        <tbody>
          {items.map(({ id, item_name, date, price }) => (
            <tr key={id} className="text-center border-t">
              <td className="px-4 py-2">{id}</td>
              <td className="px-4 py-2">{item_name}</td>
              <td className="px-4 py-2">{date}</td>
              <td className="px-4 py-2">{price.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ExpenseTable;
