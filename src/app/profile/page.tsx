"use client"
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);
  const [editableData, setEditableData] = useState({ fullname: "", gender: "", birthdate: "" });
  const [isModified, setIsModified] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      alert("You are not logged in.");
      router.push('/login');
    }
  }, [router, status]);

  useEffect(() => {
    if (status === "authenticated") {
      const fetchUserDetails = async () => {
        try {
          const res = await fetch('http://localhost:8080/api/v1/user/detail', {
            headers: {
              'Authorization': `Bearer ${session.accessToken}`
            }
          });
          const data = await res.json();
          if (data.success) {
            setUserData(data.data);
            setEditableData({ fullname: data.data.fullname || "", gender: data.data.gender || "", birthdate: data.data.birthdate || "" });
          } else {
            alert("Failed to fetch user details");
          }
        } catch (error) {
          console.error("Error fetching user details:", error);
          alert("Error fetching user details");
        }
      };
      fetchUserDetails();
    }
  }, [session, status]);

  const handleInputChange = (e: any) => {
    setEditableData({ ...editableData, [e.target.name]: e.target.value });
    setIsModified(true);
  };

  const handleSave = async () => {
    const updatedData: any = {};
    if (editableData.fullname) updatedData.fullname = editableData.fullname;
    if (editableData.gender) updatedData.gender = editableData.gender;
    if (editableData.birthdate) updatedData.birthdate = editableData.birthdate;

    try {
      const res = await fetch('http://localhost:8080/api/v1/user/detail', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.accessToken}`
        },
        body: JSON.stringify(updatedData)
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

  const handleDiscard = () => {
    setEditableData({ fullname: userData.fullname || "", gender: userData.gender || "", birthdate: userData.birthdate || "" });
    setIsModified(false);
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "unauthenticated") {
    return null;
  }

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg">
      <div className="text-3xl font-semibold text-center mb-6">My Account</div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex flex-col items-center space-y-4">
          <img src={userData?.profileImageUrl || "https://via.placeholder.com/150"} alt="Profile" className="w-32 h-32 rounded-full object-cover" />
          <nav className="w-full text-center space-y-2">
            <button className="block w-full py-2 px-4 bg-gray-200 rounded hover:bg-gray-300">Account</button>
            <button className="block w-full py-2 px-4 bg-gray-200 rounded hover:bg-gray-300">Address</button>
            <button onClick={() => signOut({ callbackUrl: '/login' })} className="block w-full py-2 px-4 bg-red-500 text-white rounded hover:bg-red-600">Logout</button>
          </nav>
        </div>
        <div className="md:col-span-2 space-y-4">
          <div className="flex justify-end space-x-2">
            <button onClick={handleDiscard} disabled={!isModified} className="py-2 px-4 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50">Discard</button>
            <button onClick={handleSave} disabled={!isModified} className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50">Save</button>
          </div>
          {userData && (
            <div className="space-y-4">
              {[
                { label: "Full Name", name: "fullname", value: editableData.fullname, editable: true },
                { label: "Gender", name: "gender", value: editableData.gender, editable: true, type: "dropdown" },
                { label: "Birthdate", name: "birthdate", value: editableData.birthdate, editable: true, type: "date" },
                { label: "Email", value: userData.email },
                { label: "Phone Number", value: userData.phoneNumber },
                { label: "Role", value: userData.role },
                { label: "Email Verified", value: userData.isEmailVerified ? "Yes" : "No" }
              ].map((field, index) => (
                <div key={index} className="flex flex-col">
                  <label className="font-semibold">{field.label}</label>
                  {field.editable ? (
                    field.type === "dropdown" ? (
                      <select name={field.name} value={field.value} onChange={handleInputChange} className="w-full md:w-11/12 p-2 border rounded bg-gray-100">
                        <option value="">Not Set</option>
                        <option value="M">Male</option>
                        <option value="F">Female</option>
                      </select>
                    ) : (
                      <input type={field.type || "text"} name={field.name} value={field.value} onChange={handleInputChange} className="w-full md:w-11/12 p-2 border rounded bg-white" />
                    )
                  ) : (
                    <input type="text" value={field.value || "Not provided"} readOnly className="w-full md:w-11/12 p-2 border rounded bg-gray-100" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
