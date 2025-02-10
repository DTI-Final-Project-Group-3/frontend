import { FC, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getProductCategory } from "@/api/getProducts";

interface FilterProps {
  onFilterChange: (category: number | null) => void;
}

const Filtering: FC<FilterProps> = ({ onFilterChange }) => {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  const {
    data: categoriesResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: getProductCategory,
  });

  const categories = categoriesResponse?.data;

  const handleCategoryChange = (categoryId: number | null) => {
    setSelectedCategory(categoryId);
    onFilterChange(categoryId);
  };

  return (
    <div className="filtering-container p-4 font-inter ">
      <div className="h-[300px] overflow-y-auto ">
        {isLoading ? (
          <div className="p-3">Loading categories...</div>
        ) : error ? (
          <div className="p-3 text-red-500">
            {error instanceof Error
              ? error.message
              : "Error loading categories"}
          </div>
        ) : (
          <div className="space-y-1">
            <button
              className={`block w-full text-left p-2 hover:bg-gray-100 ${
                selectedCategory === null ? "underline font-medium" : ""
              }`}
              onClick={() => handleCategoryChange(null)}
            >
              All Categories
            </button>
            {categories?.map((category) => (
              <button
                key={category.id}
                className={`block w-full text-left p-2 hover:bg-gray-100 ${
                  selectedCategory === category.id
                    ? "underline font-medium"
                    : ""
                }`}
                onClick={() => handleCategoryChange(category.id)}
              >
                {category.name}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Filtering;
