import Filters from "@/components/filters/Filters";
import OrderLists from "@/components/lists/order-list/OrderLists";
import React, { FC } from "react";

const OrderListPage: FC = () => {
  return (
    <section className="py-[40px] px-6 bg-slate-100 sm:min-h-[1000px] md:min-h-[calc(100vh-70px)] w-full">
      <div className="md:max-w-4xl lg:max-w-[1340px] mx-auto w-full">
        <h1 className="text-4xl font-semibold tracking-tighter">Order Lists</h1>

        <div className="mt-[40px] h-auto flex flex-col gap-6 w-full">
          <Filters />
          <OrderLists />
        </div>
      </div>
    </section>
  );
};

export default OrderListPage;
