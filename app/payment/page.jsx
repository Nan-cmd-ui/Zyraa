"use client";

import React, { useEffect, useState } from "react";
import { useAppContext } from "@/context/AppContext";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const PaymentPage = () => {
  const { currency, getCartAmount, clearCart } = useAppContext();
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [flutterwaveReady, setFlutterwaveReady] = useState(false);
  const router = useRouter();
  const totalAmount = getCartAmount();

  // Load selected address
  useEffect(() => {
    const saved = localStorage.getItem("selectedAddress");
    if (saved) setSelectedAddress(JSON.parse(saved));
  }, []);

  // Dynamically load Flutterwave script
  useEffect(() => {
    if (!document.getElementById("flutterwave-script")) {
      const script = document.createElement("script");
      script.src = "https://checkout.flutterwave.com/v3.js";
      script.id = "flutterwave-script";
      script.async = true;
      script.onload = () => setFlutterwaveReady(true);
      script.onerror = () => toast.error("Failed to load Flutterwave script");
      document.body.appendChild(script);
    } else {
      setFlutterwaveReady(true);
    }
  }, []);

  const handlePayment = () => {
    if (!selectedMethod) return toast.error("Please select a payment method");
    if (!selectedAddress) {
      toast.error("No shipping address found");
      router.push("/cart");
      return;
    }

    if (selectedMethod === "flutterwave") {
      if (!flutterwaveReady || !window.FlutterwaveCheckout) {
        return toast.error("Flutterwave script not loaded yet. Please wait a moment.");
      }

      toast.loading("Redirecting to Flutterwave...", { id: "pay" });

      window.FlutterwaveCheckout({
        public_key: process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY,
        tx_ref: "tx-" + Date.now(),
        amount: totalAmount,
        currency: "NGN",
        payment_options: "card,ussd,banktransfer",
        customer: {
          email: "customer@email.com",
          name: selectedAddress.fullName,
        },
        customizations: {
          title: "Zyra Order Payment",
          description: "Payment for items in cart",
        },
        callback: (data) => {
          toast.dismiss("pay");
          if (data.status === "successful") {
            toast.success("Payment successful! 🎉");
            if (typeof clearCart === "function") clearCart();
            router.push("/order-placed");
          } else {
            toast.error("Payment failed. Try again.");
          }
        },
        onclose: () => toast.dismiss("pay"),
      });
    }

    if (selectedMethod === "cod") {
      toast.success("Order placed successfully! Pay when item is delivered.");
      if (typeof clearCart === "function") clearCart();
      router.push("/order-placed");
    }

    if (selectedMethod === "cop") {
      toast.success("Order placed! Please come to our pickup location.");
      if (typeof clearCart === "function") clearCart();
      router.push("/order-placed");
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded-2xl shadow-md mt-6">
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">
        Choose Payment Method
      </h1>

      {/* Address display */}
      {selectedAddress ? (
        <div className="bg-gray-50 p-3 rounded-lg text-sm mb-5">
          <p className="font-medium">Shipping To:</p>
          <p>{selectedAddress.fullName}</p>
          <p>
            {selectedAddress.area}, {selectedAddress.city}, {selectedAddress.state}
          </p>
        </div>
      ) : (
        <p className="text-red-500 text-sm mb-4">
          No address selected. Please go back and select one.
        </p>
      )}

      {/* Payment Options */}
      <div className="space-y-3">
        <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
          <input
            type="radio"
            name="paymentMethod"
            value="flutterwave"
            onChange={() => setSelectedMethod("flutterwave")}
            checked={selectedMethod === "flutterwave"}
          />
          <span className="text-gray-800">Pay with Flutterwave</span>
        </label>

        <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
          <input
            type="radio"
            name="paymentMethod"
            value="cod"
            onChange={() => setSelectedMethod("cod")}
            checked={selectedMethod === "cod"}
          />
          <span className="text-gray-800">Cash on Delivery</span>
        </label>

        <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
          <input
            type="radio"
            name="paymentMethod"
            value="cop"
            onChange={() => setSelectedMethod("cop")}
            checked={selectedMethod === "cop"}
          />
          <span className="text-gray-800">Come to Pickup</span>
        </label>
      </div>

      {/* Total */}
      <div className="flex justify-between text-lg font-medium mt-5 border-t pt-4">
        <span>Total:</span>
        <span>
          {currency}
          {totalAmount.toLocaleString()}
        </span>
      </div>

      {/* Confirm & Pay Button */}
      <button
        onClick={handlePayment}
        disabled={selectedMethod === "flutterwave" && !flutterwaveReady}
        className={`w-full mt-6 py-3 rounded-xl text-white ${
          selectedMethod === "flutterwave" && !flutterwaveReady
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-orange-600 hover:bg-orange-700 transition"
        }`}
      >
        Confirm & Pay
      </button>
    </div>
  );
};

export default PaymentPage;
