"use client";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Eye, EyeOff } from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function ImagePlaceholder() {
  return (
    <div className="md:w-1/2 bg-gray-200 flex flex-col justify-center items-center p-4">
      <h1 className="text-2xl font-bold mb-4">WareHub</h1>
      <div className="w-[90%] h-[40vh] bg-gray-300 rounded-lg"></div>
    </div>
  );
}

interface LoginFormProps {
  onSubmit: (email: string, password: string) => void;
  onGoogleLogin: () => void;
}

function LoginForm({ onSubmit, onGoogleLogin }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(email, password);
  };

  return (
    <div className="md:w-1/2 flex flex-col justify-center items-center bg-white p-6">
      <div className="w-4/5 md:w-4/5 max-w-md">
        <h2 className="text-2xl font-bold text-center">Sign In</h2>
        <p className="text-center mt-2">
          Don&apos;t have an account yet?
          <Link href="/signup">
            <span className="ml-2 px-3 py-1 bg-yellow-400 rounded-md cursor-pointer">
              Sign Up
            </span>
          </Link>
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
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>

          <div className="mt-4 flex justify-between items-center">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" /> Remember me
            </label>
            <span className="font-bold cursor-pointer">Forgot Password?</span>
          </div>

          <Button
            type="submit"
            className="w-full mt-6 bg-blue-600 text-white py-3 rounded-md"
          >
            Sign In
          </Button>

          <div className="flex items-center my-4">
            <hr className="flex-grow border-gray-300" />
            <span className="mx-2 text-gray-500">or</span>
            <hr className="flex-grow border-gray-300" />
          </div>

          <button
            type="button"
            onClick={onGoogleLogin}
            className="w-full flex items-center justify-center border border-gray-300 py-3 rounded-md hover:bg-gray-100"
          >
            <Image
              src="/images/google-logo.svg"
              alt="Google Logo"
              width={20}
              height={20}
              className="mr-2"
            />
            Sign in with Google
          </button>
        </form>
      </div>
    </div>
  );
}

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      const role = session?.role;

      if (role === "ADMIN_SUPER" || role === "ADMIN_WAREHOUSE")
        router.push("/admin");
      else router.push("/");
    }
  }, [status, router, session]);

  const handleSubmit = async (email: string, password: string) => {
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      toast({
        title: "Failed to login",
        description: "Please input correct account",
        variant: "destructive",
        duration: 2000,
      });
    } else {
      toast({
        title: "Login successful",
        description: "Welcome to WareHub",
        duration: 3000,
      });
      router.push("/");
    }
  };

  const handleGoogleLogin = async () => {
    await signIn("google");
  };

  return (
    <div className="flex flex-col md:flex-row h-screen w-full">
      <ImagePlaceholder />
      <LoginForm onSubmit={handleSubmit} onGoogleLogin={handleGoogleLogin} />
    </div>
  );
}
