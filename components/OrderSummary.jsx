"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useAppContext } from "@/context/AppContext";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

const OrderSummary = () => {
  const { currency, getCartCount, getCartAmount, cartItems } = useAppContext();
  const router = useRouter();
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userAddresses, setUserAddresses] = useState([]);
  const [note, setNote] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("userAddresses");
    if (saved) setUserAddresses(JSON.parse(saved));
  }, []);

  const handleAddressSelect = (address) => {
    setSelectedAddress(address);
    setIsDropdownOpen(false);
  };

  const handleContactUs = () => {
    if (!selectedAddress) {
      toast.error("Please select a shipping address first.");
      return;
    }

    localStorage.setItem("selectedAddress", JSON.stringify(selectedAddress));

    // Build order details message
    let orderDetails = "🛒 *New Order Request*\n\n";
    orderDetails += `📍 *Delivery Address:* ${selectedAddress.fullName}, ${selectedAddress.area}, ${selectedAddress.city}, ${selectedAddress.state}\n\n`;
    orderDetails += "📦 *Items:*\n";

    Object.values(cartItems).forEach((item, i) => {
      orderDetails += `${i + 1}. ${item.product.name} (x${item.quantity}) - ${currency}${item.product.price}\n`;
    });

    orderDetails += `\n💰 *Total:* ${currency}${getCartAmount()}`;

    if (note.trim()) {
      orderDetails += `\n\n📝 *Note:* ${note}`;
    }

    const phoneNumber = "+2348074034191"; // Replace with your WhatsApp number
    const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(orderDetails)}`;

    toast.success("Redirecting to WhatsApp...");
    window.location.href = whatsappLink;
  };

  const totalAmount = getCartAmount();

  const formatNumber = (num) => num.toLocaleString();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="w-full md:w-96 bg-gray-500/5 p-5">
        <h2 className="text-xl md:text-2xl font-medium text-gray-700">
          Order Summary
        </h2>
        <hr className="border-gray-500/30 my-5" />

        {/* Address Selector */}
        <div className="space-y-6">
          <div>
            <label className="text-base font-medium uppercase text-gray-600 block mb-2">
              Select Address
            </label>
            <div className="relative inline-block w-full text-sm border">
              <button
                className="peer w-full text-left px-4 pr-2 py-2 bg-white text-gray-700 focus:outline-none"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <span>
                  {selectedAddress
                    ? `${selectedAddress.fullName}, ${selectedAddress.area}, ${selectedAddress.city}, ${selectedAddress.state}`
                    : "Select Address"}
                </span>
                <svg
                  className={`w-5 h-5 inline float-right transition-transform duration-200 ${
                    isDropdownOpen ? "rotate-0" : "-rotate-90"
                  }`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="#6B7280"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {isDropdownOpen && (
                <ul className="absolute w-full bg-white border shadow-md mt-1 z-10 py-1.5">
                  {userAddresses.length > 0 ? (
                    userAddresses.map((address, index) => (
                      <li
                        key={index}
                        className="px-4 py-2 hover:bg-gray-500/10 cursor-pointer"
                        onClick={() => handleAddressSelect(address)}
                      >
                        {address.fullName}, {address.area}, {address.city},{" "}
                        {address.state}
                      </li>
                    ))
                  ) : (
                    <li className="px-4 py-2 text-gray-500 text-center">
                      No saved addresses
                    </li>
                  )}
                  <li
                    onClick={() => router.push("/add-address")}
                    className="px-4 py-2 hover:bg-gray-500/10 cursor-pointer text-center text-orange-600"
                  >
                    + Add New Address
                  </li>
                </ul>
              )}
            </div>
          </div>

          {/* Note Field */}
          <div>
            <label className="text-base font-medium uppercase text-gray-600 block mb-2">
              Note (Optional)
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="E.g. Deliver after 5 PM"
              className="w-full border rounded-md p-2 text-gray-700"
              rows={3}
            />
          </div>

          {/* Order Summary Info */}
          <div className="space-y-4">
            <div className="flex justify-between text-base font-medium">
              <p className="uppercase text-gray-600">
                Items {getCartCount()}
              </p>
              <p className="text-gray-800">
                {currency}
                {formatNumber(getCartAmount())}
              </p>
            </div>
            <div className="flex justify-between">
              <p className="text-gray-600">Shipping Fee</p>
              <p className="font-medium text-gray-800">Free</p>
            </div>
            <div className="flex justify-between text-lg md:text-xl font-medium border-t pt-3">
              <p>Total</p>
              <p>
                {currency}
                {formatNumber(totalAmount)}
              </p>
            </div>
          </div>
        </div>

        {/* Contact Us Button */}
        <button
          onClick={handleContactUs}
          className="w-full mt-5 bg-orange-600 text-white py-3 hover:bg-orange-700 transition rounded"
        >
          Contact Us
        </button>
      </div>
    </Suspense>
  );
};

export default OrderSummary;
