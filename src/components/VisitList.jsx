import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { getVisits } from '../services/api';
import { Card, CardContent } from './ui/card';

function VisitList() {
  const { data: visits = [], isLoading, error } = useQuery({
    queryKey: ['visits'],
    queryFn: getVisits
  });

  if (isLoading) {
    return <p className="text-muted-foreground text-center">Loading visits...</p>;
  }

  if (error) {
    return (
      <Card className="border-destructive">
        <CardContent className="pt-6">
          <p className="text-destructive">
            {error?.response?.data?.error || 'Failed to load visits. Please refresh the page.'}
          </p>
        </CardContent>
      </Card>
    );
  }

  if (visits.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-muted-foreground text-center">No visits recorded today</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-2">
      {visits.map((visit) => (
        <Card key={visit.id}>
          <CardContent className="p-4 flex justify-between items-center">
            <span className="font-medium">{visit.employee_name}</span>
            <span className="text-muted-foreground">
              {format(new Date(visit.timestamp), 'HH:mm:ss')}
            </span>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default VisitList;