"use client";

import { UserAdminDetail } from "@/types/models/userAdminDetail";
import { WarehouseAssignedDetail } from "@/types/models/warehouseAssigned";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

const warehouse_all = `${process.env.NEXT_PUBLIC_BACKEND_URL}${process.env.NEXT_PUBLIC_WAREHOUSES}/all-assigned`;
const admin_not_assigned = `${process.env.NEXT_PUBLIC_BACKEND_URL}${process.env.NEXT_PUBLIC_ADMIN_NOT_ASSIGNED}`;
const admin_assigned = `${process.env.NEXT_PUBLIC_BACKEND_URL}${process.env.NEXT_PUBLIC_ADMIN_ASSIGNED}`;
const admin_assign = `${process.env.NEXT_PUBLIC_BACKEND_URL}${process.env.NEXT_PUBLIC_ADMIN_ASSIGN_WAREHOUSE}`; 


const WarehouseManagementPage = () => {
  const { data: session, status } = useSession();
  const [warehouses, setWarehouses] = useState<WarehouseAssignedDetail[] | null>(null);

  const fetchWarehouses = async () => {
    try {
      const res = await fetch(warehouse_all, {
        headers: { Authorization: `Bearer ${session?.accessToken}` },
      });
      const data = await res.json();
      if (data.success) {
        setWarehouses(data.data);
      } else {
        alert("Failed to fetch warehouses");
      }
    } catch (error) {
      console.error("Error fetching warehouses:", error);
      alert("Error fetching warehouses");
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      fetchWarehouses();
    }
  }, [status, session]);

  if (status === "loading") {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <section className="w-full rounded-2xl bg-white p-7 min-h-[calc(100vh-178px)]">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-xl font-semibold">Warehouse Management</h2>
      </div>
      <div className="mt-7 w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {warehouses && warehouses.length > 0 ? (
          warehouses.map((warehouse) => (
            <WarehouseCard key={warehouse.id} warehouse={warehouse} fetchWarehouses={fetchWarehouses} />
          ))
        ) : (
          <p>No warehouses available.</p>
        )}
      </div>
    </section>
  );
};


const WarehouseCard = ({ warehouse, fetchWarehouses }: { warehouse: WarehouseAssignedDetail; fetchWarehouses: () => void }) => {
  const { data: session } = useSession();
  const [showModal, setShowModal] = useState(false);
  const [admins, setAdmins] = useState<UserAdminDetail[] | null>(null);
  const [selectedAdmin, setSelectedAdmin] = useState<number | null>(null);
  const [isRemoveAdmin, setIsRemoveAdmin] = useState(false);

  const fetchUnassignedAdmins = async () => {
    setIsRemoveAdmin(false);
    try {
      const res = await fetch(admin_not_assigned, {
        headers: { Authorization: `Bearer ${session?.accessToken}` },
      });
      const data = await res.json();
      if (data.success) {
        setAdmins(data.data);
        setShowModal(true);
      } else {
        alert("Failed to fetch unassigned admins");
      }
    } catch (error) {
      console.error("Error fetching unassigned admins:", error);
      alert("Error fetching unassigned admins");
    }
  };

  const fetchAssignedAdmins = async () => {
    setIsRemoveAdmin(true);
    try {
      const res = await fetch(admin_assigned + "?warehouseId=" + warehouse.id, {
        headers: { Authorization: `Bearer ${session?.accessToken}` },
      });
      const data = await res.json();
      if (data.success) {
        setAdmins(data.data);
        setShowModal(true);
      } else {
        alert("Failed to fetch assigned admins");
      }
    } catch (error) {
      console.error("Error fetching assigned admins:", error);
      alert("Error fetching assigned admins");
    }
  };

  const assignAdmin = async () => {
    if (!selectedAdmin) return alert("Please select an admin");
    try {
      const res = await fetch(admin_assign, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.accessToken}`,
        },
        body: JSON.stringify({
          userAssigneeId: selectedAdmin,
          warehouseId: warehouse.id,
        }),
      });
      const data = await res.json();
      if (data.success) {
        alert("Admin assigned successfully");
        setShowModal(false);
        fetchWarehouses(); // Refresh warehouse data
      } else {
        alert("Failed to assign admin");
      }
    } catch (error) {
      console.error("Error assigning admin:", error);
      alert("Error assigning admin");
    }
  };

  const removeAdmin = async () => {
    if (!selectedAdmin) return alert("Please select an admin");
    try {
      const res = await fetch(admin_assign, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.accessToken}`,
        },
        body: JSON.stringify({
          userAssigneeId: selectedAdmin,
          warehouseId: warehouse.id,
        }),
      });
      const data = await res.json();
      if (data.success) {
        alert("Admin removed successfully");
        setShowModal(false);
        fetchWarehouses(); // Refresh warehouse data
      } else {
        alert("Failed to remove admin");
      }
    } catch (error) {
      console.error("Error removing admin:", error);
      alert("Error removing admin");
    }
  };

  return (
    <div className="bg-gray-100 p-5 rounded-xl shadow-md flex flex-col">
      <h3 className="text-lg font-semibold">{warehouse.name}</h3>
      <p className="text-sm text-gray-600">{warehouse.description}</p>
      <p className="text-sm font-medium mt-2">Address: {warehouse.detailAddress}</p>
      <p className="text-sm font-medium mt-2">Longitude: {warehouse.longitude}</p>
      <p className="text-sm font-medium mt-2">Latitude: {warehouse.latitude}</p>
      <p className="text-sm font-medium mt-2">Assigned Admins: {warehouse.assignedAdmins.length}</p>

      <button
        onClick={fetchUnassignedAdmins}
        className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600">
        Assign Admin
      </button>
      <button
        onClick={fetchAssignedAdmins}
        className="mt-4 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600">
        Remove Admin
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-5 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-semibold mb-4">Select an Admin</h2>
            <ul className="max-h-40 overflow-y-auto border rounded-md p-2">
              {admins?.map((admin) => (
                <li
                  key={admin.id}
                  className={`cursor-pointer p-2 rounded-md ${
                    selectedAdmin === admin.id ? "bg-blue-300" : "hover:bg-gray-200"
                  }`}
                  onClick={() => setSelectedAdmin(admin.id)}
                >
                  {admin.fullname} ({admin.email})
                </li>
              ))}
            </ul>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-300 py-2 px-4 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={isRemoveAdmin ? removeAdmin : assignAdmin}
                className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


export default WarehouseManagementPage;
