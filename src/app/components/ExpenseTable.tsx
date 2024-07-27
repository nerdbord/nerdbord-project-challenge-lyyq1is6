import React from 'react';
import { Receipt } from '../types/types';

type Props = {
  data: Receipt;
};

const ExpenseTable: React.FC<Props> = ({ data }) => {
  const rows = Object.entries(data).flatMap(([date, items], index) => 
    Object.entries(items).map(([itemName, price], itemIndex) => ({
      id: index * Object.keys(items).length + itemIndex + 1,
      itemName,
      date,
      price,
    }))
  );

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
          {rows.map(({ id, itemName, date, price }) => (
            <tr key={id} className="text-center border-t">
              <td className="px-4 py-2">{id}</td>
              <td className="px-4 py-2">{itemName}</td>
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
