'use client';

import { Customer } from '@/lib/types';
import Link from 'next/link';

interface CustomerListProps {
  customers: Customer[];
  onDelete?: (id: string) => void;
}

export default function CustomerList({ customers, onDelete }: CustomerListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-slate-100 border-b">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-semibold">Name</th>
            <th className="px-6 py-3 text-left text-sm font-semibold">Phone</th>
            <th className="px-6 py-3 text-left text-sm font-semibold">Email</th>
            <th className="px-6 py-3 text-left text-sm font-semibold">City</th>
            <th className="px-6 py-3 text-right text-sm font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer.id} className="border-b hover:bg-slate-50">
              <td className="px-6 py-4">
                <Link href={`/customers/${customer.id}`} className="text-blue-600 hover:underline">
                  {customer.first_name} {customer.last_name}
                </Link>
              </td>
              <td className="px-6 py-4">{customer.phone}</td>
              <td className="px-6 py-4">{customer.email}</td>
              <td className="px-6 py-4">{customer.city}</td>
              <td className="px-6 py-4 text-right">
                <Link href={`/customers/${customer.id}`} className="text-blue-600 hover:underline mr-4">
                  Edit
                </Link>
                <button
                  onClick={() => onDelete?.(customer.id)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
