"use client";

import { useSession, useUser } from "@clerk/nextjs";
import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

export default function Page() {
  const [items, setItems] = useState<any[]>([]);
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
      console.log("DATA", data);

      data?.forEach;

      setLoading(false);
    }

    loadItems();
  }, [user]);

  return (
    <div>      
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
              {items.map(({ item, date, price }, i) => (
                <tr key={i} className="text-center border-t">
                  <td className="px-4 py-2">{i + 1}</td>
                  <td className="px-4 py-2">{item}</td>
                  <td className="px-4 py-2">{date}</td>
                  <td className="px-4 py-2">{price.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && items.length === 0 && <p>No tasks found</p>}
    </div>
  );
}
