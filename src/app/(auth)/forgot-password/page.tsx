"use client"

import { toast } from "@/hooks/use-toast";
import { formatSpringBootError, SpringBootErrorResponse } from '@/types/models/springBootErrorResponse';
import axios, { AxiosError } from 'axios';
import { useRouter } from "next/navigation";
import { useState } from "react";

const reset_password_request_url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/reset-password-request-by-email`;

const ResetPasswordRequest = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    
    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post(reset_password_request_url, { email });

            toast({ title: "Success", description: "Please check your email for the reset password link", duration: 2000});
            alert("Please check your email for the reset password link");
            router.push("/login");
        } catch (error) {
            const axiosError = error as AxiosError; 
          
            if (!axiosError.response) {
              toast({ title: "Error", description: "Unknown error " + axiosError, duration: 2000});
              alert("Unknown error " + axiosError);
              
            } else {
                const response = axiosError.response.data as SpringBootErrorResponse;
                toast({ title: "Error", description: formatSpringBootError(response), duration: 2000});
                alert(formatSpringBootError(response));
            }
        } finally {
            setLoading(false);
        }
    };
  
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-2xl font-semibold text-center mb-4">Reset Password</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input 
                type="email"
                className="w-full px-3 py-2 border rounded-lg focus:ring focus:ring-blue-300"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button 
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
          <button 
            className="w-full mt-4 bg-gray-500 hover:bg-gray-600 text-white py-2 rounded-lg transition"
            onClick={() => router.push("/login")}
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  };

export default ResetPasswordRequest;