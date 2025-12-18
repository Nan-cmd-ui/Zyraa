"use client";

import React, { Suspense } from "react";
import { useAppContext } from "@/context/AppContext";
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const FavouritesPage = () => {
  const { products, likedProducts } = useAppContext();

  // Filter only liked products
  const favouriteItems = products.filter((p) =>
    likedProducts.includes(p.id || p._id)
  );

  if (!favouriteItems.length)
    return (
      <>
      <Suspense fallback={<div>Loading...</div>}>
        <Navbar />
        <div className="text-center mt-20 px-6 md:px-16 lg:px-32">
          <h2 className="text-2xl font-semibold mb-4">No favourites yet 😢</h2>
          <p className="text-gray-500">Start liking products to see them here!</p>
        </div>
        <Footer />
        </Suspense>
      </>
    );

  return (
    <>
    <Suspense fallback={<div>Loading...</div>}>
      <Navbar />
      <div className="flex flex-col items-start px-6 md:px-16 lg:px-32">
        <div className="flex flex-col items-end pt-12">
          <h1 className="text-2xl md:text-3xl font-medium">Your Favourites</h1>
          <div className="w-16 h-0.5 bg-orange-600 rounded-full mb-6"></div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-6 mt-6 pb-14 w-full">
          {favouriteItems.map((item) => (
            <ProductCard key={item.id || item._id} product={item} />
          ))}
        </div>
      </div>
      <Footer />
      </Suspense>
    </>
  );
};

export default FavouritesPage;
