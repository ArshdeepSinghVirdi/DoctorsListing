import React, { useState, useEffect } from 'react';
import AutoCompleteSearch from './components/AutoCompleteSearch';
import Filters from './components/Filters';
import DoctorList from './components/DoctorList';
import { useSearchParams } from './hooks/useSearchParams';
import './App.css';

function App() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
 
  const {
    searchParams,
    setSearchParam,
    removeSearchParam,
    getSearchParam
  } = useSearchParams();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://srijandubey.github.io/campus-api-mock/SRM-C1-25.json');
       
        if (!response.ok) {
          throw new Error('Failed to fetch doctor data');
        }
       
        const data = await response.json();
        if (data.length > 0) {
          console.log("Sample doctor data:", data[0]);
        }
       
        // Normalize data structure
        const processedData = data.map(doctor => ({
          ...doctor,
          // Ensure consultationMode is always an array
          consultationMode: doctor.consultationMode ? 
            (Array.isArray(doctor.consultationMode) ? doctor.consultationMode : [doctor.consultationMode]) : 
            ['In Clinic', 'Video Consult'], // Default to both if not specified
          // Ensure specialty is always an array
          specialty: doctor.specialty ? 
            (Array.isArray(doctor.specialty) ? doctor.specialty : [doctor.specialty]) : 
            []
        }));
        
        setDoctors(processedData);
        setFilteredDoctors(processedData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
   
    fetchDoctors();
  }, []);
 
  useEffect(() => {
    if (doctors.length > 0) {
      console.log("Filtering with:", {
        search: getSearchParam('search'),
        consultationType: getSearchParam('consultationType'),
        specialties: getSearchParam('specialties')?.split(',').filter(Boolean),
        sortBy: getSearchParam('sortBy')
      });

      let filtered = [...doctors];
      
      // Search filtering
      const searchQuery = getSearchParam('search');
      if (searchQuery) {
        const lowerCaseQuery = searchQuery.toLowerCase();
        filtered = filtered.filter(doctor => {
          // Check if name matches
          const nameMatch = doctor.name?.toLowerCase().includes(lowerCaseQuery);
          
          // Check if any specialty matches
          const specialtyMatch = doctor.specialty?.some(s => 
            s?.toLowerCase().includes(lowerCaseQuery)
          );
          
          // Check if clinic name matches
          const clinicMatch = typeof doctor.clinic === 'string' && 
            doctor.clinic.toLowerCase().includes(lowerCaseQuery);
          
          // Check if clinic object has a name property that matches
          const clinicNameMatch = doctor.clinic && typeof doctor.clinic === 'object' && 
            doctor.clinic.name?.toLowerCase().includes(lowerCaseQuery);
          
          return nameMatch || specialtyMatch || clinicMatch || clinicNameMatch;
        });
      }
   
      // Consultation Type filtering
      const consultationType = getSearchParam('consultationType');
      if (consultationType) {
        filtered = filtered.filter(doctor => {
          // Make sure consultationMode is always treated as an array
          const modes = Array.isArray(doctor.consultationMode) ? 
            doctor.consultationMode : 
            [doctor.consultationMode];
          
          if (consultationType === 'video') {
            return modes.some(mode => 
              mode && mode.toLowerCase().includes('video')
            );
          } else if (consultationType === 'clinic') {
            return modes.some(mode => 
              mode && mode.toLowerCase().includes('clinic')
            );
          }
          return true; // If consultationType is not recognized, don't filter
        });
      }
   
      // Specialties filtering
      const specialties = getSearchParam('specialties')?.split(',').filter(Boolean) || [];
      if (specialties.length > 0) {
        filtered = filtered.filter(doctor => {
          // Make sure specialty is always treated as an array
          const doctorSpecialties = Array.isArray(doctor.specialty) ? 
            doctor.specialty : 
            [doctor.specialty].filter(Boolean); // Filter out null/undefined
          
          return specialties.some(selectedSpecialty =>
            doctorSpecialties.some(docSpecialty =>
              docSpecialty?.toLowerCase().includes(selectedSpecialty.toLowerCase())
            )
          );
        });
      }

      // Sorting logic
      const sortBy = getSearchParam('sortBy');
      if (sortBy) {
        filtered.sort((a, b) => {
          if (sortBy === 'fees') {
            // Convert fees to number (handling string values)
            const feeA = typeof a.fees === 'number' ? a.fees : 
              parseInt(String(a.fees).replace(/[₹,]/g, '')) || 0;
            const feeB = typeof b.fees === 'number' ? b.fees : 
              parseInt(String(b.fees).replace(/[₹,]/g, '')) || 0;
            return feeA - feeB; // Ascending (low to high)
          } else if (sortBy === 'experience') {
            // Convert experience to number (handling string values)
            const expA = typeof a.experience === 'number' ? a.experience : 
              parseInt(String(a.experience)) || 0;
            const expB = typeof b.experience === 'number' ? b.experience : 
              parseInt(String(b.experience)) || 0;
            return expB - expA; // Descending (high to low)
          }
          return 0;
        });
      }
   
      console.log(`Filtered from ${doctors.length} to ${filtered.length} doctors`);
      
      setFilteredDoctors(filtered);
    }
  }, [doctors, searchParams, getSearchParam]);
 
  const handleSearch = (query) => {
    if (query) {
      setSearchParam('search', query);
    } else {
      removeSearchParam('search');
    }
  };
 
  const handleConsultationTypeChange = (type) => {
    if (type) {
      setSearchParam('consultationType', type);
    } else {
      removeSearchParam('consultationType');
    }
  };
 
  const handleSpecialtiesChange = (specialties) => {
    if (specialties.length > 0) {
      setSearchParam('specialties', specialties.join(','));
    } else {
      removeSearchParam('specialties');
    }
  };
 
  const handleSortChange = (sortOption) => {
    if (sortOption) {
      setSearchParam('sortBy', sortOption);
    } else {
      removeSearchParam('sortBy');
    }
  };
 
  const clearAllFilters = () => {
    removeSearchParam('search');
    removeSearchParam('consultationType');
    removeSearchParam('specialties');
    removeSearchParam('sortBy');
  };

  const allSpecialties = React.useMemo(() => {
    if (!doctors.length) return [];
   
    const specialtiesSet = new Set();
   
    doctors.forEach(doctor => {
      if (Array.isArray(doctor.specialty)) {
        doctor.specialty.forEach(s => {
          if (s) specialtiesSet.add(s);
        });
      } else if (typeof doctor.specialty === 'string') {
        specialtiesSet.add(doctor.specialty);
      }
    });
   
    return Array.from(specialtiesSet).sort();
  }, [doctors]);
 
  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-red-600 text-xl font-semibold mb-2">Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-700 p-4 shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex justify-center">
            <div className="w-full max-w-2xl">
              <AutoCompleteSearch
                doctors={doctors}
                onSearch={handleSearch}
                initialSearch={getSearchParam('search') || ''}
              />
            </div>
          </div>
        </div>
      </header>
     
      <main className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/4">
            <Filters
              allSpecialties={allSpecialties}
              onConsultationTypeChange={handleConsultationTypeChange}
              onSpecialtiesChange={handleSpecialtiesChange}
              onSortChange={handleSortChange}
              onClearAll={clearAllFilters}
              initialConsultationType={getSearchParam('consultationType') || ''}
              initialSpecialties={getSearchParam('specialties')?.split(',').filter(Boolean) || []}
              initialSortBy={getSearchParam('sortBy') || ''}
            />
          </div>
         
          <div className="w-full md:w-3/4">
            <DoctorList
              doctors={filteredDoctors}
              loading={loading}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;