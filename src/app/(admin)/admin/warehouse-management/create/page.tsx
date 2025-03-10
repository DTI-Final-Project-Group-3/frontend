"use client";

import MapSelector from "@/components/location/MapSelector";
import { toast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const warehouse_url = `${process.env.NEXT_PUBLIC_BACKEND_URL}${process.env.NEXT_PUBLIC_WAREHOUSES}`;

export default function CreateAddress() {
    const { data: session, status } = useSession();
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [detailAddress, setDetailAddress] = useState("");
    const [position, setPosition] = useState<{ lat: number; lng: number } | null>(null);
    
    const router = useRouter();
    const searchParams = useSearchParams();
    const origin = searchParams.get("origin") || "/admin/warehouse-management";

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        }
    }, [status, router, origin]);

    const handleSubmit = async () => {
        if (!session) {
            return;
        }
        if (!position) {
            toast({title: "Failed", description: "Please select a location on the map.", duration: 2000,});
            return;
        }
        if (!name.trim()) {
            toast({title: "Failed", description: "Name cannot be empty.", duration: 2000,});
            return;
        }

        const response = await fetch(warehouse_url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${session.accessToken}`
            },
            body: JSON.stringify({
                name,
                description,
                detailAddress,
                latitude: position.lat,
                longitude: position.lng,
            }),
        });

        if (response.ok) {
            toast({ title: "Success", description: "Create warehouse success", duration: 2000 });
            router.push(origin);
        } else {
            const data = await response.json();
            console.log(data);
            toast({title: "Failed", description: "Failed to create warehouse. Please try again.", duration: 2000,});
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="flex flex-col items-center justify-center bg-white p-6 rounded-lg shadow-lg w-full ">
                <h1 className="text-xl font-bold mb-4 ">Create a New Warehouse</h1>
                <button className='w-full bg-gray-700 text-white p-2 rounded mb-4 hover:bg-gray-800 max-w-md' onClick={() => router.push(origin)}>
                    Return
                </button>
                <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-2 border rounded mb-2" />
                <input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-2 border rounded mb-2" />
                <input type="text" placeholder="Detail Address" value={detailAddress} onChange={(e) => setDetailAddress(e.target.value)} className="w-full p-2 border rounded mb-4" />
            </div>

            <button onClick={handleSubmit} className="w-full bg-blue-500 text-white p-2 rounded mt-4 hover:bg-blue-600">
                Create Warehouse
            </button>

            <div className="bg-white p-6 rounded-lg shadow-lg w-full md:h-[600px] mt-4">
                <MapSelector onSelectLocation={setPosition} setDetailAddress={setDetailAddress}/>
            </div>
        </div>
    );
}
