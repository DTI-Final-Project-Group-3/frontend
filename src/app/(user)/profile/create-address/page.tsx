"use client";

import MapSelector from "@/components/location/MapSelector";
import { toast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const user_address_url = `${process.env.NEXT_PUBLIC_BACKEND_URL}${process.env.NEXT_PUBLIC_USER_ADDRESS}`;

export default function CreateAddress() {
    const { data: session, status } = useSession();
    const [name, setName] = useState("");
    const [detailAddress, setDetailAddress] = useState("");
    const [position, setPosition] = useState<{ lat: number; lng: number } | null>(null);
    
    const router = useRouter();
    const searchParams = useSearchParams();
    const origin = searchParams.get("origin") || "/profile/address";

    useEffect(() => {
        if (status === "unauthenticated") {
            alert("You are not logged in.");
            router.push(origin);
        }
    }, [status, router, origin]);

    const handleSubmit = async () => {
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

        const response = await fetch(user_address_url, {
            method: "POST",
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
            toast({ title: "Success", description: "Create address success", duration: 2000 });
            router.push(origin);
        } else {
            alert("Failed to create address. Please try again.");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="flex flex-col items-center justify-center bg-white p-6 rounded-lg shadow-lg w-full ">
                <h1 className="text-xl font-bold mb-4 ">Create a New Address</h1>
                <button className='w-full bg-gray-700 text-white p-2 rounded mb-4 hover:bg-gray-800 max-w-md' onClick={() => router.push(origin)}>
                    Return
                </button>
                <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-2 border rounded mb-2" />
                <input type="text" placeholder="Detail Address" value={detailAddress} onChange={(e) => setDetailAddress(e.target.value)} className="w-full p-2 border rounded mb-4" />
            </div>

            <button onClick={handleSubmit} className="w-full bg-blue-500 text-white p-2 rounded mt-4 hover:bg-blue-600">
                Create Address
            </button>

            <div className="bg-white p-6 rounded-lg shadow-lg w-full md:h-[600px] mt-4">
                <MapSelector onSelectLocation={setPosition} setDetailAddress={setDetailAddress}/>
            </div>
        </div>
    );
}
