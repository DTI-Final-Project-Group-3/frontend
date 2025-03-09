import { PenSquare } from "lucide-react";
import React, { FC } from "react";
import { cn } from "@/lib/utils";

const EditIcon: FC<React.SVGProps<SVGSVGElement>> = ({ ...props }) => {
  return (
    <PenSquare
      {...props}
      className={cn(
        "h-5 w-5 cursor-pointer text-gray-600 hover:bg-gray-100 hover:text-green-600",
        props.className,
      )}
    />
  );
};

export default EditIcon;
