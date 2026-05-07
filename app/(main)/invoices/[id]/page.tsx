'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Invoice } from '@/lib/types';
import InvoiceForm from '@/components/InvoiceForm';

export default function InvoiceDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetch_invoice = async () => {
      try {
        const res = await fetch(`/api/invoices/${params.id}`);
        const { success, data } = await res.json();
        if (!success) throw new Error('Failed');
        setInvoice(data.invoice);
      } catch (err) {
        console.error(err);
      }
    };
    fetch_invoice();
  }, [params.id]);

  const handleSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/invoices/${params.id}`, {
        method: 'PUT',
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

  if (!invoice) return <div className="text-center py-12">Loading...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Edit Invoice</h1>
      <InvoiceForm initialData={invoice} onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
}
