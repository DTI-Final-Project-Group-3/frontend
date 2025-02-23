"use client";

import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const admin_url = `${process.env.NEXT_PUBLIC_BACKEND_URL}${process.env.NEXT_PUBLIC_ADMIN}`;

const CreateAdminPage = () => {
  const router = useRouter();
  const [fullname, setFullname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post(admin_url, {
        fullname,
        username,
        email,
        password,
      });

      console.log("Signup response:", response.data);

      if (response.data.success) {
        router.push("/admin/account-management");
      } else {
        console.error("Signup failed:", response.data.message);
      }
    } catch (error) {
      console.error("Signup failed", error);
    }
  };

  return (
    <section className="max-w-lg mx-auto mt-10 bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-center mb-6">Create Warehouse Admin</h2>

      <form onSubmit={handleSubmit}>
        <div className="mt-6">
          <input
            type="text"
            placeholder="Your full name"
            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
          />
        </div>

        <div className="mt-4">
          <input
            type="text"
            placeholder="Your username"
            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="mt-4">
          <input
            type="email"
            placeholder="Your email address"
            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="mt-4 relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
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
          Create Account
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

export default CreateAdminPage;
