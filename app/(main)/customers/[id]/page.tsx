'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Customer } from '@/lib/types';
import CustomerForm from '@/components/CustomerForm';

export default function CustomerDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetch_customer = async () => {
      try {
        const res = await fetch(`/api/customers/${params.id}`);
        const { success, data } = await res.json();
        if (!success) throw new Error('Failed');
        setCustomer(data.customer);
      } catch (err) {
        console.error(err);
      }
    };
    fetch_customer();
  }, [params.id]);

  const handleSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/customers/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const { success } = await res.json();
      if (!success) throw new Error('Failed');
      router.push('/customers');
    } finally {
      setIsLoading(false);
    }
  };

  if (!customer) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Edit Customer</h1>
      <CustomerForm initialData={customer} onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
}
