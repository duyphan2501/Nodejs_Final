import { create } from "zustand";

const useCartStore = create((set) => {
  const cartItems = [
    {
      id: 1,
      name: "GIÀY HANDBALL SPEZIAL",
      description: "OLIVE STRATA / CREAM WHITE / GUM",
      size: "8.5 UK",
      price: 2500000,
      quantity: 1,
      image:
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop",
    },
    {
      id: 2,
      name: "GIÀY HANDBALL SPEZIAL",
      description: "OLIVE STRATA / CREAM WHITE / GUM",
      size: "8.5 UK",
      price: 2500000,
      quantity: 1,
      image:
        "https://tse3.mm.bing.net/th/id/OIP.1qIpupZ7DR69J03HLvjfLQHaHa?rs=1&pid=ImgDetMain&o=7&rm=3",
    },
    {
      id: 3,
      name: "GIÀY HANDBALL SPEZIAL",
      description: "OLIVE STRATA / CREAM WHITE / GUM",
      size: "8.5 UK",
      price: 2500000,
      quantity: 1,
      image:
        "https://tse3.mm.bing.net/th/id/OIP.1qIpupZ7DR69J03HLvjfLQHaHa?rs=1&pid=ImgDetMain&o=7&rm=3",
    },
  ];
  const setCartItem = (items) => set({ cartItems: items });

  return {
    cartItems,
    setCartItem,
  };
});

export default useCartStore;
