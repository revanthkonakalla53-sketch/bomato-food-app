/*
  # Create menu items table

  1. New Tables
    - `menu_items`
      - `id` (uuid, primary key) - Unique identifier for each menu item
      - `restaurant_id` (uuid, foreign key) - References the restaurant
      - `name` (text) - Menu item name
      - `description` (text) - Item description
      - `price` (numeric) - Item price
      - `image_url` (text) - URL to item image
      - `category` (text) - Category like appetizer, main, dessert, etc.
      - `created_at` (timestamptz) - Timestamp of creation

  2. Security
    - Enable RLS on `menu_items` table
    - Add policy for public read access (menu items are public)
*/

CREATE TABLE IF NOT EXISTS menu_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id uuid NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text DEFAULT '',
  price numeric(10,2) NOT NULL,
  image_url text DEFAULT '',
  category text DEFAULT 'main',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view menu items"
  ON menu_items FOR SELECT
  TO public
  USING (true);

-- Insert sample menu items for The Golden Spoon (Italian restaurant)
INSERT INTO menu_items (restaurant_id, name, description, price, image_url, category)
SELECT 
  id as restaurant_id,
  'Spaghetti Carbonara' as name,
  'Classic Roman pasta with guanciale, eggs, and Pecorino cheese' as description,
  16.99 as price,
  'https://images.pexels.com/photos/821365/pexels-photo-821365.jpeg?auto=compress&cs=tinysrgb&w=800' as image_url,
  'main' as category
FROM restaurants WHERE name = 'The Golden Spoon'

UNION ALL

SELECT 
  id,
  'Risotto al Tartufo',
  'Creamy Arborio rice with black truffle and white wine',
  22.99,
  'https://images.pexels.com/photos/1893557/pexels-photo-1893557.jpeg?auto=compress&cs=tinysrgb&w=800',
  'main'
FROM restaurants WHERE name = 'The Golden Spoon'

UNION ALL

SELECT 
  id,
  'Bruschetta al Pomodoro',
  'Toasted bread with fresh tomatoes, basil, and garlic',
  8.99,
  'https://images.pexels.com/photos/3915857/pexels-photo-3915857.jpeg?auto=compress&cs=tinysrgb&w=800',
  'appetizer'
FROM restaurants WHERE name = 'The Golden Spoon'

UNION ALL

SELECT 
  id,
  'Osso Buco',
  'Braised veal shank with vegetables and white wine',
  28.99,
  'https://images.pexels.com/photos/821365/pexels-photo-821365.jpeg?auto=compress&cs=tinysrgb&w=800',
  'main'
FROM restaurants WHERE name = 'The Golden Spoon'

UNION ALL

SELECT 
  id,
  'Tiramisu',
  'Classic Italian dessert with mascarpone and espresso',
  7.99,
  'https://images.pexels.com/photos/2097090/pexels-photo-2097090.jpeg?auto=compress&cs=tinysrgb&w=800',
  'dessert'
FROM restaurants WHERE name = 'The Golden Spoon'

UNION ALL

SELECT 
  id,
  'Margherita Pizza',
  'Fresh mozzarella, tomato sauce, and basil on wood-fired dough',
  14.99,
  'https://images.pexels.com/photos/1629200/pexels-photo-1629200.jpeg?auto=compress&cs=tinysrgb&w=800',
  'main'
FROM restaurants WHERE name = 'The Golden Spoon';
