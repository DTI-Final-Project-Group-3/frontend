export type Address = {
  id: number;
  name: string;
  detailAddress: string;
  latitude: number;
  longitude: number;
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
  primary: boolean;
};
