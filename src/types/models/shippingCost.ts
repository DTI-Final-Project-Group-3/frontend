export interface ShippingCost {
    courier: string;
    costs: {
        service: string;
        cost: number;
        etd: string;
    }[];
}