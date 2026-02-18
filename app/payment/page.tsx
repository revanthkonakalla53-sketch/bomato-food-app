'use client';

import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

type PaymentMethod = 'upi' | 'card' | 'cod';

export default function PaymentPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const itemsJson = searchParams.get('items');
  const total = searchParams.get('total');
  const restaurantName = searchParams.get('restaurantName');

  const items: OrderItem[] = itemsJson ? JSON.parse(itemsJson) : [];
  const totalAmount = total ? parseFloat(total) : 0;

  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('upi');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^\d{10}$/.test(phoneNumber.replace(/\D/g, ''))) {
      newErrors.phoneNumber = 'Please enter a valid 10-digit phone number';
    }

    if (!address.trim()) {
      newErrors.address = 'Delivery address is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePayment = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const params = new URLSearchParams();
      params.append('items', JSON.stringify(items));
      params.append('total', totalAmount.toString());
      params.append('fullName', fullName);
      params.append('phoneNumber', phoneNumber);
      params.append('address', address);
      params.append('paymentMethod', paymentMethod);
      params.append('restaurantName', restaurantName || '');

      router.push(`/order-confirmation?${params.toString()}`);
    }, 2000);
  };

  const getButtonText = () => {
    if (loading) return null;
    return paymentMethod === 'cod' ? 'Place Order' : 'Pay Now';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 mb-8 font-medium transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Order Summary
        </button>

        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Payment Details
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Order Summary
              </h2>

              <div className="space-y-3 mb-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
                  >
                    <div>
                      <p className="font-semibold text-gray-900">
                        {item.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {item.quantity} × ${item.price.toFixed(2)}
                      </p>
                    </div>
                    <p className="font-bold text-emerald-600">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-gray-900">
                  Total Amount
                </span>
                <span className="text-2xl font-bold text-emerald-600">
                  ${totalAmount.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Delivery Address
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name
                  </label>
                  <Input
                    type="text"
                    placeholder="Enter your full name"
                    value={fullName}
                    onChange={(e) => {
                      setFullName(e.target.value);
                      if (errors.fullName) {
                        setErrors({ ...errors, fullName: '' });
                      }
                    }}
                    className={`${
                      errors.fullName
                        ? 'border-red-500 focus:border-red-500'
                        : 'border-gray-200 focus:border-emerald-500'
                    }`}
                  />
                  {errors.fullName && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.fullName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <Input
                    type="tel"
                    placeholder="Enter your phone number"
                    value={phoneNumber}
                    onChange={(e) => {
                      setPhoneNumber(e.target.value);
                      if (errors.phoneNumber) {
                        setErrors({ ...errors, phoneNumber: '' });
                      }
                    }}
                    className={`${
                      errors.phoneNumber
                        ? 'border-red-500 focus:border-red-500'
                        : 'border-gray-200 focus:border-emerald-500'
                    }`}
                  />
                  {errors.phoneNumber && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.phoneNumber}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Delivery Address
                  </label>
                  <textarea
                    placeholder="Enter your complete delivery address"
                    value={address}
                    onChange={(e) => {
                      setAddress(e.target.value);
                      if (errors.address) {
                        setErrors({ ...errors, address: '' });
                      }
                    }}
                    rows={4}
                    className={`w-full px-4 py-3 rounded-lg border-2 font-normal resize-none focus:outline-none transition-colors ${
                      errors.address
                        ? 'border-red-500 focus:border-red-500'
                        : 'border-gray-200 focus:border-emerald-500'
                    }`}
                  />
                  {errors.address && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.address}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Payment Method
              </h2>

              <div className="space-y-3">
                <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer transition-colors hover:border-emerald-300"
                  style={{
                    borderColor: paymentMethod === 'upi' ? 'rgb(16, 185, 129)' : undefined,
                    backgroundColor: paymentMethod === 'upi' ? 'rgb(240, 253, 250)' : undefined,
                  }}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="upi"
                    checked={paymentMethod === 'upi'}
                    onChange={(e) =>
                      setPaymentMethod(e.target.value as PaymentMethod)
                    }
                    className="w-4 h-4 accent-emerald-600 cursor-pointer"
                  />
                  <div className="ml-3">
                    <p className="font-semibold text-gray-900">UPI</p>
                    <p className="text-sm text-gray-600">
                      Google Pay, PhonePe, Paytm
                    </p>
                  </div>
                </label>

                <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer transition-colors hover:border-emerald-300"
                  style={{
                    borderColor: paymentMethod === 'card' ? 'rgb(16, 185, 129)' : undefined,
                    backgroundColor: paymentMethod === 'card' ? 'rgb(240, 253, 250)' : undefined,
                  }}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={(e) =>
                      setPaymentMethod(e.target.value as PaymentMethod)
                    }
                    className="w-4 h-4 accent-emerald-600 cursor-pointer"
                  />
                  <div className="ml-3">
                    <p className="font-semibold text-gray-900">
                      Credit/Debit Card
                    </p>
                    <p className="text-sm text-gray-600">
                      Visa, Mastercard, American Express
                    </p>
                  </div>
                </label>

                <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer transition-colors hover:border-emerald-300"
                  style={{
                    borderColor: paymentMethod === 'cod' ? 'rgb(16, 185, 129)' : undefined,
                    backgroundColor: paymentMethod === 'cod' ? 'rgb(240, 253, 250)' : undefined,
                  }}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={(e) =>
                      setPaymentMethod(e.target.value as PaymentMethod)
                    }
                    className="w-4 h-4 accent-emerald-600 cursor-pointer"
                  />
                  <div className="ml-3">
                    <p className="font-semibold text-gray-900">
                      Cash on Delivery
                    </p>
                    <p className="text-sm text-gray-600">
                      Pay when your order arrives
                    </p>
                  </div>
                </label>
              </div>
            </div>

            <Button
              onClick={handlePayment}
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white font-bold py-6 text-lg transition-all"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </span>
              ) : (
                getButtonText()
              )}
            </Button>
          </div>

          <div className="lg:sticky lg:top-8 h-fit">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Order Total
              </h3>

              <div className="space-y-3 mb-4 pb-4 border-b border-gray-100">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900 font-semibold">
                    ${(totalAmount * 0.9).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax (10%)</span>
                  <span className="text-gray-900 font-semibold">
                    ${(totalAmount * 0.1).toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="font-bold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-emerald-600">
                  ${totalAmount.toFixed(2)}
                </span>
              </div>

              <div className="mt-6 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                <p className="text-sm text-emerald-900">
                  <span className="font-semibold">From:</span> {restaurantName}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
