"use client";

import React, { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Separator } from "@/components/ui/separator";
import { addOneHour } from "@/utils/time";
import { useSession } from "next-auth/react";
import { QRCodeCanvas } from "qrcode.react";
import { fetchOrderDetail } from "@/components/lists/order-list/OrderDetailsModal";
import { useCountdownTimer } from "@/hooks/useCountdownTimer";
import { ImagePlus, Loader2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { formatDateTime, formatPrice } from "@/utils/formatter";
import { uploadImageManualTransaction } from "@/app/api/transaction/uploadImageManualTransaction";
import Image from "next/image";

const ManualPatmentPage = () => {
  const { orderId } = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const accessToken = session?.accessToken;
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["orderDetails", orderId, accessToken],
    queryFn: () => fetchOrderDetail(Number(orderId), accessToken!),
    enabled: !!accessToken,
    staleTime: 1000 * 60 * 60, // Set stale time to 60 minutes
    refetchOnWindowFocus: false, // Prevent refetching when switching tabs
    refetchInterval: false, // Disable automatic refetching
  });

  const createdAt = data?.data.createdAt ?? "";
  const { timeLeft, formattedTime } = useCountdownTimer(createdAt.toString());

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-160px)]">
        <p className="text-lg font-semibold text-red-500">
          Failed to load order details. Please try again.
        </p>
      </div>
    );
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUploadPaymentImage = async () => {
    if (!selectedFile) {
      toast({
        title: "No image found",
        description: "Please select an image first",
        variant: "destructive",
        duration: 2000,
      });
      return;
    }

    try {
      await uploadImageManualTransaction({
        orderId: Number(orderId),
        selectedFile,
        accessToken: accessToken!,
      });

      router.refresh();
      window.location.reload();
    } catch (error) {
      toast({
        title: "Failed to upload payment proof image",
        description: `Error ${error}`,
        variant: "destructive",
        duration: 2000,
      });
    }
  };

  return (
    <section className="py-[40px] px-6 bg-white min-h-[calc(100vh-70px)] w-full">
      {isLoading ? (
        <div className="flex flex-col gap-4 items-center justify-center min-h-[calc(100vh-160px)] w-full">
          <Loader2 className="animate-spin w-10 h-10" />
          <p className="text-lg font-semibold">Loading payment details...</p>
        </div>
      ) : (
        <div className="md:max-w-4xl lg:max-w-[1340px] mx-auto w-full flex flex-col items-center gap-14">
          {/* Payment time details */}
          <div className="flex flex-col items-center gap-4 w-full md:w-[660px]">
            <h2 className="text-2xl font-bold text-center">
              Complete the payment within
            </h2>
            {data?.data.orderStatusId === 2 ? (
              <span className="text-3xl font-bold text-green-600">
                Upload success
              </span>
            ) : data?.data.orderStatusId === 6 ? (
              <span className="text-3xl font-bold text-red-500">
                Order canceled
              </span>
            ) : (
              <>
                <span className="text-3xl font-bold text-green-600">
                  {formattedTime}
                </span>
                <p className="text-base text-gray-500">Before</p>
                <span className="text-xl font-bold">
                  {
                    formatDateTime(addOneHour(createdAt.toString()))
                      .formattedDateTime
                  }
                </span>
              </>
            )}

            {/* Payment details */}
            <div className="flex flex-col border w-full rounded-xl p-6 mt-6">
              <div className="flex items-center justify-between">
                <span>Total payment</span>
                <span className="font-bold text-lg">
                  {formatPrice(String(data?.data.totalAmount))}
                </span>
              </div>
              <Separator className="my-3" />
              <div className="flex items-center justify-between">
                <span>Invoice code</span>
                <span className="font-bold text-lg">
                  {data?.data.invoiceCode}
                </span>
              </div>
            </div>
          </div>
          {data?.data.orderStatusId === 2 ? (
            <div className="flex items-center justify-center mt-2 w-full h-full">
              <Image
                src={data?.data.paymentProofImageUrl}
                alt="Payment proof image"
                height={660}
                width={660}
                className="object-cover md:h-[660px] md:w-[660px] rounded-lg"
              />
            </div>
          ) : data?.data.orderStatusId === 6 || timeLeft <= 0 ? (
            <div className="h-[200px] flex items-center justify-center text-base font-semibold text-red-500 border rounded-xl w-[660px]">
              <span>Order canceled, payment already expired.</span>
            </div>
          ) : (
            <div className="flex flex-col md:flex-row gap-9 w-full h-full items-center justify-center">
              {timeLeft > 0 && (
                <>
                  {/* QR code section */}
                  <div className="flex flex-col items-center justify-center gap-6 border p-4">
                    <QRCodeCanvas
                      value={data?.data.invoiceCode ?? "dummy-qr-code"}
                      size={200}
                    />
                    <p className="mt-2 text-center text-gray-600">
                      Scan QR Code to pay the order
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
                        accept="image/*"
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                    </label>
                  </div>
                </>
              )}
            </div>
          )}
          <div className="flex md:flex-row flex-col w-full md:max-w-[660px] gap-6">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                router.push("/order-list");
              }}
            >
              See payment status
            </Button>
            {timeLeft > 0 && data?.data.orderStatusId === 1 && (
              <Button
                type="submit"
                variant="green"
                disabled={timeLeft < 0}
                className="px-6 w-full"
                onClick={handleUploadPaymentImage}
              >
                Upload image
              </Button>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default ManualPatmentPage;
