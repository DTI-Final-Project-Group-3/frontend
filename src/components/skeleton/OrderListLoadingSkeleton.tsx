import React, { FC } from "react";
import { Skeleton } from "../ui/skeleton";
import { Separator } from "../ui/separator";

const OrderListLoadingSkeleton: FC = () => {
  return (
    <div className="flex flex-col gap-6 p-6 border rounded-xl w-full">
      <div className="flex md:flex-row flex-col gap-2 md:gap-5 w-[75%]] rounded-xl">
        <Skeleton className="bg-slate-200 h-[32px] w-full md:w-[200px]" />
        <Skeleton className="bg-slate-200 h-[32px] w-[120px]" />
        <Skeleton className="bg-slate-200 h-[32px] w-[80px]" />
        <Skeleton className="bg-slate-200 h-[32px] w-[170px]" />
      </div>
      <div className="flex md:flex-row flex-col md:gap-6 gap-4">
        <div className="flex gap-4 border-r w-full">
          <Skeleton className="bg-slate-200 h-[60px] w-[60px]" />
          <div className="flex flex-col gap-2">
            <Skeleton className="bg-slate-200 h-[24px] w-[180px]" />
            <Skeleton className="bg-slate-200 h-[24px] w-[150px]" />
          </div>
        </div>
        <div className="flex flex-col gap-2 md:pr-14">
          <Skeleton className="bg-slate-200 h-[20px] w-[100px] rounded-xl" />
          <Skeleton className="bg-slate-200 h-[18px] w-[70px] rounded-xl" />
          <Skeleton className="bg-slate-200 h-[20px] w-[90px] rounded-xl" />
        </div>
      </div>
      <Separator className="my-2" />
      <div className="flex flex-col md:flex-row gap-2 justify-end items-center md:gap-3">
        <Skeleton className="bg-slate-200 h-[30px] w-[210px] rounded-xl" />
        <Skeleton className="bg-slate-200 h-[30px] w-[210px] rounded-xl" />
      </div>
    </div>
  );
};

export default OrderListLoadingSkeleton;
