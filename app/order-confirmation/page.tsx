'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle, Package, MapPin, Phone, User, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export default function OrderConfirmationPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const itemsJson = searchParams.get('items');
  const total = searchParams.get('total');
  const fullName = searchParams.get('fullName');
  const phoneNumber = searchParams.get('phoneNumber');
  const address = searchParams.get('address');
  const paymentMethod = searchParams.get('paymentMethod');
  const restaurantName = searchParams.get('restaurantName');

  const items: OrderItem[] = itemsJson ? JSON.parse(itemsJson) : [];
  const totalAmount = total ? parseFloat(total) : 0;

  const orderId = `ORD-${Date.now()}`;
  const estimatedTime = new Date(Date.now() + 45 * 60000).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const getPaymentMethodLabel = (method: string | null) => {
    switch (method) {
      case 'upi':
        return 'UPI';
      case 'card':
        return 'Credit/Debit Card';
      case 'cod':
        return 'Cash on Delivery';
      default:
        return method || 'Unknown';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-100 rounded-full mb-4">
            <CheckCircle className="w-12 h-12 text-emerald-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Order Confirmed!
          </h1>
          <p className="text-gray-600 text-lg">
            Thank you for your order. Your food is being prepared.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Package className="w-5 h-5 text-emerald-600" />
                Order Details
              </h2>

              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-1">Order ID</p>
                <p className="text-2xl font-bold text-emerald-600 font-mono">
                  {orderId}
                </p>
              </div>

              <Separator className="my-4" />

              <div className="space-y-3 mb-4">
                <h3 className="font-semibold text-gray-900">Order Items</h3>
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between py-2 text-sm"
                  >
                    <div>
                      <p className="font-semibold text-gray-900">
                        {item.name}
                      </p>
                      <p className="text-gray-600">
                        {item.quantity} × ${item.price.toFixed(2)}
                      </p>
                    </div>
                    <p className="font-semibold text-emerald-600">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              <div className="flex justify-between items-center mb-6">
                <span className="text-lg font-bold text-gray-900">
                  Total Amount
                </span>
                <span className="text-2xl font-bold text-emerald-600">
                  ${totalAmount.toFixed(2)}
                </span>
              </div>

              <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
                <p className="text-sm text-emerald-900">
                  <span className="font-semibold">From:</span> {restaurantName}
                </p>
                <p className="text-sm text-emerald-900 mt-1">
                  <span className="font-semibold">Estimated Delivery:</span> {estimatedTime}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-emerald-600" />
                Delivery Address
              </h2>

              <div className="space-y-3">
                <div className="flex gap-3 items-start">
                  <User className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">Name</p>
                    <p className="font-semibold text-gray-900">
                      {fullName}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 items-start">
                  <Phone className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-semibold text-gray-900">
                      {phoneNumber}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 items-start">
                  <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">Address</p>
                    <p className="font-semibold text-gray-900">
                      {address}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-emerald-600" />
                Payment Information
              </h2>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Payment Method</span>
                  <span className="font-semibold text-gray-900">
                    {getPaymentMethodLabel(paymentMethod)}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Payment Status</span>
                  <span className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-sm font-semibold">
                    <div className="w-2 h-2 bg-emerald-600 rounded-full" />
                    Confirmed
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:sticky lg:top-8 h-fit">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6">
                What's Next?
              </h3>

              <ol className="space-y-4">
                <li className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center font-bold text-sm">
                    1
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Preparing</p>
                    <p className="text-sm text-gray-600">
                      Your order is being prepared
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-gray-100 text-gray-700 rounded-full flex items-center justify-center font-bold text-sm">
                    2
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Ready for Pickup</p>
                    <p className="text-sm text-gray-600">
                      Your food will be ready soon
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-gray-100 text-gray-700 rounded-full flex items-center justify-center font-bold text-sm">
                    3
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">On the Way</p>
                    <p className="text-sm text-gray-600">
                      Delivery agent will reach you soon
                    </p>
                  </div>
                </li>
              </ol>

              <Separator className="my-6" />

              <div className="space-y-3">
                <Button
                  onClick={() => router.push('/')}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-6"
                >
                  Continue Shopping
                </Button>
                <Button
                  variant="outline"
                  onClick={() => router.back()}
                  className="w-full"
                >
                  View Order Status
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 flex gap-4">
          <div className="flex-shrink-0 pt-0.5">
            <div className="flex items-center justify-center h-6 w-6 rounded-full bg-blue-600 text-white text-sm font-semibold">
              i
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-blue-900 mb-1">
              Order Confirmation Email Sent
            </h3>
            <p className="text-sm text-blue-800">
              A confirmation email has been sent to your email address with all order details.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
