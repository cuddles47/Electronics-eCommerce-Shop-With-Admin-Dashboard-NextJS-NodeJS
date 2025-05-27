// *********************
// Role of the component: Header component
// Name of the component: Header.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.0
// Component call: <Header />
// Input parameters: no input parameters
// Output: Header component
// *********************

"use client";
import { usePathname } from "next/navigation";
import React, { useEffect, useState, useRef } from "react";
import HeaderTop from "./HeaderTop";
import Image from "next/image";
import SearchInput from "./SearchInput";
import Link from "next/link";
import { FaBell } from "react-icons/fa6";
import { FaShoppingCart, FaHeart, FaUser } from "react-icons/fa";

import CartElement from "./CartElement";
import HeartElement from "./HeartElement";
import { signOut, useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { useWishlistStore } from "@/app/_zustand/wishlistStore";
import { safeFetch } from "@/utils/fetchUtil";

const Header = () => {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const { wishlist, setWishlist, wishQuantity } = useWishlistStore();
  const [scrolled, setScrolled] = useState(false);
  const [notificationDropdownOpen, setNotificationDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const notificationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const profileTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleLogout = () => {
    setTimeout(() => signOut(), 1000);
    toast.success("Logout successful!");
  };

  // Notification dropdown handlers
  const handleNotificationEnter = () => {
    if (notificationTimeoutRef.current) {
      clearTimeout(notificationTimeoutRef.current);
    }
    setNotificationDropdownOpen(true);
  };

  const handleNotificationLeave = () => {
    notificationTimeoutRef.current = setTimeout(() => {
      setNotificationDropdownOpen(false);
    }, 300);
  };

  // Profile dropdown handlers
  const handleProfileEnter = () => {
    if (profileTimeoutRef.current) {
      clearTimeout(profileTimeoutRef.current);
    }
    setProfileDropdownOpen(true);
  };

  const handleProfileLeave = () => {
    profileTimeoutRef.current = setTimeout(() => {
      setProfileDropdownOpen(false);
    }, 300);
  };
  // getting all wishlist items by user id
  const getWishlistByUserId = async (id: string) => {
    try {
      const wishlist = await safeFetch(`http://localhost:3001/api/wishlist/${id}`, {
        cache: "no-store",
      });
      
      if (!wishlist || !Array.isArray(wishlist)) return;
      
      const productArray: {
        id: string;
        title: string;
        price: number;
        image: string;
        slug:string
        stockAvailabillity: number;
      }[] = [];
      
      wishlist.forEach((item: any) => {
        if (item?.product) {
          productArray.push({
            id: item.product.id, 
            title: item.product.title, 
            price: item.product.price, 
            image: item.product.mainImage, 
            slug: item.product.slug, 
            stockAvailabillity: item.product.inStock
          });
        }
      });
      
      setWishlist(productArray);
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    }
  };
  useEffect(() => {
    // getting user by email so I can get his user id
    const getUserByEmail = async () => {
      if (session?.user?.email) {
        try {
          const userData = await safeFetch(`http://localhost:3001/api/users/email/${session?.user?.email}`, {
            cache: "no-store",
          });
          
          if (userData?.id) {
            getWishlistByUserId(userData.id);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };
    
    getUserByEmail();
  }, [session?.user?.email, wishlist.length]);

  // Add scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Cleanup timeouts when component unmounts
  useEffect(() => {
    return () => {
      if (notificationTimeoutRef.current) {
        clearTimeout(notificationTimeoutRef.current);
      }
      if (profileTimeoutRef.current) {
        clearTimeout(profileTimeoutRef.current);
      }
    };
  }, []);

  return (
    <header className={`bg-white sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'shadow-lg' : ''}`}>
      <HeaderTop />
      {pathname.startsWith("/admin") === false && (
        <div className={`bg-gradient-to-r from-white via-[#fff8f0] to-white transition-all duration-300 flex items-center justify-between px-16 max-[1320px]:px-16 max-md:px-6 max-lg:flex-col max-lg:gap-y-7 max-lg:justify-center max-lg:h-auto py-4 max-w-screen-2xl mx-auto ${scrolled ? 'h-24' : 'h-32'}`}>          <Link href="/" className="transition-transform duration-300 hover:scale-105 relative">
            {/* <div className="absolute -top-1 -right-1 w-16 h-16 bg-orange-500/10 rounded-full animate-ping-slow opacity-75"></div> */}
            <Image 
              src="/logo v1.png" 
              width={300} 
              height={300} 
              alt="singitronic logo" 
              className={`relative right-5 max-[1023px]:w-56 transition-all duration-300 ${scrolled ? 'scale-90' : ''}`} 
            />
          </Link>
          <SearchInput />
          <div className="flex gap-x-7 items-center">
            <HeartElement wishQuantity={wishQuantity} />
            <CartElement />            {session?.user && (
              <Link href="/orders" className="hidden md:flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-2 px-4 rounded-full transition-all shadow-md hover:shadow-lg">
                <FaShoppingCart className="animate-bounce" />
                <span className="font-medium">My Orders</span>
              </Link>
            )}
          </div>
        </div>
      )}
      {pathname.startsWith("/admin") === true && (
        <div className={`flex justify-between items-center px-16 max-[1320px]:px-10 max-w-screen-2xl mx-auto max-[400px]:px-5 bg-gradient-to-r from-[#f8f4e7] via-white to-[#f8f4e7] transition-all duration-300 ${scrolled ? 'h-24 shadow-md' : 'h-32'}`}>
          <Link href="/" className="transition-transform hover:scale-105 duration-300">
            <Image
              src="/logo v1.png"
              width={130}
              height={130}
              alt="singitronic logo"
              className={`w-56 h-auto transition-all duration-300 ${scrolled ? 'scale-90' : ''}`}
            />
          </Link>          <div className="flex gap-x-5 items-center">            <div className="relative">
              <div 
                onMouseEnter={handleNotificationEnter}
                onMouseLeave={handleNotificationLeave}
              >
                <FaBell className="text-xl text-orange-500 cursor-pointer hover:text-orange-600 transition-colors" />
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">2</span>
              </div>
              {notificationDropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-lg p-2 z-10 border border-orange-100"
                  onMouseEnter={handleNotificationEnter}
                  onMouseLeave={handleNotificationLeave}
                >
                  <div className="text-sm font-medium text-gray-700">You have 2 new notifications</div>
                </div>
              )}
            </div>            <div className="relative">
              <div 
                onMouseEnter={handleProfileEnter}
                onMouseLeave={handleProfileLeave}
              >
                <div className="w-10 hover:ring-2 hover:ring-orange-400 rounded-full transition-all cursor-pointer">
                  <Image
                    src="/randomuser.jpg"
                    alt="random profile photo"
                    width={30}
                    height={30}
                    className="w-full h-full rounded-full"
                  />
                </div>
              </div>
              {profileDropdownOpen && (
                <ul 
                  className="absolute right-0 mt-2 z-[1] py-2 shadow-lg bg-white rounded-lg w-52 border border-orange-100"
                  onMouseEnter={handleProfileEnter}
                  onMouseLeave={handleProfileLeave}
                >
                  <li className="hover:bg-orange-50 transition-colors">
                    <Link href="/admin" className="block px-4 py-2 rounded-md">Dashboard</Link>
                  </li>
                  <li className="hover:bg-orange-50 transition-colors">
                    <a className="block px-4 py-2 rounded-md cursor-pointer">Profile</a>
                  </li>
                  <li onClick={handleLogout} className="hover:bg-red-50 transition-colors">
                    <a href="#" className="block px-4 py-2 rounded-md text-red-500">Logout</a>
                  </li>
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
