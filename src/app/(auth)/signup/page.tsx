"use client";
import Logo from "@/components/navbar/components/Logo";
import { Button } from "@/components/ui/button";
import { formatSpringBootError, SpringBootErrorResponse } from "@/types/models/springBootErrorResponse";
import axios from "axios";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const signup_url = `${process.env.NEXT_PUBLIC_BACKEND_URL}${process.env.NEXT_PUBLIC_SIGNUP}`;

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

function SignupForm({ onSubmit, onGoogleLogin }) {
  const [showPassword, setShowPassword] = useState(false);
  const [fullname, setFullname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agree, setAgree] = useState(false);
  const [sendingRequest, setSendingRequest] = useState(false);

  const handleFormSubmit = (e) => {
    e.preventDefault(); // Prevent the default form submission
    if (!agree) {
      alert("You must agree with Privacy Policy and Terms of use")
      return;
    }

    setSendingRequest(true); // Disable the button

    setFullname("");
    setUsername("");
    setPassword("");
    setShowPassword(showPassword);
    onSubmit(fullname, username, email, password, setSendingRequest); // Call the onSubmit callback with fullname, username, email, and password
  };

  return (
    <div className="w-full h-full md:w-1/2 flex flex-col justify-center items-center bg-white py-10 md:py-0 md:p-6">
      <div className="w-4/5 md:w-4/5 max-w-md">
        <div className="flex flex-col gap-4 items-start">
          <Logo />
          <h2 className="mt-8 text-3xl font-bold text-center">Sign Up</h2>
          <div className="flex gap-3 items-center justify-center">
            <span className="md:text-[18px] text-gray-600">
              Already have an account?
            </span>
            <Link href="/login">
              <span className="md:text-[18px] font-bold text-green-600 rounded-md cursor-pointer hover:text-green-700">
                Sign In
              </span>
            </Link>
          </div>
        </div>

        <form onSubmit={handleFormSubmit}>
          <div className="mt-4">
            <input
              type="text"
              placeholder="Your email address"
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="text-sm md:text-[16px] mt-4 flex md:flex-nowrap gap-2 md:items-center whitespace-nowrap w-full">
            <input type="checkbox" className="mr-1" onChange={(e) => setAgree(e.target.value)} />
            <div className="flex items-center gap-2 flex-wrap">
              <p className="flex items-center gap-2">
                I agree with
                <strong>Privacy Policy</strong>
              </p>
              and <strong>Terms of use</strong>
            </div>
          </div>

          <Button type="submit" className="w-full mt-6 font-semibold" disabled={sendingRequest}>
            {sendingRequest ? "Signing up..." : "Sign up"}
          </Button>

          {/* Divider */}
          <div className="flex items-center my-4">
            <hr className="flex-grow border-gray-300" />
            <span className="mx-2 text-gray-500">or</span>
            <hr className="flex-grow border-gray-300" />
          </div>

          {/* Google Login Button */}
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
              className="w-5 h-5 mr-2"
            />
            Sign in with Google
          </button>
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
      router.push("/profile");
    }
  }, [status, router]);

  const handleSubmit = async (fullname, username, email, password, setSendingRequest) => {
    try {
      const response = await axios.post(signup_url, {
        fullname,
        username,
        email,
        password,
      });

      console.log("Signup response:", response.data);

      setSendingRequest(false);

      if (response.data.success) {
        alert("Signup succesful, please check your email for verification link");
        router.push("/login");
      } else {
        alert("signup response failed :" + response.data.message);
        console.log("Signup response failed:"+ response.data.message);
      }
    } catch (error) {
      setSendingRequest(false);
      if (error.response === undefined)
        alert("Unknown error " + error);
      else {
        const response = error.response.data as SpringBootErrorResponse;
        alert(formatSpringBootError(response));
      }
    }
  };

  const handleGoogleLogin = async () => {
    await signIn("google");
  };

  return (
    <div className="flex flex-col justify-center items-center md:flex-row min-h-screen w-full">
      <ImagePlaceholder />
      <SignupForm onSubmit={handleSubmit} onGoogleLogin={handleGoogleLogin} />
    </div>
  );
}
