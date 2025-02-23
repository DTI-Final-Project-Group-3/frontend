"use client"
import { UserAdminDetail } from "@/types/models/userAdminDetail";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";

const admin_url = `${process.env.NEXT_PUBLIC_BACKEND_URL}${process.env.NEXT_PUBLIC_ADMIN}`;
const placeholderImage = "https://dummyimage.com/150x150/cccccc/ffffff&text=No+Image";

const AccountManagementPage = () => {
  const { data: session, status } = useSession();
  const [admins, setAdmins] = useState<UserAdminDetail[] | null>(null);

  useEffect(() => {
    if (status === "authenticated") {
      const fetchAdminWarehouse = async () => {
        try {
          const res = await fetch(admin_url, {
            headers: { Authorization: `Bearer ${session.accessToken}` },
          });
          const data = await res.json();
          if (data.success) {
            setAdmins(data.data);
          } else {
            alert("Failed to fetch user details");
          }
        } catch (error) {
          console.error("Error fetching admin warehouses:", error);
          alert("Error fetching admin warehouses");
        }
      };
      fetchAdminWarehouse();
    }
  }, [status, session]);

  if (status === "loading") {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <section className="w-full rounded-2xl bg-white p-7 min-h-[calc(100vh-178px)]">
      {/* Title and Button */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-xl font-semibold">Warehouse Admins</h2>
        <Link href="/admin/account-management/create" className="bg-blue-500 text-white px-4 py-2 rounded-lg">Create a new Warehouse Admin</Link>
      </div>
      
      {/* Content */}
      <div className="mt-7 w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {admins && admins.length > 0 ? (
          admins.map((admin) => <AdminCard key={admin.id} admin={admin} />)
        ) : (
          <p>No warehouse admins available.</p>
        )}
      </div>
    </section>
  );
};

const AdminCard = ({ admin }: { admin: UserAdminDetail }) => {
  return (
    <div className="bg-gray-100 p-5 rounded-xl shadow-md flex flex-col items-center">
      <img
        src={admin.profileImageUrl?.trim() ? admin.profileImageUrl : placeholderImage}
        alt={`${admin.fullname}'s profile`}
        className="w-24 h-24 rounded-full object-cover mb-3"
      />
      <h3 className="text-lg font-semibold">{admin.fullname}</h3>
      <p className="text-sm text-gray-600">{admin.email}</p>
      <p className="text-sm font-medium mt-2">Admin ID: {admin.id}</p>
      <p className="text-sm font-medium mt-2">Warehouse ID: {admin.warehouseId}</p>
      <p className="text-sm font-medium mt-2">Assigner ID: {admin.userAssignerId}</p>
    </div>
  );
};

export default AccountManagementPage;