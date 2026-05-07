'use client';

import { useEffect, useState } from 'react';
import MetricsCard from '@/components/MetricsCard';

interface DashboardMetrics {
  revenue: number;
  jobs_completed: number;
  customers_new: number;
  conversion_rate: string;
}

export default function Dashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const [revenue, jobs, customers, conversion] = await Promise.all([
          fetch('/api/analytics/revenue').then((r) => r.json()),
          fetch('/api/analytics/jobs').then((r) => r.json()),
          fetch('/api/analytics/customers').then((r) => r.json()),
          fetch('/api/analytics/conversion').then((r) => r.json()),
        ]);

        setMetrics({
          revenue: revenue.data?.revenue || 0,
          jobs_completed: jobs.data?.completed || 0,
          customers_new: customers.data?.new_this_month || 0,
          conversion_rate: conversion.data?.quoted_to_completed || '0',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  if (loading) return <div className="text-center py-12">Loading...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <MetricsCard title="Revenue (This Month)" value={`$${metrics?.revenue || 0}`} icon="💰" />
        <MetricsCard title="Jobs Completed" value={metrics?.jobs_completed || 0} icon="✅" />
        <MetricsCard title="New Customers" value={metrics?.customers_new || 0} icon="👥" />
        <MetricsCard title="Conversion Rate" value={`${metrics?.conversion_rate}%`} icon="📈" />
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
        <div className="flex gap-4">
          <a href="/customers/new" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            + Add Customer
          </a>
          <a href="/jobs/new" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            + New Job
          </a>
          <a href="/invoices/new" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            + New Invoice
          </a>
        </div>
      </div>
    </div>
  );
}
