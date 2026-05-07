'use client';

import { useEffect, useState } from 'react';
import { Job } from '@/lib/types';
import Link from 'next/link';

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch('/api/jobs');
        const { success, data } = await res.json();
        if (!success) throw new Error('Failed to fetch');
        setJobs(data.jobs);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this job?')) return;
    try {
      await fetch(`/api/jobs/${id}`, { method: 'DELETE' });
      setJobs(jobs.filter((j) => j.id !== id));
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Jobs</h1>
        <Link href="/jobs/new" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          + Add Job
        </Link>
      </div>
      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}
      {loading && <div className="text-center py-12">Loading...</div>}
      {!loading && jobs.length === 0 && <div className="text-center py-12">No jobs yet</div>}
      {!loading && jobs.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <table className="w-full">
            <thead className="bg-slate-100">
              <tr>
                <th className="px-6 py-3 text-left text-sm">Customer ID</th>
                <th className="px-6 py-3 text-left text-sm">Service</th>
                <th className="px-6 py-3 text-left text-sm">Status</th>
                <th className="px-6 py-3 text-left text-sm">Price</th>
                <th className="px-6 py-3 text-right text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job.id} className="border-b hover:bg-slate-50">
                  <td className="px-6 py-4">{job.customer_id}</td>
                  <td className="px-6 py-4">{job.service_type}</td>
                  <td className="px-6 py-4">{job.status}</td>
                  <td className="px-6 py-4">${job.quoted_price}</td>
                  <td className="px-6 py-4 text-right">
                    <Link href={`/jobs/${job.id}`} className="text-blue-600 hover:underline">
                      Edit
                    </Link>
                    <button onClick={() => handleDelete(job.id)} className="text-red-600 ml-4 hover:underline">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
