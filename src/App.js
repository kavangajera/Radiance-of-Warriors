import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import GlobeView from './components/GlobeView';
import StatsModal from './components/StatsModal';
import Header from './components/Header';
import News from './pages/News';
import Aircraft from './pages/Aircraft';
import './styles/styles.css';

// Globe container component with navigation capability
const GlobeContainer = () => {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const navigate = useNavigate();

  const handleCountryClick = (country) => {
    if (country) {
      const countryName = country.properties.name;
      
      // Special case for India - navigate directly to aircraft page
      if (countryName === 'India') {
        navigate('/aircraft/india');
      }
      else if (countryName === 'Russia') {
        navigate('/aircraft/russia');
      }
       else {
        // For other countries, show stats modal
        setSelectedCountry(country);
      }
    }
  };

  return (
    <div className="globe-container">
      <Header title="क्षात्रतेज - Radiance of Warriors" />
      <GlobeView onCountryClick={handleCountryClick} />
      {selectedCountry && (
        <StatsModal 
          country={selectedCountry} 
          onClose={() => setSelectedCountry(null)}
          onViewAircraft={() => {
            const countryName = selectedCountry.properties.name.toLowerCase();
            navigate(`/aircraft/${countryName}`);
          }}
        />
      )}
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<GlobeContainer />} />
        <Route path="/aircraft/:country" element={<Aircraft />} />
        <Route path="/news" element={<News />} />
      </Routes>
    </Router>
  );
};

export default App;