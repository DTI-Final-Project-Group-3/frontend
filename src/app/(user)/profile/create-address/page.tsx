"use client";

import { Icon } from 'leaflet';
import "leaflet/dist/leaflet.css";
import { useSession } from "next-auth/react";
import Link from 'next/link';
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";

const user_address_url = `${process.env.NEXT_PUBLIC_BACKEND_URL}${process.env.NEXT_PUBLIC_USER_ADDRESS}`;

export default function CreateAddress() {
    const { data: session, status } = useSession();
    const router = useRouter();
    
    const [name, setName] = useState("");
    const [detailAddress, setDetailAddress] = useState("");
    const [position, setPosition] = useState(null);
    
    useEffect(() => {
        if (status === "unauthenticated") {
            alert("You are not logged in.");
            router.push("/login");
        }
        
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    setPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude });
                },
                () => {
                    setPosition({ lat: 1.0, lng: -1.0 }); // Fallback location
                }
            );
        }
    }, [status, router]);
    
    function LocationMarker() {
        useMapEvents({
            click(e) {
                setPosition(e.latlng);
            },
        });
        return position === null ? null : <Marker position={position} 
            icon={new Icon({iconUrl: '/icons/marker-icon.png', iconSize: [25, 41], iconAnchor: [12, 41]})} />;
    }
    
    const handleSubmit = async () => {
        const response = await fetch(user_address_url, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                'Authorization': `Bearer ${session.accessToken}`
             },
            body: JSON.stringify({
                name,
                detailAddress,
                latitude: position.lat,
                longitude: position.lng,
            }),
        });
        
        if (response.ok) {
            router.push("/profile");
        } else {
            alert("Failed to create address. Please try again.");
        }
    };
    
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <h1 className="text-xl font-bold mb-4">Create a New Address</h1>
                <Link href="/profile">
                    <button className='w-full bg-gray-700 text-white p-2 rounded mb-4 hover:bg-gray-800'>
                        Back to Profile
                    </button>
                </Link>
                
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2 border rounded mb-2"
                />
                <input
                    type="text"
                    placeholder="Detail Address"
                    value={detailAddress}
                    onChange={(e) => setDetailAddress(e.target.value)}
                    className="w-full p-2 border rounded mb-4"
                />
                
                <div className="w-full h-64 mb-4">
                    {position && (
                        <MapContainer center={[position.lat, position.lng]} zoom={15} className="w-full h-full rounded-lg">
                            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                            <LocationMarker />
                        </MapContainer>
                    )}
                </div>
                
                <button
                    onClick={handleSubmit}
                    className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                >
                    Create Address
                </button>
            </div>
        </div>
    );
}
