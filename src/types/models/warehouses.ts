export interface Warehouse {
  id: number;
  name: string;
}

export interface WarehouseDetail extends Warehouse {
  description: string;
  detailAddress: string;
  longitude: number;
  latitude: number;
}

export interface NearbyWarehouseQuantityResponse {
  id: number;
  name: string;
  distanceInMeters: number;
  totalQuantity: number;
}
