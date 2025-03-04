import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRef, useState } from "react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

const user_detail_url = `${process.env.NEXT_PUBLIC_BACKEND_URL}${process.env.NEXT_PUBLIC_USER_DETAIL}`;
const imgbb_api = `${process.env.NEXT_PUBLIC_IMGBB_API}`;

interface ProfileImageProps {
    profile_image_url: string;
    refresh : () => void;
}

export default function ProfileImage({ profile_image_url, refresh }: ProfileImageProps) {
    const { data: session } = useSession();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Function to upload to ImgBB
    const uploadToImgBB = async (file: File): Promise<string | null> => {
        const formData = new FormData();
        formData.append("image", file);

        try {
            const res = await fetch(`https://api.imgbb.com/1/upload?key=${imgbb_api}`, {
                method: "POST",
                body: formData,
            });
            const data = await res.json();
            console.log("api key = " + imgbb_api)
            console.log("Response Data:");
            Object.entries(data).forEach(([key, value]) => {
                console.log(`${key}:`, value);
            });
            return data.success ? data.data.url : null;
        } catch (error) {
            console.error("Error uploading to ImgBB:", error);
            return null;
        }
    };

    // Function to update profile image in the backend
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
                alert("Profile image updated successfully");
                refresh();
            } else {
                alert("Failed to update profile image");
            }
        } catch (error) {
            console.error("Error updating profile image:", error);
            alert("Error updating profile image");
        }
    };

    // Function to handle file selection
    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    // Function to handle upload process
    const handleUpload = async () => {
        if (!selectedFile) return;

        const imageUrl = await uploadToImgBB(selectedFile);
        if (imageUrl) {
            await updateProfileImage(imageUrl);
            setIsDialogOpen(false);
        } else {
            alert("Failed to upload image");
        }
    };

    return (
        <>
            {/* Profile Image Button */}
            <button onClick={() => {setSelectedFile(null) ; setIsDialogOpen(true)}} className="p-0 bg-transparent w-48 h-48">
                <Image
                    src={profile_image_url}
                    height={150}
                    width={150}
                    alt="Profile"
                    className="w-48 h-48 rounded-full object-cover"
                />
            </button>

            {/* Dialog for Image Upload */}
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
                    <Button onClick={handleUpload} disabled={!selectedFile} className="w-full mt-4">
                        Upload
                    </Button>
                </DialogContent>
            </Dialog>
        </>
    );
}
