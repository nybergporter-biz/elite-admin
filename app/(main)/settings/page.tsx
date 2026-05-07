'use client';

import { useEffect, useState } from 'react';
import { BusinessSettings } from '@/lib/types';
import SettingsForm from '@/components/SettingsForm';

export default function SettingsPage() {
  const [settings, setSettings] = useState<BusinessSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/settings');
        const { success, data } = await res.json();
        if (!success) throw new Error('Failed to fetch settings');
        setSettings(data);
      } catch (err) {
        setError((err as Error).message);
        // Set default settings if fetch fails
        setSettings({
          business_name: 'Elite Junk Solutions',
          business_phone: '(801) 441-5090',
          business_email: '',
          service_types: [],
        });
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSubmit = async (data: BusinessSettings) => {
    setIsSaving(true);
    setError('');
    setSuccess('');

    try {
      // Save each field via the API
      const updates = [
        { key: 'business_name', value: data.business_name },
        { key: 'business_phone', value: data.business_phone },
        { key: 'business_email', value: data.business_email },
        { key: 'service_types', value: JSON.stringify(data.service_types) },
      ];

      for (const update of updates) {
        const res = await fetch('/api/settings', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(update),
        });

        const { success } = await res.json();
        if (!success) throw new Error(`Failed to update ${update.key}`);
      }

      setSettings(data);
      setSuccess('Settings saved successfully!');

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Settings</h1>

      {error && !success && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          Error: {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
          {success}
        </div>
      )}

      {settings && <SettingsForm initialData={settings} onSubmit={handleSubmit} isLoading={isSaving} />}
    </div>
  );
}
