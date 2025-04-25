import React from 'react';
import { MapPin, Building } from 'lucide-react';

const DoctorCard = ({ doctor }) => {
  const { 
    name, 
    specialty, 
    qualification, 
    experience, 
    fees, 
    clinic, 
    location 
  } = doctor;

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4 doctor-card" data-testid="doctor-card">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="md:w-1/6 flex justify-center">
          <div className="w-20 h-20 rounded-full bg-gray-300 overflow-hidden">
            <img
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0D8ABC&color=fff`}
              alt={name}
              className="w-full h-full object-cover"
              data-testid="doctor-profile"
            />
          </div>
        </div>
        
        <div className="flex-1">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-800 mb-1" data-testid="doctor-name">{name}</h2>
              <p className="text-gray-600 mb-1">{specialty && Array.isArray(specialty) ? specialty.join(', ') : ''}</p>
              <p className="text-gray-500 text-sm mb-1" data-testid="doctor-qualification">{qualification}</p>
              <p className="text-gray-500 text-sm mb-2" data-testid="doctor-experience">{experience} yrs exp.</p>
              
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 text-gray-500 text-sm">
                <div className="flex items-center">
                  <Building className="h-4 w-4 mr-1 shrink-0" />
                  <span>{clinic?.name || clinic || 'Clinic Name Unavailable'}</span>
                </div>
                
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1 shrink-0" />
                  <span>{location}</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-start gap-4 md:gap-2 mt-4 md:mt-0">
              <p className="text-lg font-semibold text-gray-800" data-testid="doctor-fee">₹{fees}</p>
              <button 
                className="bg-blue-600 text-white py-2 px-6 rounded-md font-medium hover:bg-blue-700 transition-colors book-button whitespace-nowrap"
              >
                Book Appointment
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorCard;