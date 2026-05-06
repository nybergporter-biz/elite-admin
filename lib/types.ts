// lib/types.ts

export interface Customer {
  id: string;
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Job {
  id: string;
  customer_id: string;
  service_type: string;
  status: 'quoted' | 'booked' | 'in_progress' | 'completed' | 'cancelled';
  quoted_price: number;
  actual_price?: number;
  scheduled_date?: string;
  completed_date?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Invoice {
  id: string;
  job_id?: string;
  customer_id: string;
  amount: number;
  tax: number;
  total: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  issued_date: string;
  due_date?: string;
  paid_date?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface BusinessSettings {
  business_name: string;
  business_phone: string;
  business_email: string;
  service_types: string[];
}

export interface User {
  id: string;
  email: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
