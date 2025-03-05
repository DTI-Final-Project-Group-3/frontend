"use client";

import Account from "@/components/user/Account";
import { toast } from "@/hooks/use-toast";
import { UserDetail } from "@/types/models/userDetail";
import { useSession } from "next-auth/react";
import { ChangeEvent, useEffect, useState } from "react";

const user_detail_url = `${process.env.NEXT_PUBLIC_BACKEND_URL}${process.env.NEXT_PUBLIC_USER_DETAIL}`;

export default function AccountPage() {
  const { data: session, status } = useSession();
  const [userData, setUserData] = useState<UserDetail | null>(null);
  const [editableData, setEditableData] = useState({
    fullname: "",
    gender: "",
    birthdate: "",
    phoneNumber: "",
  });
  const [isModified, setIsModified] = useState(false);

  useEffect(() => {
    const fetchUserDetails = async () => {
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
            toast({title: "Failed", description: "Failed to fetch user details", duration: 2000,});
          }
        } catch (error) {
          console.error("Error fetching user details:", error);
          toast({title: "Error", description: "Error fetching user details", duration: 2000,});
        }
      }
    };

    fetchUserDetails();
  }, [session, status]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setEditableData({ ...editableData, [e.target.name]: e.target.value });
    setIsModified(true);
  };

  const handleSave = async () => {
    if (!session) return;

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
        toast({title: "Success", description: "User details updated successfully", duration: 2000,});
        setIsModified(false);
      } else {
        toast({title: "Failed", description: "Failed to update user details", duration: 2000,});
      }
    } catch (error) {
      console.error("Error updating user details:", error);
      toast({title: "Error", description: "Error updating user details", duration: 2000,});
    }
  };

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

  return (
    <Account
      userData={userData}
      editableData={editableData}
      handleInputChange={handleInputChange}
      handleSave={handleSave}
      isModified={isModified}
      handleDiscard={handleDiscard}
    />
  );
}
