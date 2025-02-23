import { UserDetail } from "./userDetail";

export interface UserAdminDetail extends UserDetail {
    warehouseId: number;
    userAssignerId: number;
}