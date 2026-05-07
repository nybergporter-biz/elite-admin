'use client';

import { useRouter } from 'next/navigation';
import JobForm from '@/components/JobForm';
import { useState } from 'react';

export default function NewJobPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const { success } = await res.json();
      if (!success) throw new Error('Failed');
      router.push('/jobs');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Add Job</h1>
      <JobForm onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
}
