import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addEmployee } from '../services/api';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';

function EmployeeForm() {
    const [name, setName] = useState('');
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: addEmployee,
        onSuccess: () => {
            queryClient.invalidateQueries(['employees']);
            queryClient.invalidateQueries(['summary']);
            setName('');
        }
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (name.trim()) {
            mutation.mutate(name);
        }
    };

    return (
        <Card>
            <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex gap-4">
                        <Input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter new employee name"
                            required
                            disabled={mutation.isPending}
                        />
                        <Button type="submit" disabled={mutation.isPending}>
                            {mutation.isPending ? 'Adding...' : 'Add Employee'}
                        </Button>
                    </div>
                    {mutation.isError && (
                        <p className="text-sm text-destructive">
                            {mutation.error?.response?.data?.error || 'Failed to add employee. Please try again.'}
                        </p>
                    )}
                </form>
            </CardContent>
        </Card>
    );
}

export default EmployeeForm;