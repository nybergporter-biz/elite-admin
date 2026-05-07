'use client';

import { Invoice } from '@/lib/types';
import { useState, useEffect } from 'react';

interface InvoiceFormProps {
  initialData?: Invoice;
  onSubmit: (data: any) => Promise<void>;
  isLoading?: boolean;
}

export default function InvoiceForm({ initialData, onSubmit, isLoading }: InvoiceFormProps) {
  const [formData, setFormData] = useState(
    initialData || {
      customer_id: '',
      job_id: '',
      amount: '',
      tax: '',
      total: '',
      status: 'draft',
      notes: '',
    }
  );
  const [error, setError] = useState('');

  // Calculate total when amount or tax changes
  useEffect(() => {
    const amount = parseFloat(formData.amount) || 0;
    const tax = parseFloat(formData.tax) || 0;
    const total = (amount + tax).toFixed(2);
    setFormData((prev) => ({ ...prev, total: total }));
  }, [formData.amount, formData.tax]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.customer_id) { setError('Customer ID required'); return; }
    if (!formData.amount) { setError('Amount required'); return; }
    if (formData.tax === undefined || formData.tax === '') { setError('Tax required'); return; }

    try {
      await onSubmit(formData);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 max-w-2xl">
      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}

      <div className="grid grid-cols-2 gap-4 mb-4">
        <input
          type="text"
          placeholder="Customer ID"
          value={formData.customer_id}
          onChange={(e) => setFormData({ ...formData, customer_id: e.target.value })}
          className="w-full px-4 py-2 border border-slate-300 rounded focus:outline-none focus:border-blue-500"
        />
        <input
          type="text"
          placeholder="Job ID (optional)"
          value={formData.job_id || ''}
          onChange={(e) => setFormData({ ...formData, job_id: e.target.value })}
          className="w-full px-4 py-2 border border-slate-300 rounded focus:outline-none focus:border-blue-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <input
          type="number"
          placeholder="Amount"
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
          className="w-full px-4 py-2 border border-slate-300 rounded focus:outline-none focus:border-blue-500"
          step="0.01"
        />
        <input
          type="number"
          placeholder="Tax"
          value={formData.tax}
          onChange={(e) => setFormData({ ...formData, tax: e.target.value })}
          className="w-full px-4 py-2 border border-slate-300 rounded focus:outline-none focus:border-blue-500"
          step="0.01"
        />
      </div>

      <input
        type="number"
        placeholder="Total"
        value={formData.total}
        readOnly
        className="w-full px-4 py-2 border border-slate-300 rounded focus:outline-none focus:border-blue-500 mb-4 bg-slate-50"
        step="0.01"
      />

      <div className="grid grid-cols-2 gap-4 mb-4">
        <select
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          className="w-full px-4 py-2 border border-slate-300 rounded focus:outline-none focus:border-blue-500"
        >
          <option value="draft">Draft</option>
          <option value="sent">Sent</option>
          <option value="paid">Paid</option>
          <option value="overdue">Overdue</option>
        </select>
      </div>

      <textarea
        placeholder="Notes (optional)"
        value={formData.notes || ''}
        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
        className="w-full px-4 py-2 border border-slate-300 rounded focus:outline-none focus:border-blue-500 mb-4 resize-none"
        rows={4}
      />

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" disabled={isLoading}>
        {isLoading ? 'Saving...' : 'Save Invoice'}
      </button>
    </form>
  );
}
