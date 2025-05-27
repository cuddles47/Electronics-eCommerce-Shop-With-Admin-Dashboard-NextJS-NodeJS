"use client";

// *********************
// Role of the component: Button for adding and removing product to the wishlist on the single product page
// Name of the component: AddToWishlistBtn.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.0
// Component call: <AddToWishlistBtn product={product} slug={slug}  />
// Input parameters: AddToWishlistBtnProps interface
// Output: Two buttons with adding and removing from the wishlist functionality
// *********************

import { useWishlistStore } from "@/app/_zustand/wishlistStore";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaHeartCrack } from "react-icons/fa6";
import { FaHeart } from "react-icons/fa6";
import { safeFetch } from "@/utils/fetchUtil";

interface AddToWishlistBtnProps {
  product: Product;
  slug: string;
}

const AddToWishlistBtn = ({ product, slug }: AddToWishlistBtnProps) => {
  const { data: session, status } = useSession();
  const { addToWishlist, removeFromWishlist, wishlist } = useWishlistStore();
  const [isProductInWishlist, setIsProductInWishlist] = useState<boolean>();
  const addToWishlistFun = async () => {
    // getting user by email so I can get his user id
    if (session?.user?.email) {
      try {
        // sending fetch request to get user id because we will need it for saving wish item
        const userData = await safeFetch(`http://localhost:3001/api/users/email/${session?.user?.email}`, {
          cache: "no-store",
        });
        
        if (userData?.id) {
          const wishlistData = await safeFetch("http://localhost:3001/api/wishlist", {
            method: "POST",
            headers: {
              Accept: "application/json, text/plain, */*",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ productId: product?.id, userId: userData?.id }),
          });
          
          addToWishlist({
            id: product?.id,
            title: product?.title,
            price: product?.price,
            image: product?.mainImage,
            slug: product?.slug,
            stockAvailabillity: product?.inStock,
          });
          toast.success("Product added to the wishlist");
        }
      } catch (error) {
        console.error("Error adding product to wishlist:", error);
        toast.error("Failed to add product to wishlist");
      }
    } else {
      toast.error("You need to be logged in to add a product to the wishlist");
    }
  };
  const removeFromWishlistFun = async () => {
    if (session?.user?.email) {
      try {
        // sending fetch request to get user id because we will need to delete wish item
        const userData = await safeFetch(`http://localhost:3001/api/users/email/${session?.user?.email}`, {
          cache: "no-store",
        });
        
        if (userData?.id) {
          await safeFetch(
            `http://localhost:3001/api/wishlist/${userData?.id}/${product?.id}`,
            {
              method: "DELETE",
            }
          );
          
          removeFromWishlist(product?.id);
          toast.success("Product removed from the wishlist");
        }
      } catch (error) {
        console.error("Error removing product from wishlist:", error);
        toast.error("Failed to remove product from wishlist");
      }
    }
  };  useEffect(() => {
    const isInWishlist = async () => {
      // sending fetch request to get user id because we will need it for cheching whether the product is in wishlist
      if (session?.user?.email) {
        try {
          const userData = await safeFetch(`http://localhost:3001/api/users/email/${session?.user?.email}`, {
            cache: "no-store",
          });
          
          if (userData?.id) {
            // checking is product in wishlist
            const wishlistData = await safeFetch(
              `http://localhost:3001/api/wishlist/${userData?.id}/${product?.id}`
            );
            
            if (wishlistData?.[0]?.id) {
              setIsProductInWishlist(true);
            } else {
              setIsProductInWishlist(false);
            }
          }
        } catch (error) {
          console.error("Error checking if product is in wishlist:", error);
          setIsProductInWishlist(false);
        }
      }
    };
    
    isInWishlist();
  }, [session?.user?.email, wishlist, product?.id]);

  return (
    <>
      {isProductInWishlist ? (
        <p
          className="flex items-center gap-x-2 cursor-pointer"
          onClick={removeFromWishlistFun}
        >
          <FaHeartCrack className="text-xl text-custom-black" />
          <span className="text-lg">REMOVE FROM WISHLIST</span>
        </p>
      ) : (
        <p
          className="flex items-center gap-x-2 cursor-pointer"
          onClick={addToWishlistFun}
        >
          <FaHeart className="text-xl text-custom-black" />
          <span className="text-lg">ADD TO WISHLIST</span>
        </p>
      )}
    </>
  );
};

export default AddToWishlistBtn;
