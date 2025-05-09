'use client';

import React, { useEffect, useState } from 'react';
import { getSession, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface OrderProduct {
  id: string;
  product: {
    id: string;
    title: string;
    mainImage: string;
    price: number;
  };
  quantity: number;
}

interface Order {
  id: string;
  name: string;
  lastname: string;
  email: string;
  phone: string;
  dateTime: string;
  status: string;
  city: string;
  country: string;
  paymentStatus: string;
  trackingNumber?: string;
  total: number;
  products: OrderProduct[];
}

const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    const fetchOrders = async () => {
      if (status === 'loading') return;
      
      if (!session) {
        toast.error('You must be logged in to view orders');
        router.push('/login');
        return;
      }

      try {
        const response = await fetch('/api/orders', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }

        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error('Error fetching orders:', error);
        toast.error('Failed to load orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [session, status, router]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'unpaid':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-8 max-w-6xl">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-orange-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-6xl">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-lg">
          <h2 className="text-2xl font-medium text-gray-600 mb-4">You haven't placed any orders yet</h2>
          <p className="text-gray-500 mb-8">Start shopping to see your orders here.</p>
          <Link href="/" className="bg-orange-500 hover:bg-orange-600 text-white py-3 px-6 rounded-md font-medium transition-colors">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {orders.map((order) => (
            <div key={order.id} className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
              <div className="bg-gradient-to-r from-orange-100 to-orange-50 p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <div className="flex gap-3 items-center mb-1">
                    <h3 className="font-semibold text-lg">Order #{order.id.substring(0, 8)}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(order.status)}`}>
                      {order.status}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPaymentStatusBadgeColor(order.paymentStatus)}`}>
                      {order.paymentStatus}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">Placed on {formatDate(order.dateTime)}</p>
                </div>
                <div className="flex gap-3">
                  <span className="font-semibold text-lg">${order.total.toFixed(2)}</span>
                  <Link 
                    href={`/orders/${order.id}`}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded text-sm transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>
              <div className="p-4 sm:p-6 bg-white">
                <div className="space-y-4">
                  {order.products.slice(0, 3).map((item) => (
                    <div key={item.id} className="flex items-center gap-4">
                      <div className="w-16 h-16 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
                        <img 
                          src={item.product.mainImage} 
                          alt={item.product.title} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-grow">
                        <h4 className="text-gray-800 font-medium line-clamp-1">{item.product.title}</h4>
                        <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                      </div>
                      <span className="font-medium">${(item.product.price * item.quantity / 100).toFixed(2)}</span>
                    </div>
                  ))}
                  
                  {order.products.length > 3 && (
                    <div className="text-sm text-gray-500 italic">
                      + {order.products.length - 3} more items
                    </div>
                  )}
                </div>
                
                {order.trackingNumber && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-md">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Tracking Number:</span> {order.trackingNumber}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
