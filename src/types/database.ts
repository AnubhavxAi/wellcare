export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  mrp: number;
  stock: number;
  unit: string;
  image_url?: string;
  description?: string;
  benefits?: string[];
  how_to_use?: string[];
  ingredients?: string[];
  form?: string;
  requires_prescription: boolean;
  in_stock: boolean;
  // Aliases for frontend compatibility
  imageSrc?: string;
  rxRequired?: boolean;
  originalPrice?: number;
  inStock?: boolean;
  packSize?: string;
  created_at: string;
}

export interface Order {
  id: string;
  order_id: string;
  customer_name: string;
  phone: string;
  email?: string;
  address: string;
  pincode: string;
  items: OrderItem[];
  subtotal: number;
  delivery_charge: number;
  total_amount: number;
  payment_method: string;
  status: "pending" | "confirmed" | "dispatched" | "delivered" | "cancelled";
  prescription_url?: string;
  user_id?: string;
  created_at: string;
}

export interface OrderItem {
  id: string;
  name: string;
  brand: string;
  qty: number;
  price: number;
}

export interface User {
  id: string;
  phone: string;
  name: string;
  email?: string;
  addresses: Address[];
  order_count: number;
  created_at: string;
}

export interface Address {
  line1: string;
  line2?: string;
  area: string;
  pincode: string;
  isDefault: boolean;
}

export interface LabBooking {
  id: string;
  booking_id: string;
  test_name: string;
  price: number;
  customer_name: string;
  phone: string;
  age?: number;
  gender?: string;
  address: string;
  preferred_date: string;
  preferred_time: string;
  fasting_required: boolean;
  status: string;
  created_at: string;
}
