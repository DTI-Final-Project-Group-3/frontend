import { toast } from "@/hooks/use-toast";
import { CartItem } from "@/store/cartStore";

type GatewayTransferPayload = {
  accessToken: string | undefined;
  latitude: number | undefined;
  longitude: number | undefined;
  paymentMethodId: number;
  shippingCost: number;
  totalPrice: number;
  cartItems: CartItem[];
};

// Handle payment gateway checkout
export const createGatewayTransaction = async ({
  accessToken,
  latitude,
  longitude,
  paymentMethodId,
  shippingCost,
  totalPrice,
  cartItems,
}: GatewayTransferPayload) => {
  try {
    // Set order items
    const orderItems = cartItems.map((item) => ({
      productId: 3,
      quantity: item.cartQuantity,
      unitPrice: item.product.price,
    }));

    // Set payload
    const payload = {
      orderId: `ORDER-${Date.now()}-${Math.random().toString(10)}`,
      grossAmount: totalPrice + 25000,
      warehouseId: 3,
      latitude: latitude,
      longitude: longitude,
      paymentMethodId: paymentMethodId,
      shippingCost: shippingCost,
      orderStatusId: 1, // Default status for waiting payment
      orderItems: orderItems,
    };

    const response = await fetch(
      process.env.NEXT_PUBLIC_BACKEND_URL + "/api/v1/transactions/create",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) throw new Error("Failed to create transaction");

    const data = await response.json();

    await window.snap.pay(data.data.token);
  } catch (error) {
    console.error("Error creating transaction:", error);
    toast({
      title: "Payment failed",
      duration: 2000,
      variant: "destructive",
      description: "Please check your order and payment detail.",
    });
  }
};
