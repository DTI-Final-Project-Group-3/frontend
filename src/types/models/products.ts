export interface Product {
  id: number;
  name: string;
  imageUrl: string;
  description: string;
  price: number;
  weight: number;
  height: number;
  width: number;
  length: number;
}

export interface ProductImage {
  imageUrl: string;
  orderNumber: number;
}
