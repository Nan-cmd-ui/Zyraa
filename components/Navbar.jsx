'use client';

import React, { Suspense, useEffect, useState } from "react";
import { assets } from "@/assets/assets";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";
import { IoCartOutline } from "react-icons/io5";
import SearchBar from "./SearchBar";
import { useAppContext } from "@/context/AppContext";
import { CiViewList } from "react-icons/ci";
import { Button } from "./ui/button";
import { AiOutlineHeart } from "react-icons/ai";

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = (e) => {
    e.stopPropagation();
    setIsMenuOpen((prev) => !prev);
  };

  const { userData, getCartCount } = useAppContext();
  const cartCount = getCartCount();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      supabase.auth.getUser().then(({ data }) => setUser(data.user));
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    // Close menu if clicked outside
    const handleClickOutside = () => setIsMenuOpen(false);
    window.addEventListener("click", handleClickOutside);

    return () => {
      listener.subscription.unsubscribe();
      window.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const getAvatar = () => {
    if (!user) return null;
    return user.user_metadata?.avatar_url || user.user_metadata?.picture || null;
  };

  /** ------------------------------
   * Replaced Dropdown with Popover
   * ----------------------------- */
  const UserMenu = () => (
    <div className="relative">
      <button
        onClick={toggleMenu}
        className="flex items-center text-gray-700 dark:text-gray-400"
      >
        <span className="mr-3 overflow-hidden rounded-full h-11 w-11">
          <Image
            src={getAvatar() ? getAvatar() : "/default-avatar.png"}
            alt="avatar"
            width={44}
            height={44}
          />
        </span>
        <svg
          className={`stroke-gray-500 dark:stroke-gray-400 transition-transform duration-200 ${
            isMenuOpen ? "rotate-180" : ""
          }`}
          width="18"
          height="20"
          viewBox="0 0 18 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4.3125 8.65625L9 13.3437L13.6875 8.65625"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

     
    </div>
  );

  return (
    <>
    <Suspense fallback={<div>Loading...</div>}>
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-300 text-gray-700">
      <div className="flex items-center justify-between px-6 md:px-16 lg:px-32 py-3">
        <Image
          src={assets.logo || null}
          alt="logo"
          className="cursor-pointer w-28 md:w-32"
          onClick={() => router.push("/")}
        />

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-4 w-full">
          <div className="flex-1 mx-4">
            <SearchBar />
          </div>
          <div className="flex items-center gap-4">
            <AiOutlineHeart
              size={28}
              className="cursor-pointer"
              onClick={() => router.push("/favourites")}
            />
            <div
              className="relative cursor-pointer"
              onClick={() => router.push("/cart")}
            >
              <IoCartOutline size={28} className="hover:text-red-500 transition" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Mobile */}
        <div className="flex md:hidden items-center gap-3">
          <AiOutlineHeart 
            size={28}
            className="cursor-pointer"
            onClick={() => router.push("/favourites")}
          />
          <div
            className="relative cursor-pointer"
            onClick={() => router.push("/cart")}
          >
            <IoCartOutline size={24} className="hover:text-red-500 transition" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Mobile search */}
      <div className="md:hidden px-6 pb-3">
        <SearchBar />
      </div>
    </nav>
    </Suspense>
    </>
  );
};

export default Navbar;
