"use client";

import React, { Suspense, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const SellerAuthWrapper = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");

  // Change this to your desired password
  const correctPassword = "YourSecretPassword";

  const handleLogin = () => {
    if (passwordInput === correctPassword) {
      localStorage.setItem("sellerLoggedIn", "true");
      setAuthenticated(true);
    } else {
      alert("Incorrect password");
    }
  };

  useEffect(() => {
    const loggedIn = localStorage.getItem("sellerLoggedIn");
    if (loggedIn === "true") {
      setAuthenticated(true);
    }
  }, []);

  if (!authenticated) {
    return (
      <>
      <Suspense fallback={<div>Loading...</div>}>
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-sm text-center">
          <h1 className="text-2xl font-bold mb-4">Seller Login</h1>
          <input
            type="password"
            placeholder="Enter password"
            className="border p-2 rounded w-full mb-4"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
          />
          <Button
            onClick={handleLogin}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white"
          >
            Login
          </Button>
        </div>
      </div>
      </Suspense>
      </>
    );
  }

  return <><Suspense fallback={<div>Loading...</div>}>
      {children}</Suspense></>;
};

export default SellerAuthWrapper;
