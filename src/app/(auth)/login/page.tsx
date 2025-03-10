"use client";
import Logo from "@/components/navbar/components/Logo";
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
    <div className="relative w-1/2 h-screen hidden md:flex">
      {/* Image fully covering the left 50% */}
      <Image
        src="/images/auth-image.jpg"
        alt="Auth image"
        height={1920}
        width={2880}
        className="object-cover"
      />

      {/* Overlay effect */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Caption text */}
      <div className="absolute inset-0 flex flex-col justify-center items-center text-white p-6 text-center">
        <h2 className="text-3xl font-bold">Welcome to WareHub</h2>
        <p className="mt-2 text-lg">Join us and explore the best deals!</p>
      </div>
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
    <div className="w-full h-full md:w-1/2 flex flex-col justify-center items-center bg-white md:p-6">
      <div className="w-4/5 md:w-4/5 max-w-md">
        <div className="flex flex-col gap-4 items-start">
          <Logo />
          <h2 className="mt-8 text-3xl font-bold text-center">Sign In</h2>
          <div className="flex gap-3 items-center justify-center">
            <span className="md:text-[18px] text-gray-600">
              Don&apos;t have an account yet?
            </span>
            <Link href="/signup">
              <span className="md:text-[18px] font-bold text-green-600 rounded-md cursor-pointer hover:text-green-700">
                Sign Up
              </span>
            </Link>
          </div>
        </div>

        <form onSubmit={handleFormSubmit}>
          <div className="mt-8">
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

          <div className="text-sm md:text-[16px] mt-4 flex gap-2 items-center justify-between">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              Remember me
            </label>
            <Link href="/forgot-password"><span className="font-bold cursor-pointer">Forgot Password?</span></Link>
          </div>

          <Button type="submit" className="w-full mt-6 font-semibold">
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

function getFriendlyErrorMessage(errorCode: string): string {
  const messages: Record<string, string> = {
    "CredentialsSignin": "Invalid email or password. Please try again.",
    "OAuthSignin": "Failed to sign in with the provider.",
    "OAuthCallbackError": "Something went wrong during authentication.",
    "OAuthCreateAccount": "Could not create an account with this provider.",
    "OAuthAccountNotLinked": "This email is already linked to another login method.",
    "EmailCreateAccount": "Could not create an account with this email.",
    "EmailSignin": "Check your email for the sign-in link.",
    "CallbackRouteError": "Error occurred while processing sign-in callback.",
    "Default": "An unknown error occurred. Please try again later."
  };

  return messages[errorCode] || messages["Default"];
}

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      const role = session?.role;

      if (role === "ADMIN_SUPER" || role === "ADMIN_WAREHOUSE")
        router.push("/admin/report-analysis");
      else router.push("/");
    }
  }, [status, router, session]);

  const handleSubmit = async (email: string, password: string) => {
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    console.log("result = " + result);
    if (result) {
      console.log("error = " + result.error);
    }

    if (result?.error) {
      alert(getFriendlyErrorMessage(result.error));
      toast({
        title: "Failed to login",
        description: "Please input correct account",
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
