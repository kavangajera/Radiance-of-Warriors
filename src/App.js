// import React, { useState } from 'react';
// import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
// import GlobeView from './components/GlobeView';
// import StatsModal from './components/StatsModal';
// import Header from './components/Header';
// import News from './pages/News';
// import Armory from './pages/Armory';
// import Aircraft from './pages/Aircraft';
// import './styles/styles.css';

// // Globe container component with navigation capability
// const GlobeContainer = () => {
//   const [selectedCountry, setSelectedCountry] = useState(null);
//   const navigate = useNavigate();

//   const handleCountryClick = (country) => {
//     if (country) {
//       const countryName = country.properties.name;
      
//       // Special case for India - navigate directly to aircraft page
//       if (countryName === 'India') {
//         navigate('/aircraft/india');
//       }
//       else if (countryName === 'Russia') {
//         navigate('/aircraft/russia');
//       }
//        else {
//         // For other countries, show stats modal
//         setSelectedCountry(country);
//       }
//     }
//   };

//   return (
//     <div className="globe-container">
//       <Header title="क्षात्रतेज - Radiance of Warriors" />
//       <GlobeView onCountryClick={handleCountryClick} />
//       {selectedCountry && (
//         <StatsModal 
//           country={selectedCountry} 
//           onClose={() => setSelectedCountry(null)}
//           onViewAircraft={() => {
//             const countryName = selectedCountry.properties.name.toLowerCase();
//             navigate(`/aircraft/${countryName}`);
//           }}
//         />
//       )}
//     </div>
//   );
// };

// const App = () => {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<GlobeContainer />} />
//         <Route path="/aircraft/:country" element={<Aircraft />} />
//         <Route path="/news" element={<News />} />
//         <Route path="/armory" element={<Armory/>} />
//       </Routes>
//     </Router>
//   );
// };

// export default App;

import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import GlobeView from './components/GlobeView';
import OverviewModal from './components/OverviewModal';
import Header from './components/Header';
import News from './pages/News';
import Armory from './pages/Armory';
import Aircraft from './pages/Aircraft';
import './styles/styles.css';

// Globe container component with navigation capability
const GlobeContainer = () => {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const navigate = useNavigate();

  const handleCountryClick = (country) => {
    if (country) {
      const countryName = country.properties.name;
      
      // Show overview modal for all countries
      setSelectedCountry(country);
      
      // Optional: You can still add special handling for specific countries
      // if (countryName === 'India') {
      //   // Special handling for India if needed
      // }
    }
  };

  const handleCloseModal = () => {
    setSelectedCountry(null);
  };

  return (
    <div className="globe-container">
      <Header title="क्षात्रतेज - Radiance of Warriors" />
      <GlobeView onCountryClick={handleCountryClick} />
      {selectedCountry && (
        <OverviewModal 
          country={selectedCountry} 
          onClose={handleCloseModal}
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
        <Route path="/armory/:country" element={<Armory />} />
        <Route path="/naval/:country" element={<News />} /> {/* You can create a Naval component later */}
        <Route path="/news" element={<News />} />
        <Route path="/armory" element={<Armory />} />
      </Routes>
    </Router>
  );
};

export default App;