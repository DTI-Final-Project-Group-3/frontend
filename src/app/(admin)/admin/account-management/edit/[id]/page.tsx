"use client";

import { toast } from "@/hooks/use-toast";
import { formatSpringBootError } from "@/types/models/springBootErrorResponse";
import { Eye, EyeOff } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const admin_url = `${process.env.NEXT_PUBLIC_BACKEND_URL}${process.env.NEXT_PUBLIC_ADMIN}`;

const EditAdminPage = () => {
  const router = useRouter();
  const { id } = useParams();
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { data: session, status } = useSession();

  useEffect(() => {
    if (!session) return;

    const fetchAdmin = async () => {
      try {
        const res = await fetch(`${admin_url}/id/${id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
          },
        });
        const data = await res.json();
        if (res.ok) {
          setFullname(data.data.fullname);
          setEmail(data.data.email);
        } else {
          toast({ title: "Error", description: "Failed to load admin data", duration: 2000 });
        }
      } catch (error) {
        console.error("Fetch admin error", error);
        toast({ title: "Error", description: "Error fetching admin data", duration: 2000 });
      }
    };

    fetchAdmin();
  }, [id, session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) return;

    if (password && password.length < 8) {
      toast({ title: "Failed", description: "Password length minimum is 8", duration: 2000 });
      return;
    }

    try {
      const res = await fetch(`${admin_url}/id/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.accessToken}`,
        },
        body: JSON.stringify({
          fullname,
          password: password || undefined, // Only send password if changed
        }),
      });
      const data = await res.json();

      if (res.ok) {
        router.push("/admin/account-management");
      } else {
        toast({
          title: "Failed",
          description: "Update failed: " + formatSpringBootError(data),
          duration: 2000,
        });
      }
    } catch (error) {
      console.error("Update error", error);
      toast({ title: "Error", description: "Update error", duration: 2000 });
    }
  };

  if (status === "loading") {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <section className="max-w-lg mx-auto mt-10 bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-center mb-6">Edit Warehouse Admin</h2>

      <form onSubmit={handleSubmit}>
        <div className="mt-6">
          <input
            type="text"
            placeholder="Full Name"
            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
          />
        </div>

        <div className="mt-4">
          <input
            type="email"
            placeholder="Email Address"
            className="w-full p-3 border rounded-md bg-gray-200 cursor-not-allowed"
            value={email}
            disabled
          />
        </div>

        <div className="mt-4 relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="New Password (leave blank to keep current)"
            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            className="absolute inset-y-0 right-3 flex items-center"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>

        <button
          type="submit"
          className="mt-6 w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 transition"
        >
          Update Admin
        </button>

        <Link href="/admin/account-management">
          <button className="mt-6 w-full bg-red-600 text-white p-3 rounded-md hover:bg-red-700 transition">
            Cancel
          </button>
        </Link>
      </form>
    </section>
  );
};

export default EditAdminPage;