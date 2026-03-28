export interface Product {
  id: string;
  name: string;
  image: string;
  description: string;
  price: number;
  rating: number;
  category: string;
  created_at?: string;
}

export interface UserProfile {
  id: string;
  name: string | null;
  email: string;
  created_at: string;
}

export interface Order {
  id: string;
  user_id: string;
  product_id: string;
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Delayed';
  delivery_date: string | null;
  created_at: string;
}

export interface WishlistItem {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
}
