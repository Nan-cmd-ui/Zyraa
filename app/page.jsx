"use client";
import React, { Suspense, useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabaseClient";
import Loading from "@/components/Loading";

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // <-- track error

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from("products")
          .select("*");

        if (error) throw error;

        const normalized = data.map((p) => ({
          ...p,
          main_image: p.main_image
            ? p.main_image.startsWith("http")
              ? p.main_image
              : supabase.storage
                  .from("shop-assets")
                  .getPublicUrl(p.main_image).publicURL
            : null,
        }));

        setProducts(normalized);
      } catch (err) {
        console.error("Error fetching products:", err.message);
        setError(err.message); // <-- set error
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <Loading />;

  if (error) {
    return (
      <div className="p-6 text-red-600">
        ⚠️ Failed to load products. Check your internet connection.
      </div>
    );
  }

  if (!products.length) {
    return <div className="p-6">No products in the store yet.</div>;
  }

  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <Navbar />
        <div className="flex flex-col items-start px-6 md:px-16 lg:px-32">
          <div className="flex flex-col items-end pt-12">
            <p className="text-2xl font-medium">All products</p>
            <div className="w-16 h-0.5 bg-orange-600 rounded-full"></div>
          </div>
          {/* Product Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-6 mt-12 pb-14 w-full">
            {products.map((product, index) => (
              <ProductCard key={product.id || index} product={product} />
            ))}
          </div>
        </div>
        <Footer />
      </Suspense>
    </>
  );
};

export default AllProducts;
