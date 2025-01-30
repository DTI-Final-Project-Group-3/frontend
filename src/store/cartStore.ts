import { toast } from "@/hooks/use-toast";
import { create } from "zustand";

type CartItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
  stock: number;
};

type CartState = {
  cartItems: CartItem[];
  isUserRegistered: boolean;
  isUserVerified: boolean;
  totalItems: number;
  addToCart: (product: CartItem) => void;
  updateCart: (productId: number, quantity: number) => void;
  increaseQuantity: (productId: number) => void;
  decreaseQuantity: (productId: number) => void;
  removeFromCart: (productId: number) => void;
};

export const useCartStore = create<CartState>((set) => ({
  cartItems: [],
  isUserRegistered: false,
  isUserVerified: false,
  totalItems: 0,

  // Add to Cart
  addToCart: (product) =>
    set((state) => {
      if (!state.isUserRegistered || !state.isUserVerified) {
        toast({
          title: "Failed to add to cart",
          description: "You must be registered and verified to add to cart.",
          variant: "destructive",
        });
        return state;
      }

      const existingItemIndex = state.cartItems.findIndex(
        (item) => item.id === product.id
      );

      if (existingItemIndex >= 0) {
        // Item already exists in cart
        const existingItem = state.cartItems[existingItemIndex];

        if (existingItem.quantity + 1 > product.stock) {
          console.error("Stock not available.");
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
        cartItems: [...state.cartItems, { ...product, quantity: 1 }],
        totalItems: state.totalItems + 1,
      };
    }),

  // Update Cart Quantity
  updateCart: (productId, quantity) =>
    set((state) => {
      const updatedCartItems = state.cartItems.map((item) =>
        item.id === productId
          ? { ...item, quantity: Math.max(1, quantity) }
          : item
      );
      const totalItems = updatedCartItems.reduce(
        (sum, item) => sum + item.quantity,
        0
      );
      return { ...state, cartItems: updatedCartItems, totalItems };
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
}));
