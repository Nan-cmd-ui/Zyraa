"use client";
import React, { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabaseClient";
import Loading from "@/components/Loading";
import { useSearchParams } from "next/navigation";

const SearchPageContent = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get("query")?.toLowerCase() || "";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!query) {
        setProducts([]);
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .ilike("name", `%${query}%`);

        if (error) throw error;

        const normalized = data.map((p) => ({
          ...p,
          main_image: p.main_image
            ? p.main_image.startsWith("http")
              ? p.main_image
              : supabase.storage.from("shop-assets").getPublicUrl(p.main_image)
                  .publicURL
            : null,
        }));

        setProducts(normalized);
      } catch (err) {
        console.error("Error fetching products:", err.message);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [query]);

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-start px-6 md:px-16 lg:px-32">
        <div className="flex flex-col items-end pt-12">
          <p className="text-2xl font-medium">
            {query ? `Search results for "${query}"` : "Search Products"}
          </p>
          <div className="w-16 h-0.5 bg-orange-600 rounded-full"></div>
        </div>

        {loading ? (
          <Loading />
        ) : products.length === 0 ? (
          <div className="mt-12">No products found.</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-6 mt-12 pb-14 w-full">
            {products.map((product, index) => (
              <ProductCard key={index} product={product} />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default function SearchPage() {
  // Wrap with Suspense at the PAGE LEVEL
  return (
    <React.Suspense fallback={<div>Loading search...</div>}>
      <SearchPageContent />
    </React.Suspense>
  );
}
