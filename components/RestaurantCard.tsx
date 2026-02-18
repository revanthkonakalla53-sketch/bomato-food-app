import { Star } from 'lucide-react';
import Link from 'next/link';
import { Restaurant } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface RestaurantCardProps {
  restaurant: Restaurant;
}

export default function RestaurantCard({ restaurant }: RestaurantCardProps) {
  const getPriceLevel = (level: number) => {
    return '$'.repeat(level);
  };

  return (
    <div className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
      <div className="relative h-48 overflow-hidden">
        <img
          src={restaurant.image_url}
          alt={restaurant.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1 shadow-md">
          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
          <span className="font-semibold text-sm">{restaurant.rating}</span>
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">
            {restaurant.name}
          </h3>
          <span className="text-lg font-bold text-emerald-600">
            {getPriceLevel(restaurant.price_level)}
          </span>
        </div>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {restaurant.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {restaurant.cuisine_tags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
            >
              {tag}
            </Badge>
          ))}
        </div>

        <Link href={`/restaurant/${restaurant.id}`}>
          <Button
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
          >
            Order Now
          </Button>
        </Link>
      </div>
    </div>
  );
}
