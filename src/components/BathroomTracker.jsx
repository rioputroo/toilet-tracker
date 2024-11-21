import React from 'react';
import EmployeeForm from './EmployeeForm';
import VisitSummary from './VisitSummary';

function BathroomTracker() {
  return (
    <div className="space-y-6">
      <EmployeeForm />
      <VisitSummary />
    </div>
  );
}

export default BathroomTracker;