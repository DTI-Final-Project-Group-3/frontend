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
