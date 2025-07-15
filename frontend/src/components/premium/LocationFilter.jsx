import React, { useState, useRef, useEffect } from 'react';
import { MapPin, Search, ChevronDown, X } from 'lucide-react';

const LocationFilter = ({ 
  onLocationChange, 
  placeholder = "Filter by location", 
  className = "" 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const dropdownRef = useRef(null);

  // Sample locations - in a real app, these would come from an API
  const locations = [
    { id: 'all', name: 'All Locations', city: '', country: '' },
    { id: 'ny', name: 'New York', city: 'New York', country: 'USA' },
    { id: 'la', name: 'Los Angeles', city: 'Los Angeles', country: 'USA' },
    { id: 'london', name: 'London', city: 'London', country: 'UK' },
    { id: 'toronto', name: 'Toronto', city: 'Toronto', country: 'Canada' },
    { id: 'sydney', name: 'Sydney', city: 'Sydney', country: 'Australia' },
    { id: 'tokyo', name: 'Tokyo', city: 'Tokyo', country: 'Japan' },
    { id: 'paris', name: 'Paris', city: 'Paris', country: 'France' },
    { id: 'berlin', name: 'Berlin', city: 'Berlin', country: 'Germany' },
    { id: 'singapore', name: 'Singapore', city: 'Singapore', country: 'Singapore' },
    { id: 'dubai', name: 'Dubai', city: 'Dubai', country: 'UAE' }
  ];

  const filteredLocations = locations.filter(location =>
    location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    location.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    location.country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLocationSelect = (location) => {
    setSelectedLocation(location.name);
    setIsOpen(false);
    setSearchTerm('');
    onLocationChange?.(location);
  };

  const handleClear = () => {
    setSelectedLocation('');
    setSearchTerm('');
    onLocationChange?.(locations[0]); // Reset to "All Locations"
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Main Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-gradient-to-r from-simples-midnight to-simples-storm hover:from-simples-storm hover:to-simples-midnight text-white rounded-xl px-4 py-3 flex items-center justify-between transition-all duration-300 shadow-lg hover:shadow-xl border border-simples-silver hover:border-simples-storm"
      >
        <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-simples-ocean" />
          <span className="font-medium">
            {selectedLocation || placeholder}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          {selectedLocation && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleClear();
              }}
              className="p-1 rounded-full hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4 text-simples-silver" />
            </button>
          )}
          <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-gradient-to-br from-simples-midnight to-simples-storm rounded-xl shadow-2xl border border-simples-silver overflow-hidden z-50">
          {/* Search Bar */}
          <div className="p-4 border-b border-simples-silver">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-simples-silver" />
              <input
                type="text"
                placeholder="Search locations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                                  className="w-full bg-simples-storm text-white placeholder-simples-silver rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-simples-ocean focus:bg-simples-midnight transition-all duration-300"
              />
            </div>
          </div>

          {/* Location List */}
          <div className="max-h-60 overflow-y-auto">
            {filteredLocations.length > 0 ? (
              filteredLocations.map((location) => (
                <button
                  key={location.id}
                  onClick={() => handleLocationSelect(location)}
                  className="w-full px-4 py-3 text-left hover:bg-simples-storm transition-colors duration-200 flex items-center gap-3 border-b border-simples-silver/50 last:border-b-0"
                >
                  <MapPin className="w-4 h-4 text-simples-ocean flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-white truncate">
                      {location.name}
                    </div>
                    {location.city && location.country && (
                      <div className="text-sm text-simples-silver truncate">
                        {location.city}, {location.country}
                      </div>
                    )}
                  </div>
                  {selectedLocation === location.name && (
                    <div className="w-2 h-2 bg-simples-ocean rounded-full" />
                  )}
                </button>
              ))
            ) : (
              <div className="px-4 py-6 text-center text-simples-silver">
                <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No locations found</p>
                <p className="text-sm">Try a different search term</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-simples-silver bg-simples-midnight/50">
            <p className="text-xs text-simples-silver text-center">
              Can't find your location? <span className="text-simples-ocean cursor-pointer hover:underline">Request to add it</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationFilter; 