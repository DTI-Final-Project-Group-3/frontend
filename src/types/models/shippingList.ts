export interface ShippingDetail {
    service: string;
    cost: number;
    etd: string;
    name: string;
    code: string;
    description: string;
  }
  
export interface ShippingList {
    couriers: string;
    details: ShippingDetail[];
}
