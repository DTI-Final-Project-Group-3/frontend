import { WarehouseDetail } from "./warehouses";

interface assignedAdmin {
  userAssigneeId: number;
  userAssignerId: number;
}

export interface WarehouseAssignedDetail extends WarehouseDetail {
  assignedAdmins : assignedAdmin[];
}