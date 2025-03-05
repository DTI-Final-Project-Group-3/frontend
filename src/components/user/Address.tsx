import { toast } from "@/hooks/use-toast";
import { UserAddress } from "@/types/models/users";
import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

const user_address_url = `${process.env.NEXT_PUBLIC_BACKEND_URL}${process.env.NEXT_PUBLIC_USER_ADDRESS}`;
const user_address_id_url = `${process.env.NEXT_PUBLIC_BACKEND_URL}${process.env.NEXT_PUBLIC_USER_ADDRESS_ID}`;

interface AddressComponentProps {
  id : number,
  name : string,
  detailAddress : string,
  latitude : number,
  longitude : number,
  primary? : boolean,
  refresh :  () => void,
  session : Session | null
  }

function AddressComponent({
  id,
  name,
  detailAddress,
  latitude,
  longitude,
  primary,
  refresh,
  session,
} : AddressComponentProps) {
  const handleDelete = async () => {
    if (session)
      try {
        const res = await fetch(`${user_address_id_url}/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
        });
        if (res.ok) {
            toast({title: "Success", description: "Success deleting address", duration: 2000,});
            refresh();
        } else {
          toast({title: "Failed", description: "Failed to delete address", duration: 2000,});
        }
      } catch (err) {
        console.error("Error deleting address:", err);
        toast({title: "Error", description: "Error deleting address", duration: 2000,});
      }
  };

  const handleSetAsPrimary = async () => {
    if (session)
        try {
          const res = await fetch(`${user_address_id_url}/${id}`, {
                method: "PUT",
                headers: { 
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${session.accessToken}`
                 },
                body: JSON.stringify({
                    isPrimary : true
                }),
            });

          if (res.ok) {
              toast({title: "Success", description: "Success set as primary", duration: 2000,});
              refresh();
          } else {
            toast({title: "Failed", description: "Failed to set as primary", duration: 2000,});
          }
        } catch (err) {
          console.error("Error set as primary:", err);
          toast({title: "Error", description: "Error set as primary", duration: 2000,});
        }
  }

  

  
  return (
    <div
      key={id}
      className={`p-4 border rounded-lg shadow ${primary ? "border-green-500" : "border-gray-300"}`}
    >
      <h3 className="text-lg font-bold">{name}</h3>
      <p className="text-gray-600">{detailAddress}</p>
      <p className="text-sm text-gray-500">
        Latitude: {latitude} <br></br> Longitude: {longitude}
      </p>
      <div className="flex flex-col  md:flex-row  justify-between items-center w-full mt-4 flex">
        {primary && (
          <span className="text-green-500 font-bold">Main address</span>
        )}
        {
          !primary && (
            <button
                onClick={handleSetAsPrimary}
                className="m-2 bg-gray-500 text-white p-2 rounded"
                 >
                 Set as primary
            </button>
          )
        }
        <div className="flex">
            <button
              onClick={handleDelete}
              className="m-2 bg-blue-500 text-white p-2 rounded w-16">
              Edit
            </button>

            <button
              onClick={handleDelete}
              className="m-2 bg-red-500 text-white p-2 rounded w-16">
              Delete
            </button>
        </div>
      </div>
    </div>
  );
}

export default function Address() {
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
          tempAddresses.sort((a, b) => Number(b.primary) - Number(a.primary));
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
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8">
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
