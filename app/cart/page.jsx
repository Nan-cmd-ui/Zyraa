"use client";
import React, { Suspense } from "react";
import { assets } from "@/assets/assets";
import OrderSummary from "@/components/OrderSummary";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import { useAppContext } from "@/context/AppContext";
import Footer from "@/components/Footer";

const Cart = () => {
  const { cartItems, addToCart, updateCartQuantity, getCartCount, router } =
    useAppContext();

  const hasItems = Object.keys(cartItems).length > 0;

  // ✅ Helper to format numbers as ₦1,000,000
  const formatCurrency = (amount) =>
    `₦${(amount ?? 0).toLocaleString("en-NG")}`;

  return (
    <>
    <Suspense fallback={<div>Loading...</div>}>
      <Navbar />
      <div className="flex flex-col md:flex-row gap-10 px-6 md:px-16 lg:px-32 pt-14 mb-20">
        {/* Cart Section */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-8 border-b border-gray-500/30 pb-6">
            <p className="text-2xl md:text-3xl text-gray-500">
              Your <span className="font-medium text-orange-600">Cart</span>
            </p>
            <p className="text-lg md:text-xl text-gray-500">
              {getCartCount()} Items
            </p>
          </div>

          {/* Empty Cart */}
          {!hasItems ? (
            <div className="text-center mt-20 text-gray-500">
              <p className="text-xl mb-2">Your cart is empty 😔</p>
              <p className="text-gray-400">
                Start adding products to see them here!
              </p>
              <button
                onClick={() => router.push("/")}
                className="mt-6 px-6 py-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition"
              >
                Shop Now
              </button>
            </div>
          ) : (
            /* Cart Table */
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead className="text-left">
                  <tr>
                    <th className="pb-6 md:px-4 px-1 text-gray-600 font-medium">
                      Product Details
                    </th>
                    <th className="pb-6 md:px-4 px-1 text-gray-600 font-medium">
                      Unit Price
                    </th>
                    <th className="pb-6 md:px-4 px-1 text-gray-600 font-medium">
                      Quantity
                    </th>
                    <th className="pb-6 md:px-4 px-1 text-gray-600 font-medium">
                      Subtotal
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(cartItems).map((itemId) => {
                    const item = cartItems[itemId];
                    if (!item || item.quantity <= 0) return null;

                    const product = item.product;
                    const quantity = item.quantity;
                    const unitPrice =
                      product?.offer_price ?? product?.price ?? 0;
                    const subtotal = quantity * unitPrice;

                    return (
                      <tr key={itemId}>
                        {/* Product Details */}
                        <td className="flex items-center gap-4 py-4 md:px-4 px-1">
                          <div>
                            <div className="rounded-lg overflow-hidden bg-gray-500/10 p-2">
                              <Image
                                src={
                                  product?.main_image ||
                                  product?.images?.[0] ||
                                  product?.image?.[0] ||
                                  "/placeholder.png"
                                }
                                alt={product?.name || "Product"}
                                className="w-16 h-auto object-cover mix-blend-multiply"
                                width={1280}
                                height={720}
                              />
                            </div>
                            <button
                              className="md:hidden text-xs text-orange-600 mt-1"
                              onClick={() => updateCartQuantity(itemId, 0)}
                            >
                              Remove
                            </button>
                          </div>
                          <div className="text-sm hidden md:block">
                            <p className="text-gray-800">
                              {product?.name || "Product"}
                            </p>
                            <button
                              className="text-xs text-orange-600 mt-1"
                              onClick={() => updateCartQuantity(itemId, 0)}
                            >
                              Remove
                            </button>
                          </div>
                        </td>

                        {/* Unit Price */}
                        <td className="py-4 md:px-4 px-1 text-gray-600">
                          {formatCurrency(unitPrice)}
                        </td>

                        {/* Quantity Controls */}
                        <td className="py-4 md:px-4 px-1">
                          <div className="flex items-center md:gap-2 gap-1">
                            <button
                              onClick={() =>
                                updateCartQuantity(
                                  itemId,
                                  Math.max(quantity - 1, 0)
                                )
                              }
                            >
                              <Image
                                src={assets.decrease_arrow}
                                alt="decrease_arrow"
                                className="w-4 h-4"
                              />
                            </button>
                            <input
                              onChange={(e) =>
                                updateCartQuantity(itemId, Number(e.target.value))
                              }
                              type="number"
                              value={quantity}
                              className="w-8 border text-center appearance-none"
                            />
                            <button onClick={() => addToCart(product, 1)}>
                              <Image
                                src={assets.increase_arrow}
                                alt="increase_arrow"
                                className="w-4 h-4"
                              />
                            </button>
                          </div>
                        </td>

                        {/* Subtotal */}
                        <td className="py-4 md:px-4 px-1 text-gray-600">
                          {formatCurrency(subtotal)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Continue Shopping */}
          <button
            onClick={() => router.push("/")}
            className="group flex items-center mt-6 gap-2 text-orange-600"
          >
            <Image
              className="group-hover:-translate-x-1 transition"
              src={assets.arrow_right_icon_colored}
              alt="arrow_right_icon_colored"
            />
            Continue Shopping
          </button>
        </div>

        {/* Order Summary */}
        <OrderSummary />
      </div>
      <Footer />
      </Suspense>
    </>
  );
};

export default Cart;
