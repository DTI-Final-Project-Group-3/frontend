import { toast } from "@/hooks/use-toast";
import { ProductSummary } from "@/types/models/products";
import { WarehouseInventorySummary } from "@/types/models/warehouseInventories";
import { Warehouse } from "@/types/models/warehouses";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  inventoryId: number;
  product: ProductSummary;
  stockQuantity: number;
  cartQuantity: number;
  warehouse: Warehouse;
}

type CartState = {
  userId: string | null;
  role: string | null;
  isUserRegistered: boolean;
  isUserVerified: boolean;

  cartItems: CartItem[];
  totalItems: number; // Aggregate quantity of all items in the cart

  setUser: (userId: string, role: string, isVerified: boolean) => void;
  resetCart: () => void;
  addToCart: (cart: CartItem) => void;
  increaseQuantity: (inventoryId: number) => void;
  decreaseQuantity: (inventoryId: number) => void;
  removeFromCart: (inventoryId: number) => void;
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
      totalItems: 0, // Initialize totalItems to 0

      // Set user data
      setUser: (userId, role, isVerified) => {
        set({
          userId,
          role,
          isUserVerified: isVerified,
          cartItems: [],
          totalItems: 0, // Reset totalItems when setting a new user
        });
      },

      // Reset cart when user log out or changes
      resetCart: () => set({ cartItems: [], totalItems: 0 }), // Reset totalItems when resetting the cart

      // Add to Cart
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
            (item) => item.inventoryId === cart.inventoryId
          );

          if (existingItemIndex >= 0) {
            // Item already exists in cart
            const existingItem = state.cartItems[existingItemIndex];

            if (existingItem.cartQuantity + 1 > existingItem.stockQuantity) {
              toast({
                title: "Out of stock",
                description: `Only ${existingItem.stockQuantity} of stock available.`,
                variant: "destructive",
                duration: 2000,
              });
              return state;
            }

            const updatedCartItems = [...state.cartItems];
            updatedCartItems[existingItemIndex] = {
              ...existingItem,
              cartQuantity: existingItem.cartQuantity + 1,
            };

            return {
              ...state,
              cartItems: updatedCartItems,
              totalItems: state.totalItems + 1, // Increment totalItems by 1
            };
          }

          // Add new cart item to cart
          return {
            ...state,
            cartItems: [
              ...state.cartItems,
              {
                inventoryId: cart.inventoryId,
                product: cart.product,
                stockQuantity: cart.stockQuantity,
                cartQuantity: cart.cartQuantity,
                warehouse: cart.warehouse,
              },
            ],
            totalItems: state.totalItems + 1, // Increment totalItems by 1
          };
        }),

      // Increase Product Quantity
      increaseQuantity: (inventoryId) =>
        set((state) => {
          const updatedCartItems = state.cartItems.map((item) =>
            item.inventoryId === inventoryId &&
            item.cartQuantity < item.stockQuantity
              ? { ...item, cartQuantity: item.cartQuantity + 1 }
              : item
          );

          const totalItems = updatedCartItems.reduce(
            (sum, item) => sum + item.cartQuantity,
            0
          );

          return {
            ...state,
            cartItems: updatedCartItems,
            totalItems, // Update totalItems
          };
        }),

      // Decrease Product Quantity
      decreaseQuantity: (inventoryId) =>
        set((state) => {
          const updatedCartItems = state.cartItems
            .map((item) =>
              item.inventoryId === inventoryId && item.cartQuantity > 1
                ? { ...item, cartQuantity: item.cartQuantity - 1 }
                : item
            )
            .filter((item) => item.cartQuantity > 0);

          const totalItems = updatedCartItems.reduce(
            (sum, item) => sum + item.cartQuantity,
            0
          );

          return {
            ...state,
            cartItems: updatedCartItems,
            totalItems, // Update totalItems
          };
        }),

      // Remove from Cart
      removeFromCart: (inventoryId) =>
        set((state) => {
          const updatedCartItems = state.cartItems.filter(
            (item) => item.inventoryId !== inventoryId
          );
          const totalItems = updatedCartItems.reduce(
            (sum, item) => sum + item.cartQuantity,
            0
          );
          return { ...state, cartItems: updatedCartItems, totalItems }; // Update totalItems
        }),

      // Set cart items directly (to load data from local Storage)
      setCartItems: (newCartItems: CartItem[]) =>
        set((state) => {
          const totalItems =
            newCartItems.length > 0
              ? newCartItems.reduce((sum, item) => sum + item.cartQuantity, 0)
              : 0;
          return { ...state, cartItems: newCartItems, totalItems }; // Update totalItems
        }),
    }),
    {
      // Key for the local storage
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
