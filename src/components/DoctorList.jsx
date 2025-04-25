import React from 'react';
import DoctorCard from './DoctorCard';

const DoctorList = ({ doctors, loading }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (doctors.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">No doctors found</h3>
        <p className="text-gray-600">Try adjusting your search or filter criteria</p>
      </div>
    );
  }

  return (
    <div data-testid="doctor-list">
      {doctors.map((doctor, index) => (
        <DoctorCard key={index} doctor={doctor} />
      ))}
    </div>
  );
};

export default DoctorList;