// *********************
// Role of the component: Topbar of the header
// Name of the component: HeaderTop.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.0
// Component call: <HeaderTop />
// Input parameters: no input parameters
// Output: topbar with phone, email and login and register links
// *********************

"use client";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { FaHeadphones } from "react-icons/fa6";
import { FaRegEnvelope } from "react-icons/fa6";
import { FaLocationDot } from "react-icons/fa6";
import { FaRegUser, FaUser } from "react-icons/fa6";
import { CiGlobe } from "react-icons/ci";
import { FaTruck, FaPercent } from "react-icons/fa";
import { MdSupportAgent } from "react-icons/md";
import { IoMdTime } from "react-icons/io";
import { LuPackageOpen } from "react-icons/lu";
import { AiOutlineClose } from "react-icons/ai";
import { IoMdStar, IoMdStarOutline } from "react-icons/io";
import { RiSparklingFill, RiSparklingLine } from "react-icons/ri";

const HeaderTop = () => {
  const { data: session }: any = useSession();
  const [showPromotion, setShowPromotion] = useState(true);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const userDropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [activePromo, setActivePromo] = useState(0);
  const [currentTime, setCurrentTime] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [showZipSearch, setShowZipSearch] = useState(false);
  const [sparkles, setSparkles] = useState<React.ReactNode[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  
  const promos = [
    { icon: <FaTruck className="text-white" />, text: "Free Shipping" },
    { icon: <FaPercent className="text-white" />, text: "Special Offers" },
    { icon: <MdSupportAgent className="text-white text-lg" />, text: "24/7 Customer Support" },
  ];

  const handleLogout = () => {
    setTimeout(() => signOut(), 1000);
    toast.success("Logout successful!");
  }

  // User dropdown handlers
  const handleUserDropdownEnter = () => {
    if (userDropdownTimeoutRef.current) {
      clearTimeout(userDropdownTimeoutRef.current);
    }
    setUserDropdownOpen(true);
  };

  const handleUserDropdownLeave = () => {
    userDropdownTimeoutRef.current = setTimeout(() => {
      setUserDropdownOpen(false);
    }, 300);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (userDropdownTimeoutRef.current) {
        clearTimeout(userDropdownTimeoutRef.current);
      }
    };
  }, []);
  // Mark component as mounted on client-side
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Update promotion carousel  
  useEffect(() => {
    const timer = setInterval(() => {
      setActivePromo((prev) => (prev + 1) % promos.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [promos.length]);

  // Update current time
  useEffect(() => {
    if (!isMounted) return;
    
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    
    updateTime(); // Initial call
    const timer = setInterval(updateTime, 60000); // Update every minute
    
    return () => clearInterval(timer);
  }, [isMounted]);

  // Generate sparkles only on client-side
  useEffect(() => {
    if (!isMounted) return;
    
    // Mảng để lưu trữ các sparkles
    const sparklesArray = [];
    
    // Tạo 20 sparkles ngẫu nhiên
    for (let i = 0; i < 20; i++) {
      // Chọn loại sparkle ngẫu nhiên
      const sparkleType = Math.floor(Math.random() * 4);
      // Vị trí ngẫu nhiên
      const left = `${Math.random() * 100}%`;
      const top = `${Math.random() * 100}%`;
      // Kích thước ngẫu nhiên
      const size = 0.5 + Math.random() * 1.5;
      // Độ trễ ngẫu nhiên cho animation
      const delay = `${Math.random() * 5}s`;
      // Thời lượng animation ngẫu nhiên
      const duration = `${2 + Math.random() * 4}s`;
      
      // Các loại sparkle khác nhau
      let sparkle;
      if (sparkleType === 0) {
        sparkle = <div className="absolute rounded-full bg-white/80" style={{
          left,
          top,
          width: `${size}px`,
          height: `${size}px`,
          animationDelay: delay,
          animationDuration: duration,
        }} />;
      } else if (sparkleType === 1) {
        sparkle = <IoMdStar className="absolute text-white/80" style={{
          left,
          top,
          fontSize: `${size * 6}px`,
          animationDelay: delay,
          animationDuration: duration,
        }} />;
      } else if (sparkleType === 2) {
        sparkle = <RiSparklingFill className="absolute text-white/80" style={{
          left,
          top,
          fontSize: `${size * 6}px`,
          animationDelay: delay,
          animationDuration: duration,
        }} />;
      } else {
        // Tạo sparkle hình kim cương
        sparkle = <div className="absolute bg-white/80 rotate-45" style={{
          left,
          top,
          width: `${size * 2}px`,
          height: `${size * 2}px`,
          animationDelay: delay,
          animationDuration: duration,
        }} />;
      }
      
      // Thêm vào mảng sparkle với key duy nhất và class animation
      sparklesArray.push(
        <div key={`sparkle-${i}`} className="absolute animate-twinkle" style={{
          left,
          top,
          animationDelay: delay,
          animationDuration: duration,
        }}>
          {sparkle}
        </div>
      );
    }
    
    setSparkles(sparklesArray);
  }, [isMounted]);

  const handleZipSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Logic tìm kiếm cửa hàng gần nhất
    toast.success(`Searching stores near ${zipcode}...`);
    setZipcode("");
    setShowZipSearch(false);
  };

  return (
    <div className="relative z-50">
      {/* Promotion Banner */}
      {showPromotion && (
        <div className="bg-gradient-to-r from-orange-600 to-orange-500 text-white py-1.5 relative overflow-hidden">
          <div className="flex justify-center items-center max-w-screen-2xl mx-auto px-4 text-sm">
            <div className="absolute left-0 w-40 h-40 bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
            <div className="absolute right-0 w-40 h-40 bg-orange-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-2000"></div>
            
            <span className="font-medium">🎁 Flash Sale! 20% OFF on all electronics - Use code: <span className="bg-white text-orange-600 px-2 py-0.5 rounded font-bold mx-1">FLASH20</span> at checkout</span>
            <button 
              onClick={() => setShowPromotion(false)} 
              className="absolute right-4 text-white/80 hover:text-white"
              aria-label="Close promotion"
            >
              <AiOutlineClose size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Main Top Header - Orange Section */}
      <div className="bg-gradient-to-r from-orange-500 via-orange-400 to-orange-500 text-white shadow-md max-lg:px-5 max-[573px]:px-0 relative overflow-hidden">
        {/* Sparkles effect - rendered only on client side */}
        {isMounted && sparkles}
        
        {/* Tia sáng xuyên qua - only show on client side */}
        {isMounted && (
          <>
            <div className="absolute h-[200%] w-[60px] bg-white/10 -rotate-45 left-1/4 -top-1/2 animate-light-beam"></div>
            <div className="absolute h-[200%] w-[30px] bg-white/10 -rotate-45 left-2/3 -top-1/2 animate-light-beam animation-delay-2000"></div>
          </>
        )}
        
        {/* Original decorative elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-white/20 via-white/40 to-white/20"></div>
        
        <div className="flex justify-between h-full max-lg:flex-col max-lg:justify-center max-lg:items-center max-w-screen-2xl mx-auto px-12 max-[573px]:px-2 py-2.5 relative">
          <div className="flex items-center h-full gap-x-6 max-[370px]:text-sm max-[370px]:gap-x-3">
            {/* Rotating Promo */}
            <div className="hidden md:flex items-center gap-x-2 group bg-orange-600/20 px-3 py-1.5 rounded-full backdrop-blur-sm relative overflow-hidden w-52">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-600/10 to-orange-600/20 animate-pulse"></div>
              <div className="flex items-center gap-x-2 z-10 animate-fadeIn">
                {promos[activePromo].icon}
                <span className="font-medium text-sm text-white/90 group-hover:text-white transition-colors">
                  {promos[activePromo].text}
                </span>
              </div>
            </div>
            
            {/* Time Display - only show if mounted on client */}
            {isMounted && (
              <div className="hidden md:flex items-center gap-x-2 bg-orange-600/20 px-3 py-1 rounded-full">
                <IoMdTime className="text-white" />
                <span className="text-sm text-white font-medium">{currentTime}</span>
              </div>
            )}
          </div>
          
          <ul className="flex items-center h-full gap-x-5 max-[370px]:text-sm max-[370px]:gap-x-2 divide-x divide-white/20">
            <li className="flex items-center gap-x-2 group hover:scale-105 transition-transform">
              <FaHeadphones className="text-white group-hover:rotate-12 transition-transform" />
              <span className="font-medium text-sm text-white/90 group-hover:text-white transition-colors">+381 61 123 321</span>
            </li>
            <li className="flex items-center gap-x-2 pl-4 group hover:scale-105 transition-transform">
              <FaRegEnvelope className="text-white text-sm group-hover:scale-110 transition-transform" />
              <span className="font-medium text-sm text-white/90 group-hover:text-white transition-colors">support@email.com</span>
            </li>
          </ul>
        </div>
      </div>
      
      {/* Second row with login/register */}
      <div className="bg-gradient-to-r from-[#f8f4e7] via-[#f9f5ea] to-[#f8f4e7] text-orange-800 border-t border-orange-300/30 border-b border-b-orange-200 relative">
        {/* Decorative pattern - subtle dots */}
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(#ff6b00 0.5px, transparent 0.5px)", backgroundSize: "10px 10px" }}></div>
        
        <div className="flex justify-between h-full max-lg:flex-col max-lg:justify-center max-lg:items-center max-w-screen-2xl mx-auto px-12 max-[573px]:px-2 py-1.5">
          <ul className="flex items-center h-full gap-x-5 max-[370px]:text-sm max-[370px]:gap-x-2">
            {/* Store Locations Dropdown */}
            <li className="hidden md:flex items-center gap-x-2 hover:text-orange-600 transition-colors cursor-pointer group relative">
              <div className="relative">
                <FaLocationDot className="text-orange-500 group-hover:text-orange-600 group-hover:scale-110 transition-all" />
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-orange-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
              <span className="text-sm font-medium">Our Stores</span>
              
              {/* Stores dropdown */}
              <div className="absolute top-full left-0 mt-2 bg-white shadow-md rounded-md p-3 w-64 hidden group-hover:block z-10">
                <div className="flex flex-col space-y-2">
                  <div className="text-xs text-orange-600 font-semibold mb-1">FIND A STORE NEAR YOU</div>
                  <div className="flex items-start gap-x-2 px-2 py-1.5 hover:bg-orange-50 rounded">
                    <FaLocationDot className="text-orange-500 mt-1" />
                    <div>
                      <p className="text-sm font-medium text-gray-800">Downtown Store</p>
                      <p className="text-xs text-gray-600">123 Main St, City Center</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-x-2 px-2 py-1.5 hover:bg-orange-50 rounded">
                    <FaLocationDot className="text-orange-500 mt-1" />
                    <div>
                      <p className="text-sm font-medium text-gray-800">Westside Mall</p>
                      <p className="text-xs text-gray-600">456 West Ave, Shopping District</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-x-2 px-2 py-1.5 hover:bg-orange-50 rounded">
                    <FaLocationDot className="text-orange-500 mt-1" />
                    <div>
                      <p className="text-sm font-medium text-gray-800">Eastside Plaza</p>
                      <p className="text-xs text-gray-600">789 East Blvd, Business Park</p>
                    </div>
                  </div>
                  <Link href="/stores" className="text-center text-xs text-orange-600 hover:text-orange-700 font-medium mt-1 border-t border-orange-100 pt-2">
                    View All Locations
                  </Link>
                </div>
              </div>
            </li>
            
            {/* Find Nearest Store */}
            <li className="hidden md:flex items-center gap-x-2 hover:text-orange-600 transition-colors cursor-pointer group">
              <button 
                onClick={() => setShowZipSearch(true)} 
                className="flex items-center gap-x-2"
              >
                <svg className="w-4 h-4 text-orange-500 group-hover:text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-sm font-medium">Find Nearest Store</span>
              </button>
            </li>
            
            {/* Language Switcher */}
            <li className="hidden md:flex items-center gap-x-2 hover:text-orange-600 transition-colors cursor-pointer group relative">
              <div className="relative">
                <CiGlobe className="text-orange-500 group-hover:text-orange-600 group-hover:scale-110 transition-all" />
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-orange-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
              <span className="text-sm font-medium">English</span>
              <svg className="w-3 h-3 text-orange-500 ml-0.5 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
              
              {/* Language dropdown */}
              <div className="absolute top-full left-0 mt-2 bg-white shadow-md rounded-md p-2 w-28 hidden group-hover:block z-10">
                <div className="flex flex-col space-y-1">
                  <button className="flex items-center gap-x-2 px-2 py-1 hover:bg-orange-50 rounded text-left text-orange-800">
                    <span className="text-sm font-medium">English</span>
                  </button>
                  <button className="flex items-center gap-x-2 px-2 py-1 hover:bg-orange-50 rounded text-left text-orange-800">
                    <span className="text-sm font-medium">Français</span>
                  </button>
                  <button className="flex items-center gap-x-2 px-2 py-1 hover:bg-orange-50 rounded text-left text-orange-800">
                    <span className="text-sm font-medium">Español</span>
                  </button>
                </div>
              </div>
            </li>
            
            {/* Customer Support */}
            <li className="hidden md:flex items-center gap-x-2 hover:text-orange-600 transition-colors cursor-pointer group">
              <svg className="w-4 h-4 text-orange-500 group-hover:text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              <span className="text-sm font-medium relative">
                Customer Support
                <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-orange-500 group-hover:w-full transition-all duration-300"></span>
              </span>
            </li>
          </ul>
          
          <ul className="flex items-center gap-x-5 h-full max-[370px]:text-sm max-[370px]:gap-x-2">
            {!session ? ( 
            <>
            <li className="flex items-center">
              <Link href="/login" className="flex items-center gap-x-1.5 hover:text-orange-600 transition-colors group">
                <div className="relative">
                  <FaRegUser className="text-orange-500 group-hover:text-orange-600 group-hover:scale-110 transition-all" />
                  <div className="absolute -top-1 -right-1 w-0 h-0 bg-orange-400 rounded-full group-hover:w-1.5 group-hover:h-1.5 transition-all"></div>
                </div>
                <span className="text-sm font-medium relative">
                  Login
                  <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-orange-500 group-hover:w-full transition-all duration-300"></span>
                </span>
              </Link>
            </li>
            <li className="flex items-center border-l border-orange-300/50 pl-4">
              <Link href="/register" className="flex items-center gap-x-1.5 hover:text-orange-600 transition-colors group">
                <div className="relative">
                  <FaRegUser className="text-orange-500 group-hover:text-orange-600 group-hover:scale-110 transition-all" />
                  <div className="absolute -top-1 -right-1 w-0 h-0 bg-orange-400 rounded-full group-hover:w-1.5 group-hover:h-1.5 transition-all"></div>
                </div>
                <span className="text-sm font-medium relative">
                  Register
                  <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-orange-500 group-hover:w-full transition-all duration-300"></span>
                </span>
              </Link>
            </li>
            </>
            ) : (
            <>              {/* Logged in user dropdown */}
              <div className="relative">
                <div className="flex items-center gap-x-2 ml-10 cursor-pointer"
                     onMouseEnter={handleUserDropdownEnter}
                     onMouseLeave={handleUserDropdownLeave}
                >
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-orange-700 truncate max-w-[150px] hover:text-orange-600 transition-colors">
                    {session.user?.email}
                  </span>
                  <svg className={`w-3 h-3 text-orange-500 transition-transform ${userDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
                
                {/* User dropdown menu */}                {userDropdownOpen && (
                <div 
                  className="absolute top-full right-0 mt-2 bg-white shadow-md rounded-md py-2 w-48 z-10 border border-orange-100"
                  onMouseEnter={handleUserDropdownEnter}
                  onMouseLeave={handleUserDropdownLeave}
                >
                  <Link href="/account" className="flex items-center gap-x-2 px-4 py-1.5 hover:bg-orange-50 text-orange-800">
                    <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                    <span className="text-sm">My Account</span>
                  </Link>
                  <Link href="/orders" className="flex items-center gap-x-2 px-4 py-1.5 hover:bg-orange-50 text-orange-800">
                    <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                    </svg>
                    <span className="text-sm">My Orders</span>
                  </Link>
                  <Link href="/wishlist" className="flex items-center gap-x-2 px-4 py-1.5 hover:bg-orange-50 text-orange-800">
                    <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                    </svg>
                    <span className="text-sm">My Wishlist</span>
                  </Link>
                  <div className="border-t border-orange-100 my-1"></div>
                  <button 
                    onClick={() => handleLogout()} 
                    className="flex items-center gap-x-2 px-4 py-1.5 hover:bg-red-50 text-red-600 w-full text-left"
                  >
                    <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                    </svg>
                    <span className="text-sm font-medium">Log out</span>
                  </button>
                </div>
                )}
              </div>
            </>)}
          </ul>
        </div>
      </div>
      
      {/* ZIP Code Search Modal */}
      {showZipSearch && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white p-5 rounded-lg shadow-xl max-w-md w-full relative">
            <button 
              onClick={() => setShowZipSearch(false)} 
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <AiOutlineClose size={16} />
            </button>
            
            <h3 className="text-xl font-medium text-orange-600 mb-4">Find a store near you</h3>
            <form onSubmit={handleZipSearch}>
              <div className="mb-4">
                <label htmlFor="zipcode" className="block text-sm font-medium text-gray-700 mb-1">
                  Enter your ZIP code
                </label>
                <input
                  type="text"
                  id="zipcode"
                  value={zipcode}
                  onChange={(e) => setZipcode(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="e.g., 10001"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-2 px-4 rounded-md transition-colors"
              >
                Find Stores
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeaderTop;
