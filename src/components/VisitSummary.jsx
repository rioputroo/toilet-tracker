import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getSummary, addVisit, resetTodayVisits } from '../services/api';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

function VisitSummary() {
    const queryClient = useQueryClient();

    const { data: summary = [], isLoading } = useQuery({
        queryKey: ['summary'],
        queryFn: getSummary,
        refetchInterval: 5000 // Real-time updates every 5 seconds
    });

    const addVisitMutation = useMutation({
        mutationFn: addVisit,
        onSuccess: () => {
            queryClient.invalidateQueries(['summary']);
        }
    });

    const resetMutation = useMutation({
        mutationFn: resetTodayVisits,
        onSuccess: () => {
            queryClient.invalidateQueries(['summary']);
        }
    });

    if (isLoading) {
        return <p className="text-muted-foreground text-center">Loading summary...</p>;
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Today's Summary</CardTitle>
                <Button
                    variant="destructive"
                    onClick={() => resetMutation.mutate()}
                    disabled={resetMutation.isPending}
                >
                    {resetMutation.isPending ? 'Resetting...' : 'Reset Today'}
                </Button>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {summary.map((employee) => (
                        <div key={employee.id} className="flex items-center justify-between border-b pb-2">
                            <div>
                                <span className="font-medium">{employee.name}</span>
                                <span className="ml-4 text-muted-foreground">
                                    Visits: {employee.visit_count}
                                </span>
                            </div>
                            <Button
                                onClick={() => addVisitMutation.mutate(employee.id)}
                                disabled={addVisitMutation.isPending}
                                size="sm"
                            >
                                Add Visit
                            </Button>
                        </div>
                    ))}
                    {summary.length === 0 && (
                        <p className="text-muted-foreground text-center">No employees added yet</p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

export default VisitSummary;