import { FC, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getProductCategory } from "@/app/api/getProducts";

interface FilterCategoryProps {
  onFilterChange: (category: number | null) => void;
}

const FilterCategory: FC<FilterCategoryProps> = ({ onFilterChange }) => {
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
    <div className="font-inter">
      <div className="h-[320px] overflow-y-auto">
        <h1 className="mb-4 text-xl font-bold">Categories</h1>

        {isLoading ? (
          <div className="flex flex-col gap-5 p-3 animate-pulse">
            {Array.from({ length: 10 }).map((_, index) => (
              <div key={index} className="rounded-md bg-gray-200 p-4"></div>
            ))}
          </div>
        ) : error ? (
          <div className="p-3 text-red-500">
            {error instanceof Error
              ? error.message
              : "Error loading categories"}
          </div>
        ) : (
          <div className="space-y-2">
            <button
              className={`w-full rounded-md p-2 text-left transition-colors ${
                selectedCategory === null
                  ? "font-medium text-black"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
              onClick={() => handleCategoryChange(null)}
            >
              All Categories
            </button>
            {categories?.map((category) => (
              <button
                key={category.id}
                className={`w-full rounded-md p-2 text-left transition-colors ${
                  selectedCategory === category.id
                    ? "font-medium text-black"
                    : "text-gray-600 hover:bg-gray-50"
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

export default FilterCategory;
