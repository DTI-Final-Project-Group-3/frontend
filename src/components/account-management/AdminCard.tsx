import { UserAdminDetail } from "@/types/models/userAdminDetail";

const placeholderImage = "https://dummyimage.com/150x150/cccccc/ffffff&text=No+Image";

export const AdminCard = ({ admin }: { admin: UserAdminDetail }) => {
    return (
      <div className="bg-gray-100 p-5 rounded-xl shadow-md flex flex-col items-center">
        <img
          src={admin.profileImageUrl?.trim() ? admin.profileImageUrl : placeholderImage}
          alt={`${admin.fullname}'s profile`}
          className="w-24 h-24 rounded-full object-cover mb-3"
        />
        <h3 className="text-lg font-semibold">{admin.fullname}</h3>
        <p className="text-sm text-gray-600">{admin.email}</p>
        <p className="text-sm font-medium mt-2">Admin ID: {admin.id}</p>
        { (admin.warehouseId > 0) &&
          <p className="text-sm font-medium mt-2 text-blue-600">Warehouse ID: {admin.warehouseId}</p>
        }
        { (admin.warehouseId > 0) &&
          <p className="text-sm font-medium mt-2 text-blue-600">Assigner ID: {admin.userAssignerId}</p>
        }
        { (admin.warehouseId <= 0) &&
          <p className="text-sm font-medium mt-2 text-red-500">Not assigned to a warehouse</p>
        }
      </div>
    );
  };