export type OrderItems = {
  id: number;
  orderId: string;
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
};

export type Order = {
  id: number;
  userId: number;
  warehouseId: number;
  warehouseName: string;
  paymentMethodId: number;
  paymentMethodName: string;
  customerOrderitems: OrderItems[];
  paymentProofImageUrl: string;
  gatewayTrxId: string;
  shippingCost: number;
  totalAmount: number;
  orderStatusId: number;
  orderStatusName: string;
  invoiceCode: string;
  createdAt: Date;
  sentAt: Date;
};

export interface CustomerOrderHistoryRequestParams {
  page: number;
  limit: number;
  startDate?: string;
  endDate?: string;
  warehouseId?: number;
  customerOrderStatusId?: number;
  productId?: number;
  productCategoryId?: number;
  accessToken?: string;
}

export interface CustomerOrderHistoryResponse {
  dateTime: Date;
  orderId: number;
  invoiceCode: string;
  orderStatusId: number;
  orderStatusName: string;
  orderItemId: number;
  productId: number;
  productName: string;
  productCategoryId: number;
  productCategoryName: string;
  quantity: number;
  unitPrice: number;
}
