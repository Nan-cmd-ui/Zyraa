"use client";

import { useRouter } from "next/navigation";
import { createContext, Suspense, useContext, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { createClient } from "@supabase/supabase-js";

// Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Context
export const AppContext = createContext();
export const useAppContext = () => useContext(AppContext);

export const AppContextProvider = ({ children }) => {
  const router = useRouter();
  const currency = process.env.NEXT_PUBLIC_CURRENCY || "₦";

  const [products, setProducts] = useState([]);
  const [userData, setUserData] = useState(null);
  const [isSeller, setIsSeller] = useState(false);

  // cartItems = { productId: { product, quantity } }
  const [cartItems, setCartItems] = useState({});
  const [likedProducts, setLikedProducts] = useState([]);

  /** --------------------
   * LocalStorage Sync
   * ------------------- */
  useEffect(() => {
    try {
      const savedCart = JSON.parse(localStorage.getItem("cart_items") || "{}");
      const savedLikes = JSON.parse(localStorage.getItem("liked_products") || "[]");
      setCartItems(savedCart);
      setLikedProducts(savedLikes);
    } catch (err) {
      console.error("Failed to load local storage:", err);
    }
  }, []);

  const saveCart = (newCart) => {
    setCartItems(newCart);
    localStorage.setItem("cart_items", JSON.stringify(newCart));
  };

  const saveLikes = (newLikes) => {
    setLikedProducts(newLikes);
    localStorage.setItem("liked_products", JSON.stringify(newLikes));
  };

  /** --------------------
   * Cart Functions
   * ------------------- */
  const addToCart = (product, quantity = 1) => {
    const productId = product.id;
    const newCart = { ...cartItems };

    if (!newCart[productId]) {
      newCart[productId] = { product, quantity };
    } else {
      newCart[productId].quantity = Math.min(
        newCart[productId].quantity + quantity,
        product.stock || 99
      );
    }

    saveCart(newCart);
    toast.success(`${quantity} item(s) added to cart`);
  };

  const updateCartQuantity = (productId, quantity) => {
    const newCart = { ...cartItems };

    if (quantity <= 0) {
      delete newCart[productId];
      toast("Removed from cart 🛒");
    } else if (newCart[productId]) {
      newCart[productId].quantity = Math.min(
        quantity,
        newCart[productId].product.stock || 99
      );
      toast.success("Cart updated!");
    }

    saveCart(newCart);
  };

  const clearCart = () => {
    setCartItems({});
    localStorage.removeItem("cart_items");
    toast.success("Cart cleared 🛒");
  };

  const getCartCount = () =>
    Object.values(cartItems).reduce((acc, item) => acc + (item.quantity || 0), 0);

  const getCartAmount = () => {
    let total = 0;
    for (const key in cartItems) {
      const item = cartItems[key];
      if (item?.product) {
        total += (item.product.offer_price ?? item.product.price) * item.quantity;
      }
    }
    return Math.round(total * 100) / 100;
  };

  /** --------------------
   * Favourites
   * ------------------- */
  const toggleLike = (productId) => {
    let newLikes;
    if (likedProducts.includes(productId)) {
      newLikes = likedProducts.filter((id) => id !== productId);
      toast("Removed from favorites 💔");
    } else {
      newLikes = [...likedProducts, productId];
      toast.success("Added to favorites ❤️");
    }
    saveLikes(newLikes);
  };

  /** --------------------
   * Supabase Fetch
   * ------------------- */
  const fetchProductData = async () => {
    try {
      const { data, error } = await supabase.from("products").select("*");
      if (error) throw error;

      const productsWithUrls = data.map((p) => {
        if (!p.main_image) return p;

        const { data: urlData } = supabase.storage
          .from("product-images") // your bucket name
          .getPublicUrl(p.main_image);

        return {
          ...p,
          main_image_url: urlData?.publicUrl || null,
        };
      });

      setProducts(productsWithUrls || []);
    } catch (err) {
      console.error("Failed to fetch products:", err.message);
    }
  };

  const fetchUserData = async () => {
    // Replace later with real Supabase auth
    setUserData({ id: "user1", name: "John Doe" });
  };

  useEffect(() => {
    fetchProductData();
    fetchUserData();
  }, []);

  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <AppContext.Provider
          value={{
            currency,
            router,
            isSeller,
            setIsSeller,
            userData,
            products,
            cartItems,
            addToCart,
            updateCartQuantity,
            clearCart, // ✅ Added here
            getCartCount,
            getCartAmount,
            likedProducts,
            toggleLike,
          }}
        >
          {children}
          <Toaster position="top-right" reverseOrder={false} />
        </AppContext.Provider>
      </Suspense>
    </>
  );
};
