import { UserAddress } from "@/types/models/users";
import { Link } from "lucide-react";
import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

const user_address_url = `${process.env.NEXT_PUBLIC_BACKEND_URL}${process.env.NEXT_PUBLIC_USER_ADDRESS}`;
const user_address_id_url = `${process.env.NEXT_PUBLIC_BACKEND_URL}${process.env.NEXT_PUBLIC_USER_ADDRESS_ID}`;

interface AddressComponentProps {
  id : number,
  name : string,
  detailAddress : string,
  latitude : number,
  longitude : number,
  primary? : boolean,
  onDelete :  () => void,
  session : Session | null
  }

function AddressComponent({
  id,
  name,
  detailAddress,
  latitude,
  longitude,
  primary,
  onDelete,
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
          onDelete();
        } else {
          alert("Failed to delete address");
        }
      } catch (err) {
        console.error("Error deleting address:", err);
        alert("Error deleting address");
      }
  };

  return (
    <div
      key={id}
      className={`p-4 border rounded-lg shadow ${primary ? "border-green-500" : "border-gray-300"}`}
    >
      <h3 className="text-lg font-bold">{name}</h3>
      <p className="text-gray-600">{detailAddress}</p>
      <p className="text-sm text-gray-500">
        Latitude: {latitude}, Longitude: {longitude}
      </p>
      <div className="flex justify-between items-center w-full mt-4">
        {primary && (
          <span className="text-green-500 font-bold">Main address</span>
        )}
        <button
          onClick={handleDelete}
          className="mt-2 bg-red-500 text-white p-2 rounded"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default function Address() {
  const { data: session } = useSession();
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAddresses = async () => {
    if (session) {
      try {
        const res = await fetch(user_address_url, {
          headers: { Authorization: `Bearer ${session.accessToken}` },
        });
        const data = await res.json();
        if (data.success) {
          setAddresses(data.data);
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
  };

  useEffect(() => {
    fetchAddresses();
  }, [session]);

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
          <div className="bg-black text-white px-4 py-2 text-center cursor-pointer rounded-lg">
            Create A New Address
          </div>
        </Link>
      </div>
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8">
        {addresses.map((address) => (
          <AddressComponent
            key={address.id}
            {...address}
            onDelete={fetchAddresses}
            session={session}
          />
        ))}
      </div>
    </div>
  );
}