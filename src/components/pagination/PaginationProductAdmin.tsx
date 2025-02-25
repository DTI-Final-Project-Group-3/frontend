// CustomPagination.tsx
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

interface CustomPaginationProps {
  currentPage: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
  onPageChange: (page: number) => void;
  totalElements: number;
  currentPageSize: number;
}

export const PaginationProductAdmin = ({
  currentPage,
  totalPages,
  hasNext,
  hasPrev,
  onPageChange,
  totalElements,
  currentPageSize,
}: CustomPaginationProps) => {
  // Calculate which page numbers to show
  const getPageNumbers = () => {
    let pagesToShow: (number | "ellipsis")[] = [];

    if (totalPages <= 5) {
      // If 5 or fewer pages, show all
      pagesToShow = Array.from({ length: totalPages }, (_, i) => i);
    } else {
      if (currentPage < 3) {
        // Start of the range
        pagesToShow = [0, 1, 2, 3, "ellipsis"];
      } else if (currentPage > totalPages - 4) {
        // End of the range
        pagesToShow = [
          "ellipsis",
          totalPages - 4,
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
        ];
      } else {
        // Middle of the range
        pagesToShow = [
          "ellipsis",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "ellipsis",
        ];
      }
    }

    return pagesToShow;
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-center w-full gap-2 md:gap-0">
      <p className="text-sm text-gray-600 text-nowrap">
        Showing {currentPageSize} out of {totalElements} products
      </p>
      <Pagination className="md:justify-end">
        <PaginationContent className="gap-3 md:gap-4">
          <PaginationItem className="md:w-24">
            <PaginationPrevious
              onClick={() => onPageChange(currentPage - 1)}
              className={
                !hasPrev ? "pointer-events-none opacity-50" : "cursor-pointer"
              }
              aria-disabled={!hasPrev}
            />
          </PaginationItem>

          {getPageNumbers().map((pageOrEllipsis, index) => (
            <PaginationItem
              key={`${pageOrEllipsis}-${index}`}
              className="w-5 md:w-10"
            >
              {pageOrEllipsis === "ellipsis" ? (
                <PaginationEllipsis className="h-5 md:h-10" />
              ) : (
                <PaginationLink
                  onClick={() => onPageChange(pageOrEllipsis)}
                  className={`md:h-10 ${
                    pageOrEllipsis === currentPage
                      ? "bg-black text-white hover:bg-black hover:text-white cursor-not-allowed"
                      : "text-gray-700 hover:bg-gray-100 cursor-pointer"
                  }`}
                >
                  {pageOrEllipsis + 1}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}

          <PaginationItem className="md:w-24">
            <PaginationNext
              onClick={() => onPageChange(currentPage + 1)}
              className={
                !hasNext ? "pointer-events-none opacity-50" : "cursor-pointer"
              }
              aria-disabled={!hasNext}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};
