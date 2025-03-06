import React, { FC } from "react";
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

type PaginationProps = {
  page: number;
  totalPages: number;
  setPage: (page: number) => void;
  backToTop?: boolean;
  className?: string;
};

const PaginationComponent: FC<PaginationProps> = ({
  page,
  setPage,
  totalPages,
  backToTop = true,
  className,
}) => {
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    if (backToTop) {
      window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll to top smoothly
    }
  };

  return (
    <Pagination className={cn("my-5", className)}>
      <PaginationContent>
        {/* Previous button */}
        <PaginationItem>
          <PaginationPrevious
            href=""
            onClick={(e) => {
              e.preventDefault();
              if (page > 0) handlePageChange(page - 1);
            }}
            className={page <= 0 ? "hidden" : ""}
          />
        </PaginationItem>

        {/* Render first page */}
        {page > 2 && (
          <>
            <PaginationItem className="hidden md:block">
              <PaginationLink
                href=""
                onClick={(e) => {
                  e.preventDefault();
                  handlePageChange(0);
                }}
              >
                1
              </PaginationLink>
            </PaginationItem>
            <PaginationEllipsis />
          </>
        )}

        {/* Render neighboring pages */}
        {[...Array(totalPages)].map((_, index) => {
          if (index >= page - 1 && index <= page + 1) {
            return (
              <PaginationItem key={index} className="hidden md:block">
                <PaginationLink
                  href=""
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(index);
                  }}
                  isActive={page === index}
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            );
          }
          return null;
        })}

        {/* Render last page */}
        {page < totalPages - 3 && (
          <>
            <PaginationEllipsis className="hidden md:flex" />
            <PaginationItem className="hidden md:block">
              <PaginationLink
                href=""
                onClick={(e) => {
                  e.preventDefault();
                  handlePageChange(totalPages - 1);
                }}
              >
                {totalPages}
              </PaginationLink>
            </PaginationItem>
          </>
        )}

        {/* Next button */}
        <PaginationItem>
          <PaginationNext
            href=""
            onClick={(e) => {
              e.preventDefault();
              if (page < totalPages - 1) handlePageChange(page + 1);
            }}
            className={
              page >= totalPages - 1 || totalPages === 0 ? "hidden" : ""
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default PaginationComponent;
