import { toast } from "@/hooks/use-toast";
import { WarehouseInventorySummary } from "@/types/models/warehouseInventories";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type CartState = {
  userId: string | null;
  role: string | null;
  isUserRegistered: boolean;
  isUserVerified: boolean;

  cartItems: WarehouseInventorySummary[];
  totalItems: number;

  setUser: (userId: string, role: string, isVerified: boolean) => void;
  resetCart: () => void;
  addToCart: (inventory: WarehouseInventorySummary) => void;
  increaseQuantity: (inventoryId: number) => void;
  decreaseQuantity: (inventoryId: number) => void;
  removeFromCart: (inventoryId: number) => void;
  setCartItems: (newCartItems: WarehouseInventorySummary[]) => void;
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

      // Set user data
      setUser: (userId, role, isVerified) => {
        set({
          userId,
          role,
          isUserVerified: isVerified,
          cartItems: [],
          totalItems: 0,
        });
      },

      // Reset cart when user log out or changes
      resetCart: () => set({ cartItems: [], totalItems: 0 }),

      // Add to Cart
      addToCart: (product) =>
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
              description: `${product.product.name} has been added to your cart.`,
              duration: 2000,
            });
          }

          const existingItemIndex = state.cartItems.findIndex(
            (item) => item.id === product.id
          );

          if (existingItemIndex >= 0) {
            // Item already exists in cart
            const existingItem = state.cartItems[existingItemIndex];

            if (existingItem.quantity + 1 > product.quantity) {
              toast({
                title: "Out of stock",
                description: `Only ${existingItem.stock} of stock available.`,
                variant: "destructive",
                duration: 2000,
              });
              return state;
            }

            const updatedCartItems = [...state.cartItems];
            updatedCartItems[existingItemIndex] = {
              ...existingItem,
              quantity: existingItem.quantity + 1,
            };

            return {
              ...state,
              cartItems: updatedCartItems,
              totalItems: state.totalItems + 1,
            };
          }

          // Add new product to cart
          return {
            ...state,
            cartItems: [
              ...state.cartItems,
              {
                ...product,
                stock: product.quantity,
                quantity: 1,
              },
            ],
            totalItems: state.totalItems + 1,
          };
        }),

      // Increase Product Quantity
      increaseQuantity: (productId) =>
        set((state) => ({
          cartItems: state.cartItems.map((item) =>
            item.id === productId && item.quantity < item.stock
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        })),

      // Decrease Product Quantity
      decreaseQuantity: (productId) =>
        set((state) => ({
          cartItems: state.cartItems
            .map((item) =>
              item.id === productId && item.quantity > 1
                ? { ...item, quantity: item.quantity - 1 }
                : item
            )
            .filter((item) => item.quantity > 0),
        })),

      // Remove from Cart
      removeFromCart: (productId) =>
        set((state) => {
          const updatedCartItems = state.cartItems.filter(
            (item) => item.id !== productId
          );
          const totalItems = updatedCartItems.reduce(
            (sum, item) => sum + item.quantity,
            0
          );
          return { ...state, cartItems: updatedCartItems, totalItems };
        }),

      // Set cart items directly (to load data from local Storage)
      setCartItems: (newCartItems: WarehouseInventorySummary[]) =>
        set((state) => {
          const totalItems =
            newCartItems.length > 0
              ? newCartItems.reduce((sum, item) => sum + item.quantity, 0)
              : 0;
          return { ...state, cartItems: newCartItems, totalItems };
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
