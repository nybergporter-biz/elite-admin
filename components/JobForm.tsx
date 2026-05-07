'use client';

import { Job } from '@/lib/types';
import { useState } from 'react';

interface JobFormProps {
  initialData?: Job;
  onSubmit: (data: any) => Promise<void>;
  isLoading?: boolean;
}

export default function JobForm({ initialData, onSubmit, isLoading }: JobFormProps) {
  const [formData, setFormData] = useState(
    initialData || {
      customer_id: '',
      service_type: '',
      status: 'quoted',
      quoted_price: '',
      actual_price: '',
      scheduled_date: '',
      completed_date: '',
      notes: '',
    }
  );
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.customer_id) { setError('Customer ID required'); return; }
    if (!formData.service_type) { setError('Service type required'); return; }
    if (!formData.quoted_price) { setError('Quoted price required'); return; }

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
          placeholder="Service Type"
          value={formData.service_type}
          onChange={(e) => setFormData({ ...formData, service_type: e.target.value })}
          className="w-full px-4 py-2 border border-slate-300 rounded focus:outline-none focus:border-blue-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <select
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          className="w-full px-4 py-2 border border-slate-300 rounded focus:outline-none focus:border-blue-500"
        >
          <option value="quoted">Quoted</option>
          <option value="booked">Booked</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <input
          type="number"
          placeholder="Quoted Price"
          value={formData.quoted_price}
          onChange={(e) => setFormData({ ...formData, quoted_price: e.target.value })}
          className="w-full px-4 py-2 border border-slate-300 rounded focus:outline-none focus:border-blue-500"
          step="0.01"
        />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <input
          type="number"
          placeholder="Actual Price"
          value={formData.actual_price || ''}
          onChange={(e) => setFormData({ ...formData, actual_price: e.target.value })}
          className="w-full px-4 py-2 border border-slate-300 rounded focus:outline-none focus:border-blue-500"
          step="0.01"
        />
        <input
          type="date"
          placeholder="Scheduled Date"
          value={formData.scheduled_date || ''}
          onChange={(e) => setFormData({ ...formData, scheduled_date: e.target.value })}
          className="w-full px-4 py-2 border border-slate-300 rounded focus:outline-none focus:border-blue-500"
        />
      </div>

      <input
        type="date"
        placeholder="Completed Date"
        value={formData.completed_date || ''}
        onChange={(e) => setFormData({ ...formData, completed_date: e.target.value })}
        className="w-full px-4 py-2 border border-slate-300 rounded focus:outline-none focus:border-blue-500 mb-4"
      />

      <textarea
        placeholder="Notes"
        value={formData.notes || ''}
        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
        className="w-full px-4 py-2 border border-slate-300 rounded focus:outline-none focus:border-blue-500 mb-4 resize-none"
        rows={4}
      />

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" disabled={isLoading}>
        {isLoading ? 'Saving...' : 'Save Job'}
      </button>
    </form>
  );
}
