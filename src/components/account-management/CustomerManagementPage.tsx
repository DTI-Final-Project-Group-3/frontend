import { toast } from "@/hooks/use-toast";
import { UserDetail } from "@/types/models/userDetail";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { CustomerCard } from "./CustomerCard";

const admin_url = `${process.env.NEXT_PUBLIC_BACKEND_URL}${process.env.NEXT_PUBLIC_ADMIN}/verified-customers`;

const CustomerManagementPage = () => {
    const { data: session, status } = useSession();
    const [customers, setCustomers] = useState<UserDetail[] | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12;

    const fetchCustomer = useCallback(async () => {
        if (!session) return;
        try {
          const res = await fetch(admin_url, {
            headers: { Authorization: `Bearer ${session.accessToken}` },
          });
          const data = await res.json();
          if (data.success) {
            setCustomers(data.data);
          } else {
            toast({ title: "Failed", description: "Failed to fetch user details", duration: 2000 });
          }
        } catch (error) {
          console.error("Error fetching customers:", error);
          toast({ title: "Error", description: "Error fetching customers", duration: 2000 });
        }
    }, [session]);

    useEffect(() => {
        if (status === "authenticated") {
          fetchCustomer();
        }
    }, [status, session, fetchCustomer]);

    const totalPages = customers ? Math.ceil(customers.length / itemsPerPage) : 1;
    const paginatedCustomers = customers?.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <section className="w-full rounded-2xl bg-white p-7 min-h-[calc(100vh-178px)]">
            {customers && customers.length > itemsPerPage && (
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
            {customers && (
                <div className="mt-7 w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {paginatedCustomers && paginatedCustomers.length > 0 ? (
                      paginatedCustomers.map((customer) => (
                        <CustomerCard key={customer.id} customer={customer} />
                      ))
                    ) : (
                      <p>No customers available.</p>
                    )}
                </div>
            )}
        </section>
    );
}

export default CustomerManagementPage;
