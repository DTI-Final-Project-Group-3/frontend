"use client";

import { createGatewayTransaction } from "@/app/api/transaction/createGatewayTransaction";
import { createManualTransaction } from "@/app/api/transaction/createManualTransaction";
import {
  getAllAddress,
  getMainAddress,
} from "@/app/api/transaction/getUserAddresses";
import CartItemsList from "@/components/checkout/CartItemsList";
import CheckoutSummary from "@/components/checkout/CheckoutSummary";
import ShippingAddress from "@/components/checkout/ShippingAddress";
import { toast } from "@/hooks/use-toast";
import { CartItem, useCartStore } from "@/store/cartStore";
import { PaymentMethods } from "@/types/models/checkout/paymentMethods";
import { Address } from "@/types/models/checkout/userAddresses";
import { ShippingDetail, ShippingList } from "@/types/models/shippingList";
import { useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { FC, useCallback, useEffect, useMemo, useState } from "react";

//const shipping_cost_url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/user/shipping/cost`;
const shipping_cost_url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/user/shipping/cost-dummy`;

const CheckoutPage: FC = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const cartItems = useCartStore((state) => state.cartItems);
  const setCartItems = useCartStore((state) => state.setCartItems);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethods>("gateway");
  const [userAddress, setUserAddress] = useState<Address[]>([]);
  const [mainAddress, setMainAddress] = useState<Address | null>(null);
  const [shippingCost, setShippingCost] = useState(0);
  const [shippingList, setShippingList] = useState<ShippingList | null>(null);
  const [shippingMethodSelected, setShippingMethodSelected] = useState(false);

  // Load cart data from local storage if there is any data on mount
  useEffect(() => {
    const storedCart = localStorage.getItem("cart-storage");
    if (storedCart) setCartItems(JSON.parse(storedCart));
  }, [setCartItems]);

  // Sync cart data to local storage whenever cartItems change
  useEffect(() => {
    if (cartItems.length > 0)
      localStorage.setItem("cart-storage", JSON.stringify(cartItems));
    else localStorage.removeItem("cart-storage");
  }, [cartItems]);

  // Calculate total price
  const totalPrice = useMemo(
    () =>
      cartItems.reduce(
        (acc, item) => acc + item.product.price * item.cartQuantity,
        0
      ),
    [cartItems]
  );

  const setShippingMethod = (method: ShippingDetail | null) => {
    if (method) {
      setShippingCost(method.cost);
      setShippingMethodSelected(true);
    } else {
      setShippingMethodSelected(false);
    }
  }

  // Calculate total quantity
  const totalQuantity = useMemo(
    () => cartItems.reduce((acc, item) => acc + item.cartQuantity, 0),
    [cartItems]
  );

  const fetchShippingAddress = useCallback(async (address : Address | null) => {
    if (!session) return;
    if (!address) return;
  
    const res = await fetch(shipping_cost_url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.accessToken}`,
      },
      body: JSON.stringify({
        warehouseId: 1,
        userAddressId: address?.id,
        courier: "jne:tiki:wahana:sicepat:anteraja:pos",
        weight: 100, // gram
      }),
    });
  
    const response = await res.json();
    if (response.success) {
      setShippingList(response.data);
    } else {
      toast({
        title: "Failed to get shipping cost",
        description: `${response.message}`,
      });
    }
  }, [session]);

  const setSelectedShippingAddress = useCallback((selectedShippingAddress: Address) => {
    setShippingMethodSelected(false);
    setShippingList(null);
    fetchShippingAddress(selectedShippingAddress);
  }, [fetchShippingAddress]);

  useEffect(() => {
    const fetchUserAddress = async () => {
      if (session) {
        const userAddress = await getAllAddress(session.accessToken);
        const mainAddress = await getMainAddress(session.accessToken);
        setUserAddress(userAddress);
        setMainAddress(mainAddress);
        console.log(mainAddress);
      }
    };

    fetchUserAddress();
  }, [session]);

  // Tanstack Query mutations transaction
  const gatewayTransaction = useMutation({
    mutationFn: () =>
      createGatewayTransaction({
        accessToken: session?.accessToken,
        latitude: mainAddress?.latitude || 0,
        longitude: mainAddress?.longitude || 0,
        shippingCost: shippingCost,
        paymentMethodId: paymentMethod === "gateway" ? 1 : 2,
        totalPrice: totalPrice,
        cartItems: cartItems as CartItem[],
      }),
  });

  const manualTransaction = useMutation({
    mutationFn: () =>
      createManualTransaction(
        {
          accessToken: session?.accessToken,
          latitude: mainAddress?.latitude || 0,
          longitude: mainAddress?.longitude || 0,
          shippingCost: shippingCost,
          paymentMethodId: paymentMethod === "gateway" ? 1 : 2,
          totalPrice: totalPrice,
          cartItems: cartItems as CartItem[],
        },
        router
      ),
  });

  return (
    <>
      {/* Midtrans snap pop up  */}
      <Script
        src={process.env.NEXT_PUBLIC_MIDTRANS_SNAP_URL}
        data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
        strategy="lazyOnload"
      />
      <section className="py-[40px] px-6 bg-slate-100 min-h-[calc(100vh-70px)] w-full">
        <div className="md:max-w-4xl lg:max-w-[1340px] mx-auto w-full">
          {/* Breadcrumbs */}
          <div className="flex">
            <h1 className="text-4xl text-gray-500 font-medium">
              <Link href="/cart">Cart</Link>
            </h1>
            <span className="text-4xl text-gray-500 mx-2">/</span>
            <h1 className="text-4xl font-semibold">Checkout</h1>
          </div>

          <div className="mt-[40px] flex flex-col-reverse lg:flex-row gap-8 w-full">
            {/* Checkout details & shipping address */}
            <div className="flex flex-col gap-6 w-full">
              <ShippingAddress userAddress={userAddress} setSelectedShippingAddress={setSelectedShippingAddress}/>
              <CartItemsList cartItems={cartItems} />
            </div>

            {/* Checkout Summary */}
            <div className="flex flex-col w-full md:w-[480px] lg:w-[600px] relative">
              <CheckoutSummary
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
                totalQuantity={totalQuantity}
                totalPrice={totalPrice}
                handleCheckout={gatewayTransaction.mutate}
                handleManualCheckout={manualTransaction.mutate}
                isLoading={
                  gatewayTransaction.isPending || manualTransaction.isPending
                }
                isError={
                  gatewayTransaction.isError || manualTransaction.isError
                }
                shippingCost={shippingCost}
                shippingList={shippingList}
                shippingMethodSelected={shippingMethodSelected}
                setShippingMethod={setShippingMethod}
                isDisabled={cartItems.length < 1}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default CheckoutPage;
