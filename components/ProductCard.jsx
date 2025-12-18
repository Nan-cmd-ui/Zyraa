'use client';
import React, { useState, useEffect, Suspense } from 'react';
import { assets } from '@/assets/assets';
import Image from 'next/image';
import { useAppContext } from '@/context/AppContext';
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';
import { supabase } from "@/lib/supabaseClient";

const ProductCard = ({ product }) => {
  const { router, likedProducts, toggleLike, addToCart } = useAppContext();
  const [animate, setAnimate] = useState(false);

  // ✅ Guard against null product
  if (!product) return null;

  // ✅ Support both Supabase (id) and dummy (_id)
  const productId = product._id || product.id;

  const isLiked = likedProducts.includes(productId);

  // fetch reviews for this product
  useEffect(() => {
    if (!productId) return;

  }, [productId]);

  const handleLike = (e) => {
    e.stopPropagation();
    toggleLike(productId);
    setAnimate(true);
    setTimeout(() => setAnimate(false), 300);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product);
  };

  const handleCardClick = () => {
    router.push('/product/' + productId);
    scrollTo(0, 0);
  };

  const getStockStyle = (stock) => {
    if (stock === 0) return 'text-gray-400';
    if (stock <= 5) return 'text-red-600';
    if (stock <= 20) return 'text-orange-500';
    return 'text-green-600';
  };

  const discountPercentage = product.offer_price
    ? Math.round(((product.price - product.offer_price) / product.price) * 100)
    : null;

  return (
    <>
    <Suspense fallback={<div>Loading...</div>}>
    <div
      className="flex flex-col items-start gap-1 max-w-[250px] md:max-w-[280px] w-full cursor-pointer group"
      onClick={handleCardClick}
    >
      {/* Product Image */}
      <div className="relative bg-gray-500/10 rounded-lg w-full h-64 flex items-center justify-center overflow-hidden">
{product.main_image ? (
  <Image
    src={product.main_image}
    alt={product.name}
    className="group-hover:scale-105 transition object-cover w-full h-full rounded-lg"
    width={800}
    height={800}
  />
) : product.images && product.images.length > 0 ? (
  <Image
    src={product.images[0]}
    alt={product.name}
    className="group-hover:scale-105 transition object-cover w-full h-full rounded-lg"
    width={800}
    height={800}
  />
) : (
  <div className="flex items-center justify-center w-full h-full text-gray-400">
    No image
  </div>
)}



        {/* Like Button */}
        <button
          onClick={handleLike}
          className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full shadow-md transition"
        >
          <span className={`transition-colors duration-300 text-xl ${animate ? 'animate-pop' : ''}`}>
            {isLiked
              ? <AiFillHeart size={20} className="cursor-pointer text-orange-500 transition" />
              : <AiOutlineHeart size={20} className="cursor-pointer hover:text-orange-500 transition" />}
          </span>
        </button>
      </div>

      {/* Product Name */}
      <p className="md:text-lg font-medium pt-2 w-full truncate">{product.name}</p>

      {/* Stock & Rating */}
      <div className="flex flex-col gap-1 w-full mt-1 text-xs">
        {product.stock !== null && (
          <span className={getStockStyle(product.stock)}>
            {product.stock} in stock
          </span>
        )}
      </div>


      {/* Price & Buttons */}
      <div className="flex flex-col gap-2 w-full mt-1">
        {product.offer_price && product.offer_price < product.price ? (
          <div className="flex items-center gap-2">
            <span className="text-gray-400 line-through text-sm">₦{product.price.toLocaleString()}</span>
            <span className="text-base font-medium">₦{product.offer_price.toLocaleString()}</span>
            {discountPercentage && (
              <span className="text-xs text-red-600 font-medium">{discountPercentage}% off</span>
            )}
          </div>
        ) : (
          <span className="text-base font-medium">₦{product.price.toLocaleString()}</span>
        )}

        <div className="flex gap-2 mt-2">
          <button
            onClick={(e) => { e.stopPropagation(); handleAddToCart(e); }}
            className="flex-1 px-4 py-1.5 text-gray-700 border border-gray-300 rounded-full text-xs hover:bg-gray-100 transition"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
    </Suspense>
    </>
  );
};

export default ProductCard;
