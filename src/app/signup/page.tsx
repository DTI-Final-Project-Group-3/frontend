"use client"
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import { useSession } from 'next-auth/react';
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";

function ImagePlaceholder() {
  return (
    <div className="md:w-1/2 bg-gray-200 flex flex-col justify-center items-center p-4">
      <h1 className="text-2xl font-bold mb-4">WareHub</h1>
      <div className="w-[90%] h-[40vh] bg-gray-300 rounded-lg"></div>
    </div>
  );
}

function SignupForm({ onSubmit }) {
  const [showPassword, setShowPassword] = useState(false);
  const [fullname, setFullname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleFormSubmit = (e) => {
    e.preventDefault(); // Prevent the default form submission
    onSubmit(fullname, username, email, password); // Call the onSubmit callback with fullname, username, email, and password
  };
 
  return (
    <div className="md:w-1/2 flex flex-col justify-center items-center bg-white p-6">
        <div className="w-4/5 md:w-4/5 max-w-md">
          <h2 className="text-3xl font-bold text-center bg-yellow-400 p-2 rounded-md inline-block">Sign up</h2>
          <p className="text-center mt-2">
            Already have an account? 
            <Link href="/login">
              <span className="ml-2 text-green-800 cursor-pointer">Sign in</span>
            </Link>
          </p>

        <form onSubmit={handleFormSubmit}>
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
              type="text" 
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

          <div className="mt-4 flex items-center">
            <input type="checkbox" className="mr-2" /> 
            I agree with 
            <strong className="ml-1">Privacy Policy</strong> and 
            <strong className="ml-1">Terms of use</strong>
          </div>

          <Button type="submit" className="w-full mt-6 bg-black text-yellow-400 py-3 rounded-md">
            Sign up
          </Button>
        </form>
      </div>
    </div>
  );
}

export default function SignupPage() {
    const { data: session, status } = useSession();
        const router = useRouter();
      
    // Redirect to profile if already logged in
    useEffect(() => {
      if (status === "authenticated") {
        router.push('/profile');
      }
    }, [status, router]);
  
    const handleSubmit = async (fullname, username, email, password) => {
      try {
        const response = await axios.post("http://localhost:8080/api/v1/signup", {
          fullname,
          username,
          email,
          password,
        });
  
        console.log("Signup response:", response.data);
  
        if (response.data.success) {
          // Redirect to login page if signup is successful
          router.push('/login');
        } else {
          console.error("Signup failed:", response.data.message);
        }
      } catch (error) {
        console.error("Signup failed", error);
      }
    };
  
    return (
      <div className="flex flex-col md:flex-row h-screen w-full">
        <ImagePlaceholder />
        <SignupForm onSubmit={handleSubmit} />
      </div>
    );
  }