import React from "react";

const OrderManagementPage = () => {
  return (
    <section className="w-full rounded-2xl bg-white p-7 min-h-[calc(100vh-178px)]">
      {/* Title */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-xl font-semibold">Order Management</h2>
      </div>
      {/* Content */}
      <div className="mt-7 w-full overflow-hidden">
        <p>Table</p>
      </div>
    </section>
  );
};

export default OrderManagementPage;
