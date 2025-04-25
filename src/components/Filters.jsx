import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, X, Search } from 'lucide-react';

const Filters = ({ 
  allSpecialties, 
  onConsultationTypeChange, 
  onSpecialtiesChange, 
  onSortChange,
  onClearAll,
  initialConsultationType = '',
  initialSpecialties = [],
  initialSortBy = ''
}) => {
  const [expandedSections, setExpandedSections] = useState({
    specialties: true,
    consultation: true,
    sort: true
  });
  
  const [consultationType, setConsultationType] = useState(initialConsultationType);
  const [selectedSpecialties, setSelectedSpecialties] = useState(initialSpecialties);
  const [sortBy, setSortBy] = useState(initialSortBy);
  const [searchSpecialty, setSearchSpecialty] = useState('');
  
  useEffect(() => {
    setConsultationType(initialConsultationType);
    setSelectedSpecialties(initialSpecialties);
    setSortBy(initialSortBy);
  }, [initialConsultationType, initialSpecialties, initialSortBy]);
  
  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  
  const handleConsultationTypeChange = (type) => {
    const newType = consultationType === type ? '' : type;
    setConsultationType(newType);
    onConsultationTypeChange(newType);
  };
  
  const handleSpecialtyChange = (specialty) => {
    const newSpecialties = selectedSpecialties.includes(specialty)
      ? selectedSpecialties.filter(s => s !== specialty)
      : [...selectedSpecialties, specialty];
    
    setSelectedSpecialties(newSpecialties);
    onSpecialtiesChange(newSpecialties);
  };
  
  const handleSortChange = (sort) => {
    const newSort = sortBy === sort ? '' : sort;
    setSortBy(newSort);
    onSortChange(newSort);
  };
  
  const clearFilters = () => {
    setConsultationType('');
    setSelectedSpecialties([]);
    setSortBy('');
    setSearchSpecialty('');
    onClearAll();
  };
  
  const filteredSpecialties = (allSpecialties || []).filter(specialty => 
    typeof specialty === 'string' && specialty.toLowerCase().includes(searchSpecialty.toLowerCase())
  );
  
  const hasActiveFilters = consultationType || selectedSpecialties.length > 0 || sortBy;
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4" data-testid="filters">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Filters</h2>
        {hasActiveFilters && (
          <button 
            onClick={clearFilters}
            className="text-sm text-blue-600 hover:text-blue-800"
            data-testid="clear-all"
          >
            Clear All
          </button>
        )}
      </div>
      
      {/* Sort Options */}
      <div className="mb-4">
        <div 
          className="flex justify-between items-center cursor-pointer py-2"
          onClick={() => toggleSection('sort')}
        >
          <h3 className="font-medium text-gray-800">Sort by</h3>
          {expandedSections.sort ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
        
        {expandedSections.sort && (
          <div className="mt-2 filter-section">
            <div className="flex items-center mb-2">
              <input
                id="sort-fees"
                type="radio"
                checked={sortBy === 'fees'}
                onChange={() => handleSortChange('fees')}
                className="w-4 h-4 text-blue-600"
                data-testid="sort-fees"
              />
              <label htmlFor="sort-fees" className="ml-2 text-sm text-gray-700">
                Price: Low-High
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                id="sort-experience"
                type="radio"
                checked={sortBy === 'experience'}
                onChange={() => handleSortChange('experience')}
                className="w-4 h-4 text-blue-600"
                data-testid="sort-experience"
              />
              <label htmlFor="sort-experience" className="ml-2 text-sm text-gray-700">
                Experience: Most Experience first
              </label>
            </div>
          </div>
        )}
      </div>
      
      <hr className="my-4" />
      
      {/* Specialties */}
      <div className="mb-4">
        <div 
          className="flex justify-between items-center cursor-pointer py-2"
          onClick={() => toggleSection('specialties')}
        >
          <h3 className="font-medium text-gray-800">Specialities</h3>
          {expandedSections.specialties ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
        
        {expandedSections.specialties && (
          <div className="mt-2 filter-section">
            <div className="relative mb-3">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="h-4 w-4 text-gray-500" />
              </div>
              <input
                type="text"
                value={searchSpecialty}
                onChange={(e) => setSearchSpecialty(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 text-sm text-gray-900 border border-gray-300 rounded-md"
                placeholder="Search specialties"
              />
            </div>
            
            <div className="max-h-48 overflow-y-auto">
              {filteredSpecialties.map((specialty, index) => (
                <div key={index} className="flex items-center mb-2 specialty-item rounded-md p-1">
                  <input
                    id={`specialty-${index}`}
                    type="checkbox"
                    checked={selectedSpecialties.includes(specialty)}
                    onChange={() => handleSpecialtyChange(specialty)}
                    className="w-4 h-4 text-blue-600"
                    data-testid={`filter-specialty-${specialty.toLowerCase().replace(/\s+/g, '')}`}
                  />
                  <label htmlFor={`specialty-${index}`} className="ml-2 text-sm text-gray-700">
                    {specialty}
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <hr className="my-4" />
      
      {/* Consultation Mode */}
      <div>
        <div 
          className="flex justify-between items-center cursor-pointer py-2"
          onClick={() => toggleSection('consultation')}
        >
          <h3 className="font-medium text-gray-800">Mode of consultation</h3>
          {expandedSections.consultation ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
        
        {expandedSections.consultation && (
          <div className="mt-2 filter-section">
            <div className="flex items-center mb-2">
              <input
                id="video-consult"
                type="radio"
                checked={consultationType === 'video'}
                onChange={() => handleConsultationTypeChange('video')}
                className="w-4 h-4 text-blue-600"
                data-testid="filter-consultation-video"
              />
              <label htmlFor="video-consult" className="ml-2 text-sm text-gray-700">
                Video Consultation
              </label>
            </div>
            
            <div className="flex items-center mb-2">
              <input
                id="in-clinic"
                type="radio"
                checked={consultationType === 'clinic'}
                onChange={() => handleConsultationTypeChange('clinic')}
                className="w-4 h-4 text-blue-600"
                data-testid="filter-consultation-clinic"
              />
              <label htmlFor="in-clinic" className="ml-2 text-sm text-gray-700">
                In-clinic Consultation
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                id="all-consult"
                type="radio"
                checked={consultationType === ''}
                onChange={() => handleConsultationTypeChange('')}
                className="w-4 h-4 text-blue-600"
              />
              <label htmlFor="all-consult" className="ml-2 text-sm text-gray-700">
                All
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Filters;