-- Run these commands in your Supabase SQL Editor

-- 1. Create Profiles table (linked to auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  name TEXT,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Trigger to create profile when auth.user created
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (new.id, new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 2. Create Products table
CREATE TABLE products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  image TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL,
  rating NUMERIC DEFAULT 0,
  category TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Insert dummy products
INSERT INTO products (name, image, description, price, rating, category) VALUES
('Wireless Noise-Canceling Headphones', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80', 'Premium noise-canceling headphones with 30-hour battery life.', 12999, 4.8, 'Electronics'),
('Smartphone 14 Pro', 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&q=80', 'Latest generation smartphone with pro camera system.', 89999, 4.9, 'Electronics'),
('Classic White Sneakers', 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&q=80', 'Comfortable everyday white sneakers.', 2499, 4.5, 'Shoes'),
('Mechanical Gaming Keyboard', 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=500&q=80', 'RGB mechanical keyboard with tactile switches.', 4599, 4.7, 'Accessories'),
('Smartwatch Series 8', 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&q=80', 'Advanced health and fitness tracking smartwatch.', 24999, 4.6, 'Gadgets'),
('Designer Leather Jacket', 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&q=80', 'Premium authentic leather jacket for men and women.', 8999, 4.8, 'Fashion');

-- 3. Create Orders table
CREATE TABLE orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'Processing', -- Processing, Shipped, Delivered, Delayed
  delivery_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Create Wishlist table
CREATE TABLE wishlist (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, product_id)
);

-- 5. Create Refunds table
CREATE TABLE refunds (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  amount NUMERIC,                           -- refund amount in INR
  status TEXT DEFAULT 'Pending', -- Pending, Approved, Processed, Rejected
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- If table already exists, add the column with:
-- ALTER TABLE refunds ADD COLUMN IF NOT EXISTS amount NUMERIC;

-- Set Row Level Security (RLS) - FOR NOW, we'll allow public read access to products, but restrict everything else. 
-- Note: You might want to fine-tune RLS policies for production.
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles are viewable by everyone." ON products FOR SELECT USING (true);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can insert their own profile." ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile." ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can read own profile." ON profiles FOR SELECT USING (auth.uid() = id);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own orders." ON orders FOR ALL USING (auth.uid() = user_id);

ALTER TABLE wishlist ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own wishlist." ON wishlist FOR ALL USING (auth.uid() = user_id);

ALTER TABLE refunds ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own refunds." ON refunds FOR ALL USING (auth.uid() = user_id);
