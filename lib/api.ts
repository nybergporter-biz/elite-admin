import { supabase } from './supabase';
import { Customer, Job, Invoice, BusinessSettings, ApiResponse } from './types';

// ============= CUSTOMERS =============
export async function getCustomers(limit = 20, offset = 0) {
  const { data, error, count } = await supabase
    .from('customers')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) throw error;
  return { customers: data as Customer[], count };
}

export async function getCustomerById(id: string) {
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as Customer;
}

export async function createCustomer(customer: Omit<Customer, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('customers')
    .insert([customer])
    .select()
    .single();

  if (error) throw error;
  return data as Customer;
}

export async function updateCustomer(id: string, updates: Partial<Customer>) {
  const { data, error } = await supabase
    .from('customers')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Customer;
}

export async function deleteCustomer(id: string) {
  const { error } = await supabase
    .from('customers')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// ============= JOBS =============
export async function getJobs(status?: string, limit = 20, offset = 0) {
  let query = supabase.from('jobs').select('*', { count: 'exact' });

  if (status) query = query.eq('status', status);

  const { data, error, count } = await query
    .order('scheduled_date', { ascending: true })
    .range(offset, offset + limit - 1);

  if (error) throw error;
  return { jobs: data as Job[], count };
}

export async function getJobById(id: string) {
  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as Job;
}

export async function createJob(job: Omit<Job, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('jobs')
    .insert([job])
    .select()
    .single();

  if (error) throw error;
  return data as Job;
}

export async function updateJob(id: string, updates: Partial<Job>) {
  const { data, error } = await supabase
    .from('jobs')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Job;
}

export async function deleteJob(id: string) {
  const { error } = await supabase
    .from('jobs')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// ============= INVOICES =============
export async function getInvoices(status?: string, limit = 20, offset = 0) {
  let query = supabase.from('invoices').select('*', { count: 'exact' });

  if (status) query = query.eq('status', status);

  const { data, error, count } = await query
    .order('issued_date', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) throw error;
  return { invoices: data as Invoice[], count };
}

export async function getInvoiceById(id: string) {
  const { data, error } = await supabase
    .from('invoices')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as Invoice;
}

export async function createInvoice(invoice: Omit<Invoice, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('invoices')
    .insert([invoice])
    .select()
    .single();

  if (error) throw error;
  return data as Invoice;
}

export async function updateInvoice(id: string, updates: Partial<Invoice>) {
  const { data, error } = await supabase
    .from('invoices')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Invoice;
}

export async function deleteInvoice(id: string) {
  const { error } = await supabase
    .from('invoices')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// ============= SETTINGS =============
export async function getSettings() {
  const { data, error } = await supabase
    .from('settings')
    .select('*');

  if (error) throw error;

  const settings: BusinessSettings = {
    business_name: 'Elite Junk Solutions',
    business_phone: '(801) 441-5090',
    business_email: '',
    service_types: [],
  };

  data.forEach((setting: any) => {
    if (setting.key === 'business_name') settings.business_name = setting.value;
    if (setting.key === 'business_phone') settings.business_phone = setting.value;
    if (setting.key === 'business_email') settings.business_email = setting.value;
    if (setting.key === 'service_types') settings.service_types = JSON.parse(setting.value);
  });

  return settings;
}

export async function updateSetting(key: string, value: string) {
  const { error } = await supabase
    .from('settings')
    .upsert({ key, value }, { onConflict: 'key' });

  if (error) throw error;
}

// ============= ANALYTICS =============
export async function getRevenue(month?: number, year?: number) {
  const now = new Date();
  const currentMonth = month || now.getMonth() + 1;
  const currentYear = year || now.getFullYear();

  const { data, error } = await supabase
    .from('invoices')
    .select('total')
    .eq('status', 'paid');

  if (error) throw error;

  const filtered = (data || []).filter((inv: any) => {
    const invDate = new Date(inv.issued_date);
    return invDate.getMonth() + 1 === currentMonth && invDate.getFullYear() === currentYear;
  });

  const total = filtered.reduce((sum, inv) => sum + inv.total, 0);
  return { revenue: total, currency: 'USD' };
}

export async function getJobStats() {
  const { data, error } = await supabase
    .from('jobs')
    .select('status');

  if (error) throw error;

  const completed = (data || []).filter((j: any) => j.status === 'completed').length;
  const total = data?.length || 0;

  return {
    completed,
    total,
    completion_rate: total > 0 ? ((completed / total) * 100).toFixed(1) : '0',
  };
}

export async function getCustomerStats() {
  const { data, error } = await supabase
    .from('customers')
    .select('created_at');

  if (error) throw error;

  const now = new Date();
  const thisMonth = (data || []).filter((c: any) => {
    const cDate = new Date(c.created_at);
    return cDate.getMonth() === now.getMonth() && cDate.getFullYear() === now.getFullYear();
  }).length;

  return { new_this_month: thisMonth, total: data?.length || 0 };
}

export async function getConversionRate() {
  const { data: jobs, error: jobsError } = await supabase
    .from('jobs')
    .select('status');

  if (jobsError) throw jobsError;

  const quoted = (jobs || []).filter((j: any) => j.status === 'quoted').length;
  const booked = (jobs || []).filter((j: any) => j.status === 'booked').length;
  const completed = (jobs || []).filter((j: any) => j.status === 'completed').length;
  const totalQuoted = quoted + booked + completed;

  return {
    quoted_to_booked: totalQuoted > 0 ? ((booked / totalQuoted) * 100).toFixed(1) : '0',
    quoted_to_completed: totalQuoted > 0 ? ((completed / totalQuoted) * 100).toFixed(1) : '0',
  };
}
