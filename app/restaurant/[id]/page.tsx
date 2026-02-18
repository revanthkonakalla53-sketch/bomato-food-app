'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Star, ArrowLeft, ShoppingCart } from 'lucide-react';
import { supabase, Restaurant, MenuItem } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import MenuItemCard from '@/components/MenuItemCard';

interface CartItem {
  item: MenuItem;
  quantity: number;
}

export default function RestaurantPage() {
  const params = useParams();
  const router = useRouter();
  const restaurantId = params.id as string;

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());
  const [cart, setCart] = useState<Map<string, CartItem>>(new Map());

  useEffect(() => {
    fetchRestaurantAndMenu();
  }, []);

  const fetchRestaurantAndMenu = async () => {
    try {
      const [restaurantRes, menuRes] = await Promise.all([
        supabase
          .from('restaurants')
          .select('*')
          .eq('id', restaurantId)
          .maybeSingle(),
        supabase
          .from('menu_items')
          .select('*')
          .eq('restaurant_id', restaurantId)
          .order('category', { ascending: true })
          .order('name', { ascending: true }),
      ]);

      if (restaurantRes.error) throw restaurantRes.error;
      if (menuRes.error) throw menuRes.error;

      setRestaurant(restaurantRes.data);
      setMenuItems(menuRes.data || []);

      const categories = new Set(
        (menuRes.data || []).map((item) => item.category)
      );
      setSelectedCategories(categories);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPriceLevel = (level: number) => {
    return '$'.repeat(level);
  };

  const handleAddItem = (item: MenuItem, quantity: number) => {
    const newCart = new Map(cart);
    if (quantity > 0) {
      newCart.set(item.id, { item, quantity });
    } else {
      newCart.delete(item.id);
    }
    setCart(newCart);
  };

  const handleViewOrder = () => {
    const orderItems = Array.from(cart.values()).map((cartItem) => ({
      id: cartItem.item.id,
      name: cartItem.item.name,
      price: cartItem.item.price,
      quantity: cartItem.quantity,
    }));

    const queryParams = new URLSearchParams();
    queryParams.append('restaurantId', restaurantId);
    queryParams.append('restaurantName', restaurant?.name || '');
    queryParams.append('items', JSON.stringify(orderItems));

    router.push(
      `/order-summary?${queryParams.toString()}`
    );
  };

  const totalItems = Array.from(cart.values()).reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const categories = Array.from(
    new Set(menuItems.map((item) => item.category))
  ).sort();

  const groupedItems = categories.reduce(
    (acc, category) => {
      acc[category] = menuItems.filter((item) => item.category === category);
      return acc;
    },
    {} as Record<string, MenuItem[]>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="h-96 bg-gray-200 rounded-xl animate-pulse mb-6" />
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4 animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-2/3 mb-8 animate-pulse" />
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-24 bg-gray-200 rounded-xl animate-pulse"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 mb-8"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold text-gray-900">
              Restaurant not found
            </h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 mb-6 font-medium transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Restaurants
        </button>

        <div className="bg-white rounded-xl overflow-hidden shadow-sm mb-8">
          <div className="relative h-64 sm:h-96 overflow-hidden">
            <img
              src={restaurant.image_url}
              alt={restaurant.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>

          <div className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  {restaurant.name}
                </h1>
                <p className="text-gray-600 max-w-2xl">
                  {restaurant.description}
                </p>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex items-center gap-2 bg-amber-50 px-4 py-2 rounded-lg">
                  <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                  <span className="font-bold text-lg text-gray-900">
                    {restaurant.rating}
                  </span>
                </div>
                <span className="text-2xl font-bold text-emerald-600 pt-1">
                  {getPriceLevel(restaurant.price_level)}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {restaurant.cuisine_tags.map((tag) => (
                <Badge
                  key={tag}
                  className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Menu</h2>

          {menuItems.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center">
              <p className="text-gray-600">No menu items available</p>
            </div>
          ) : (
            <div className="space-y-8">
              {categories.map((category) => (
                <div key={category}>
                  <h3 className="text-xl font-bold text-gray-900 capitalize mb-4 pb-2 border-b-2 border-emerald-200">
                    {category}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {groupedItems[category].map((item) => (
                      <MenuItemCard
                        key={item.id}
                        item={item}
                        initialQuantity={cart.get(item.id)?.quantity || 0}
                        onQuantityChange={(quantity) =>
                          handleAddItem(item, quantity)
                        }
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {totalItems > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-xl">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-emerald-100 p-3 rounded-lg">
                <ShoppingCart className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">
                  {totalItems} item{totalItems !== 1 ? 's' : ''} in your order
                </p>
              </div>
            </div>
            <Button
              onClick={handleViewOrder}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-8"
            >
              View Order
            </Button>
          </div>
        </div>
      )}

      {totalItems > 0 && <div className="h-24" />}
    </div>
  );
}
