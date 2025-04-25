import React, { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';

const AutoCompleteSearch = ({ doctors, onSearch, initialSearch = '' }) => {
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsRef = useRef(null);
  
  useEffect(() => {
    if (initialSearch) {
      setSearchTerm(initialSearch);
    }
  }, [initialSearch]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (value.trim().length > 0) {
      const filteredDoctors = doctors
        .filter(doctor => 
          doctor.name.toLowerCase().includes(value.toLowerCase())
        )
        .slice(0, 3);
      
      setSuggestions(filteredDoctors);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
      onSearch('');
    }
  };

  const handleSuggestionClick = (doctorName) => {
    setSearchTerm(doctorName);
    setShowSuggestions(false);
    onSearch(doctorName);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
    setShowSuggestions(false);
  };

  return (
    <div className="relative" data-testid="autocomplete-input">
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-5 w-5 text-gray-500" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={handleInputChange}
            className="block w-full p-3 pl-10 pr-3 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500"
            placeholder="Search Symptoms, Doctors, Specialties, Clinics"
            data-testid="search-input"
          />
          <button
            type="submit"
            className="absolute right-2.5 bottom-2 top-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-sm px-4 py-1"
          >
            Search
          </button>
        </div>
      </form>
      
      {showSuggestions && suggestions.length > 0 && (
        <div 
          ref={suggestionsRef}
          className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg search-dropdown"
        >
          <ul className="py-2" data-testid="suggestion-list">
            {suggestions.map((doctor, index) => (
              <li 
                key={index} 
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleSuggestionClick(doctor.name)}
              >
                {doctor.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AutoCompleteSearch;