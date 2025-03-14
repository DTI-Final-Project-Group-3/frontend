import { FC, useEffect, useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { Input } from "@/components/ui/input";

interface SearchBarAdminComponentProps {
  setSearchQuery: (searchQuery: string | undefined) => void;
  placeholder?: string;
}

const SearchBarAdminComponent: FC<SearchBarAdminComponentProps> = ({
  setSearchQuery,
  placeholder = "Search Products...",
}) => {
  const [internalSearchQuery, setInternalSearchQuery] = useState<string>("");

  const debouncedSearch = useDebounce(internalSearchQuery, 500);

  useEffect(() => {
    setSearchQuery(debouncedSearch);
  }, [debouncedSearch, setSearchQuery]);

  return (
    <div className="relative h-full w-full sm:w-auto">
      <Input
        type="text"
        placeholder={placeholder}
        className="w-full rounded-lg border border-gray-300 py-2 pl-10"
        value={internalSearchQuery}
        onChange={(e) => setInternalSearchQuery(e.target.value)}
      />
      <svg
        className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    </div>
  );
};

export default SearchBarAdminComponent;
