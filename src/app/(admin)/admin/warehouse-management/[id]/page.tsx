"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";
import { UserAdminDetail } from "@/types/models/userAdminDetail";
import { WarehouseDetail } from "@/types/models/warehouses";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

const warehouse_url = `${process.env.NEXT_PUBLIC_BACKEND_URL}${process.env.NEXT_PUBLIC_WAREHOUSES}`;
const warehouse_assigned_url = `${process.env.NEXT_PUBLIC_BACKEND_URL}${process.env.NEXT_PUBLIC_ADMIN_ASSIGNED}`;
const warehouse_page = "/admin/warehouse-management"
const warehouse_edit = "/admin/warehouse-management/edit"

export default function WarehouseInfo() {
    const { id } = useParams();
    const { data: session, status } = useSession();
    const [warehouse, setWarehouse] = useState<WarehouseDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const [admins, setAdmins] = useState<UserAdminDetail[] | null>(null);
    const [openDialog, setOpenDialog] = useState(false);

    const fetchWarehouse = useCallback(async () => {
        try {
            const res = await fetch(`${warehouse_url}/${id}`, {
                headers: { Authorization: `Bearer ${session?.accessToken}` },
            });
            const data = await res.json();
            if (data.success) {
                setWarehouse(data.data);
            } else {
                toast({ title: "Failed", description: "Failed to fetch warehouse", duration: 2000 });
            }
        } catch (error) {
            console.error("Error fetching warehouse:", error);
            toast({ title: "Error", description: "Error fetching warehouse", duration: 2000 });
        } finally {
            setLoading(false);
        }
    }, [session, id]);


    const deleteWarehouse = useCallback(async () => {
        try {
            const res = await fetch(`${warehouse_url}/${id}`, {
                method : "DELETE",
                headers: { Authorization: `Bearer ${session?.accessToken}` },
            });
            const data = await res.json();
            if (data.success) {
                toast({ title: "Success", description: "Warehouse successfully deleted", duration: 2000 });
                router.push(warehouse_page);
            } else {
                toast({ title: "Failed", description: "Failed to delete warehouse", duration: 2000 });
            }
        } catch (error) {
            console.error("Error fetching warehouse:", error);
            toast({ title: "Error", description: "Error fetching warehouse", duration: 2000 });
        } finally {
            setLoading(false);
        }
    }, [session, id, router]);

    const fetchAssignedAdmins = useCallback(async () => {
        try {
          const res = await fetch(warehouse_assigned_url + "?warehouseId=" + id, {
            headers: { Authorization: `Bearer ${session?.accessToken}` },
          });
          const data = await res.json();
          if (data.success) {
            setAdmins(data.data);
          } else {
            toast({title: "Failed", description: "Failed to fetch assigned admins", duration: 2000,});
          }
        } catch (error) {
          console.error("Error fetching assigned admins:", error);
          toast({title: "Error", description: "Error fetching assigned admins", duration: 2000,});
        }
    }, [id, session]);

    useEffect(() => {
        if (status === "authenticated") {
            fetchWarehouse();
            fetchAssignedAdmins();
        }
    }, [status, session, fetchWarehouse, fetchAssignedAdmins]);

    if (loading) {
        return <Skeleton className="w-full h-40" />;
    }

    if (!warehouse) {
        return <p className="text-red-500">Warehouse not found.</p>;
    }

    return (
        <>
            <Card className="w-full mx-auto mt-6">
                <CardHeader>
                    <CardTitle>
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                            <span>{warehouse.name}</span>
                            <div>
                                <Button 
                                    className="mx-2"
                                    onClick={() => router.push(`${warehouse_page}`)}
                                    variant="grey">Return</Button>
                                <Button 
                                    className="mx-2"
                                    onClick={() => router.push(`${warehouse_edit}/${warehouse.id}`)}
                                    variant="blue">Edit warehouse detail</Button>
                                <Button 
                                    className="mx-2"
                                    onClick={() => setOpenDialog(true)}
                                    variant="destructive">Delete Warehouse</Button>
                            </div>
                        </div>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-gray-600">{warehouse.description}</p>
                    <p className="text-gray-500 mt-2">{warehouse.detailAddress}</p>
                    <div className="mt-4">
                        <iframe
                            width="100%"
                            className="rounded-lg h-[250px] md:h-[400px]"
                            src={`https://www.google.com/maps?q=${warehouse.latitude},${warehouse.longitude}&output=embed`}
                            allowFullScreen
                            loading="lazy"
                        />
                    </div>
                </CardContent>
            </Card>
            <Card className="w-full mx-auto mt-6">
                <CardHeader>
                    <CardTitle>Assigned Admins</CardTitle>
                </CardHeader>
                <CardContent>
                    {admins && admins.length > 0 ? (
                        <>
                            <div className="hidden md:block overflow-x-auto">
                                <table className="w-full border-collapse border border-gray-300">
                                    <thead>
                                        <tr className="bg-gray-100">
                                            <th className="border border-gray-300 px-4 py-2 w-1/3">Name</th>
                                            <th className="border border-gray-300 px-4 py-2 w-1/3">Email</th>
                                            <th className="border border-gray-300 px-4 py-2 w-1/3">Assigned By</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {admins.map((admin) => (
                                            <tr key={admin.id} className="hover:bg-gray-50">
                                                <td className="border border-gray-300 px-4 py-2">{admin.fullname}</td>
                                                <td className="border border-gray-300 px-4 py-2">{admin.email}</td>
                                                <td className="border border-gray-300 px-4 py-2">{admin.userAssignerEmail}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                                    
                            <ul className="md:hidden space-y-4">
                                {admins.map((admin) => (
                                    <li key={admin.id} className="p-4 border border-gray-300 rounded-lg shadow-sm bg-white">
                                        <p className="text-lg font-medium text-gray-800">{admin.fullname}</p>
                                        <p className="text-gray-600">{admin.email}</p>
                                        <p className="text-sm text-gray-500">Assigned by: {admin.userAssignerEmail}</p>
                                    </li>
                                ))}
                            </ul>
                        </>
                    ) : (
                        <p className="text-gray-500">No admins assigned to this warehouse.</p>
                    )}
                </CardContent>
            </Card>

            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Deletion</DialogTitle>
                    </DialogHeader>
                    <p>Are you sure you want to delete this warehouse? This action cannot be undone.</p>
                    <DialogFooter>
                        <Button variant="grey" onClick={() => setOpenDialog(false)}>Cancel</Button>
                        <Button variant="destructive" onClick={deleteWarehouse}>Delete</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
