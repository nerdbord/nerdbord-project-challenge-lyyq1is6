"use client";

import { deletePhoto } from "@/lib/photoStore";
import getReceiptContents from "@/services/getReceiptContents";
import React, { useState } from "react";
import { Receipt } from "../types/types";
import CameraComponent from "./CameraComponent";
import ExpenseTable from "./ExpenseTable";
import PhotoUpload from "./PhotoUpload";
import axios from "axios";
import parseReceipt from "@/services/parseReceipt";
import { addItem } from "@/services/supabaseServices";
import { v4 as uuidv4 } from "uuid";
import { redirect } from "next/navigation";
import {openaiClient} from "@/lib/openai";
import {generateObject} from "ai";
import {z} from "zod";

type ParsedReceipt = {
  [date: string]: {
    [itemName: string]: number;
  };
};

const PhotoHandlingWrapper = () => {
  const [photo, setPhoto] = useState<string>('');
  const [cameraOn, setCameraOn] = useState(false);
  const [photoName, setPhotoName] = useState("");

  const [receiptData, setReceiptData] = useState<Receipt>();
  const [isLoading, setIsLoading] = useState(false);

  const userId = uuidv4();

  const handleOnClick = async () => {
    if (!photoName || !photo) {
      console.error("No file selected!");
      return;
    }
    setIsLoading(true);

      const { object } = await generateObject({
          model: openaiClient('gpt-4-turbo'),
          maxTokens: 512,
          schema: z.object({
              items: z.array(
                  z.object({
                      name: z.string(),
                      price: z.number(),
                      quantity: z.number(),
                  })
              ),
          }),
          messages: [
              {
                  role: 'user',
                  content: [
                      {
                          type: 'text',
                          text: 'Extract all bought items from the receipt image. Provide each item with its name, price, and quantity.',
                      },
                      {
                          type: 'image',
                          image: photo,
                      },
                  ],
              },
          ],
      });


    setIsLoading(false);
  };

  return (
    <div className="flex flex-col">
      <a
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-min text-nowrap my-3"
        href="/tracker"
      >
        Go to tracker
      </a>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-min text-nowrap"
        onClick={() => {
          setCameraOn((prev) => !prev);
        }}
        disabled={isLoading}
      >
        Swap input
      </button>
      <div className="flex flex-col items-center m-5">
          <PhotoUpload setPhotoName={setPhotoName} setPhoto={setPhoto} />
        {photo && <img src={photo as string} />}
      </div>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-min text-nowrap"
        onClick={handleOnClick}
        disabled={isLoading}
      >
        {isLoading ? "Loading..." : "Parse receipt"}
      </button>
      {receiptData && <ExpenseTable data={receiptData} />}
    </div>
  );
};

export default PhotoHandlingWrapper;
