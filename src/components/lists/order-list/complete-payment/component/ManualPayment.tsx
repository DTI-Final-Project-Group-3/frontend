"use client";

import React, { FC, useState } from "react";
import { ImagePlus } from "lucide-react";
import { addOneHour } from "@/utils/time";
import { QRCodeCanvas } from "qrcode.react";
import { formatDateTime } from "@/utils/formatter";
import { useCountdownTimer } from "@/hooks/useCountdownTimer";
import Image from "next/image";
import { toast } from "@/hooks/use-toast";

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
      const validExtensions = ["image/jpeg", "image/png", "image/jpg"];
      const maxSize = 1 * 1024 * 1024; // 1MB

      // Validate file type
      if (!validExtensions.includes(file.type)) {
        toast({
          title: "Error uploading image",
          description:
            "Invalid file type. Only JPG, JPEG, and PNG are allowed.",
          variant: "destructive",
          duration: 3000,
        });
        return;
      }

      // Validate file size
      if (file.size > maxSize) {
        toast({
          title: "Error uploading image",
          description: "File size exceeds 1MB. Please upload a smaller file.",
          variant: "destructive",
          duration: 3000,
        });
        return;
      }

      // If valid, update state
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  return (
    <div className="flex h-full max-h-[60vh] flex-col items-center gap-10 overflow-y-auto py-6 md:max-h-[60vh]">
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
      <div className="flex flex-col gap-10 md:flex-row">
        <div className="flex flex-col items-center justify-center gap-6 border p-4">
          <QRCodeCanvas value="dummy-manual-payment-info" size={200} />
          <p className="mt-2 text-center text-gray-600">
            Scan the QR Code to pay the order
          </p>
        </div>
        <div className="h-full border border-gray-200" />
        {/* File upload section */}
        <div className="flex flex-col items-center gap-6">
          <label
            htmlFor="file-upload"
            className="relative flex h-[300px] w-[300px] cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 transition hover:bg-gray-100"
          >
            {previewUrl ? (
              <div className="mt-2 flex h-full w-full items-center justify-center bg-slate-100">
                <Image
                  src={previewUrl}
                  alt="Payment proof image"
                  height={300}
                  width={300}
                  className="h-[300px] w-[300px] rounded-lg object-cover"
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-3">
                <ImagePlus className="text-gray-400" size={28} />
                <p className="text-center text-gray-500">
                  Click to upload image
                </p>
              </div>
            )}

            <input
              type="file"
              accept="image/"
              onChange={handleFileChange}
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            />
          </label>
        </div>
      </div>
    </div>
  );
};

export default ManualPayment;
