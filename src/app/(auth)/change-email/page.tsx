"use client";

import { toast } from '@/hooks/use-toast';
import { formatSpringBootError, SpringBootErrorResponse } from '@/types/models/springBootErrorResponse';
import axios, { AxiosError } from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

const verify_email_url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/user/email/verify-change-email-token`;

function VerifyChangeEmail() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [token, setToken] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const tokenParam = searchParams.get('token');
        if (tokenParam) {
            setToken(tokenParam);
        }
    }, [searchParams]);

    const handleVerify = async () => {
        if (!token) {
            toast({ title: "Error", description: "Invalid token", duration: 2000 });
            return;
        }

        setLoading(true);
        try {
            await axios.post(verify_email_url, { token });

            toast({ title: "Success", description: "Email successfully changed", duration: 2000 });
            alert("Email successfully changed");
            router.push('/login');
        } catch (error) {
            const axiosError = error as AxiosError;

            if (!axiosError.response) {
                toast({ title: "Error", description: "Unknown error " + axiosError, duration: 2000 });
                alert("Unknown error " + axiosError);
            } else {
                const response = axiosError.response.data as SpringBootErrorResponse;
                toast({ title: "Error", description: formatSpringBootError(response), duration: 2000 });
                alert(formatSpringBootError(response));
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-2xl font-bold mb-4">Verify Email Change</h2>
                <p className="mb-4 text-gray-600">Click the button below to verify your email change.</p>
                <button
                    onClick={handleVerify}
                    className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                    disabled={loading}
                >
                    {loading ? 'Verifying...' : 'Verify Email'}
                </button>
            </div>
        </div>
    );
}

export default function VerifyChangeEmailWrapper() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <VerifyChangeEmail />
        </Suspense>
    );
}