'use client';

import { toast } from '@/hooks/use-toast';
import { formatSpringBootError, SpringBootErrorResponse } from '@/types/models/springBootErrorResponse';
import axios, { AxiosError } from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ResetPassword() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [password, setPassword] = useState('');
    const [token, setToken] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const tokenParam = searchParams.get('token');
        if (tokenParam) {
            setToken(tokenParam);
        }
    }, [searchParams]);

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        setLoading(true);
        try {
            axios.post('http://localhost:8080/api/v1/signup/verify', {
                token,
                password
            });

            toast({ title: "Success", description: "Email successfully verified. Please login with the registered email.", duration: 2000});
            alert("Email successfully verified. Please login with the registered email.");
            router.push('/login');
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
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-2xl font-bold mb-4">Set password to complete email verification</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="password"
                        placeholder="New Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded mb-4"
                        required
                    />
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                        disabled={loading}
                    >
                        {loading ? 'Setting Password...' : 'Confirm Set Password'}
                    </button>
                </form>
            </div>
        </div>
    );
}
