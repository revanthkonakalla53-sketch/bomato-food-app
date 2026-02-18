/*
  # Create restaurants table

  1. New Tables
    - `restaurants`
      - `id` (uuid, primary key) - Unique identifier for each restaurant
      - `name` (text) - Restaurant name
      - `image_url` (text) - URL to restaurant image
      - `rating` (numeric) - Restaurant rating (0-5)
      - `cuisine_tags` (text[]) - Array of cuisine types
      - `price_level` (integer) - Price level (1-4, representing $-$$$$)
      - `description` (text) - Brief description
      - `created_at` (timestamptz) - Timestamp of creation

  2. Security
    - Enable RLS on `restaurants` table
    - Add policy for public read access (restaurant listings are public)
    - Add policy for authenticated users to insert restaurants
*/

CREATE TABLE IF NOT EXISTS restaurants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  image_url text NOT NULL,
  rating numeric(2,1) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  cuisine_tags text[] DEFAULT '{}',
  price_level integer DEFAULT 1 CHECK (price_level >= 1 AND price_level <= 4),
  description text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view restaurants"
  ON restaurants FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can insert restaurants"
  ON restaurants FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Insert sample data
INSERT INTO restaurants (name, image_url, rating, cuisine_tags, price_level, description) VALUES
  ('The Golden Spoon', 'https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=800', 4.5, ARRAY['Italian', 'Fine Dining'], 3, 'Elegant Italian restaurant with authentic cuisine'),
  ('Sushi Paradise', 'https://images.pexels.com/photos/260922/pexels-photo-260922.jpeg?auto=compress&cs=tinysrgb&w=800', 4.8, ARRAY['Japanese', 'Sushi'], 3, 'Premium sushi experience with fresh ingredients'),
  ('Taco Fiesta', 'https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg?auto=compress&cs=tinysrgb&w=800', 4.2, ARRAY['Mexican', 'Street Food'], 1, 'Authentic Mexican street tacos and more'),
  ('The Burger Joint', 'https://images.pexels.com/photos/1639562/pexels-photo-1639562.jpeg?auto=compress&cs=tinysrgb&w=800', 4.3, ARRAY['American', 'Burgers'], 2, 'Gourmet burgers and craft sodas'),
  ('Spice House', 'https://images.pexels.com/photos/735869/pexels-photo-735869.jpeg?auto=compress&cs=tinysrgb&w=800', 4.6, ARRAY['Indian', 'Curry'], 2, 'Traditional Indian flavors and spices'),
  ('Le Petit Bistro', 'https://images.pexels.com/photos/460537/pexels-photo-460537.jpeg?auto=compress&cs=tinysrgb&w=800', 4.7, ARRAY['French', 'Fine Dining'], 4, 'Intimate French bistro with classic dishes'),
  ('Dragon Wok', 'https://images.pexels.com/photos/262047/pexels-photo-262047.jpeg?auto=compress&cs=tinysrgb&w=800', 4.4, ARRAY['Chinese', 'Asian'], 2, 'Authentic Chinese cuisine and dim sum'),
  ('Pizza Napoli', 'https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg?auto=compress&cs=tinysrgb&w=800', 4.5, ARRAY['Italian', 'Pizza'], 2, 'Wood-fired pizzas with traditional recipes'),
  ('Green Bowl', 'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=800', 4.1, ARRAY['Healthy', 'Vegetarian'], 2, 'Fresh and healthy plant-based options'),
  ('Ocean Breeze', 'https://images.pexels.com/photos/67468/pexels-photo-67468.jpeg?auto=compress&cs=tinysrgb&w=800', 4.6, ARRAY['Seafood', 'Mediterranean'], 3, 'Fresh seafood with Mediterranean flair');
