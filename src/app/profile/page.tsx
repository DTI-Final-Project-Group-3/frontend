"use client"
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const user_detail_url = `${process.env.NEXT_PUBLIC_BACKEND_URL}${process.env.NEXT_PUBLIC_USER_DETAIL}`;

function Account({ userData, editableData, handleInputChange, handleSave, handleDiscard, isModified }) {
  return (
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
  );
}

const user_address_url = `${process.env.NEXT_PUBLIC_BACKEND_URL}${process.env.NEXT_PUBLIC_USER_ADDRESS}`;
const user_address_id_url = `${process.env.NEXT_PUBLIC_BACKEND_URL}${process.env.NEXT_PUBLIC_USER_ADDRESS_ID}`;


function AddressComponent({ id, name, detailAddress, latitude, longitude, primary, onDelete, session }) {
  const handleDelete = async () => {
    try {
      const res = await fetch(`${user_address_id_url}/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.accessToken}`
        }
      });
      if (res.ok) {
        onDelete();
      } else {
        alert("Failed to delete address");
      }
    } catch (err) {
      console.error("Error deleting address:", err);
      alert("Error deleting address");
    }
  };

  return (
    <div key={id} className={`p-4 border rounded-lg shadow ${primary ? 'border-blue-500' : 'border-gray-300'}`}>
      <h3 className="text-lg font-bold">{name}</h3>
      <p className="text-gray-600">{detailAddress}</p>
      <p className="text-sm text-gray-500">Latitude: {latitude}, Longitude: {longitude}</p>
      {primary && <span className="text-blue-500 font-semibold">Primary Address</span>}
      <button onClick={handleDelete} className="mt-2 bg-red-500 text-white p-2 rounded">Delete</button>
    </div>
  );
}

function Address() {
  const { data: session } = useSession();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAddresses = async () => {
    if (session) {
      try {
        const res = await fetch(user_address_url, {
          headers: { 'Authorization': `Bearer ${session.accessToken}` }
        });
        const data = await res.json();
        if (data.success) {
          setAddresses(data.data);
        } else {
          setError("Failed to fetch addresses");
        }
      } catch (err) {
        console.error("Error fetching addresses:", err);
        setError("Error fetching addresses");
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, [session]);

  if (loading) return <div>Loading addresses...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold text-center">My Addresses</h2>
      <Link href="/profile/create-address">
        <div className='bg-black rounded-[4px] text-white p-2 text-center cursor-pointer'>Create A New Address</div>
      </Link>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {addresses.map(address => <AddressComponent key={address.id} {...address} onDelete={fetchAddresses} session={session} />)}
      </div>
    </div>
  );
}



export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);
  const [editableData, setEditableData] = useState({ fullname: "", gender: "", birthdate: "" });
  const [isModified, setIsModified] = useState(false);
  const [activeTab, setActiveTab] = useState<'account' | 'address'>('account');

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
          const res = await fetch(user_detail_url, {
            headers: { 'Authorization': `Bearer ${session.accessToken}` }
          });
          const data = await res.json();
          if (data.success) {
            setUserData(data.data);
            console.log("Profile data", data.data);
            setEditableData({ fullname: data.data.fullname || "", gender: data.data.gender || "", birthdate: data.data.birthdate || "" });
          } else {
            alert("Failed to fetch user details");
          }
        } catch (error) {
          console.error("Error fetching user details:", status, error);
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
    try {
      const res = await fetch(user_detail_url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.accessToken}`
        },
        body: JSON.stringify(editableData)
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
        <img src={status === "authenticated" && userData ? userData.profileImageUrl || "https://via.placeholder.com/150" : "https://via.placeholder.com/150"}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover"
        />
        
          <nav className="w-full text-center space-y-2">
            <button onClick={() => setActiveTab('account')} className={`block w-full py-2 px-4 rounded ${activeTab === 'account' ? 'bg-gray-300' : 'bg-gray-200 hover:bg-gray-300'}`}>Account</button>
            <button onClick={() => setActiveTab('address')} className={`block w-full py-2 px-4 rounded ${activeTab === 'address' ? 'bg-gray-300' : 'bg-gray-200 hover:bg-gray-300'}`}>Address</button>
            <button onClick={() => signOut({ callbackUrl: '/login' })} className="block w-full py-2 px-4 bg-red-500 text-white rounded hover:bg-red-600">Logout</button>
          </nav>
        </div>
        {activeTab === 'account' ? (
          <Account userData={userData} editableData={editableData} handleInputChange={handleInputChange} handleSave={handleSave} handleDiscard={handleDiscard} isModified={isModified} />
        ) : (
          <Address />
        )}
      </div>
    </div>
  );
}
