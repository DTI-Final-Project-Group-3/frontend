"use client"
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { signIn, useSession } from 'next-auth/react';
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

function LoginForm({ onSubmit }) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleFormSubmit = (e) => {
    e.preventDefault(); // Prevent the default form submission
    onSubmit(email, password); // Call the onSubmit callback with email and password
  };

  return (
    <div className="md:w-1/2 flex flex-col justify-center items-center bg-white p-6">
      <div className="w-4/5 md:w-4/5 max-w-md">
        <h2 className="text-2xl font-bold text-center">Sign In</h2>
        <p className="text-center mt-2">
          Don't have an account yet? 
          <Link href="/signup"><span className="ml-2 px-3 py-1 bg-yellow-400 rounded-md cursor-pointer">Sign Up</span></Link>
        </p>
        
        <form onSubmit={handleFormSubmit}>
          <div className="mt-6">
            <input 
              type="text" 
              placeholder="Your username or email address" 
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
          
          <div className="mt-4 flex justify-between items-center">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" /> Remember me
            </label>
            <span className="font-bold cursor-pointer">Forgot Password?</span>
          </div>
          
          <Button type="submit" className="w-full mt-6 bg-blue-600 text-white py-3 rounded-md">
            Sign In
          </Button>
        </form>
      </div>
    </div>
  );
}

export default function LoginPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
  
    // Redirect to profile if already logged in
    useEffect(() => {
      if (status === "authenticated") {
        router.push('/profile');
      }
    }, [status, router]);
  
    const handleSubmit = async (email, password) => {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });
  
      if (result?.error) {
        alert("Login failed");
      } else {
        alert("Login successful");
        router.push('/profile');
      }
    };
  
    return (
      <div className="flex flex-col md:flex-row h-screen w-full">
        <ImagePlaceholder />
        <LoginForm onSubmit={handleSubmit} />
      </div>
    );
  }