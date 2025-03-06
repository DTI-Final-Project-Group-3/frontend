import { toast } from "@/hooks/use-toast";
import { Session } from "next-auth";
import { useRouter } from "next/navigation";

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

export default function AddressComponent({
  id,
  name,
  detailAddress,
  latitude,
  longitude,
  primary,
  refresh,
  session,
} : AddressComponentProps) {
  const router = useRouter();

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

  
  const handleEdit = async () => {
    router.push("/profile/edit-address/"+id);
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
              onClick={handleEdit}
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
