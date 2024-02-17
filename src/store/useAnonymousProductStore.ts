import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type AnonymousProductStore = {
  productId: string;
  userEmail: string;
  updateProductId: (productId: string) => void;
  updateUserEmail: (userEmail: string) => void;
};

const useAnonymousProductStore = create<AnonymousProductStore>()(
  persist(
    (set) => ({
      productId: "",
      userEmail: "",
      updateProductId: (productId) => set({ productId }),
      updateUserEmail: (userEmail) => set({ userEmail }),
    }),
    {
      name: "anonymous-product",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);

export default useAnonymousProductStore;
