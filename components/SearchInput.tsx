// *********************
// Role of the component: Search input element located in the header but it can be used anywhere in your application
// Name of the component: SearchInput.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.0
// Component call: <SearchInput />
// Input parameters: no input parameters
// Output: form with search input and button
// *********************

"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";

const SearchInput = () => {
  const [searchInput, setSearchInput] = useState<string>("");
  const router = useRouter();

  // function for modifying URL for searching products
  // After it we will grab URL on the search page and send GET request for searched products
  const searchProducts = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    router.push(`/search?search=${searchInput}`);
    setSearchInput("");
  };

  return (
    <form className="flex w-full justify-center relative group" onSubmit={searchProducts}>
      <input
        type="text"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        placeholder="Search products..."
        className="bg-[#f8f4e7]/50 input input-bordered w-[70%] rounded-l-xl rounded-r-none outline-none focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400 border-r-0 transition-all duration-200 pl-4 max-sm:w-full placeholder-gray-400/80"
      />
      <button 
        type="submit" 
        className="btn bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-l-none rounded-r-xl hover:from-orange-600 hover:to-orange-700 border-none shadow-md group-hover:shadow-lg transition-all duration-200"
      >
        <FaSearch className="mr-1" />
        Search
      </button>
      <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 text-xs text-orange-700/70 hidden group-hover:block transition-opacity">
        Find amazing products
      </div>
    </form>
  );
};

export default SearchInput;
