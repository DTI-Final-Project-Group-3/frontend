import { Trash2 } from "lucide-react";
import React, { FC } from "react";
import { cn } from "@/lib/utils";

const DeleteIcon: FC<React.SVGProps<SVGSVGElement>> = ({
  className,
  ...props
}) => {
  return (
    <Trash2
      {...props}
      className={cn(
        "h-5 w-5 cursor-pointer text-gray-600 hover:bg-gray-100 hover:text-red-600",
        className,
      )}
    />
  );
};

export default DeleteIcon;
