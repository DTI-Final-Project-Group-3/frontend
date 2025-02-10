import { ApiResponse } from "@/types/api/apiResponse";
import { UserAddress } from "@/types/models/users";
import axios from "axios";

const userUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}${process.env.NEXT_PUBLIC_USER}`;

export const getUserAddress = async (): Promise<ApiResponse<UserAddress[]>> => {
  const response = await axios.get<ApiResponse<UserAddress[]>>(
    `${userUrl}/address`
  );
  return response.data;
};
