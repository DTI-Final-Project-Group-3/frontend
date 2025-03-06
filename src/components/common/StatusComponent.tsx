import { FC } from "react";

const StatusComponent: FC<{ name: string; color: string }> = ({
  name,
  color,
}) => {
  return (
    <span
      className={`rounded-full px-3 py-1 ${color} whitespace-nowrap text-xs font-semibold`}
    >
      {name}
    </span>
  );
};

export default StatusComponent;
