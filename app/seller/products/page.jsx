// "use client";

// import React, { useEffect, useState } from "react";
// import { Wallet } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { createClient } from "@supabase/supabase-js";
// import Image from "next/image";
// import Loading from "@/components/Loading";
// import SellerAuthWrapper from "@/components/SellerAuthPaper";

// const supabase = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL,
//   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
// );

// const ProductList = () => {
//   const shopId = "7b37f79d-3bc2-4807-972d-96f123e7c295";
//   const [loading, setLoading] = useState(true);

//   // Fetch product info
//   const fetchProductById = async (productId) => {
//     const { data, error } = await supabase
//       .from("products")
//       .select("id, name, price, main_image")
//       .eq("id", productId)
//       .single();
//     if (error) return null;
//     return data;
//   };

//   useEffect(() => {

//     const channel = supabase
//       .channel("earnings-changes")
//       .on(
//         "postgres_changes",
//         { event: "*", schema: "public", table: "earnings", filter: `shop_id=eq.${shopId}` },
//         async () => setHasChanges(true)
//       )
//       .subscribe();

//     return () => supabase.removeChannel(channel);
//   }, []);

//   return (
//     <main className="min-h-screen w-full flex flex-col justify-center items-center bg-white px-4">
//       {loading ? <Loading /> : (
//         <>
//         <SellerAuthWrapper>
//           <div className="w-full md:p-10 p-4">
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-lg font-medium">All Products</h2>
//             </div>

//             <div className="flex flex-col items-center max-w-5xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20">
//               <table className="table-fixed w-full overflow-hidden">
//                 <thead className="text-gray-900 text-sm text-left">
//                 <tr>
//                   <th className="w-2/3 md:w-2/5 px-4 py-3 font-medium truncate">Product</th>
//                   <th className="px-4 py-3 font-medium truncate max-sm:hidden">Category</th>
//                   <th className="px-4 py-3 font-medium truncate">Price</th>
//                   <th className="px-4 py-3 font-medium truncate max-sm:hidden">Action</th>
//                 </tr>
//                 </thead>
//                 <tbody className="text-sm text-gray-500">
//                   {productsEarnings.length === 0 ? (
//                     <tr>
//                       <td colSpan={2} className="px-6 py-6 text-center text-gray-400">
//                         No products or earnings yet.
//                       </td>
//                     </tr>
//                   ) : (
//                     productsEarnings.map((product, index) => (
//                       <tr key={index} className="border-t border-gray-500/20">
//                                                              <td className="px-4 py-3 max-sm:hidden">{product.category}</td>
//                                       <td className="px-4 py-3">${product.offerPrice}</td>
//                                       <td className="px-4 py-3 max-sm:hidden">
//                                         <button
//                                           onClick={() => router.push(`/product/${product.id}`)}
//                                           className="flex items-center gap-1 px-1.5 md:px-3.5 py-2 bg-orange-600 text-white rounded-md"
//                                         >
//                                           <span className="hidden md:block">Visit</span>
//                                           <Image
//                                             className="h-3.5"
//                                             src={assets.redirect_icon}
//                                             alt="redirect_icon"
//                                           />
//                                         </button>
//                                       </td>
//                       </tr>
//                     ))
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </div>

//           <div className="w-full max-w-md flex flex-col items-center space-y-8 mt-10">
//             <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-700 text-center">Earnings</h2>
//             <div className="text-center space-y-2">
//               <p className="text-sm sm:text-base text-gray-500">Total Cash Made</p>
//               <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight">
//                 ₦{totalEarnings.toLocaleString()}
//               </h1>
//             </div>

//             <Button
//               size="lg"
//               className="w-full max-w-sm rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-[1.03] transition-all duration-200 flex items-center justify-center gap-2"
//             >
//               <Wallet className="h-5 w-5 sm:h-6 sm:w-6" />
//               Withdraw
//             </Button>

//             <p className="text-xs sm:text-sm text-gray-500 text-center max-w-sm">
//               Withdrawals are processed within 1–3 business days
//             </p>
//           </div>
//           </SellerAuthWrapper>
//         </>
//       )}
//     </main>
//   );
// };

// export default ProductList;
