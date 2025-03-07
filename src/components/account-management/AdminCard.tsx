import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { UserAdminDetail } from "@/types/models/userAdminDetail";
import axios from "axios";
import { Session } from "next-auth";
import { useCallback, useState } from "react";
import { Button } from "../ui/button";

const placeholderImage = "https://dummyimage.com/150x150/cccccc/ffffff&text=No+Image";
const admin_url = `${process.env.NEXT_PUBLIC_BACKEND_URL}${process.env.NEXT_PUBLIC_ADMIN}`;
const admin_assign = `${process.env.NEXT_PUBLIC_BACKEND_URL}${process.env.NEXT_PUBLIC_ADMIN_ASSIGN_WAREHOUSE}`;

interface Props {
  admin: UserAdminDetail;
  refresh: () => void;
  session: Session | null;
}

export const AdminCard = ({ admin, refresh, session }: Props) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [assignmentDialogOpen, setAssignmentDialogOpen] = useState(false);

  const deleteAdmin = useCallback(async () => {
    if (!session) return;

    try {
      const response = await axios.delete(
        `${admin_url}/id/${admin.id}`,
        { headers: { Authorization: `Bearer ${session.accessToken}` } }
      );

      if (response.data.success) {
        toast({ title: "Success", description: "Successfully deleted admin", duration: 2000 });
        refresh();
      } else {
        toast({ title: "Failed", description: "Failed to delete admin", duration: 2000 });
      }
    } catch (error) {
      console.error("Error deleting admin", error);
      toast({ title: "Error", description: "Error deleting admin", duration: 2000 });
    }
    setDeleteDialogOpen(false);
  }, [admin, refresh, session]);

  const removeAssignment = async () => {
    try {
      const res = await fetch(admin_assign, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.accessToken}`,
        },
        body: JSON.stringify({
          userAssigneeId: admin.id
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast({ title: "Success", description: "Admin removed successfully", duration: 2000 });
        refresh();
      } else {
        toast({ title: "Failed", description: "Failed to remove admin", duration: 2000 });
      }
    } catch (error) {
      console.error("Error removing admin:", error);
      toast({ title: "Error", description: "Error removing admin", duration: 2000 });
    }
    setAssignmentDialogOpen(false);
  };

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
      {admin.warehouseId > 0 ? (
        <>
          <p className="text-sm font-medium mt-2 text-blue-600">Warehouse ID: {admin.warehouseId}</p>
          <p className="text-sm font-medium mt-2 text-blue-600">Assigner ID: {admin.userAssignerId}</p>
          <Button variant="blue" className="mt-2" onClick={() => setAssignmentDialogOpen(true)}>
            Remove assignment
          </Button>
        </>
      ) : (
        <>
          <p className="text-sm font-medium mt-2 text-red-500">Not assigned to a warehouse</p>
          <Button variant="destructive" className="mt-2" onClick={() => setDeleteDialogOpen(true)}>
            Delete admin
          </Button>
        </>
      )}

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete {admin.fullname}? This action cannot be undone.
          </DialogDescription>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={deleteAdmin}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={assignmentDialogOpen} onOpenChange={setAssignmentDialogOpen}>
        <DialogContent>
          <DialogTitle>Confirm Removal</DialogTitle>
          <DialogDescription>
            Are you sure you want to remove {admin.fullname} from the warehouse assignment?
          </DialogDescription>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setAssignmentDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={removeAssignment}>Remove</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
