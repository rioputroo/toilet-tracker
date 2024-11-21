import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addVisit } from '../services/api';

function VisitForm() {
  const [employeeName, setEmployeeName] = useState('');
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: addVisit,
    onSuccess: () => {
      queryClient.invalidateQueries(['visits']);
      setEmployeeName('');
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (employeeName.trim()) {
      mutation.mutate(employeeName);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8">
      <div className="flex gap-4">
        <input
          type="text"
          value={employeeName}
          onChange={(e) => setEmployeeName(e.target.value)}
          placeholder="Enter employee name"
          className="flex-1 p-2 border rounded"
          required
          disabled={mutation.isPending}
        />
        <button
          type="submit"
          className={`px-4 py-2 rounded text-white ${
            mutation.isPending 
              ? 'bg-blue-300 cursor-not-allowed' 
              : 'bg-blue-500 hover:bg-blue-600'
          }`}
          disabled={mutation.isPending}
        >
          {mutation.isPending ? 'Adding...' : 'Log Visit'}
        </button>
      </div>
      {mutation.isError && (
        <div className="mt-2 text-red-600">
          {mutation.error?.response?.data?.error || 'Failed to add visit. Please try again.'}
        </div>
      )}
    </form>
  );
}

export default VisitForm;