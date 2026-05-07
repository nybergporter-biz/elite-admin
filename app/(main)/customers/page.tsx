'use client';

import { useEffect, useState } from 'react';
import { Customer } from '@/lib/types';
import CustomerList from '@/components/CustomerList';
import Link from 'next/link';

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await fetch('/api/customers');
        const { success, data } = await res.json();
        if (!success) throw new Error('Failed to fetch');
        setCustomers(data.customers);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this customer?')) return;
    try {
      await fetch(`/api/customers/${id}`, { method: 'DELETE' });
      setCustomers(customers.filter((c) => c.id !== id));
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Customers</h1>
        <Link href="/customers/new" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          + Add Customer
        </Link>
      </div>
      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}
      {loading && <div className="text-center py-12">Loading...</div>}
      {!loading && customers.length === 0 && <div className="text-center py-12">No customers yet</div>}
      {!loading && customers.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <CustomerList customers={customers} onDelete={handleDelete} />
        </div>
      )}
    </div>
  );
}
