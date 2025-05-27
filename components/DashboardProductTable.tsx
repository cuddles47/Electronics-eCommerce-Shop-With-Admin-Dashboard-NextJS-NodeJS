// *********************
// Role of the component: Product table component on admin dashboard page
// Name of the component: DashboardProductTable.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.0
// Component call: <DashboardProductTable />
// Input parameters: no input parameters
// Output: products table
// *********************

"use client";
import { nanoid } from "nanoid";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import CustomButton from "./CustomButton";
import { safeFetch } from "@/utils/fetchUtil";

const DashboardProductTable = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await safeFetch("http://localhost:3001/api/products?mode=admin", {cache: "no-store"});
        setProducts(data || []);
        setError(null);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, []);
  return (
    <div className="w-full">
      <h1 className="text-3xl font-semibold text-center mb-5">All products</h1>
      <div className="flex justify-end mb-5">
        <Link href="/admin/products/new">
          <CustomButton
            buttonType="button"
            customWidth="110px"
            paddingX={10}
            paddingY={5}
            textSize="base"
            text="Add new product"
          />
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-10">
          <span className="loading loading-spinner loading-lg"></span>
          <p className="mt-2">Loading products...</p>
        </div>
      ) : error ? (
        <div className="text-center py-10 text-error">
          <p>{error}</p>
        </div>
      ) : (
        <div className="xl:ml-5 w-full max-xl:mt-5 overflow-auto w-full h-[80vh]">
          <table className="table table-md table-pin-cols">
            {/* head */}
            <thead>
              <tr>
                <th>
                  <label>
                    <input type="checkbox" className="checkbox" />
                  </label>
                </th>
                <th>Product</th>
                <th>Stock Availability</th>
                <th>Price</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {/* row 1 */}
              {products && products.length > 0 ? (
                products.map((product) => (
                <tr key={nanoid()}>
                  <th>
                    <label>
                      <input type="checkbox" className="checkbox" />
                    </label>
                  </th>

                  <td>
                    <div className="flex items-center gap-3">
                      <div className="avatar">
                        <div className="mask mask-squircle w-12 h-12">
                          <Image
                            width={48}
                            height={48}
                            src={product?.mainImage ? `/${product?.mainImage}` : "/product_placeholder.jpg"}
                            alt="Avatar Tailwind CSS Component"
                            className="w-auto h-auto"
                          />
                        </div>
                      </div>
                      <div>
                        <div className="font-bold">{product?.title}</div>
                        <div className="text-sm opacity-50">
                          {product?.manufacturer}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td>
                    { product?.inStock ? (<span className="badge badge-success text-white badge-sm">
                      In stock
                    </span>) : (<span className="badge badge-error text-white badge-sm">
                      Out of stock
                    </span>) }
                    
                  </td>
                  <td>${product?.price}</td>
                  <th>
                    <Link
                      href={`/admin/products/${product.id}`}
                      className="btn btn-ghost btn-xs"
                    >
                      details
                    </Link>
                  </th>                </tr>
              ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-4">
                    No products found
                  </td>
                </tr>
              )}
            </tbody>
            {/* foot */}
            <tfoot>
              <tr>
                <th></th>
                <th>Product</th>
                <th>Stock Availability</th>
                <th>Price</th>
                <th></th>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </div>
  );
};

export default DashboardProductTable;
