import React, { useState, useEffect } from 'react';
//import { Search } from 'lucide-react';
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
        setDoctors(data);
        setFilteredDoctors(data);
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
      let filtered = [...doctors];
      const searchQuery = getSearchParam('search');
      if (searchQuery) {
        filtered = filtered.filter(doctor => 
          doctor.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      
      const consultationType = getSearchParam('consultationType');
      if (consultationType) {
        filtered = filtered.filter(doctor => {
          const consultationMode = doctor.consultationMode || [];
          if (consultationType === 'video') {
            return consultationMode.includes('Video Consult');
          } else if (consultationType === 'clinic') {
            return consultationMode.includes('In Clinic');
          }
          return true;
        });
      }
    
      const specialties = getSearchParam('specialties')?.split(',').filter(Boolean) || [];
      if (specialties.length > 0) {
        filtered = filtered.filter(doctor => 
          doctor.specialty && specialties.some(specialty => 
            doctor.specialty.includes(specialty)
          )
        );
      }
    
      const sortBy = getSearchParam('sortBy');
      if (sortBy) {
        filtered.sort((a, b) => {
          if (sortBy === 'fees') {
            return (a.fees || 0) - (b.fees || 0);
          } else if (sortBy === 'experience') {
            return (b.experience || 0) - (a.experience || 0);
          }
          return 0;
        });
      }
      
      setFilteredDoctors(filtered);
    }
  }, [doctors, searchParams]);
  
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

  const allSpecialties = doctors.length > 0 
    ? [...new Set(doctors.flatMap(doctor => doctor.specialty || []))]
    : [];
  
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