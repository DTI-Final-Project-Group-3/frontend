import PaginationComponent from "@/components/lists/order-list/PaginationComponent";

interface CustomPaginationProps {
  desc: string;
  page: number;
  setPage: (page: number) => void;
  totalPages: number;
  totalElements: number;
  currentPageSize: number;
}

export const PaginationAdmin = ({
  desc,
  page,
  setPage,
  totalPages,
  totalElements,
  currentPageSize,
}: CustomPaginationProps) => {
  return (
    <div className="flex w-full flex-col items-center justify-between gap-2 md:flex-row md:gap-0">
      <p className="text-nowrap text-sm text-gray-600">
        Showing {currentPageSize} out of {totalElements} {desc}
      </p>
      <PaginationComponent
        page={page}
        totalPages={totalPages}
        setPage={setPage}
        backToTop={false}
        className="flex justify-end"
      />
    </div>
  );
};
