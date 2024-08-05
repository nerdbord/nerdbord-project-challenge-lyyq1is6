"use client";

import React, { useState } from "react";
import { Receipt } from "../../types/types";

type Props = {
  data: Receipt;
};

const ExpenseTable: React.FC<Props> = ({ data }) => {
  const [editedData, setEditedData] = useState(data);
  const receiptDate = Object.keys(data)[0];

  const handleInputChange = (id: number, key: string, value: string) => {
    setEditedData((prevData) => {
      const items = Object.entries(prevData[receiptDate]).map(
        ([itemName, price], index) => ({
          itemName,
          price,
          id: index + 1,
        })
      );
      const itemIndex = items.findIndex((item) => item.id === id);

      if (key === "itemName") {
        const newItemName = value;
        const { [items[itemIndex].itemName]: oldItemName, ...restItems } =
          prevData[receiptDate];
        return {
          [receiptDate]: {
            ...restItems,
            [newItemName]: items[itemIndex].price,
          },
        };
      } else if (key === "price") {
        items[itemIndex].price = parseFloat(value);
        return {
          [receiptDate]: {
            ...prevData[receiptDate],
            [items[itemIndex].itemName]: items[itemIndex].price,
          },
        };
      }

      return prevData;
    });
  };

  const handleAddRow = () => {
    setEditedData((prevData) => ({
      [receiptDate]: {
        ...prevData[receiptDate],
        [`Item ${Object.keys(prevData[receiptDate]).length + 1}`]: 0,
      },
    }));
  };

  const handleRemoveRow = (itemName: string) => {
    setEditedData((prevData) => {
      const updatedItems = { ...prevData[receiptDate] };
      delete updatedItems[itemName];
      return {
        [receiptDate]: updatedItems,
      };
    });
  };

  const rows = Object.entries(editedData).flatMap(([date, items], index) =>
    Object.entries(items).map(([itemName, price], itemIndex) => ({
      id: index * Object.keys(items).length + itemIndex + 1,
      itemName,
      date,
      price,
    }))
  );

  return (
    <div className="overflow-x-auto">
      <div>{receiptDate}</div>
      <table className="min-w-full bg-white">
        <thead className="bg-gray-800 text-white">
          <tr>
            <th className="w-1/4 px-4 py-2">ID</th>
            <th className="w-1/2 px-4 py-2">Item Name</th>
            <th className="w-1/4 px-4 py-2">Price</th>
            <button
              className="my-1 bg-blue-500 text-white px-4 py-2 rounded"
              onClick={handleAddRow}
            >
              Add Item
            </button>
          </tr>
        </thead>
        <tbody>
          {rows.map(({ id, itemName, date, price }, rowIndex) => (
            <tr key={id} className="text-center border-t">
              <td className="px-4 py-2">{id}</td>
              <td className="px-4 py-2">
              <input
                  type="text"
                  className="w-full text-center bg-transparent border-none"
                  value={itemName}
                  onChange={(e) =>
                    handleInputChange(id, "itemName", e.target.value)
                  }
                />
              </td>
              <td className="px-4 py-2">
              <input
                  type="number"
                  step={0.1}
                  className="w-full text-center bg-transparent border-none"
                  value={price}
                  onChange={(e) =>
                    handleInputChange(id, "price", e.target.value)
                  }
                />
              </td>
              <td className="px-4 py-2">
                <button
                  className="bg-red-500 text-white px-2 py-1 rounded"
                  onClick={() => handleRemoveRow(itemName)}
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ExpenseTable;
