"use client";

import React, { FC, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Bell } from "lucide-react";
import NotificationTabs from "./NotificationTabs";

const NotificationDropdown: FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <TooltipProvider>
      <Tooltip>
        <Popover open={open} onOpenChange={setOpen}>
          <TooltipTrigger asChild>
            <PopoverTrigger onClick={() => setOpen(!open)}>
              {/* Notification Icon */}
              <div className="relative p-2 cursor-pointer hover:bg-slate-100 rounded-lg flex items-center justify-center transition-all">
                <Bell size={24} className="text-gray-600"/>

                {/* Notifications number */}
                {/* <span className="absolute -top-1 -right-1 text-[14px] font-bold bg-red-500 px-2 text-white rounded-full border-white border-[1px]">
                  3
                </span> */}
              </div>
            </PopoverTrigger>
          </TooltipTrigger>

          <PopoverContent className="w-[340px] h-[500px] bg-white border rounded-xl transition-all shadow-lg">
            <h3 className="text-[16px] p-5 font-bold">Notifications</h3>
            <NotificationTabs closePopover={() => setOpen(false)} />
          </PopoverContent>
          <TooltipContent>Orders & Notifications</TooltipContent>
        </Popover>
      </Tooltip>
    </TooltipProvider>
  );
};

export default NotificationDropdown;
