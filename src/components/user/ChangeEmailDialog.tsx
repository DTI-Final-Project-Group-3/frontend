import { toast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";
import { useState } from "react";

const change_email_request_url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/user/email/request-email-change`;

export default function ChangeEmailDialog({ onClose }: { onClose: () => void }) {
    const { data: session } = useSession();
    const [email, setEmail] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
  
    const handleEmailChangeRequest = async () => {
      if (!session) return;
      try {
        setIsSubmitting(true);
        const res = await fetch(change_email_request_url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.accessToken}`,
          },
          body: JSON.stringify({ email }),
        });
        const data = await res.json();
        if (data.success) {
          toast({
            title: "Success",
            description: "Check your new email for verification link",
            duration: 2000,
          });
          onClose();
        } else {
          toast({
            title: "Failed",
            description: "Failed to send email change request",
            duration: 2000,
          });
        }
      } catch (error) {
        console.error("Error sending email change request:", error);
        toast({
          title: "Error",
          description: "Error sending email change request",
          duration: 2000,
        });
      } finally {
        setIsSubmitting(false);
      }
    };
  
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
          <h2 className="text-xl font-semibold mb-4">Change Email</h2>
          <input
            type="email"
            className="w-full px-4 py-2 border rounded-md mb-4"
            placeholder="Enter new email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="flex justify-end space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              onClick={handleEmailChangeRequest}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sending..." : "Send Request"}
            </button>
          </div>
        </div>
      </div>
    );
  }