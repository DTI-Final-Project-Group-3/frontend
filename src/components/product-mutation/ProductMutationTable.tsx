import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDateString } from "@/utils/formatter";
import StatusComponent from "@/components/common/StatusComponent";
import { PaginationAdmin } from "@/components/pagination/PaginationAdmin";
import React, { FC, useState } from "react";
import { ProductMutationDetailResponse } from "@/types/models/productMutation";
import { PaginationResponse } from "@/types/api/pagination";

type ProductMutationType = "adjustment" | "inbound" | "outbound";

interface ProductMutationTableProps {
  data: PaginationResponse<ProductMutationDetailResponse> | undefined;
  isLoading: boolean;
  isError: boolean;
  type: ProductMutationType;
}

const ProductMutationTable: FC<ProductMutationTableProps> = ({
  data,
  isLoading,
  isError,
  type,
}) => {
  const [page, setPage] = useState(0);

  const renderTableHeaders = () => {
    const commonHeaders = (
      <>
        <TableHead>Date</TableHead>
        <TableHead>Product</TableHead>
        {/*<TableHead>Thumbnail</TableHead>*/}
        <TableHead>Quantity</TableHead>
        <TableHead>Type</TableHead>
        <TableHead>Status</TableHead>
        <TableHead>Requester</TableHead>
        <TableHead>Requester Notes</TableHead>
      </>
    );

    switch (type) {
      case "adjustment":
        return commonHeaders;
      case "inbound":
        return (
          <>
            {commonHeaders}
            <TableHead>Reviewer</TableHead>
            <TableHead>Reviewer Notes</TableHead>
            <TableHead>Origin Warehouse</TableHead>
          </>
        );
      case "outbound":
        return (
          <>
            {commonHeaders}
            <TableHead>Reviewer</TableHead>
            <TableHead>Reviewer Notes</TableHead>
            <TableHead>Destination Warehouse</TableHead>
          </>
        );
      default:
        return commonHeaders;
    }
  };

  const renderTableRows = (item: ProductMutationDetailResponse) => {
    const commonCells = (
      <>
        <TableCell>{formatDateString(item.createdAt)}</TableCell>
        <TableCell>{item.productName}</TableCell>
        {/*<TableCell>*/}
        {/*  <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md bg-gray-100">*/}
        {/*    <ImageComponent*/}
        {/*      src={item.productThumbnail}*/}
        {/*      className="object-cover"*/}
        {/*      alt={`${item.productName} thumbnail`}*/}
        {/*      fill={true}*/}
        {/*      sizes="50px, 50px"*/}
        {/*    />*/}
        {/*  </div>*/}
        {/*</TableCell>*/}
        <TableCell>{item.quantity}</TableCell>
        <TableCell>{item.productMutationTypeName}</TableCell>
        <TableCell>
          <StatusComponent name={item.productMutationStatusName} />
        </TableCell>
        <TableCell>{item.requesterName || "-"}</TableCell>
        <TableCell>{item.requesterNotes || "-"}</TableCell>
      </>
    );

    switch (type) {
      case "adjustment":
        return commonCells;
      case "inbound":
        return (
          <>
            {commonCells}
            <TableCell>{item.reviewerName || "-"}</TableCell>
            <TableCell>{item.reviewerNotes || "-"}</TableCell>
            <TableCell>{item.originWarehouseName || "-"}</TableCell>
          </>
        );
      case "outbound":
        return (
          <>
            {commonCells}
            <TableCell>{item.reviewerName || "-"}</TableCell>
            <TableCell>{item.reviewerNotes || "-"}</TableCell>
            <TableCell>{item.destinationWarehouseName || "-"}</TableCell>
          </>
        );
      default:
        return commonCells;
    }
  };

  return (
    <div className="rounded-lg bg-white p-6 shadow">
      {isLoading ? (
        <div>
          <div className="mb-6 grid grid-cols-3 gap-4">
            <Skeleton />
            <Skeleton />
            <Skeleton />
          </div>

          <Skeleton className="h-40 w-full" />

          <div className="flex flex-col gap-4">
            <Skeleton />
            <Skeleton />
            <Skeleton />
          </div>
        </div>
      ) : isError ? (
        <div>Error loading data</div>
      ) : (
        data && (
          <>
            <Table>
              <TableHeader>
                <TableRow>{renderTableHeaders()}</TableRow>
              </TableHeader>
              <TableBody>
                {data.content.map((item) => (
                  <TableRow key={item.productMutationId}>
                    {renderTableRows(item)}
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <PaginationAdmin
              desc={`${type.charAt(0).toUpperCase() + type.slice(1)} History`}
              page={page}
              setPage={setPage}
              totalPages={data.totalPages}
              totalElements={data.totalElements}
              currentPageSize={data.content.length}
            />
          </>
        )
      )}
    </div>
  );
};

export default ProductMutationTable;
