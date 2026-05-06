export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validatePhone(phone: string): boolean {
  return /^\d{10}$|^\(\d{3}\) \d{3}-\d{4}$/.test(phone.replace(/\D/g, ''));
}

export function validateCustomer(data: any): string | null {
  if (!data.first_name?.trim()) return 'First name is required';
  if (!data.last_name?.trim()) return 'Last name is required';
  if (!data.phone?.trim()) return 'Phone is required';
  if (!validatePhone(data.phone)) return 'Phone must be 10 digits';
  if (!data.email?.trim()) return 'Email is required';
  if (!validateEmail(data.email)) return 'Email is invalid';
  if (!data.address?.trim()) return 'Address is required';
  if (!data.city?.trim()) return 'City is required';
  if (!data.state?.trim()) return 'State is required';
  if (!data.zip?.trim()) return 'ZIP code is required';
  return null;
}

export function validateJob(data: any): string | null {
  if (!data.customer_id?.trim()) return 'Customer is required';
  if (!data.service_type?.trim()) return 'Service type is required';
  if (data.quoted_price <= 0) return 'Quoted price must be greater than 0';
  return null;
}

export function validateInvoice(data: any): string | null {
  if (!data.customer_id?.trim()) return 'Customer is required';
  if (data.amount <= 0) return 'Amount must be greater than 0';
  if (data.tax < 0) return 'Tax cannot be negative';
  return null;
}
