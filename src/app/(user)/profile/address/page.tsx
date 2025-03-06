"use client";

import AddressComponent from "@/components/user/Address";
import { UserAddress } from "@/types/models/users";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

const user_address_url = `${process.env.NEXT_PUBLIC_BACKEND_URL}${process.env.NEXT_PUBLIC_USER_ADDRESS}`;

export default function AddressPage() {
  const { data: session } = useSession();
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAddresses = useCallback(async () => {
    if (session) {
      try {
        const res = await fetch(user_address_url, {
          headers: { Authorization: `Bearer ${session.accessToken}` },
        });
        const data = await res.json();
        if (data.success) {
          const tempAddresses = data.data as UserAddress[];
          setAddresses(tempAddresses);
        } else {
          setError("Failed to fetch addresses");
        }
      } catch (err) {
        console.error("Error fetching addresses:", err);
        setError("Error fetching addresses");
      } finally {
        setLoading(false);
      }
    }
  }, [session]);

  useEffect(() => {
    fetchAddresses();
  }, [session, fetchAddresses]);

  if (loading)
    return (
      <div className="w-full h-full flex items-center justify-center">
        Loading addresses...
      </div>
    );
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="space-y-4 flex flex-col gap-6">
      <div className="w-full flex gap-4 flex-col md:flex-row md:justify-between md:items-center">
        <h2 className="text-2xl font-semibold">My Address</h2>
        <Link href="/profile/create-address">
          <div className="bg-blue-600 text-white px-4 py-2 text-center cursor-pointer rounded-lg">
            Create A New Address
          </div>
        </Link>
      </div>
      <div className="w-full space-y-4">
        {addresses.map((address) => (
          <AddressComponent
            key={address.id}
            {...address}
            refresh={fetchAddresses}
            session={session}
          />
        ))}
      </div>
    </div>
  );
}
