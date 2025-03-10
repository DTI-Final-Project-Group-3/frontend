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
  const [warehouses, setWarehouses] = useState<
    WarehouseAssignedDetail[] | null
  >(null);

  const fetchWarehouses = useCallback(async () => {
    try {
      const res = await fetch(warehouse_all, {
        headers: { Authorization: `Bearer ${session?.accessToken}` },
      });
      const data = await res.json();
      if (data.success) {
        setWarehouses(data.data);
      } else {
        toast({title: "Failed", description: "Failed to fetch warehouses", duration: 2000,});
      }
    } catch (error) {
      console.error("Error fetching warehouses:", error);
      toast({title: "Error", description: "Error fetching warehouses", duration: 2000,});
    }
  },[session]);

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

  return (
    <section className="w-full rounded-2xl bg-white p-7 min-h-[calc(100vh-178px)]">
      <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold">Warehouse Management</h2>
          <Link href="/admin/warehouse-management/create" className="bg-blue-500 text-white px-4 py-2 rounded-lg">
            Create new
          </Link>
        </div>
      <div className="mt-7 w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {warehouses && warehouses.length > 0 ? (
          warehouses.map((warehouse) => (
            <WarehouseCard
              key={warehouse.id}
              warehouse={warehouse}
              fetchWarehouses={fetchWarehouses}
            />
          ))
        ) : (
          <p>No warehouses available.</p>
        )}
      </div>
    </section>
  );
};

export default WarehouseManagementPage;
