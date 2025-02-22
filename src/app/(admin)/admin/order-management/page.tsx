import Filters from "@/components/filters/Filters";
import OrderLists from "@/components/lists/order-list/OrderLists";
import React from "react";

const OrderManagementPage = () => {
  return (
    <section className="w-full rounded-2xl min-h-[calc(100vh-178px)]">
      {/* Title */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-7 md:sticky md:top-[0] z-[100] bg-white w-full rounded-xl">
        <h1 className="text-3xl font-bold">Order Management</h1>
      </div>
      {/* Content */}
      {/* <div className="mt-7 w-full overflow-hidden"> */}
        <div className="mt-[24px] h-auto flex flex-col gap-6 w-full ">
          <Filters />
          <OrderLists />
        </div>
      {/* </div> */}
    </section>
  );
};

export default OrderManagementPage;
