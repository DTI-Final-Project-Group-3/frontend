"use client";

import { Separator } from "@/components/ui/separator";
import { Bell } from "lucide-react";
import React, { FC, useState } from "react";

const notifications = [
  { id: 1, text: "Pending", icon: "/icons/waiting.svg" },
  { id: 2, text: "Proccessing", icon: "/icons/processing.svg" },
  { id: 3, text: "Shipped", icon: "/icons/shipping.svg" },
  { id: 4, text: "Confirmed", icon: "/icons/delivered.svg" },
  { id: 5, text: "Canceled", icon: "/icons/delivered.svg" },
];

const NotificationDropdown: FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Transaction");

  return (
    <div className="relative">
      {/* Notification Icon */}
      <div
        className="relative p-2 cursor-pointer hover:bg-slate-100 rounded-lg"
        onMouseEnter={() => setIsOpen(true)}
      >
        <Bell size={24} />
        <span className="absolute -top-1 -right-1 text-[14px] font-bold bg-red-500 px-2 text-white rounded-full border-white border-[1px]">
          3
        </span>
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div
          className="absolute py-2 left-1/2 -translate-x-1/2 mt-2 w-[350px] bg-white shadow-lg rounded-lg z-10 border transition-all"
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
        >
          {/* Header Tabs */}
          <div className="w-full px-4 py-2">
            <span className="font-semibold text-lg">Notifications</span>
            <Separator className="my-2" />
          </div>
          <div className="flex border-b">
            <button
              className={`flex-1 p-2 text-center ${
                activeTab === "Transactions"
                  ? "border-b-2 border-black text-black font-semibold"
                  : "text-gray-400 font-semibold"
              }`}
              onClick={() => setActiveTab("Transactions")}
            >
              Transactions
            </button>
            <button
              className={`flex-1 p-2 text-center ${
                activeTab === "Notifications"
                  ? "border-b-2 border-black text-black font-semibold"
                  : "text-gray-400 font-semibold"
              }`}
              onClick={() => setActiveTab("Notifications")}
            >
              Notifications (1)
            </button>
          </div>

          {/* Notification List */}
          <ul className="flex items-center justify-center p-3 space-y-3 max-w-[350px]">
            {notifications.map((notif) => (
              <li
                key={notif.id}
                className="flex flex-col justify-center items-center space-x-3 p-2 hover:bg-gray-100 rounded-md"
              >
                <Bell />
                <p className="text-[12px] text-gray-700">{notif.text}</p>
              </li>
            ))}
          </ul>

          {/* Footer Actions */}
          <div className="border-t p-3 text-center">
            <button className="text-green-600 font-semibold hover:underline">
              Tandai semua dibaca
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
