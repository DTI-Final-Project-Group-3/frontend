export interface UserAddress {
  id: number;
  name: string;
  detailAddress: string;
  latitude: number;
  longitude: number;
  primary?: boolean;
}
