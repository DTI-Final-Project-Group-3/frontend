import { FC } from "react";

const LoadingCard: FC = () => {
  return (
    <div className="animate-pulse">
      <div className="bg-gray-200 h-[300px] rounded-lg mb-4"></div>
      <div className="bg-gray-200 h-6 rounded w-3/4 mb-2"></div>
      <div className="bg-gray-200 h-4 rounded w-1/2"></div>
    </div>
  );
};

export default LoadingCard;
