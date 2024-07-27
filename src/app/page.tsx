"use client";

import Image from "next/image";
import checkIfReceipt from "@/services/checkIfReceipt";
import getReceiptContents from "@/services/getReceiptContents";
import ExpenseTable from "./components/ExpenseTable";
import { useState } from "react";
import { Receipt } from "./types/types";
import PhotoUpload from "./components/PhotoUpload";

export default function Home() {
  const [data, setData] = useState<Receipt>();
  const [isLoading, setIsLoading] = useState(false);
  const handleOnClick = async () => {
    setIsLoading(true);
    const response = (await getReceiptContents(
      "https://images.iberion.media/images/1920/2_J_Ic_Dz_Bx_H_Es_W4_R2_M_Kx_H9n_V_paragon_1_3df2622222.jpg"
    )) as Receipt;
    console.log(response);
    setData(response);
    setIsLoading(false);
  };
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {!isLoading ? (
        <button onClick={handleOnClick}>HALLO</button>
      ) : (
        <>Loading...</>
      )}
      {data && <ExpenseTable data={data} />}

      <PhotoUpload></PhotoUpload>
    </main>
  );
}
