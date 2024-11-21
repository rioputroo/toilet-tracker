import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import BathroomTracker from './components/BathroomTracker';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-background">
        <div className="container py-8">
          <h1 className="text-3xl font-bold text-center mb-8">Employee Bathroom Tracker</h1>
          <BathroomTracker />
        </div>
      </div>
    </QueryClientProvider>
  );
}

export default App;