import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { getVisits } from '../services/api';

function VisitList() {
  const { data: visits = [], isLoading, error } = useQuery({
    queryKey: ['visits'],
    queryFn: getVisits
  });

  if (isLoading) {
    return <p className="text-gray-500 text-center">Loading visits...</p>;
  }

  if (error) {
    return (
      <div className="p-3 bg-red-50 text-red-600 rounded-lg">
        {error?.response?.data?.error || 'Failed to load visits. Please refresh the page.'}
      </div>
    );
  }

  if (visits.length === 0) {
    return <p className="text-gray-500 text-center">No visits recorded today</p>;
  }

  return (
    <div className="space-y-2">
      {visits.map((visit) => (
        <div
          key={visit.id}
          className="border rounded p-3 flex justify-between items-center"
        >
          <span className="font-medium">{visit.employee_name}</span>
          <span className="text-gray-500">
            {format(new Date(visit.timestamp), 'HH:mm:ss')}
          </span>
        </div>
      ))}
    </div>
  );
}

export default VisitList;