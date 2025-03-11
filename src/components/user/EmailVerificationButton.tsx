import { toast } from "@/hooks/use-toast";
import { SpringBootErrorResponse, formatSpringBootError } from "@/types/models/springBootErrorResponse";
import axios, { AxiosError } from "axios";
import { useState } from "react";

const signup_url = `${process.env.NEXT_PUBLIC_BACKEND_URL}${process.env.NEXT_PUBLIC_SIGNUP}`;

interface EmailVerificationProps {
    email : string | null | undefined;
    role : string | null | undefined;
}
  

export default function EmailVerificationButton({email, role} : EmailVerificationProps) {
    const [sendingRequest, setSendingRequest] = useState(false);

    const handleSubmit = async () => {
        if (!email)
            return;

        try {
          setSendingRequest(true);  

          const response = await axios.post(signup_url, {
            email
          });
    
          console.log("Signup response:", response.data);
    
          setSendingRequest(false);
    
          if (response.data.success) {
            toast({title: "Success", description: "Please check your email for verification link", duration: 2000});
          } else {
            toast({title: "Failed", description: "Signup failed :" + response.data.message, duration: 2000});
            console.log("Signup response failed:"+ response.data.message);
          }
        } catch (error) {
          setSendingRequest(false);
            const axiosError = error as AxiosError; 
            
            if (!axiosError.response) {
              toast({ title: "Error", description: "Unknown error " + axiosError, duration: 2000});
            } else {
                const response = axiosError.response.data as SpringBootErrorResponse;
                toast({ title: "Error", description: formatSpringBootError(response), duration: 2000});
            }
        }
      };

      return( 
        <>
            { (role === "NOT_VERIFIED") &&
            <button className="block w-full py-2 px-4 bg-green-500 text-white rounded hover:bg-green-600"
                disabled={sendingRequest} onClick={() => handleSubmit()}>
                {sendingRequest ? "Sending verification..." : "Email Verification"}
            </button>
            }
         </>
      );
}