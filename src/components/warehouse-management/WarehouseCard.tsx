import { toast } from "@/hooks/use-toast";
import { UserAdminDetail } from "@/types/models/userAdminDetail";
import { WarehouseAssignedDetail } from "@/types/models/warehouseAssigned";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const admin_not_assigned = `${process.env.NEXT_PUBLIC_BACKEND_URL}${process.env.NEXT_PUBLIC_ADMIN_NOT_ASSIGNED}`;
const admin_assigned = `${process.env.NEXT_PUBLIC_BACKEND_URL}${process.env.NEXT_PUBLIC_ADMIN_ASSIGNED}`;
const admin_assign = `${process.env.NEXT_PUBLIC_BACKEND_URL}${process.env.NEXT_PUBLIC_ADMIN_ASSIGN_WAREHOUSE}`;

export const WarehouseCard = ({
    warehouse,
    fetchWarehouses,
  }: {
    warehouse: WarehouseAssignedDetail;
    fetchWarehouses: () => void;
  }) => {
    const { data: session } = useSession();
    const [showModal, setShowModal] = useState(false);
    const [admins, setAdmins] = useState<UserAdminDetail[] | null>(null);
    const [selectedAdmin, setSelectedAdmin] = useState<number | null>(null);
    const [isRemoveAdmin, setIsRemoveAdmin] = useState(false);
    const router = useRouter();
  
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
          toast({title: "Failed", description: "Failed to fetch unassigned admins", duration: 2000,});
        }
      } catch (error) {
        console.error("Error fetching unassigned admins:", error);
        toast({title: "Error", description: "Error fetching unassigned admins", duration: 2000,});
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
          toast({title: "Failed", description: "Failed to fetch assigned admins", duration: 2000,});
        }
      } catch (error) {
        console.error("Error fetching assigned admins:", error);
        toast({title: "Error", description: "Error fetching assigned admins", duration: 2000,});
      }
    };
  
    const assignAdmin = async () => {
      if (!selectedAdmin) {
        toast({title: "Failed", description: "Please select an admin", duration: 2000,});
        return; 
      }
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
          toast({title: "Success", description: "Admin assigned successfully", duration: 2000,});
          setShowModal(false);
          fetchWarehouses(); // Refresh warehouse data
        } else {
          toast({title: "Failed", description: "Failed to assign admin", duration: 2000,});
        }
      } catch (error) {
        console.error("Error assigning admin:", error);
        toast({title: "Error", description: "Error assigning admin", duration: 2000,});
      }
    };
  
    const removeAdmin = async () => {
      if (!selectedAdmin){
         toast({title: "Failed", description: "Please select an admin", duration: 2000,});
         return;
      }
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
          toast({title: "Success", description: "Admin removed successfully", duration: 2000,});
          setShowModal(false);
          fetchWarehouses(); // Refresh warehouse data
        } else {
          toast({title: "Failed", description: "Failed to remove admin", duration: 2000,});
        }
      } catch (error) {
        console.error("Error removing admin:", error);
        toast({title: "Error", description: "Error removing admin", duration: 2000,});
      }
    };
  
    return (
      <div className="bg-gray-100 p-5 rounded-xl shadow-md flex flex-col">
        <h3 className="text-lg font-semibold">{warehouse.name}</h3>
        <p className="text-sm text-gray-600">{warehouse.description}</p>
        <p className="text-sm font-medium mt-2">
          Address: {warehouse.detailAddress}
        </p>
        <p className="text-sm font-medium mt-2">
          Longitude: {warehouse.longitude}
        </p>
        <p className="text-sm font-medium mt-2">Latitude: {warehouse.latitude}</p>
        <p className="text-sm font-medium mt-2">
          Assigned Admins: {warehouse.assignedAdmins.length}
        </p>

        <button
          onClick={() => router.push(`/admin/warehouse-management/${warehouse.id}`)}
          className="mt-4 bg-gray-400 text-white py-2 px-4 rounded-lg hover:bg-gray-500"
        >
          Warehouse Detail
        </button>
  
        <button
          onClick={fetchUnassignedAdmins}
          className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
        >
          Assign Admin
        </button>

        <button
          onClick={fetchAssignedAdmins}
          className="mt-4 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600"
        >
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
                      selectedAdmin === admin.id
                        ? "bg-blue-300"
                        : "hover:bg-gray-200"
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