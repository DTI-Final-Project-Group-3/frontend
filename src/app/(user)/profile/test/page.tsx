"use client"
import { UserDetail } from "@/types/models/userDetail";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function ProfileTest() {
    const { data: session, status } = useSession();
    const [userData, setUserData] = useState<UserDetail | undefined>(undefined);

    useEffect(() => {
        if (status === "authenticated") {
            console.log("userDetail = ",session.userDetail)
            setUserData(session.userDetail);
        }
    }, [status, session]);

    if (status === "loading") {
        return <div className="flex items-center justify-center h-screen">Loading...</div>;
    }

    if (!userData) {
        return <div className="flex items-center justify-center h-screen">No user data available.{session?.accessToken}</div>;
    }

    return (
        <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md mt-10">
            <h2 className="text-xl font-bold mb-4 text-center">User Profile</h2>
            <div className="space-y-2">
                {[
                    { label: "Full Name", value: userData.fullname },
                    { label: "Gender", value: userData.gender },
                    { label: "Birthdate", value: userData.birthdate },
                    { label: "Email", value: userData.email },
                    { label: "Phone Number", value: userData.phoneNumber },
                    { label: "Role", value: userData.role },
                    { label: "Email Verified", value: userData.isEmailVerified ? "Yes" : "No" },
                    { label: "Warehouse ID", value: userData.warehouseId },
                    { label: "User Assigner ID ", value: userData.userAssignerId }
                ].map((item, index) => (
                    <div key={index} className="flex justify-between border-b pb-1">
                        <span className="font-medium">{item.label}:</span>
                        <span className="text-gray-600">{item.value || "N/A"}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}