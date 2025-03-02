"use client";

import React, { FC, useState } from "react";
import { ImagePlus } from "lucide-react";
import { addOneHour } from "@/utils/time";
import { QRCodeCanvas } from "qrcode.react";
import { formatDateTime } from "@/utils/formatter";
import { useCountdownTimer } from "@/hooks/useCountdownTimer";
import Image from "next/image";

type ManualPaymentProps = {
  createdAt: Date;
};

const ManualPayment: FC<ManualPaymentProps> = ({ createdAt }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const { timeLeft, formattedTime } = useCountdownTimer(createdAt.toString());

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  return (
    <div
      className="flex flex-col items-center gap-10 py-6 h-full md:max-h-[60vh] max-h-[60vh] overflow-y-auto
    "
    >
      <div className="flex flex-col items-center gap-3">
        <h2 className="text-xl font-bold">Complete the payment within</h2>
        <span className="text-2xl font-bold text-green-600">
          {formattedTime}
        </span>
        <p className="text-base text-gray-500">Before</p>
        <span className="text-xl font-bold">
          {formatDateTime(addOneHour(createdAt.toString())).formattedDateTime}
        </span>
      </div>
      {/* QR code section */}
      <div className="flex flex-col md:flex-row gap-10">
        <div className="flex flex-col items-center justify-center gap-6 border p-4">
          <QRCodeCanvas value="dummy-manual-payment-info" size={200} />
          <p className="mt-2 text-center text-gray-600">
            Scan the QR Code to pay the order
          </p>
        </div>
        <div className="border border-gray-200 h-full" />
        {/* File upload section */}
        <div className="flex flex-col items-center gap-6">
          <label
            htmlFor="file-upload"
            className="relative cursor-pointer border-2 border-dashed border-gray-300 rounded-lg w-[300px] h-[300px] flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition"
          >
            {previewUrl ? (
              <div className="flex items-center justify-center mt-2 bg-slate-100 w-full h-full">
                <Image
                  src={previewUrl}
                  alt="Payment proof image"
                  height={300}
                  width={300}
                  className="object-cover h-[300px] w-[300px] rounded-lg"
                />
              </div>
            ) : (
              <div className="flex flex-col gap-3 items-center justify-center">
                <ImagePlus className="text-gray-400" size={28} />
                <p className="text-gray-500 text-center">
                  Click to upload image
                </p>
              </div>
            )}

            <input
              type="file"
              accept="image/"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </label>
        </div>
      </div>
    </div>
  );
};

export default ManualPayment;
