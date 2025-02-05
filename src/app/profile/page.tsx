"use client"
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProfilePage() {
  const { data: session, status } = useSession(); // Destructure session and status from useSession()
  const router = useRouter();

  // Redirect to login if unauthenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      alert("You are not logged in.");
      router.push('/login');
    }
  }, [router, status]);

  // If session is still loading, show a loading message
  if (status === "loading") {
    return <div>Loading...</div>;
  }

  // If the user is not authenticated, return null (redirect happens in useEffect)
  if (status === "unauthenticated") {
    return null;
  }

  return (
    <div>
      <h1>Logged in</h1>
      <p>Welcome, {session.user.email}</p>
      <button 
        onClick={() => signOut({ callbackUrl: '/login' })} 
        className="bg-black text-white py-2 px-4 rounded"
      >
        Logout
      </button>
    </div>
  );
}
