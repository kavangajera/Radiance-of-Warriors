import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import AircraftCard from '../components/AircraftCard';
import Header from '../components/Header';

const Aircraft = () => {
  const { country } = useParams();
  const [aircraftData, setAircraftData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter states
  const [filters, setFilters] = useState({
    service: 'ALL',
    role: 'ALL',
    country: 'ALL'
  });
  
  // Statistics
  const [stats, setStats] = useState({
    total: 0,
    byService: {},
    byRole: {},
    byCountry: {}
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Assuming you have country-specific JSON files
        const response = await fetch(`/data/aircraft_data_${country.toLowerCase()}.json`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch data for ${country}`);
        }
        
        const data = await response.json();
        setAircraftData(data);
        calculateStats(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching aircraft data:', err);
        setError(err.message);
        setLoading(false);
      }
    };
    
    fetchData();
  }, [country]);
  
  // Calculate statistics from data
  const calculateStats = (data) => {
    const statsByService = {};
    const statsByRole = {};
    const statsByCountry = {};
    
    data.forEach(aircraft => {
      // Count by service
      statsByService[aircraft.service] = (statsByService[aircraft.service] || 0) + aircraft.units;
      
      // Count by role
      statsByRole[aircraft.role] = (statsByRole[aircraft.role] || 0) + aircraft.units;
      
      // Count by country of origin
      statsByCountry[aircraft.country] = (statsByCountry[aircraft.country] || 0) + aircraft.units;
    });
    
    // Calculate total units
    const totalUnits = Object.values(statsByService).reduce((sum, current) => sum + current, 0);
    
    setStats({
      total: totalUnits,
      byService: statsByService,
      byRole: statsByRole,
      byCountry: statsByCountry
    });
  };
  
  // Get unique values for filter dropdowns
  const getUniqueValues = (key) => {
    return [...new Set(aircraftData.map(item => item[key]))];
  };
  
  // Apply filters and search
  const filteredAircraft = aircraftData.filter(aircraft => {
    const matchesSearch = aircraft.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         aircraft.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         aircraft.description.toLowerCase().includes(searchTerm.toLowerCase());
                         
    const matchesService = filters.service === 'ALL' || aircraft.service === filters.service;
    const matchesRole = filters.role === 'ALL' || aircraft.role === filters.role;
    const matchesCountry = filters.country === 'ALL' || aircraft.country === filters.country;
    
    return matchesSearch && matchesService && matchesRole && matchesCountry;
  });
  
  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };
  
  if (loading) return (
    <div className="flex justify-center items-center h-screen bg-gray-900">
      <div className="text-green-500 font-mono text-lg">
        LOADING DATA...
      </div>
    </div>
  );
  
  if (error) return (
    <div className="bg-gray-900 text-red-500 text-center p-8 font-mono border border-red-800 mx-auto my-16 max-w-lg">
      <div className="border-b border-red-800 pb-2 mb-2 uppercase tracking-wider">ERROR</div>
      <div>{error}</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200">
      <Header title={`${country.charAt(0).toUpperCase() + country.slice(1)} Military Aircraft`} />
      
      <div className="container mx-auto px-4 py-6">
        {/* Back button */}
        <Link to="/" className="inline-flex items-center mb-6 bg-gray-800 hover:bg-gray-700 text-gray-200 px-4 py-2 border border-gray-700 rounded-sm transition-colors duration-200">
          <span className="font-mono tracking-wide mr-1">←</span>
          RETURN TO GLOBE
        </Link>
        
        {/* Stats overview */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 shadow-lg p-4 mb-6">
          <h2 className="text-xl font-bold mb-3 text-gray-100 border-b border-gray-700 pb-2 font-mono tracking-wide">MILITARY AIRCRAFT OVERVIEW</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gray-900 p-3 rounded-sm border-l-4 border-green-600">
              <h3 className="font-medium text-gray-400 text-sm uppercase tracking-wider">Total Units</h3>
              <p className="text-2xl font-bold text-green-500 font-mono">{stats.total}</p>
            </div>
            
            <div className="bg-gray-900 p-3 rounded-sm border-l-4 border-blue-600">
              <h3 className="font-medium text-gray-400 text-sm uppercase tracking-wider">Top Service</h3>
              {Object.entries(stats.byService).length > 0 && (
                <p className="text-lg font-bold text-blue-400 font-mono">
                  {Object.entries(stats.byService).sort((a, b) => b[1] - a[1])[0][0]}
                  <span className="text-sm text-gray-500 ml-1">({Object.entries(stats.byService).sort((a, b) => b[1] - a[1])[0][1]} units)</span>
                </p>
              )}
            </div>
            
            <div className="bg-gray-900 p-3 rounded-sm border-l-4 border-yellow-600">
              <h3 className="font-medium text-gray-400 text-sm uppercase tracking-wider">Top Role</h3>
              {Object.entries(stats.byRole).length > 0 && (
                <p className="text-lg font-bold text-yellow-400 font-mono">
                  {Object.entries(stats.byRole).sort((a, b) => b[1] - a[1])[0][0]}
                  <span className="text-sm text-gray-500 ml-1">({Object.entries(stats.byRole).sort((a, b) => b[1] - a[1])[0][1]} units)</span>
                </p>
              )}
            </div>
            
            <div className="bg-gray-900 p-3 rounded-sm border-l-4 border-red-600">
              <h3 className="font-medium text-gray-400 text-sm uppercase tracking-wider">Foreign vs. Domestic</h3>
              {Object.entries(stats.byCountry).length > 0 && (
                <p className="text-lg font-bold text-red-400 font-mono">
                  {stats.byCountry[country.charAt(0).toUpperCase() + country.slice(1)] ? 
                    `${Math.round((stats.byCountry[country.charAt(0).toUpperCase() + country.slice(1)] / stats.total) * 100)}% Domestic` : 
                    '0% Domestic'}
                </p>
              )}
            </div>
          </div>
        </div>
        
        {/* Search and filters */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 shadow-lg p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-300 mb-1 uppercase tracking-wider font-mono">Search</label>
              <input
                type="text"
                id="search"
                placeholder="Search aircraft..."
                className="w-full p-2 border border-gray-600 rounded-sm bg-gray-900 text-gray-200 focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div>
              <label htmlFor="service-filter" className="block text-sm font-medium text-gray-300 mb-1 uppercase tracking-wider font-mono">Service</label>
              <select
                id="service-filter"
                className="w-full p-2 border border-gray-600 rounded-sm bg-gray-900 text-gray-200 focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600"
                value={filters.service}
                onChange={(e) => handleFilterChange('service', e.target.value)}
              >
                <option value="ALL">All Services</option>
                {getUniqueValues('service').map(service => (
                  <option key={service} value={service}>{service}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="role-filter" className="block text-sm font-medium text-gray-300 mb-1 uppercase tracking-wider font-mono">Role</label>
              <select
                id="role-filter"
                className="w-full p-2 border border-gray-600 rounded-sm bg-gray-900 text-gray-200 focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600"
                value={filters.role}
                onChange={(e) => handleFilterChange('role', e.target.value)}
              >
                <option value="ALL">All Roles</option>
                {getUniqueValues('role').map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="country-filter" className="block text-sm font-medium text-gray-300 mb-1 uppercase tracking-wider font-mono">Country of Origin</label>
              <select
                id="country-filter"
                className="w-full p-2 border border-gray-600 rounded-sm bg-gray-900 text-gray-200 focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600"
                value={filters.country}
                onChange={(e) => handleFilterChange('country', e.target.value)}
              >
                <option value="ALL">All Countries</option>
                {getUniqueValues('country').map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        {/* Results count */}
        <div className="mb-6 bg-gray-800 p-3 border-l-4 border-gray-600 font-mono">
          <p className="text-gray-300">
            DISPLAYING {filteredAircraft.length} OF {aircraftData.length} AIRCRAFT
            {filteredAircraft.length > 0 && ` (${filteredAircraft.reduce((sum, aircraft) => sum + aircraft.units, 0)} UNITS)`}
          </p>
        </div>
        
        {/* Aircraft cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAircraft.map((aircraft, index) => (
            <AircraftCard key={index} aircraft={aircraft} />
          ))}
        </div>
        
        {filteredAircraft.length === 0 && (
          <div className="text-center py-10 bg-gray-800 border border-gray-700 rounded-lg">
            <p className="text-gray-400 text-lg mb-4 font-mono">NO AIRCRAFT FOUND MATCHING YOUR CRITERIA.</p>
            <button 
              className="px-6 py-3 bg-green-800 text-gray-200 rounded-sm hover:bg-green-700 border border-green-600 font-mono tracking-wider uppercase transition-colors duration-200"
              onClick={() => {
                setSearchTerm('');
                setFilters({
                  service: 'ALL',
                  role: 'ALL',
                  country: 'ALL'
                });
              }}
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Aircraft;