"use client"
import { AdminCard } from "@/components/account-management/AdminCard";
import { toast } from "@/hooks/use-toast";
import { UserAdminDetail } from "@/types/models/userAdminDetail";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

const admin_url = `${process.env.NEXT_PUBLIC_BACKEND_URL}${process.env.NEXT_PUBLIC_ADMIN}`;

const AccountManagementPage = () => {
  const { data: session, status } = useSession();
  const [admins, setAdmins] = useState<UserAdminDetail[] | null>(null);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchField, setSearchField] = useState("both");

  const fetchAdminWarehouse = useCallback(async () => {
    if (!session) return;
    try {
      const res = await fetch(admin_url, {
        headers: { Authorization: `Bearer ${session.accessToken}` },
      });
      const data = await res.json();
      if (data.success) {
        setAdmins(data.data);
      } else {
        toast({
          title: "Failed",
          description: "Failed to fetch user details",
          duration: 2000,
        });
      }
    } catch (error) {
      console.error("Error fetching admin warehouses:", error);
      toast({
        title: "Error",
        description: "Error fetching admin warehouses",
        duration: 2000,
      });
    }
  }, [session]);

  useEffect(() => {
    if (status === "authenticated") {
      fetchAdminWarehouse();
    }
  }, [status, session, fetchAdminWarehouse]);

  const filteredAdmins = useMemo(() => {
    if (!admins) return [];

    let result = admins;
    if (searchQuery) {
      result = result.filter((admin) => {
        if (searchField === "email") {
          return admin.email.toLowerCase().includes(searchQuery.toLowerCase());
        } else if (searchField === "fullname") {
          return admin.fullname?.toLowerCase().includes(searchQuery.toLowerCase());
        } else {
          return (
            admin.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            admin.fullname?.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }
      });
    }

    if (!searchQuery) {
      if (filter === "assigned") {
        result = result.filter((admin) => admin.warehouseId > 0);
      } else if (filter === "not_assigned") {
        result = result.filter((admin) => admin.warehouseId <= 0);
      }
    }

    return result;
  }, [admins, filter, searchQuery, searchField]);

  if (status === "loading") {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <section className="w-full rounded-2xl bg-white p-7 min-h-[calc(100vh-178px)]">
      {/* Title and Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-xl font-semibold">Warehouse Admins</h2>
        <div className="flex gap-3 items-center">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setFilter("all");
            }}
            className="border p-2 rounded"
          />
          <select
            value={searchField}
            onChange={(e) => setSearchField(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="both">Name or Email</option>
            <option value="fullname">Name</option>
            <option value="email">Email</option>
          </select>
          <div className="flex gap-2">
            <label>
              <input
                type="radio"
                value="all"
                checked={filter === "all"}
                onChange={() => {
                  setFilter("all");
                  setSearchQuery("");
                }}
              />
              All
            </label>
            <label>
              <input
                type="radio"
                value="assigned"
                checked={filter === "assigned"}
                onChange={() => {
                  setFilter("assigned");
                  setSearchQuery("");
                }}
              />
              Assigned
            </label>
            <label>
              <input
                type="radio"
                value="not_assigned"
                checked={filter === "not_assigned"}
                onChange={() => {
                  setFilter("not_assigned");
                  setSearchQuery("");
                }}
              />
              Not Assigned
            </label>
          </div>
        </div>
        <Link href="/admin/account-management/create" className="bg-blue-500 text-white px-4 py-2 rounded-lg">
          Create a new Warehouse Admin
        </Link>
      </div>

      {/* Content */}
      <div className="mt-7 w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAdmins.length > 0 ? (
          filteredAdmins.map((admin) => (
            <AdminCard key={admin.id} admin={admin} refresh={fetchAdminWarehouse} session={session} />
          ))
        ) : (
          <p>No warehouse admins available.</p>
        )}
      </div>
    </section>
  );
};

export default AccountManagementPage;
