import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addVisit } from '../services/api';
import { Input } from './ui/input';
import { Button } from './ui/button';

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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex gap-4">
        <Input
          type="text"
          value={employeeName}
          onChange={(e) => setEmployeeName(e.target.value)}
          placeholder="Enter employee name"
          required
          disabled={mutation.isPending}
        />
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? 'Adding...' : 'Log Visit'}
        </Button>
      </div>
      {mutation.isError && (
        <p className="text-sm text-destructive">
          {mutation.error?.response?.data?.error || 'Failed to add visit. Please try again.'}
        </p>
      )}
    </form>
  );
}

export default VisitForm;