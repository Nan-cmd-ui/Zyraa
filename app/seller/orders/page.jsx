// "use client";
// import React, { useEffect, useState } from "react";
// import { assets } from "@/assets/assets";
// import Image from "next/image";
// import { useAppContext } from "@/context/AppContext";
// import Footer from "@/components/Footer";
// import Loading from "@/components/Loading";
// import { supabase } from "@/lib/supabaseClient";
// import SellerAuthWrapper from "@/components/SellerAuthPaper";

// const Orders = () => {
//   const { currency, user, shopId } = useAppContext();
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const fetchOrders = async () => {
//     try {
//       setLoading(true);

//       const { data, error } = await supabase
//         .from("orders")
//         .select(`
//           id,
//           total,
//           created_at,
//           payment_method,
//           payment_status,
//           status,
//           shipping,
//           transaction_id,
//           order_items (
//             quantity,
//             price,
//             product:products(id, name, price, main_image)
//           )
//         `)
//         .eq("shop_id", shopId)
//         .order("created_at", { ascending: false });

//       if (error) {
//         console.error("Error fetching orders:", error);
//         setOrders([]);
//         return;
//       }

//       // normalize orders
//       const normalized = data.map((order) => ({
//         ...order,
//         items: (order.order_items || []).map((oi) => ({
//           ...oi,
//           product: oi.product || {},
//         })),
//         address: order.shipping || {},
//         amount: order.total,
//         date: order.created_at, // use created_at for display
//       }));

//       setOrders(normalized);
//     } catch (err) {
//       console.error("Unexpected error:", err);
//       setOrders([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (shopId) fetchOrders();
//     else setLoading(false);
//   }, [shopId]);

//   return (
//     <div className="flex-1 h-screen overflow-scroll flex flex-col justify-between text-sm">
//       {loading ? (
//         <Loading />
//       ) : (
//         <SellerAuthWrapper>
//         <div className="md:p-10 p-4 space-y-5">
//           <h2 className="text-lg font-medium">Orders</h2>
//           <div className="max-w-4xl rounded-md">
//             {orders.length === 0 && <p>No orders found.</p>}
//             {orders.map((order, index) => (
//               <div
//                 key={index}
//                 className="flex flex-col md:flex-row gap-5 justify-between p-5 border-t border-gray-300"
//               >
//                 {/* Items */}
//                 <div className="flex-1 flex gap-5 max-w-80">
//                   <Image
//                     className="max-w-16 max-h-16 object-cover"
//                     src={assets.box_icon}
//                     alt="box_icon"
//                   />
//                   <p className="flex flex-col gap-3">
//                     <span className="font-medium">
//                       {order.items
//                         .map((item) => `${item.product.name || "N/A"} x ${item.quantity}`)
//                         .join(", ")}
//                     </span>
//                     <span>Items: {order.items.length}</span>
//                   </p>
//                 </div>

//                 {/* Shipping info */}
//                 <div>
//                   <p>
//                     <span className="font-medium">{order.address.fullName || "N/A"}</span>
//                     <br />
//                     <span>{order.address.area || "N/A"}</span>
//                     <br />
//                     <span>
//                       {order.address.city && order.address.state
//                         ? `${order.address.city}, ${order.address.state}`
//                         : "N/A"}
//                     </span>
//                     <br />
//                     <span>{order.address.phoneNumber || "N/A"}</span>
//                   </p>
//                 </div>

//                 {/* Total */}
//                 <p className="font-medium my-auto">
//                   {currency}{order.amount ?? 0}
//                 </p>

//                 {/* Payment */}
//                 <div>
//                   <p className="flex flex-col">
//                     <span>Method: {order.payment_method || "COD"}</span>
//                     <span>
//                       Date:{" "}
//                       {order.date ? new Date(order.date).toLocaleDateString() : "N/A"}
//                     </span>
//                     <span>Payment: {order.payment_status || "Pending"}</span>
//                   </p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//         </SellerAuthWrapper>
//       )}
//       <Footer />
//     </div>
//   );
// };

// export default Orders;
