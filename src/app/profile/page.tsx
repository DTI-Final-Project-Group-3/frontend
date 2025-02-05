"use client"
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      alert("You are not logged in.");
      router.push('/login');
    }
  }, [router, status]);

  // Fetch user details after confirming session is loaded
  useEffect(() => {
    if (status === "authenticated") {
      const fetchUserDetails = async () => {
        try {
          const res = await fetch('http://localhost:8080/api/v1/user/detail', {
            headers: {
              'Authorization': `Bearer ${session.accessToken}` // assuming accessToken exists
            }
          });
          const data = await res.json();
          if (data.success) {
            setUserData(data.data);
          } else {
            alert("Failed to fetch user details");
          }
        } catch (error) {
          console.error("Error fetching user details:", error);
          alert("Error fetching user details");
        }
      };
      fetchUserDetails();
    }
  }, [session, status]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "unauthenticated") {
    return null;
  }

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
      <button 
        onClick={() => signOut({ callbackUrl: '/login' })} 
        className="mb-4 bg-black text-white py-2 px-4 rounded hover:bg-gray-800"
      >
        Logout
      </button>
      <h1 className="text-3xl font-semibold mb-2">Welcome, {session.user.email}</h1>
      {userData ? (
        <div className="space-y-2">
          <p><strong>Full Name:</strong> {userData.fullname || "Not provided"}</p>
          <p><strong>Gender:</strong> {userData.gender || "Not provided"}</p>
          <p><strong>Birthdate:</strong> {userData.birthdate || "Not provided"}</p>
          <p><strong>Email:</strong> {userData.email || "Not provided"}</p>
          <p><strong>Phone Number:</strong> {userData.phoneNumber || "Not provided"}</p>
          <p><strong>Role:</strong> {userData.role}</p>
          <p><strong>Email Verified:</strong> {userData.isEmailVerified ? "Yes" : "No"}</p>
          <p><strong>Profile Image:</strong> {userData.profileImageUrl || "No image"}</p>
        </div>
      ) : (
        <div className="text-gray-500">Loading user details...</div>
      )}
    </div>
  );
}
