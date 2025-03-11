import { UserDetail } from "@/types/models/userDetail";
import Image from "next/image";

const placeholderImage = "https://dummyimage.com/150x150/cccccc/ffffff&text=No+Image";

interface Props
{
    customer : UserDetail | null
}

export const CustomerCard = ({customer} : Props) => {

  return (
  <div className="bg-gray-100 p-5 rounded-xl shadow-md flex flex-col items-start">
    { customer &&
    <div>
        <div className="flex flex-col md:flex-row items-center md:items-start gap-4 mb-3 w-full">
          <Image
            src={customer.profileImageUrl?.trim() ? customer.profileImageUrl : placeholderImage}
            alt={`${customer.fullname}'s profile`}
            height={96}
            width={96}
            className="w-24 h-24 rounded-full object-cover"
          />
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold">{customer.fullname}</h3>
            <p className="text-sm text-gray-600">{customer.email}</p>
            <p className="text-sm font-medium mt-1">Customer ID: {customer.id}</p>
          </div>
        </div>
     </div>
     }
  </div>
);

};
