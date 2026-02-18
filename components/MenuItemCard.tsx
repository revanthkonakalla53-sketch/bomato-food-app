'use client';

import { useEffect, useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { MenuItem } from '@/lib/supabase';
import { Button } from '@/components/ui/button';

interface MenuItemCardProps {
  item: MenuItem;
  initialQuantity?: number;
  onQuantityChange?: (quantity: number) => void;
}

export default function MenuItemCard({
  item,
  initialQuantity = 0,
  onQuantityChange,
}: MenuItemCardProps) {
  const [quantity, setQuantity] = useState(initialQuantity);
  const [showCounter, setShowCounter] = useState(initialQuantity > 0);

  useEffect(() => {
    setQuantity(initialQuantity);
    setShowCounter(initialQuantity > 0);
  }, [initialQuantity]);

  const handleAddClick = () => {
    setShowCounter(true);
    setQuantity(1);
    onQuantityChange?.(1);
  };

  const handleQuantityChange = (newQuantity: number) => {
    newQuantity = Math.max(0, newQuantity);
    setQuantity(newQuantity);
    onQuantityChange?.(newQuantity);

    if (newQuantity === 0) {
      setShowCounter(false);
    }
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100">
      {item.image_url && (
        <div className="h-40 overflow-hidden">
          <img
            src={item.image_url}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="p-4">
        <h4 className="font-bold text-gray-900 text-lg mb-1">
          {item.name}
        </h4>

        {item.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {item.description}
          </p>
        )}

        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-emerald-600">
            ${item.price.toFixed(2)}
          </span>

          {!showCounter ? (
            <Button
              size="sm"
              variant="outline"
              onClick={handleAddClick}
              className="border-emerald-200 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700"
            >
              Add
            </Button>
          ) : (
            <div className="flex items-center gap-2 bg-emerald-50 rounded-lg p-1">
              <button
                onClick={() => handleQuantityChange(quantity - 1)}
                className="p-1 hover:bg-emerald-200 rounded transition-colors"
              >
                <Minus className="w-4 h-4 text-emerald-600" />
              </button>
              <span className="w-6 text-center font-semibold text-emerald-600">
                {quantity}
              </span>
              <button
                onClick={() => handleQuantityChange(quantity + 1)}
                className="p-1 hover:bg-emerald-200 rounded transition-colors"
              >
                <Plus className="w-4 h-4 text-emerald-600" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
