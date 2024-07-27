"use client";

import getReceiptContents from "@/services/getReceiptContents";
import ExpenseTable from "./components/ExpenseTable";
import { SetStateAction, useState } from "react";
import { Receipt } from "./types/types";
import PhotoUpload from "./components/PhotoUpload";

export default function Home() {
  const [photo, setPhoto] = useState("");
  const [receiptData, setReceiptData] = useState<Receipt>();
  const [isLoading, setIsLoading] = useState(false);

  const handleOnClick = async () => {
    if (!photo) {
      console.error("No file selected!");
      return;
    }
    setIsLoading(true);
    const response = await getReceiptContents(
      `https://paragon-of-saving.vercel.app/api/${photo}`
    );

    if (!response) {
      console.error("Couldn't parse the image!")
      return;
    }

    console.log(response);
    setReceiptData(response as Receipt);
    setIsLoading(false);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-24">
      <PhotoUpload photoName={photo} setPhotoName={setPhoto}></PhotoUpload>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={handleOnClick}
        disabled={isLoading}
      >
        {isLoading ? "Loading..." : "Czekierałt!"}
      </button>

      {receiptData && <ExpenseTable data={receiptData} />}
    </main>
  );
}
