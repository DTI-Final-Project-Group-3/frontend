import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trxStatuses } from "@/constant/orderStatus";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { FC } from "react";

type NotificationTabsProps = {
  closePopover: () => void;
};

const NotificationTabs: FC<NotificationTabsProps> = ({ closePopover }) => {
  const router = useRouter();

  const handleNavigation = (path: string) => {
    closePopover();
    setTimeout(() => router.push(path), 300);
  };

  return (
    <Tabs defaultValue="order-list" className="w-full transition-all">
      {/* Tabs Menu */}
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="order-list" className="font-semibold">
          Order Lists
        </TabsTrigger>
        <TabsTrigger value="update" className="font-semibold">
          Update
        </TabsTrigger>
      </TabsList>

      {/* Order Lists Tab Content */}
      <TabsContent value="order-list" className="transition-all w-full h-full">
        {/* See all transaction link */}
        <div className="flex items-center justify-between w-full mb-2 p-5">
          <p className="font-semibold">Transactions</p>
          <button
            className="text-green-500 font-semibold"
            onClick={() => handleNavigation("/order-list")}
          >
            See all
          </button>
        </div>

        {/* Show By Filter Status */}
        <div className="flex flex-row items-center gap-8 w-full overflow-x-auto pb-2 px-5 [&::-webkit-scrollbar]:h-[10px]">
          {trxStatuses.slice(1).map((status) => (
            <div
              key={status.id}
              className="flex flex-col items-center justify-center gap-2"
            >
              <Image
                src={status.icon}
                alt="Status icon"
                height={24}
                width={24}
              />
              <p className="text-[12px] font-medium text-center max-w-[80px]">
                {status.text}
              </p>
            </div>
          ))}
        </div>
        <Separator className="my-4" />
      </TabsContent>

      {/* Update Notifications Tab Content */}
      <TabsContent value="update" className="p-5 transition-all">
        This is notifications update
      </TabsContent>
    </Tabs>
  );
};

export default NotificationTabs;
