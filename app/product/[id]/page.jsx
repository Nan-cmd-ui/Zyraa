'use client';

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import { useParams } from "next/navigation";
import Loading from "@/components/Loading";
import { useAppContext } from "@/context/AppContext";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "react-hot-toast";

const Product = () => {
  const { id } = useParams();
  const { router, addToCart, currency } = useAppContext();

  const [mainMedia, setMainMedia] = useState(null); // { url, type }
  const [productData, setProductData] = useState(null);
  const [related, setRelated] = useState([]);
  const [quantity, setQuantity] = useState(1);

  const fetchProduct = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;

      // Ensure main_image is always first
      const images = Array.isArray(data.images) ? data.images : [];
      if (data.main_image && !images.includes(data.main_image)) {
        images.unshift(data.main_image); // main_image always first
      }

      const videos = Array.isArray(data.videos) ? data.videos : [];

      const normalized = { ...data, images, videos };

      const media = [
        ...normalized.images.map(url => ({ url, type: "image" })),
        ...normalized.videos.map(url => ({ url, type: "video" })),
      ];

      setProductData(normalized);
      setMainMedia(media[0] || null);

      // Fetch related products
      if (normalized.category) {
        const { data: relatedProducts } = await supabase
          .from("products")
          .select("*")
          .eq("category", normalized.category)
          .neq("id", id)
          .limit(5);
        setRelated(relatedProducts || []);
      }
    } catch (err) {
      console.error("Error fetching product:", err.message);
    }
  };

  useEffect(() => {
    if (id) fetchProduct();
  }, [id]);

  if (!productData) return <Loading />;

  const discountPercentage = productData.offer_price
    ? Math.round(((productData.price - productData.offer_price) / productData.price) * 100)
    : null;

  const handleQuantityChange = val => {
    const num = Number(val);
    if (isNaN(num) || num < 1) setQuantity(1);
    else if (num > productData.stock) setQuantity(productData.stock);
    else setQuantity(num);
  };

  const media = [
    ...productData.images.map(url => ({ url, type: "image" })),
    ...productData.videos.map(url => ({ url, type: "video" })),
  ];

  return (
    <>
    <Suspense fallback={<div>Loading...</div>}>
      <Navbar />
      <div className="px-6 md:px-16 lg:px-32 pt-14 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {/* Main Media Section */}
          <div>
            <div className="relative rounded-lg overflow-hidden bg-gray-100 mb-4 w-full h-96">
              {mainMedia ? (
                mainMedia.type === "image" ? (
                  <Image
                    src={mainMedia.url}
                    alt={productData.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <video
                    src={mainMedia.url}
                    controls
                    className="w-full h-full object-cover"
                  />
                )
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                  No Media
                </div>
              )}
            </div>

            {/* Thumbnails */}
            <div className="grid grid-cols-4 gap-4">
              {media.map((item, i) => (
                <div
                  key={i}
                  onClick={() => setMainMedia(item)}
                  className={`cursor-pointer rounded-lg overflow-hidden border ${
                    mainMedia?.url === item.url ? "border-orange-500" : "border-gray-300"
                  }`}
                >
                  {item.type === "image" ? (
                    <Image
                      src={item.url}
                      alt={`thumb-${i}`}
                      width={1280}
                      height={720}
                      className="w-full h-24 object-cover"
                    />
                  ) : (
                    <video
                      src={item.url}
                      className="w-full h-24 object-cover"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="flex flex-col">
            <h1 className="text-3xl font-semibold text-gray-800 mb-2">{productData.name}</h1>

            <p className="text-gray-700 leading-relaxed mb-4">
              {productData.description || "No description available."}
            </p>

            <p className="text-3xl font-bold flex items-center gap-3">
              {currency}{productData.offer_price || productData.price}
              {productData.offer_price && (
                <>
                  <span className="line-through text-gray-500 text-lg">
                    {currency}{productData.price}
                  </span>
                  <span className="text-red-600 font-medium">-{discountPercentage}%</span>
                </>
              )}
            </p>

            <p className={`mt-2 font-medium ${productData.stock > 0 ? "text-green-600" : "text-red-500"}`}>
              {productData.stock > 0 ? `${productData.stock} In Stock` : "Out of Stock"}
            </p>

            <div className="flex items-center gap-4 mt-4">
              <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-4 py-2 bg-gray-200 rounded-lg text-gray-800">-</button>
              <input type="number" className="w-16 border text-center" value={quantity} min={1} max={productData.stock} onChange={e => handleQuantityChange(e.target.value)} />
              <button onClick={() => setQuantity(q => productData.stock ? Math.min(productData.stock, q + 1) : q + 1)} className="px-4 py-2 bg-gray-200 rounded-lg text-gray-800">+</button>
            </div>

            <div className="flex items-center gap-4 mt-6">
              <button
                onClick={() => {
                  if (quantity > productData.stock) {
                    toast.error(`Only ${productData.stock} item(s) available`);
                    setQuantity(productData.stock);
                    return;
                  }
                  addToCart(productData, quantity);
                  toast.success(`${quantity} items added to cart`);
                }}
                className="w-full py-3.5 bg-gray-100 text-gray-800 hover:bg-gray-200 transition"
              >
                Add to Cart
              </button>
              <button
                onClick={() => {
                  if (quantity > productData.stock) {
                    toast.error(`Only ${productData.stock} item(s) available`);
                    setQuantity(productData.stock);
                    return;
                  }
                  addToCart(productData, quantity);
                  router.push("/cart");
                }}
                className="w-full py-3.5 bg-orange-500 text-white hover:bg-orange-600 transition"
              >
                Buy Now
              </button>
            </div>

            <div className="mt-6 border-t pt-4 text-gray-600 text-sm space-y-1">
              <p>✔ Secure payment</p>
              <p>✔ Easy returns within 7 days</p>
              <p>✔ 24/7 Customer Support</p>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className="flex flex-col items-center mt-16">
            <p className="text-3xl font-medium mb-2">Related <span className="text-orange-600">Products</span></p>
            <div className="w-28 h-0.5 bg-orange-600 mb-6"></div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 w-full">
              {related.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>
      <Footer />
      </Suspense>
    </>
  );
};

export default Product;
