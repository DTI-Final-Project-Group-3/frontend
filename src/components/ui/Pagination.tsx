import { FC } from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number, isDirectPage?: boolean) => void;
  hasNext: boolean;
  hasPrev: boolean;
}

const Pagination: FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  hasNext,
  hasPrev,
}) => {
  const handlePageChange = (page: number, isDirectPage?: boolean) => {
    onPageChange(page, isDirectPage);
    window.scrollTo({ top: 570, behavior: "smooth" });
  };

  return (
    <div className="flex pt-10 justify-center gap-3">
      <div className="w-16 justify-end flex">
        <button
          onClick={() => handlePageChange(-1)}
          className={`${hasPrev ? "visible" : "invisible"}`}
        >
          Prev
        </button>
      </div>

      {totalPages > 0 && (
        <>
          {/* First page if not in first group */}
          {currentPage > 2 && (
            <>
              <button
                className="w-8 text-center"
                onClick={() => handlePageChange(0, true)}
              >
                1
              </button>
              <span className="w-8 text-center">...</span>
            </>
          )}

          {/* Visible page numbers */}
          {[...Array(5)].map((_, index) => {
            let pageNumber;
            if (currentPage < 3) {
              pageNumber = index;
            } else if (currentPage > totalPages - 4) {
              pageNumber = totalPages - 5 + index;
            } else {
              pageNumber = currentPage - 2 + index;
            }

            if (pageNumber < 0 || pageNumber >= totalPages) return null;

            return (
              <button
                key={pageNumber}
                className={`w-8 text-center ${
                  currentPage === pageNumber ? "font-bold" : ""
                }`}
                onClick={() => handlePageChange(pageNumber, true)}
              >
                {pageNumber + 1}
              </button>
            );
          })}

          {/* Last page if not in last group */}
          {currentPage < totalPages - 3 && (
            <>
              <span className="w-8 text-center">...</span>
              <button
                className="w-8 text-center"
                onClick={() => handlePageChange(totalPages - 1, true)}
              >
                {totalPages}
              </button>
            </>
          )}
        </>
      )}

      <div className="flex justify-start w-16">
        <button
          onClick={() => handlePageChange(+1)}
          className={`${hasNext ? "visible" : "invisible"}`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;
