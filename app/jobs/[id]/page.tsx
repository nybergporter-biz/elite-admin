'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Job } from '@/lib/types';
import JobForm from '@/components/JobForm';

export default function JobDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [job, setJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetch_job = async () => {
      try {
        const res = await fetch(`/api/jobs/${params.id}`);
        const { success, data } = await res.json();
        if (!success) throw new Error('Failed');
        setJob(data.job);
      } catch (err) {
        console.error(err);
      }
    };
    fetch_job();
  }, [params.id]);

  const handleSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/jobs/${params.id}`, {
        method: 'PUT',
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

  if (!job) return <div className="text-center py-12">Loading...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Edit Job</h1>
      <JobForm initialData={job} onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
}
