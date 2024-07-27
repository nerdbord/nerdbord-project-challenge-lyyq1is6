"use client";

import { deletePhoto } from "@/lib/photoStore";
import getReceiptContents from "@/services/getReceiptContents";
import React, { useState } from "react";
import { Receipt } from "../types/types";
import CameraComponent from "./CameraComponent";
import ExpenseTable from "./ExpenseTable";
import PhotoUpload from "./PhotoUpload";
import axios from "axios";

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
    await axios.post("/api/upload", { name: photoName, photo: photo });

    const response = await getReceiptContents(
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
      {receiptData && <ExpenseTable data={receiptData} />}
    </div>
  );
};

export default PhotoHandlingWrapper;
