'use client';

import { useRouter } from 'next/navigation';
import InvoiceForm from '@/components/InvoiceForm';
import { useState } from 'react';

export default function NewInvoicePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const { success } = await res.json();
      if (!success) throw new Error('Failed');
      router.push('/invoices');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Add Invoice</h1>
      <InvoiceForm onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
}
