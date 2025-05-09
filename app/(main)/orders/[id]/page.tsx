'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';

interface OrderProduct {
  id: string;
  product: {
    id: string;
    title: string;
    mainImage: string;
    price: number;
    slug: string;
  };
  quantity: number;
}

interface Order {
  id: string;
  name: string;
  lastname: string;
  email: string;
  phone: string;
  adress: string;
  apartment: string;
  postalCode: string;
  city: string;
  country: string;
  company: string;
  dateTime: string;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  orderNotice: string;
  trackingNumber: string | null;
  total: number;
  products: OrderProduct[];
}

const OrderDetailPage = ({ params }: { params: { id: string } }) => {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const { data: session, status } = useSession();
  const router = useRouter();
  const orderId = params.id;

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (status === 'loading') return;
      
      if (!session) {
        toast.error('You must be logged in to view order details');
        router.push('/login');
        return;
      }

      try {
        const response = await fetch(`/api/orders/${orderId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch order details');
        }

        const data = await response.json();
        setOrder(data);
      } catch (error) {
        console.error('Error fetching order details:', error);
        toast.error('Failed to load order details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId, session, status, router]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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

  if (loading) {
    return (
      <div className="container mx-auto p-8 max-w-6xl">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-orange-500"></div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto p-8 max-w-6xl">
        <div className="text-center py-16 bg-gray-50 rounded-lg">
          <h2 className="text-2xl font-medium text-gray-600 mb-4">Order not found</h2>
          <p className="text-gray-500 mb-8">The order you're looking for doesn't exist or you don't have permission to view it.</p>
          <Link href="/orders" className="bg-orange-500 hover:bg-orange-600 text-white py-3 px-6 rounded-md font-medium transition-colors">
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-6xl">
      <div className="mb-8">
        <Link href="/orders" className="text-orange-600 hover:text-orange-700 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back to Orders
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-orange-100 to-orange-50 p-6">
          <div className="flex flex-col md:flex-row justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">Order #{order.id.substring(0, 8)}</h1>
              <p className="text-gray-600">Placed on {formatDate(order.dateTime)}</p>
            </div>
            <div className="mt-4 md:mt-0">
              <span className={`px-4 py-1.5 rounded-full text-sm font-medium ${getStatusBadgeColor(order.status)}`}>
                {order.status}
              </span>
            </div>
          </div>
          
          {order.trackingNumber && (
            <div className="p-3 bg-blue-50 rounded-md text-blue-800">
              <p className="font-medium">Tracking Number: {order.trackingNumber}</p>
            </div>
          )}
        </div>
        
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold mb-4">Order Items</h2>
          <div className="space-y-6">
            {order.products.map((item) => (
              <div key={item.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 border-b border-gray-100 pb-6">
                <div className="w-24 h-24 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                  <img 
                    src={item.product.mainImage} 
                    alt={item.product.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-grow">
                  <Link href={`/product/${item.product.slug}`} className="text-gray-800 font-medium hover:text-orange-500 transition-colors">
                    {item.product.title}
                  </Link>
                  <p className="text-gray-500">Quantity: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-lg">${(item.product.price * item.quantity / 100).toFixed(2)}</p>
                  <p className="text-sm text-gray-500">${(item.product.price / 100).toFixed(2)} each</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
            <div className="bg-gray-50 p-4 rounded">
              <p className="font-medium">{order.name} {order.lastname}</p>
              <p>{order.adress}</p>
              {order.apartment && <p>{order.apartment}</p>}
              <p>{order.city}, {order.postalCode}</p>
              <p>{order.country}</p>
              <p className="mt-2">{order.phone}</p>
              <p>{order.email}</p>
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="bg-gray-50 p-4 rounded">
              <div className="flex justify-between mb-2">
                <span>Subtotal</span>
                <span>${(order.total / 100).toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t border-gray-300 mt-3 pt-3">
                <span>Total</span>
                <span>${(order.total / 100).toFixed(2)}</span>
              </div>
              
              <div className="mt-4">
                <p><span className="font-medium">Payment Method:</span> {order.paymentMethod || 'Credit Card'}</p>
                <p><span className="font-medium">Payment Status:</span> {order.paymentStatus}</p>
              </div>
            </div>
          </div>
        </div>
        
        {order.orderNotice && (
          <div className="p-6 border-t">
            <h2 className="text-xl font-semibold mb-2">Order Notes</h2>
            <p className="text-gray-700">{order.orderNotice}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetailPage;
