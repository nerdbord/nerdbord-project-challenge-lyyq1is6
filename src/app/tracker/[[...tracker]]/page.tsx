"use client";

import { useSession, useUser } from "@clerk/nextjs";
import { createClient } from "@supabase/supabase-js";
import { ChangeEvent, useEffect, useState } from "react";

export default function Page() {
  const [items, setItems] = useState<any[]>([]);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [loading, setLoading] = useState(true);
  //   The `useUser()` hook will be used to ensure that Clerk has loaded data about the logged in user
  const { user } = useUser();
  // The `useSession()` hook will be used to get the Clerk session object
  const { session } = useSession();

  // Create a custom supabase client that injects the Clerk Supabase token into the request headers
  function createClerkSupabaseClient() {
    return createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_KEY!,
      {
        global: {
          // Get the custom Supabase token from Clerk
          fetch: async (url, options = {}) => {
            const clerkToken = await session?.getToken({
              template: "supabase",
            });

            // Insert the Clerk Supabase token into the headers
            const headers = new Headers(options?.headers);
            headers.set("Authorization", `Bearer ${clerkToken}`);

            // Now call the default fetch
            return fetch(url, {
              ...options,
              headers,
            });
          },
        },
      }
    );
  }

  // Create a `client` object for accessing Supabase data using the Clerk token
  const client = createClerkSupabaseClient();

  // This `useEffect` will wait for the User object to be loaded before requesting
  // the tasks for the logged in user
  useEffect(() => {
    if (!user) return;

    async function loadItems() {
      setLoading(true);
      const { data, error } = await client.from("itemsList").select();
      if (!error) setItems(data);
      setLoading(false);
    }

    loadItems();
  }, [user, startDate, endDate]);

  const handleChangeStartDate = (event: any) => {
    setStartDate(event.target.value);
  };

  const handleChangeEndDate = (event: any) => {
    setEndDate(event.target.value);
  };

  const filterItems = () => {
    return items.filter((item) => {
      const itemDate = new Date(item.date);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;

      if (start && end) {
        return itemDate >= start && itemDate <= end;
      } else if (start) {
        return itemDate >= start;
      } else if (end) {
        return itemDate <= end;
      } else {
        return true; // No filter applied
      }
    });
  };

  function handleDownloadCsv() {
    const csvData =
      `index,item name,date,price\n` +
      filterItems()
        .map(({ item, date, price }, i) => {
          return `${i},${item},${date},${price}`;
        })
        .join("\n");

    const csvBlob = new Blob([csvData], { type: "text/csv" });
    const blobUrl = URL.createObjectURL(csvBlob);

    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = "my-receipt-data.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    console.log(csvData);
  }

  return (
    <div>
      <div>
        <a
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-min text-nowrap my-3"
          href="/"
        >
          Back to receipt scanner
        </a>
        <div>
          start date:
          <input
            type="date"
            onChange={handleChangeStartDate}
            value={startDate}
          />
          end date:
          <input type="date" onChange={handleChangeEndDate} value={endDate} />
        </div>
      </div>
      {loading && <p>Loading...</p>}
      {!loading && items.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="w-1/4 px-4 py-2">#</th>
                <th className="w-1/2 px-4 py-2">Item Name</th>
                <th className="w-1/4 px-4 py-2">Date</th>
                <th className="w-1/4 px-4 py-2">Price</th>
              </tr>
            </thead>
            <tbody>
              {filterItems().map(({ item, date, price }, i) => {
                return (
                  <tr key={i} className="text-center border-t">
                    <td className="px-4 py-2">{i + 1}</td>
                    <td className="px-4 py-2">{item}</td>
                    <td className="px-4 py-2">{date}</td>
                    <td className="px-4 py-2">{price.toFixed(2)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {!loading && items.length === 0 && <p>No tasks found</p>}

      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-min text-nowrap my-3"
        onClick={handleDownloadCsv}
      >
        Download as CSV
      </button>
    </div>
  );
}
