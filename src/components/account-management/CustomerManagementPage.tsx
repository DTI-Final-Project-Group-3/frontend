import { toast } from "@/hooks/use-toast";
import { UserDetail } from "@/types/models/userDetail";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { CustomerCard } from "./CustomerCard";

const admin_url = `${process.env.NEXT_PUBLIC_BACKEND_URL}${process.env.NEXT_PUBLIC_ADMIN}/verified-customers`;

const CustomerManagementPage = () => {
    const { data: session, status } = useSession();
    const [customers, setCustomers] = useState<UserDetail[] | null>(null);
    
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
          fetchCustomer();
        }
      }, [status, session, fetchCustomer]);

    return (
        <section className="w-full rounded-2xl bg-white p-7 min-h-[calc(100vh-178px)]">
            {customers &&
                <div className="mt-7 w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {customers.length > 0 ? (
                      customers.map((customer) => (
                        <CustomerCard key={customer.id} customer={customer} />
                      ))
                    ) : (
                      <p>No warehouse admins available.</p>
                    )}
                </div>
            }
        </section>
    );
}

export default CustomerManagementPage;