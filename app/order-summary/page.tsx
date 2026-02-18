'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export default function OrderSummaryPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const restaurantId = searchParams.get('restaurantId');
  const restaurantName = searchParams.get('restaurantName');
  const itemsJson = searchParams.get('items');

  const items: OrderItem[] = itemsJson ? JSON.parse(itemsJson) : [];

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 mb-8 font-medium transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>

          <div className="bg-white rounded-xl p-12 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              No items in order
            </h2>
            <p className="text-gray-600 mb-6">
              Add items to your order before proceeding to checkout
            </p>
            <Button
              onClick={() => router.back()}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              Back to Restaurant
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 mb-8 font-medium transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Menu
        </button>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 px-6 sm:px-8 py-6 border-b border-gray-100">
            <h1 className="text-3xl font-bold text-gray-900 mb-1">
              Order Summary
            </h1>
            <p className="text-gray-600">
              From <span className="font-semibold text-emerald-600">{restaurantName}</span>
            </p>
          </div>

          <div className="px-6 sm:px-8 py-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              Order Items
            </h2>

            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {item.name}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>${item.price.toFixed(2)} each</span>
                      <span className="font-medium text-emerald-600">
                        Qty: {item.quantity}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg text-emerald-600">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <Separator className="my-6" />

            <div className="space-y-3 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold text-gray-900">
                  ${subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Tax (10%)</span>
                <span className="font-semibold text-gray-900">
                  ${tax.toFixed(2)}
                </span>
              </div>

              <Separator className="my-3" />

              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-emerald-600">
                  ${total.toFixed(2)}
                </span>
              </div>
            </div>

            <Button
              onClick={() => {
                const paymentParams = new URLSearchParams();
                paymentParams.append('items', JSON.stringify(items));
                paymentParams.append('total', total.toFixed(2));
                paymentParams.append('restaurantName', restaurantName || '');
                router.push(`/payment?${paymentParams.toString()}`);
              }}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-6 text-lg"
            >
              Proceed to Payment
            </Button>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 flex gap-4">
          <div className="flex-shrink-0">
            <CheckCircle className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-blue-900 mb-1">
              Order Information
            </h3>
            <p className="text-sm text-blue-800">
              Your order will be prepared fresh. You can track your delivery status after payment.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
