'use client';

import { useEffect, useState } from 'react';
import { Job } from '@/lib/types';

export default function CalendarPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch('/api/jobs?status=booked');
        const { success, data } = await res.json();

        if (!success) throw new Error('Failed to fetch jobs');

        setJobs(data.jobs || []);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getJobsForDate = (day: number) => {
    return jobs.filter((job) => {
      if (!job.scheduled_date) return false;
      const jobDate = new Date(job.scheduled_date);
      return (
        jobDate.getDate() === day &&
        jobDate.getMonth() === currentDate.getMonth() &&
        jobDate.getFullYear() === currentDate.getFullYear()
      );
    });
  };

  const monthName = currentDate.toLocaleString('default', {
    month: 'long',
    year: 'numeric',
  });

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const days = [];

  // Empty cells for days before month starts
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }

  // Days of the month
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const today = new Date();
  const goToToday = () => {
    setCurrentDate(new Date(today.getFullYear(), today.getMonth()));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Calendar</h1>
        <div className="flex gap-2">
          <button onClick={previousMonth} className="btn-secondary">
            ← Previous
          </button>
          <button onClick={goToToday} className="btn-secondary">
            Today
          </button>
          <button onClick={nextMonth} className="btn-secondary">
            Next →
          </button>
        </div>
      </div>

      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}

      {loading ? (
        <div className="text-center py-12">Loading...</div>
      ) : (
        <div className="card">
          <h2 className="text-2xl font-bold mb-6">{monthName}</h2>

          <div className="grid grid-cols-7 gap-1">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="font-bold text-center py-2 bg-slate-100">
                {day}
              </div>
            ))}

            {days.map((day, index) => {
              const dayJobs = day ? getJobsForDate(day) : [];
              const isToday =
                day &&
                day === today.getDate() &&
                today.getMonth() === currentDate.getMonth() &&
                today.getFullYear() === currentDate.getFullYear();

              return (
                <div
                  key={index}
                  className={`min-h-24 p-2 border rounded ${
                    day ? (isToday ? 'bg-blue-50 border-blue-300' : 'bg-white') : 'bg-gray-50'
                  }`}
                >
                  {day && (
                    <>
                      <div className={`font-bold mb-1 ${isToday ? 'text-blue-600' : ''}`}>
                        {day}
                      </div>
                      <div className="space-y-1">
                        {dayJobs.map((job) => (
                          <div
                            key={job.id}
                            className="text-xs bg-orange-100 text-orange-800 p-1 rounded truncate cursor-pointer hover:bg-orange-200"
                            title={job.service_type}
                          >
                            {job.service_type}
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>

          <p className="text-sm text-slate-600 mt-6">
            Showing {jobs.length} scheduled job{jobs.length !== 1 ? 's' : ''}
          </p>
        </div>
      )}
    </div>
  );
}
