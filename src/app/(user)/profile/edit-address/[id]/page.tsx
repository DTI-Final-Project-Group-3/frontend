"use client";

import MapSelector from "@/components/location/MapSelector";
import { toast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const user_address_id_url = `${process.env.NEXT_PUBLIC_BACKEND_URL}${process.env.NEXT_PUBLIC_USER_ADDRESS_ID}`;

export default function EditAddress() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const { id } = useParams();
    
    const [name, setName] = useState("");
    const [detailAddress, setDetailAddress] = useState("");
    const [position, setPosition] = useState<{ lat: number; lng: number } | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === "unauthenticated") {
            alert("You are not logged in.");
            router.push("/profile/address");
        }
    }, [status, router]);

    useEffect(() => {
        const fetchAddress = async () => {
            if (!session) return;
            try {
                const res = await fetch(`${user_address_id_url}/${id}`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${session.accessToken}`
                    }
                });
                if (!res.ok) throw new Error("Failed to fetch address");
                const data = await res.json();
                setName(data.data.name);
                setDetailAddress(data.data.detailAddress);
                setPosition({ lat: data.data.latitude, lng: data.data.longitude });
            } catch (error) {
                console.log("Error fetching address. " + error);
                alert("Error fetching address.");
                router.push("/profile/address");
            } finally {
                setLoading(false);
            }
        };

        fetchAddress();
    }, [id, session, router]);

    const handleUpdate = async () => {
        if (!session) {
            alert("Session is not available");
            return;
        }
        if (!position) {
            alert("Please select a location on the map.");
            return;
        }
        if (!name.trim()) {
            alert("Name cannot be empty.");
            return;
        }

        const response = await fetch(`${user_address_id_url}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${session.accessToken}`
            },
            body: JSON.stringify({
                name,
                detailAddress,
                latitude: position.lat,
                longitude: position.lng,
            }),
        });

        if (response.ok) {
            toast({ title: "Success", description: "Address updated successfully", duration: 2000 });
            router.push("/profile/address");
        } else {
            alert("Failed to update address. Please try again.");
        }
    };

    if (loading) {
        return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="flex flex-col items-center justify-center bg-white p-6 rounded-lg shadow-lg w-full">
                <h1 className="text-xl font-bold mb-4">Edit Address</h1>
                <button className='w-full bg-gray-700 text-white p-2 rounded mb-4 hover:bg-gray-800 max-w-md' onClick={() => router.push("/profile/address")}>Return</button>
                <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-2 border rounded mb-2" />
                <input type="text" placeholder="Detail Address" value={detailAddress} onChange={(e) => setDetailAddress(e.target.value)} className="w-full p-2 border rounded mb-4" />
            </div>

            <button onClick={handleUpdate} className="w-full bg-blue-500 text-white p-2 rounded mt-4 hover:bg-blue-600">Update Address</button>

            <div className="bg-white p-6 rounded-lg shadow-lg w-full md:h-[600px] mt-4">
                <MapSelector onSelectLocation={setPosition} setDetailAddress={setDetailAddress} initialPosition={position} />
            </div>
        </div>
    );
}
