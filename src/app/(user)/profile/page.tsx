"use client";
import Account from "@/components/user/Account";
import Address from "@/components/user/Address";
import ProfileImage from "@/components/user/ProfileImage";
import { useCartStore } from "@/store/cartStore";
import { UserDetail } from "@/types/models/userDetail";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, useCallback, useEffect, useState } from "react";

const user_detail_url = `${process.env.NEXT_PUBLIC_BACKEND_URL}${process.env.NEXT_PUBLIC_USER_DETAIL}`;
const reset_password_request_url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/reset-password-request`;


export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userData, setUserData] = useState<UserDetail | null>(null);
  const [editableData, setEditableData] = useState({
    fullname: "",
    gender: "",
    birthdate: "",
    phoneNumber: "",
  });
  const [isModified, setIsModified] = useState(false);
  const [activeTab, setActiveTab] = useState<"account" | "address">("account");

  const resetCart = useCartStore((state) => state.resetCart);

  useEffect(() => {
    if (status === "unauthenticated") {
      console.log(status);
      alert("You are not logged in.");
      router.push("/login");
    }
  }, [router, status]);

  const fetchUserDetails = useCallback(async () => {
    if (status === "authenticated") {
      try {
        const res = await fetch(user_detail_url, {
          headers: { Authorization: `Bearer ${session.accessToken}` },
        });
        const data = await res.json();
        if (data.success) {
          setUserData(data.data);
          setEditableData({
            fullname: data.data.fullname || "",
            gender: data.data.gender || "",
            birthdate: data.data.birthdate || "",
            phoneNumber: data.data.phoneNumber || "",
          });
        } else {
          alert("Failed to fetch user details");
        }
      } catch (error) {
        console.error("Error fetching user details:", status, error);
        alert("Error fetching user details");
      }
    }
  }, [session, status])

  useEffect(() => {
    fetchUserDetails();
  }, [session, status, fetchUserDetails]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setEditableData({ ...editableData, [e.target.name]: e.target.value });
  setIsModified(true);
  };

  const handleSave = async () => {
    if (session)
      try {
        const res = await fetch(user_detail_url, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.accessToken}`,
          },
          body: JSON.stringify(editableData),
        });
        const data = await res.json();
        if (data.success) {
          alert("User details updated successfully");
          setIsModified(false);
        } else {
          alert("Failed to update user details");
        }
      } catch (error) {
        console.error("Error updating user details:", error);
        alert("Error updating user details");
      }
  };

  const resetPassword = async () => {
    if (session)
      try {
        const res = await fetch(reset_password_request_url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.accessToken}`,
          },
          body: JSON.stringify(editableData),
        });
        const data = await res.json();
        if (data.success) {
          alert("Check your email for password change link");
          setIsModified(false);
        } else {
          alert("Failed to send password change link");
        }
      } catch (error) {
        console.error("Error sending password change link:", error);
        alert("Error sending password change link");
      }
  }

  const handleDiscard = () => {
    if (userData)
      setEditableData({
        fullname: userData.fullname || "",
        gender: userData.gender || "",
        birthdate: userData.birthdate || "",
        phoneNumber: userData.phoneNumber || "",
      });
    else {
      setEditableData({
        fullname: "",
        gender: "",
        birthdate: "",
        phoneNumber: "",
      });
    }
    setIsModified(false);
  };

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center py-[40px] px-6 min-h-[calc(100vh-70px)] w-full">
        Loading...
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

  return (
    <div className="py-[40px] px-6 min-h-[calc(100vh-70px)] bg-slate-100 w-full">
      <div className="md:max-w-4xl lg:max-w-[1340px] mx-auto w-full">
        <h1 className="text-4xl font-semibold">My Profile</h1>

        {/* Responsive Layout */}
        <div className="mt-[40px] w-full flex flex-col md:flex-row md:gap-16 items-start">
          {/* Left Menu - Auto Height Based on Content */}
          <div className="flex flex-col flex-shrink-0 items-center space-y-4 md:w-1/4 bg-white p-8 rounded-xl w-full">
          <ProfileImage profile_image_url={userData?.profileImageUrl || "/images/no-image-icon.jpg"} refresh={fetchUserDetails}></ProfileImage>
            <nav className="pt-10 w-full text-center space-y-2">
              <button
                onClick={() => setActiveTab("account")}
                className={`block w-full py-2 px-4 rounded ${
                  activeTab === "account"
                    ? "bg-gray-300"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                Account
              </button>
              <button
                onClick={() => setActiveTab("address")}
                className={`block w-full py-2 px-4 rounded ${
                  activeTab === "address"
                    ? "bg-gray-300"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                Address
              </button>
              {session && (session.role === "ADMIN_WAREHOUSE" || session.role === "ADMIN_SUPER") && (
                <Link href={"/admin"}>
                  <button className="block w-full py-2 px-4 bg-green-500 text-white rounded hover:bg-green-600">
                    Admin
                  </button>
                </Link>
              )}
              <button
                onClick={() => {
                  resetPassword();
                }}
                className="block w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Reset Password
              </button>
              <button
                onClick={() => {
                  resetCart();
                  signOut({ callbackUrl: "/login" });
                }}
                className="block w-full py-2 px-4 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Logout
              </button>
            </nav>
          </div>

          <div className="md:w-3/4 md:my-0 w-full my-20 bg-white p-12 rounded-xl">
            {activeTab === "account" ? (
              <Account
                userData={userData}
                editableData={editableData}
                handleInputChange={handleInputChange}
                handleSave={handleSave}
                handleDiscard={handleDiscard}
                isModified={isModified}
              />
            ) : (
              <Address />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
