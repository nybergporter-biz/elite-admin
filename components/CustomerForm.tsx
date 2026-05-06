'use client';

import { Customer } from '@/lib/types';
import { useState } from 'react';

interface CustomerFormProps {
  initialData?: Customer;
  onSubmit: (data: any) => Promise<void>;
  isLoading?: boolean;
}

export default function CustomerForm({ initialData, onSubmit, isLoading }: CustomerFormProps) {
  const [formData, setFormData] = useState(
    initialData || {
      first_name: '',
      last_name: '',
      phone: '',
      email: '',
      address: '',
      city: '',
      state: '',
      zip: '',
      notes: '',
    }
  );
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.first_name) { setError('First name required'); return; }
    if (!formData.last_name) { setError('Last name required'); return; }
    if (!formData.phone) { setError('Phone required'); return; }
    if (!formData.email) { setError('Email required'); return; }
    if (!formData.address) { setError('Address required'); return; }
    if (!formData.city) { setError('City required'); return; }
    if (!formData.state) { setError('State required'); return; }
    if (!formData.zip) { setError('ZIP required'); return; }

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
          placeholder="First Name"
          value={formData.first_name}
          onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
          className="w-full px-4 py-2 border border-slate-300 rounded focus:outline-none focus:border-blue-500"
        />
        <input
          type="text"
          placeholder="Last Name"
          value={formData.last_name}
          onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
          className="w-full px-4 py-2 border border-slate-300 rounded focus:outline-none focus:border-blue-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <input type="tel" placeholder="Phone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full px-4 py-2 border border-slate-300 rounded focus:outline-none focus:border-blue-500" />
        <input type="email" placeholder="Email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-2 border border-slate-300 rounded focus:outline-none focus:border-blue-500" />
      </div>

      <input type="text" placeholder="Address" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} className="w-full px-4 py-2 border border-slate-300 rounded focus:outline-none focus:border-blue-500 mb-4" />

      <div className="grid grid-cols-3 gap-4 mb-4">
        <input type="text" placeholder="City" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} className="w-full px-4 py-2 border border-slate-300 rounded focus:outline-none focus:border-blue-500" />
        <input type="text" placeholder="State" value={formData.state} onChange={(e) => setFormData({ ...formData, state: e.target.value })} className="w-full px-4 py-2 border border-slate-300 rounded focus:outline-none focus:border-blue-500" />
        <input type="text" placeholder="ZIP" value={formData.zip} onChange={(e) => setFormData({ ...formData, zip: e.target.value })} className="w-full px-4 py-2 border border-slate-300 rounded focus:outline-none focus:border-blue-500" />
      </div>

      <textarea placeholder="Notes" value={formData.notes || ''} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} className="w-full px-4 py-2 border border-slate-300 rounded focus:outline-none focus:border-blue-500 mb-4 resize-none" rows={4} />

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" disabled={isLoading}>
        {isLoading ? 'Saving...' : 'Save Customer'}
      </button>
    </form>
  );
}
