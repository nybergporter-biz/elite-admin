'use client';

import { useRouter } from 'next/navigation';
import CustomerForm from '@/components/CustomerForm';
import { useState } from 'react';

export default function NewCustomerPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      const session = localStorage.getItem('supabase.auth.token');
      const token = session ? JSON.parse(session).access_token : '';

      const res = await fetch('/api/customers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      const { success } = await res.json();
      if (!success) throw new Error('Failed');
      router.push('/customers');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Add Customer</h1>
      <CustomerForm onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
}
