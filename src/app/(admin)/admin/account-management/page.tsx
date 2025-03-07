"use client"
import { AdminCard } from "@/components/account-management/AdminCard";
import { toast } from "@/hooks/use-toast";
import { UserAdminDetail } from "@/types/models/userAdminDetail";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

const admin_url = `${process.env.NEXT_PUBLIC_BACKEND_URL}${process.env.NEXT_PUBLIC_ADMIN}`;

const AccountManagementPage = () => {
  const { data: session, status } = useSession();
  const [admins, setAdmins] = useState<UserAdminDetail[] | null>(null);

  const fetchAdminWarehouse = useCallback (async () => {
    if (!session)
      return;
    try {
      const res = await fetch(admin_url, {
        headers: { Authorization: `Bearer ${session.accessToken}` },
      });
      const data = await res.json();
      if (data.success) {
        setAdmins(data.data);
      } else {
        toast({title: "Failed", description: "Failed to fetch user details", duration: 2000,});
      }
    } catch (error) {
      console.error("Error fetching admin warehouses:", error);
      toast({title: "Error", description: "Error fetching admin warehouses", duration: 2000,});
    }
  }, [session]);

  useEffect(() => {
    if (status === "authenticated") {
      fetchAdminWarehouse();
    }
  }, [status, session, fetchAdminWarehouse]);

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
          admins.map((admin) => <AdminCard key={admin.id} admin={admin} refresh={fetchAdminWarehouse} session={session}/>)
        ) : (
          <p>No warehouse admins available.</p>
        )}
      </div>
    </section>
  );
};



export default AccountManagementPage;