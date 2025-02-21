import CartItem from "@/components/cart/components/CartItem";
import { toast } from "@/hooks/use-toast";
import { ProductSummary } from "@/types/models/products";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  product: ProductSummary;
  cartQuantity: number;
}

type CartState = {
  userId: string | null;
  role: string | null;
  isUserRegistered: boolean;
  isUserVerified: boolean;

  cartItems: CartItem[];
  totalItems: number;

  setUser: (userId: string, role: string, isVerified: boolean) => void;
  resetCart: () => void;
  addToCart: (cart: CartItem) => void;
  increaseQuantity: (productId: number) => void;
  decreaseQuantity: (productId: number) => void;
  removeFromCart: (productId: number) => void;
  setCartItems: (newCartItems: CartItem[]) => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      userId: null,
      role: null,
      cartItems: [],
      isUserRegistered: false,
      isUserVerified: false,
      totalItems: 0,

      setUser: (userId, role, isVerified) => {
        set({
          userId,
          role,
          isUserVerified: isVerified,
          cartItems: [],
          totalItems: 0,
        });
      },

      resetCart: () => set({ cartItems: [], totalItems: 0 }),

      addToCart: (cart) =>
        set((state) => {
          if (
            !state.isUserRegistered &&
            !state.isUserVerified &&
            state.role !== "ROLE_CUSTOMER"
          ) {
            toast({
              title: "Failed to add to cart",
              description:
                "You must be registered and verified to add to cart.",
              variant: "destructive",
              duration: 2000,
            });
            return state;
          } else {
            toast({
              title: "Added to cart",
              description: `${cart.product.name} has been added to your cart.`,
              duration: 2000,
            });
          }

          const existingItemIndex = state.cartItems.findIndex(
            (item) => item.product.id === cart.product.id
          );

          if (existingItemIndex >= 0) {
            const existingItem = state.cartItems[existingItemIndex];

            const updatedCartItems = [...state.cartItems];
            updatedCartItems[existingItemIndex] = {
              ...existingItem,
              cartQuantity: existingItem.cartQuantity + 1,
            };

            return {
              ...state,
              cartItems: updatedCartItems,
              totalItems: state.totalItems + 1,
            };
          }

          const newItem: CartItem = {
            product: cart.product,
            cartQuantity: cart.cartQuantity,
          };

          return {
            ...state,
            cartItems: [...state.cartItems, newItem],
            totalItems: state.totalItems + cart.cartQuantity,
          };
        }),

      increaseQuantity: (productId) =>
        set((state) => {
          const updatedCartItems = state.cartItems.map((item) => {
            if (
              item.product.id === productId &&
              item.cartQuantity < item.product.totalStock
            ) {
              const newQuantity = item.cartQuantity + 1;
              return {
                ...item,
                cartQuantity: newQuantity,
                available: item.product.totalStock >= newQuantity,
              };
            }
            return item;
          });

          const totalItems = updatedCartItems.reduce(
            (sum, item) => sum + item.cartQuantity,
            0
          );

          return { ...state, cartItems: updatedCartItems, totalItems };
        }),

      decreaseQuantity: (productId) =>
        set((state) => {
          const updatedCartItems = state.cartItems
            .map((item) => {
              if (item.product.id === productId && item.cartQuantity > 1) {
                const newQuantity = item.cartQuantity - 1;
                return {
                  ...item,
                  cartQuantity: newQuantity,
                  available: item.product.totalStock >= newQuantity,
                };
              }
              return item;
            })
            .filter((item) => item.cartQuantity > 0);

          const totalItems = updatedCartItems.reduce(
            (sum, item) => sum + item.cartQuantity,
            0
          );

          return { ...state, cartItems: updatedCartItems, totalItems };
        }),

      removeFromCart: (productId) =>
        set((state) => {
          const updatedCartItems = state.cartItems.filter(
            (item) => item.product.id !== productId
          );
          const totalItems = updatedCartItems.reduce(
            (sum, item) => sum + item.cartQuantity,
            0
          );
          return { ...state, cartItems: updatedCartItems, totalItems };
        }),

      setCartItems: (newCartItems: CartItem[]) =>
        set((state) => {
          const totalItems =
            newCartItems.length > 0
              ? newCartItems.reduce((sum, item) => sum + item.cartQuantity, 0)
              : 0;
          return { ...state, cartItems: newCartItems, totalItems };
        }),
    }),

    {
      name: "cart-storage",
      partialize: (state) => ({
        userId: state.userId,
        role: state.role,
        isUserVerified: state.isUserVerified,
        cartItems: state.cartItems,
        totalItems: state.totalItems,
      }),
    }
  )
);
