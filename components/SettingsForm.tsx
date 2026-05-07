'use client';

import { BusinessSettings } from '@/lib/types';
import { useState } from 'react';

interface SettingsFormProps {
  initialData: BusinessSettings;
  onSubmit: (data: BusinessSettings) => Promise<void>;
  isLoading?: boolean;
}

export default function SettingsForm({ initialData, onSubmit, isLoading }: SettingsFormProps) {
  const [formData, setFormData] = useState<BusinessSettings>(initialData);
  const [newServiceType, setNewServiceType] = useState('');
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddServiceType = () => {
    if (!newServiceType.trim()) {
      setError('Service type cannot be empty');
      return;
    }

    if (formData.service_types.includes(newServiceType.trim())) {
      setError('This service type already exists');
      return;
    }

    setFormData({
      ...formData,
      service_types: [...formData.service_types, newServiceType.trim()],
    });
    setNewServiceType('');
    setError('');
  };

  const handleRemoveServiceType = (index: number) => {
    setFormData({
      ...formData,
      service_types: formData.service_types.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.business_name?.trim()) {
      setError('Business name is required');
      return;
    }
    if (!formData.business_phone?.trim()) {
      setError('Business phone is required');
      return;
    }
    if (!formData.business_email?.trim()) {
      setError('Business email is required');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.business_email)) {
      setError('Invalid email format');
      return;
    }

    if (formData.service_types.length === 0) {
      setError('At least one service type is required');
      return;
    }

    try {
      await onSubmit(formData);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 max-w-2xl">
      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}

      <div className="mb-6">
        <label className="block text-sm font-semibold mb-2">Business Name</label>
        <input
          type="text"
          name="business_name"
          placeholder="Elite Junk Solutions"
          value={formData.business_name}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border border-slate-300 rounded focus:outline-none focus:border-blue-500"
        />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-semibold mb-2">Business Phone</label>
        <input
          type="tel"
          name="business_phone"
          placeholder="(801) 441-5090"
          value={formData.business_phone}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border border-slate-300 rounded focus:outline-none focus:border-blue-500"
        />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-semibold mb-2">Business Email</label>
        <input
          type="email"
          name="business_email"
          placeholder="info@elitejunksolutions.com"
          value={formData.business_email}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border border-slate-300 rounded focus:outline-none focus:border-blue-500"
        />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-semibold mb-2">Service Types</label>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="e.g., Residential Cleanout"
            value={newServiceType}
            onChange={(e) => setNewServiceType(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddServiceType();
              }
            }}
            className="flex-1 px-4 py-2 border border-slate-300 rounded focus:outline-none focus:border-blue-500"
          />
          <button
            type="button"
            onClick={handleAddServiceType}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Add
          </button>
        </div>

        {formData.service_types.length > 0 && (
          <div className="space-y-2">
            {formData.service_types.map((service, index) => (
              <div key={index} className="flex justify-between items-center bg-slate-50 p-3 rounded border border-slate-200">
                <span>{service}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveServiceType(index)}
                  className="text-red-600 hover:text-red-700 text-sm font-semibold"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}

        {formData.service_types.length === 0 && (
          <div className="text-sm text-slate-500 italic">No service types added yet</div>
        )}
      </div>

      <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700" disabled={isLoading}>
        {isLoading ? 'Saving...' : 'Save Settings'}
      </button>
    </form>
  );
}
