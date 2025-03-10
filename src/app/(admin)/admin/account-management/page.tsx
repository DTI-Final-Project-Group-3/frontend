"use client"
import AdminManagementPage from "@/components/account-management/AdminManagementPage";
import CustomerManagementPage from "@/components/account-management/CustomerManagementPage";
import { useState } from "react";

const AccountManagementPage = () => {
  const [selectedPage, setSelectedPage] = useState("admin");

  return (
    <div>
      <section className="w-full rounded-2xl bg-white p-7 mb-4">
        <div className="flex gap-4">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="managementPage"
              value="admin"
              checked={selectedPage === "admin"}
              onChange={() => setSelectedPage("admin")}
            />
            Admin Management Page
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="managementPage"
              value="customer"
              checked={selectedPage === "customer"}
              onChange={() => setSelectedPage("customer")}
            />
            Customer Management Page
          </label>
        </div>
      </section>
      {selectedPage === "admin" ? <AdminManagementPage /> : <CustomerManagementPage />}
    </div>
  );
};

export default AccountManagementPage;
