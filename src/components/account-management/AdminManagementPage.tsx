import { toast } from "@/hooks/use-toast";
import { UserAdminDetail } from "@/types/models/userAdminDetail";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AdminCard } from "./AdminCard";

const admin_url = `${process.env.NEXT_PUBLIC_BACKEND_URL}${process.env.NEXT_PUBLIC_ADMIN}`;

const AdminManagementPage = () => {
  const { data: session, status } = useSession();
  const [admins, setAdmins] = useState<UserAdminDetail[] | null>(null);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchField, setSearchField] = useState("both");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

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
        toast({ title: "Failed", description: "Failed to fetch user details", duration: 2000 });
      }
    } catch (error) {
      console.error("Error fetching admin warehouses:", error);
      toast({ title: "Error", description: "Error fetching admin warehouses", duration: 2000 });
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

  const paginatedAdmins = useMemo(() => {
    if (filter === "all" && !searchQuery) {
      const startIndex = (currentPage - 1) * itemsPerPage;
      return admins ? admins.slice(startIndex, startIndex + itemsPerPage) : [];
    }
    return filteredAdmins;
  }, [admins, filteredAdmins, filter, searchQuery, currentPage]);

  const totalPages = Math.ceil((filter === "all" && !searchQuery ? admins?.length || 0 : filteredAdmins.length) / itemsPerPage);

  if (status === "loading") {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <section className="w-full rounded-2xl bg-white p-7 min-h-[calc(100vh-178px)]">
      {/* Title and Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold">Warehouse Admins</h2>
          <Link href="/admin/account-management/create" className="bg-blue-500 text-white px-4 py-2 rounded-lg">
            Create new
          </Link>
        </div>
        <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 w-full md:w-auto">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setFilter("all");
              setCurrentPage(1);
            }}
            className="border p-2 rounded w-full md:w-auto"
          />
          <select value={searchField} onChange={(e) => setSearchField(e.target.value)} className="border p-2 rounded w-full md:w-auto">
            <option value="both">Name or Email</option>
            <option value="fullname">Name</option>
            <option value="email">Email</option>
          </select>
        </div>
        <div className="flex gap-2 justify-center md:justify-end">
          {['all', 'assigned', 'not_assigned'].map((f) => (
            <label key={f} className="flex items-center gap-1">
              <input type="radio" value={f} checked={filter === f} onChange={() => { setFilter(f); setSearchQuery(""); setCurrentPage(1); }} />
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </label>
          ))}
        </div>
      </div>


        {/* Pagination */}
      {filter === "all" && !searchQuery && totalPages > 1 && (
        <div className="flex justify-center mt-5">
          <button disabled={currentPage === 1} onClick={() => setCurrentPage((prev) => prev - 1)} className="px-3 py-1 mx-1 border rounded disabled:opacity-50">
            Prev
          </button>
          <span className="px-3 py-1 mx-1">Page {currentPage} of {totalPages}</span>
          <button disabled={currentPage === totalPages} onClick={() => setCurrentPage((prev) => prev + 1)} className="px-3 py-1 mx-1 border rounded disabled:opacity-50">
            Next
          </button>
        </div>
      )}

      {/* Content */}
      <div className="mt-7 w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedAdmins.length > 0 ? paginatedAdmins.map((admin) => (
          <AdminCard key={admin.id} admin={admin} refresh={fetchAdminWarehouse} session={session} />
        )) : (
          <p>No warehouse admins available.</p>
        )}
      </div>

      
    </section>
  );
};

export default AdminManagementPage;
