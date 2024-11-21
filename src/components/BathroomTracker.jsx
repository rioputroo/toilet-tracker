import React from 'react';
import VisitForm from './VisitForm';
import VisitList from './VisitList';

function BathroomTracker() {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <VisitForm />
      <div>
        <h2 className="text-xl font-semibold mb-4">Today's Visits</h2>
        <VisitList />
      </div>
    </div>
  );
}

export default BathroomTracker;