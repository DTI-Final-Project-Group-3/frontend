"use client";

import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";
import { useCallback, useEffect } from "react";
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";

interface Position {
    lat: number;
    lng: number;
}

interface MapSelectorDynamicProps {
    initialPosition?: Position | null;
    position: Position | null;
    setPosition: (pos: Position) => void;
    address: string;
    setAddress: (addr: string) => void;
    setCopiedAddress: (addr: string) => void; // New prop to handle copied address
}

export default function MapSelectorDynamic({ initialPosition, position, setPosition, address, setAddress, setCopiedAddress }: MapSelectorDynamicProps) {

    const fetchAddress = useCallback (async (position: Position) => {
        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.lat}&lon=${position.lng}`)
            .then((res) => res.json())
            .then((data) => {
                if (data.display_name) {
                    setAddress(data.display_name);
                }
            })
            .catch(() => setAddress("Address not found"));
    },[setAddress])

    useEffect(() => {
        if (initialPosition) {
            setPosition(initialPosition);
            fetchAddress(initialPosition);
        } else if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const userPosition = { lat: pos.coords.latitude, lng: pos.coords.longitude };
                    setPosition(userPosition);
                    fetchAddress(userPosition);
                },
                () => {
                    const fallbackPosition = { lat: 1.0, lng: -1.0 };
                    setPosition(fallbackPosition);
                    fetchAddress(fallbackPosition);
                }
            );
        }
    }, [initialPosition, fetchAddress, setPosition]);


    function LocationMarker() {
        useMapEvents({
            click(e) {
                setPosition(e.latlng);
                fetchAddress(e.latlng);
            },
        });

        return position ? (
            <Marker
                position={position}
                icon={new Icon({ iconUrl: "/icons/marker-icon.png", iconSize: [25, 41], iconAnchor: [12, 41] })}
            />
        ) : null;
    }

    return (
        <div className="w-full">
            <input 
                type="text" 
                value={address} 
                readOnly 
                className="w-full p-2 border rounded mb-2" 
                placeholder="Selected address will appear here" 
            />
            <button 
                onClick={() => setCopiedAddress(address)} 
                className="w-full bg-gray-500 text-white p-2 rounded mb-2 hover:bg-gray-600"
            >
                Copy Address Detail
            </button>
            <div className="w-full h-64 md:h-[400px]">
                {position && (
                    <MapContainer center={[position.lat, position.lng]} zoom={15} className="w-full h-full rounded-lg">
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        <LocationMarker />
                    </MapContainer>
                )}
            </div>
        </div>
    );
}
