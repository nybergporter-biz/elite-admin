'use client';

import { useEffect, useState } from 'react';
import { Invoice } from '@/lib/types';
import Link from 'next/link';

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const res = await fetch('/api/invoices');
        const { success, data } = await res.json();
        if (!success) throw new Error('Failed to fetch');
        setInvoices(data.invoices);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    fetchInvoices();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this invoice?')) return;
    try {
      await fetch(`/api/invoices/${id}`, { method: 'DELETE' });
      setInvoices(invoices.filter((i) => i.id !== id));
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Invoices</h1>
        <Link href="/invoices/new" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          + Add Invoice
        </Link>
      </div>
      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}
      {loading && <div className="text-center py-12">Loading...</div>}
      {!loading && invoices.length === 0 && <div className="text-center py-12">No invoices yet</div>}
      {!loading && invoices.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <table className="w-full">
            <thead className="bg-slate-100">
              <tr>
                <th className="px-6 py-3 text-left text-sm">Customer ID</th>
                <th className="px-6 py-3 text-left text-sm">Amount</th>
                <th className="px-6 py-3 text-left text-sm">Tax</th>
                <th className="px-6 py-3 text-left text-sm">Total</th>
                <th className="px-6 py-3 text-left text-sm">Status</th>
                <th className="px-6 py-3 text-right text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => (
                <tr key={invoice.id} className="border-b hover:bg-slate-50">
                  <td className="px-6 py-4">{invoice.customer_id}</td>
                  <td className="px-6 py-4">${invoice.amount.toFixed(2)}</td>
                  <td className="px-6 py-4">${invoice.tax.toFixed(2)}</td>
                  <td className="px-6 py-4">${invoice.total.toFixed(2)}</td>
                  <td className="px-6 py-4">{invoice.status}</td>
                  <td className="px-6 py-4 text-right">
                    <Link href={`/invoices/${invoice.id}`} className="text-blue-600 hover:underline">
                      Edit
                    </Link>
                    <button onClick={() => handleDelete(invoice.id)} className="text-red-600 ml-4 hover:underline">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
