import { toast } from "@/hooks/use-toast";
import { UserDetail } from "@/types/models/userDetail";
import { useSession } from "next-auth/react";
import NextImage from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

const user_detail_url = `${process.env.NEXT_PUBLIC_BACKEND_URL}${process.env.NEXT_PUBLIC_USER_DETAIL}`;
const imgbb_api = `${process.env.NEXT_PUBLIC_IMGBB_API}`;

export default function ProfileImage() {
    const { data: session, status } = useSession();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [userData, setUserData] = useState<UserDetail | null | undefined>(null);
    const [isUploading, setIsUploading] = useState(false);

    const refresh = useCallback(async () => {
        if (!session)
            return;
        if (status === "authenticated") {
          try {
            const res = await fetch(user_detail_url, {
              headers: { Authorization: `Bearer ${session.accessToken}` },
            });
            const data = await res.json();
            if (data.success) {
              setUserData(data.data);
            } else {
              toast({title: "Failed", description: "Failed to fetch user details", duration: 2000,});
            }
          } catch (error) {
            console.error("Error fetching user details:", error);
            toast({title: "Error", description: "Error fetching user details", duration: 2000,});
          }
        }
      },[session, status])

    useEffect(() => {
        refresh();
    },[refresh, session, status])

    const resizeImage = (file: File, minSize = 300): Promise<Blob> => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                const { width, height } = img;
    
                // Determine scaling factor
                const scale = Math.max(minSize / width, minSize / height, 1); // Ensure at least 300px
                const newWidth = Math.round(width * scale);
                const newHeight = Math.round(height * scale);
    
                // Create canvas
                const canvas = document.createElement("canvas");
                canvas.width = newWidth;
                canvas.height = newHeight;
                const ctx = canvas.getContext("2d");
    
                if (!ctx) {
                    reject(new Error("Canvas context not available"));
                    return;
                }
    
                ctx.drawImage(img, 0, 0, newWidth, newHeight);
    
                // Convert to Blob
                canvas.toBlob((blob) => {
                    if (blob) resolve(blob);
                    else reject(new Error("Failed to convert image to Blob"));
                }, file.type || "image/jpeg", 0.9); // Adjust quality if needed
            };
    
            img.onerror = reject;
            img.src = URL.createObjectURL(file);
        });
    };
    
    const uploadToImgBB = async (file: File): Promise<string | null> => {
        try {
            const resizedBlob = await resizeImage(file);
            const formData = new FormData();
            formData.append("image", resizedBlob, file.name);
    
            const res = await fetch(`https://api.imgbb.com/1/upload?key=${imgbb_api}`, {
                method: "POST",
                body: formData,
            });
    
            const data = await res.json();
            console.log("Response Data:", data);
            return data.success ? data.data.url : null;
        } catch (error) {
            console.error("Error uploading to ImgBB:", error);
            return null;
        }
    };

    const updateProfileImage = async (imageUrl: string) => {
        if (!session) return;

        try {
            const res = await fetch(user_detail_url, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${session.accessToken}`,
                },
                body: JSON.stringify({ profileImageUrl: imageUrl }),
            });

            const data = await res.json();
            if (data.success) {
                toast({title: "Success", description: "Profile image updated successfully", duration: 2000,});
                refresh();
            } else {
                toast({title: "Failed", description: "Failed to update profile image", duration: 2000,});
            }
        } catch (error) {
            console.error("Error updating profile image:", error);
            toast({title: "Error", description: "Error updating profile image", duration: 2000,});
        }
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) return;
    
        setIsUploading(true);
        const imageUrl = await uploadToImgBB(selectedFile);
    
        if (imageUrl) {
            await updateProfileImage(imageUrl);
            setIsDialogOpen(false);
        } else {
            toast({ title: "Failed", description: "Failed to upload image", duration: 2000 });
        }
    
        setIsUploading(false);
    };

    useEffect(() => {
        if (isDialogOpen) {
            setIsUploading(false);
        }
    }, [isDialogOpen]);

    return (
        <>
            <button onClick={() => {setSelectedFile(null) ; setIsDialogOpen(true)}} className="p-0 bg-transparent w-48 h-48">
                <NextImage
                    src={userData?.profileImageUrl || "/images/no-image-icon.jpg"}
                    height={150}
                    width={150}
                    alt="Profile"
                    className="w-48 h-48 rounded-full object-cover"
                />
            </button>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Upload New Profile Image</DialogTitle>
                    </DialogHeader>
                    <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                    />
                    <Button onClick={() => fileInputRef.current?.click()} className="w-full">
                        Select Image
                    </Button>
                    {selectedFile && <p className="text-center mt-2">{selectedFile.name}</p>}
                    <Button onClick={handleUpload} disabled={!selectedFile || isUploading} className="w-full mt-4">
                        {isUploading ? "Uploading..." : "Upload"}
                    </Button>
                </DialogContent>
            </Dialog>
        </>
    );
}
