import React, { useState, useEffect, useMemo } from "react";
import { ChevronDown, ChevronUp, Search, Trash2 } from "lucide-react";

const Filters = ({
  allSpecialties,
  onConsultationTypeChange,
  onSpecialtiesChange,
  onSortChange,
  onClearAll,
  initialConsultationType = "",
  initialSpecialties = [],
  initialSortBy = "",
}) => {
  const [expandedSections, setExpandedSections] = useState({
    specialties: true,
    consultation: true,
    sort: true,
  });

  const [consultationType, setConsultationType] = useState(
    initialConsultationType
  );
  const [selectedSpecialties, setSelectedSpecialties] =
    useState(initialSpecialties);
  const [sortBy, setSortBy] = useState(initialSortBy);
  const [searchSpecialty, setSearchSpecialty] = useState("");

  useEffect(() => {
    setConsultationType(initialConsultationType);
    setSelectedSpecialties(initialSpecialties);
    setSortBy(initialSortBy);
  }, [initialConsultationType, initialSpecialties, initialSortBy]);

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleConsultationTypeChange = (type) => {
    const newType = consultationType === type ? "" : type;
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
    const newSort = sortBy === sort ? "" : sort;
    setSortBy(newSort);
    onSortChange(newSort);
  };

  const clearFilters = () => {
    setConsultationType("");
    setSelectedSpecialties([]);
    setSortBy("");
    setSearchSpecialty("");
    onClearAll();
  };

  // Memoize filtered specialties to prevent unnecessary recalculations
  const filteredSpecialties = useMemo(() => {
    if (!Array.isArray(allSpecialties)) return [];

    return allSpecialties.filter(
      (specialty) =>
        typeof specialty === "string" &&
        specialty.toLowerCase().includes(searchSpecialty.toLowerCase())
    );
  }, [allSpecialties, searchSpecialty]);

  return (
    <div className="bg-white rounded shadow p-4" data-testid="filters">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-medium text-gray-800">Filters</h2>
        <button 
          onClick={clearFilters}
          className="flex items-center text-sm text-blue-600 hover:text-blue-800"
          data-testid="clear-all-filters"
        >
          <Trash2 size={16} className="mr-1" />
          Clear All
        </button>
      </div>

      {/* Specialties */}
      <div className="mb-6">
        <div
          className="flex justify-between items-center cursor-pointer mb-3"
          onClick={() => toggleSection("specialties")}
        >
          <h3 className="font-medium text-gray-800">Specialties</h3>
          {expandedSections.specialties ? (
            <ChevronUp size={18} />
          ) : (
            <ChevronDown size={18} />
          )}
        </div>

        {expandedSections.specialties && (
          <div className="mt-2">
            <div className="relative mb-3">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="h-4 w-4 text-gray-500" />
              </div>
              <input
                type="text"
                value={searchSpecialty}
                onChange={(e) => setSearchSpecialty(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 text-sm text-gray-500 border border-gray-300 rounded-md"
                placeholder="Search specialties"
                data-testid="specialty-search"
              />
            </div>

            {/* Selected specialties always visible when searching */}
            {selectedSpecialties.length > 0 && searchSpecialty && (
              <div className="mb-2 pb-2 border-b border-gray-200">
                <p className="text-xs text-gray-500 mb-1">Selected:</p>
                {selectedSpecialties.map((specialty, index) => (
                  <div
                    key={`selected-${index}`}
                    className="flex items-center mb-2 bg-blue-50 p-1 rounded"
                  >
                    <input
                      id={`selected-specialty-${index}`}
                      type="checkbox"
                      checked={true}
                      onChange={() => handleSpecialtyChange(specialty)}
                      className="w-4 h-4 text-blue-600"
                    />
                    <label
                      htmlFor={`selected-specialty-${index}`}
                      className="ml-2 text-sm text-gray-700 cursor-pointer"
                    >
                      {specialty}
                    </label>
                  </div>
                ))}
              </div>
            )}

            <div className="max-h-48 overflow-y-auto">
              {filteredSpecialties.length > 0 ? (
                filteredSpecialties.map((specialty, index) => (
                  <div key={index} className="flex items-center mb-2">
                    <input
                      id={`specialty-${index}`}
                      type="checkbox"
                      checked={selectedSpecialties.includes(specialty)}
                      onChange={() => handleSpecialtyChange(specialty)}
                      className="w-4 h-4 text-blue-600"
                      data-testid={`filter-specialty-${specialty
                        .toLowerCase()
                        .replace(/\s+/g, "")}`}
                    />
                    <label
                      htmlFor={`specialty-${index}`}
                      className="ml-2 text-sm text-gray-700 cursor-pointer"
                    >
                      {specialty}
                    </label>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 py-2">
                  No specialties found
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      <hr className="my-4" />

      {/* Consultation Mode */}
      <div className="mb-6">
        <div
          className="flex justify-between items-center cursor-pointer mb-3"
          onClick={() => toggleSection("consultation")}
        >
          <h3 className="font-medium text-gray-800">Mode of consultation</h3>
          {expandedSections.consultation ? (
            <ChevronUp size={18} />
          ) : (
            <ChevronDown size={18} />
          )}
        </div>

        {expandedSections.consultation && (
          <div className="mt-2">
            <div className="flex items-center mb-3">
              <input
                id="video-consult"
                type="radio"
                checked={consultationType === "video"}
                onChange={() => handleConsultationTypeChange("video")}
                className="w-4 h-4 text-blue-600"
                data-testid="filter-consultation-video"
              />
              <label
                htmlFor="video-consult"
                className="ml-2 text-sm text-gray-700"
              >
                Video Consultation
              </label>
            </div>

            <div className="flex items-center mb-3">
              <input
                id="in-clinic"
                type="radio"
                checked={consultationType === "clinic"}
                onChange={() => handleConsultationTypeChange("clinic")}
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
                checked={consultationType === ""}
                onChange={() => handleConsultationTypeChange("")}
                className="w-4 h-4 text-blue-600"
                data-testid="filter-consultation-all"
              />
              <label
                htmlFor="all-consult"
                className="ml-2 text-sm text-gray-700"
              >
                All
              </label>
            </div>
          </div>
        )}
      </div>

      <hr className="my-4" />

      {/* Sort Options */}
      <div className="mb-6">
        <div
          className="flex justify-between items-center cursor-pointer mb-3"
          onClick={() => toggleSection("sort")}
        >
          <h3 className="font-medium text-gray-800">Sort By</h3>
          {expandedSections.sort ? (
            <ChevronUp size={18} />
          ) : (
            <ChevronDown size={18} />
          )}
        </div>

        {expandedSections.sort && (
          <div className="mt-2">
            <div className="flex items-center mb-3">
              <input
                id="sort-fees"
                type="radio"
                checked={sortBy === "fees"}
                onChange={() => handleSortChange("fees")}
                className="w-4 h-4 text-blue-600"
                data-testid="filter-sort-fees"
              />
              <label
                htmlFor="sort-fees"
                className="ml-2 text-sm text-gray-700"
              >
                Price: Low-High
              </label>
            </div>

            <div className="flex items-center mb-3">
              <input
                id="sort-experience"
                type="radio"
                checked={sortBy === "experience"}
                onChange={() => handleSortChange("experience")}
                className="w-4 h-4 text-blue-600"
                data-testid="filter-sort-experience"
              />
              <label
                htmlFor="sort-experience"
                className="ml-2 text-sm text-gray-700"
              >
                Experience: Most Experience first
              </label>
            </div>

            <div className="flex items-center">
              <input
                id="sort-none"
                type="radio"
                checked={sortBy === ""}
                onChange={() => handleSortChange("")}
                className="w-4 h-4 text-blue-600"
                data-testid="filter-sort-none"
              />
              <label
                htmlFor="sort-none"
                className="ml-2 text-sm text-gray-700"
              >
                Default
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Filters;