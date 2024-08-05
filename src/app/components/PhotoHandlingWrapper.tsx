"use client";

import { deletePhoto } from "@/lib/photoStore";
import React, { useState } from "react";
import { Receipt } from "../types/types";
import CameraComponent from "./CameraComponent";
import ExpenseTable from "./expenseTable/ExpenseTable";
import PhotoUpload from "./PhotoUpload";
import axios from "axios";
import parseReceipt from "@/services/parseReceipt";

const EXAMPLERECEIPT: Receipt = {
  "2024-08-01": {
    "Apple": 1.2,
    "Banana": 0.5,
    "Milk": 2.5,
    "Bread": 1.8,
    "Eggs": 3.0,
    "Orange Juice": 3.5,
    "Chicken Breast": 5.5,
    "Rice": 2.0,
    "Yogurt": 1.5,
    "Tomato": 0.8,
    "Steak": 10.0,
    "Potato": 1.0,
    "Butter": 2.5,
    "Cheese": 4.0,
    "Lettuce": 1.2,
    "Pasta": 1.5,
    "Ground Beef": 6.0,
    "Onion": 0.7,
    "Garlic": 0.3,
    "Olive Oil": 5.0,
    "Bell Pepper": 1.1,
    "Spinach": 2.2,
    "Blueberries": 3.3,
    "Salmon": 12.0,
    "Almonds": 8.0
  }
};

const PhotoHandlingWrapper = () => {
  const [photo, setPhoto] = useState<string | ArrayBuffer | ImageData | null>();
  const [cameraOn, setCameraOn] = useState(false);
  const [photoName, setPhotoName] = useState("");

  const [receiptData, setReceiptData] = useState<Receipt>();
  const [isLoading, setIsLoading] = useState(false);

  const handleOnClick = async () => {
    if (!photoName || !photo) {
      console.error("No file selected!");
      return;
    }
    setIsLoading(true);
    try {
      await axios.post("/api/upload", { name: photoName, photo: photo });
    } catch {
      console.error("Photo upload failed!");
    }

    const response = await parseReceipt(
      `https://paragon-of-saving.vercel.app/api/${photoName}`
    );

    setReceiptData(response as Receipt);
    deletePhoto(photoName);
    setIsLoading(false);
  };

  return (
    <div>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => {
          setCameraOn((prev) => !prev);
        }}
        disabled={isLoading}
      >
        Swap input
      </button>
      <div className="flex flex-col items-center m-5">
        {!cameraOn ? (
          <PhotoUpload setPhotoName={setPhotoName} setPhoto={setPhoto} />
        ) : (
          <CameraComponent setPhotoName={setPhotoName} setPhoto={setPhoto} />
        )}
        {photo && <img src={photo as string} />}
      </div>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={handleOnClick}
        disabled={isLoading}
      >
        {isLoading ? "Loading..." : "Czekierałt!"}
      </button>
      {
      //receiptData && <ExpenseTable data={receiptData} />
      }
      {EXAMPLERECEIPT && <ExpenseTable data={EXAMPLERECEIPT} />}
    </div>
  );
};

export default PhotoHandlingWrapper;
