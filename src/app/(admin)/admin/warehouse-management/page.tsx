"use client";

import { WarehouseCard } from "@/components/warehouse-management/WarehouseCard";
import { toast } from "@/hooks/use-toast";
import { WarehouseAssignedDetail } from "@/types/models/warehouseAssigned";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

const warehouse_all = `${process.env.NEXT_PUBLIC_BACKEND_URL}${process.env.NEXT_PUBLIC_WAREHOUSES_ALL}/all-assigned`;

const WarehouseManagementPage = () => {
  const { data: session, status } = useSession();
  const [warehouses, setWarehouses] = useState<WarehouseAssignedDetail[] | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const fetchWarehouses = useCallback(async () => {
    try {
      const res = await fetch(warehouse_all, {
        headers: { Authorization: `Bearer ${session?.accessToken}` },
      });
      const data = await res.json();
      if (data.success) {
        setWarehouses(data.data);
      } else {
        toast({ title: "Failed", description: "Failed to fetch warehouses", duration: 2000 });
      }
    } catch (error) {
      console.error("Error fetching warehouses:", error);
      toast({ title: "Error", description: "Error fetching warehouses", duration: 2000 });
    }
  }, [session]);

  useEffect(() => {
    if (status === "authenticated") {
      fetchWarehouses();
    }
  }, [status, session, fetchWarehouses]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  const totalPages = warehouses ? Math.ceil(warehouses.length / itemsPerPage) : 1;
  const paginatedWarehouses = warehouses?.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <section className="w-full rounded-2xl bg-white p-7 min-h-[calc(100vh-178px)]">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Warehouse Management</h2>
        <Link href="/admin/warehouse-management/create" className="bg-blue-500 text-white px-4 py-2 rounded-lg">
          Create new
        </Link>
      </div>

      {warehouses && warehouses.length > itemsPerPage && (
        <div className="flex justify-center mt-5">
          <button 
            className={`px-4 py-2 mx-2 rounded-lg ${currentPage === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 text-white"}`} 
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} 
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span className="px-4 py-2">Page {currentPage} of {totalPages}</span>
          <button 
            className={`px-4 py-2 mx-2 rounded-lg ${currentPage === totalPages ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 text-white"}`} 
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} 
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}

      <div className="mt-7 w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedWarehouses && paginatedWarehouses.length > 0 ? (
          paginatedWarehouses.map((warehouse) => (
            <WarehouseCard key={warehouse.id} warehouse={warehouse} fetchWarehouses={fetchWarehouses} />
          ))
        ) : (
          <p>No warehouses available.</p>
        )}
      </div>
    </section>
  );
};

export default WarehouseManagementPage;
