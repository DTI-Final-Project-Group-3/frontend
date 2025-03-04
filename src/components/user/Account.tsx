import { UserDetail } from "@/types/models/userDetail";
import { ChangeEvent } from "react";

interface AccountProps {
    userData : UserDetail | null;
    editableData: {
      fullname: string;
      gender: string;
      birthdate: string;
      phoneNumber:string;
    };
    handleInputChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    handleSave: () => void;
    handleDiscard: () => void;
    isModified: boolean;
  }
  
export default function Account({
  userData,
  editableData,
  handleInputChange,
  handleSave,
  handleDiscard,
  isModified,
} : AccountProps) {
  return (
    <div className="space-y-4 flex flex-col w-full">
      <div className="flex justify-end space-x-2">
        <button
          onClick={handleDiscard}
          disabled={!isModified}
          className="py-2 px-4 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
        >
          Discard
        </button>
        <button
          onClick={handleSave}
          disabled={!isModified}
          className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          Save
        </button>
      </div>
      {userData && (
        <div className="flex flex-col gap-4 w-full">
          {[
            {
              label: "Full Name",
              name: "fullname",
              value: editableData.fullname,
              editable: true,
            },
            {
              label: "Gender",
              name: "gender",
              value: editableData.gender,
              editable: true,
              type: "dropdown",
            },
            {
              label: "Birthdate",
              name: "birthdate",
              value: editableData.birthdate,
              editable: true,
              type: "date",
            },
            { label: "Email", value: userData.email },
            { label: "Phone Number", 
                name: "phoneNumber",
                value: editableData.phoneNumber ,
                editable: true,
            },
            {
              label: "Email Verified",
              value: userData.isEmailVerified ? "Yes" : "No",
            },
          ].map((field, index) => (
            <div key={index} className="flex flex-col w-full">
              <label className="font-semibold">{field.label}</label>
              {field.editable ? (
                field.type === "dropdown" ? (
                  <select
                    name={field.name}
                    value={field.value}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded bg-white"
                  >
                    <option value="">Not Set</option>
                    <option value="M">Male</option>
                    <option value="F">Female</option>
                  </select>
                ) : (
                  <input
                    type={field.type || "text"}
                    name={field.name}
                    value={field.value}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded bg-white"
                  />
                )
              ) : (
                <input
                  type="text"
                  value={field.value || ""}
                  readOnly
                  className="w-full p-2 border rounded bg-gray-100"
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}