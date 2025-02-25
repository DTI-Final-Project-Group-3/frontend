import { toast } from "@/hooks/use-toast";
import { CartItem } from "@/store/cartStore";

type ManualTransferPayload = {
  accessToken: string | undefined;
  latitude: number | undefined;
  longitude: number | undefined;
  paymentMethodId: number;
  shippingCost: number;
  totalPrice: number;
  paymentProofUrl?: string;
  cartItems: CartItem[];
};

// Handle manual transfer payment
export const createManualTransaction = async ({
  accessToken,
  latitude,
  longitude,
  shippingCost,
  paymentMethodId,
  totalPrice,
  paymentProofUrl,
  cartItems,
}: ManualTransferPayload) => {
  try {
    // Set order items
    const orderItems = cartItems.map((item) => ({
      productId: item.product.id,
      quantity: item.cartQuantity,
      unitPrice: item.product.price,
    }));

    const payload = {
      latitude: latitude,
      longitude: longitude,
      paymentMethodId: paymentMethodId,
      orderStatusId: 1, // Default status for waiting payment
      shippingCost: shippingCost,
      grossAmount: Math.ceil(totalPrice + 25000),
      paymentProofUrl: paymentProofUrl,
      orderItems: orderItems,
    };

    console.log("payload", payload);

    const response = await fetch(
      process.env.NEXT_PUBLIC_BACKEND_URL +
        "/api/v1/transactions/create-manual",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization" : `Bearer ${accessToken}`
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) throw new Error("Failed to create manual transaction");

    toast({
      title: "Manual Payment Initiated",
      description: "Please follow the instructions to complete your payment.",
      duration: 3000,
    });

    // Optionally, redirect user to instructions page
  } catch (error) {
    toast({
      title: "Payment Error",
      description: `${error} Something went wrong. Please try again.`,
      variant: "destructive",
      duration: 2000,
    });
  }
};
