import React, { useRef, useState, useEffect } from 'react';
import Globe from 'react-globe.gl';
import * as topojson from 'topojson-client';
import * as THREE from 'three';

const GlobeView = ({ onCountryClick }) => {
  const globeEl = useRef();
  const [countries, setCountries] = useState([]);
  const [hoverD, setHoverD] = useState();
  const [flagTextures, setFlagTextures] = useState({});
  const [coordinates, setCoordinates] = useState({ lat: '0.00', lng: '0.00' });
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    // Load country data
    fetch('https://unpkg.com/world-atlas@2/countries-110m.json')
      .then(res => res.json())
      .then(worldData => {
        const countries = topojson.feature(worldData, worldData.objects.countries).features;
        setCountries(countries);
      });
    
    // Pre-load flag textures for specific countries
    const countryFlags = {
      'India': 'in',
      'Russia': 'ru',
      'Pakistan': 'pk',
      'China': 'cn',
      'Japan': 'jp',
      'France': 'fr',
      'UK': 'gb',
      'USA': 'us'
    };
    
    const textures = {};
    Object.entries(countryFlags).forEach(([country, code]) => {
      textures[country] = new THREE.TextureLoader().load(`https://flagcdn.com/w320/${code}.png`);
    });
    
    setFlagTextures(textures);

    // Set initial globe position
    if (globeEl.current) {
      globeEl.current.controls().autoRotate = true;
      globeEl.current.controls().autoRotateSpeed = 0.5;
      
      // Track coordinates on globe movement - with safety checks
      globeEl.current.controls().addEventListener('change', () => {
        if (globeEl.current) {
          try {
            const coords = globeEl.current.getCoords();
            if (coords && typeof coords.lat === 'number' && typeof coords.lng === 'number') {
              setCoordinates({ 
                lat: coords.lat.toFixed(2), 
                lng: coords.lng.toFixed(2) 
              });
            }
          } catch (error) {
            console.log('Error getting coordinates:', error);
          }
        }
      });
    }

    // Radar rotation effect
    const rotationInterval = setInterval(() => {
      setRotation(prev => (prev + 1) % 360);
    }, 50);

    return () => clearInterval(rotationInterval);
  }, []);

 // Fix for the getPolygonMaterial function
const getPolygonMaterial = d => {
  if (d === hoverD) {
    const countryName = d.properties.name;
    if (flagTextures[countryName]) {
      // Use flag texture with appropriate material type that supports textures
      // Use MeshPhongMaterial instead of MeshBasicMaterial to support emissive properties
      const material = new THREE.MeshPhongMaterial({ 
        map: flagTextures[countryName],
        emissive: new THREE.Color('#8FBC8F'),
        emissiveIntensity: 0.5,
        shininess: 30
      });
      return material;
    } else {
      // Use military green color as fallback with glow effect
      const material = new THREE.MeshStandardMaterial({ 
        color: '#4B5320',
        emissive: '#8FBC8F',
        emissiveIntensity: 0.7,
        metalness: 0.3,
        roughness: 0.4
      });
      return material;
    }
  }
  // Default non-hover material - military theme
  return new THREE.MeshLambertMaterial({ 
    color: 'rgba(75, 83, 32, 0.3)', 
    transparent: true,
    opacity: 0.7
  });
};

  // Function to determine polygon side color based on hover state
  const getPolygonSideColor = d => {
    if (d === hoverD) {
      // Bright highlight color for hovered country sides
      return '#8FBC8F';
    }
    return '#2F4F4F'; // Default side color
  };

  // Function to determine polygon stroke color based on hover state
  const getPolygonStrokeColor = d => {
    if (d === hoverD) {
      // Bright highlight color for hovered country outline
      return '#FFFFFF';
    }
    return '#8FBC8F'; // Default stroke color
  };

  // Function to determine polygon altitude based on hover state
  const getPolygonAltitude = d => {
    if (d === hoverD) {
      // Significantly increased altitude for hovered country
      return 0.15; // Much higher elevation for better visibility
    }
    return 0.01; // Default altitude
  };

  // Safe method to update coordinates after globe is initialized
  const updateCoordinates = () => {
    if (globeEl.current) {
      try {
        const coords = globeEl.current.getCoords();
        if (coords && typeof coords.lat === 'number' && typeof coords.lng === 'number') {
          setCoordinates({
            lat: coords.lat.toFixed(2),
            lng: coords.lng.toFixed(2)
          });
        }
      } catch (error) {
        console.log('Error updating coordinates:', error);
      }
    }
  };

  // Add a callback when the globe is ready
  const handleGlobeReady = () => {
    if (globeEl.current) {
      // Wait a bit for the globe to fully initialize
      setTimeout(updateCoordinates, 500);
    }
  };

  // Handle hover events with additional visual feedback
  const handlePolygonHover = (polygon) => {
    setHoverD(polygon);
    
    // Adjust camera position slightly to emphasize the hover effect
    if (polygon && globeEl.current) {
      const { lat, lng } = polygon.properties.centroid || { lat: 0, lng: 0 };
      if (lat && lng) {
        // Slightly adjust the view to focus on the hovered country
        globeEl.current.pointOfView({
          lat,
          lng,
          altitude: 2.5
        }, 300); // Smooth transition in 300ms
      }
    }
  };

  return (
    <div className="globe-container" style={containerStyle}>
      {/* Military-style header */}
      <div className="military-header" style={headerStyle}>
        <div style={titleStyle}>GLOBAL TACTICAL DISPLAY</div>
        <div style={coordsStyle}>
          LAT: {coordinates.lat}° | LNG: {coordinates.lng}°
        </div>
      </div>
      
      {/* Radar overlay */}
      <div className="radar-overlay" style={radarStyle}>
        <div className="radar-sweep" style={{
          ...radarSweepStyle,
          transform: `rotate(${rotation}deg)`
        }}></div>
        <div className="radar-grid" style={radarGridStyle}></div>
      </div>
      
      {/* Globe component */}
      <Globe
        ref={globeEl}
        globeImageUrl="https://unpkg.com/three-globe/example/img/earth-night.jpg"
        bumpImageUrl="https://unpkg.com/three-globe/example/img/earth-topology.png"
        backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
        polygonsData={countries}
        polygonCapMaterial={getPolygonMaterial}
        polygonSideColor={getPolygonSideColor}
        polygonStrokeColor={getPolygonStrokeColor}
        polygonAltitude={getPolygonAltitude}
        polygonLabel={d => `
          <div style="
            background-color: rgba(10, 10, 10, 0.9);
            color: #8FBC8F;
            border: 1px solid #4B5320;
            border-radius: 3px;
            padding: 8px;
            font-family: monospace;
            font-size: 12px;
            width: 160px;
            text-align: center;
          ">
            <div style="font-weight: bold; margin-bottom: 5px; text-decoration: underline;">
              ${d.properties.name}
            </div>
            <div>
              STATUS: MONITORED
            </div>
          </div>
        `}
        onPolygonHover={handlePolygonHover}
        onPolygonClick={d => onCountryClick(d)}
        atmosphereColor="rgba(75, 83, 32, 0.4)"
        atmosphereAltitude={0.15}
        onGlobeReady={handleGlobeReady}
        polygonsTransitionDuration={300} // Smooth transition for polygon changes
      />
      
      {/* Military-style footer with info panel */}
      <div className="military-footer" style={footerStyle}>
        <div style={infoBoxStyle}>
          {hoverD ? (
            <>
              <span style={infoLabelStyle}>TERRITORY:</span> 
              <span style={infoValueStyle}>{hoverD.properties.name}</span>
              <div style={statusStyle}>
                <div style={statusDotStyle}></div>
                ACTIVE SURVEILLANCE
              </div>
            </>
          ) : (
            <span style={infoValueStyle}>HOVER OVER TERRITORY FOR INTEL</span>
          )}
        </div>
        <div style={controlsInfoStyle}>
          <div>DRAG: ROTATE | SCROLL: ZOOM | CLICK: SELECT</div>
        </div>
      </div>
      
      {/* Corner decorations */}
      <div style={{...cornerStyle, top: 0, left: 0}}></div>
      <div style={{...cornerStyle, top: 0, right: 0}}></div>
      <div style={{...cornerStyle, bottom: 0, left: 0}}></div>
      <div style={{...cornerStyle, bottom: 0, right: 0}}></div>
      
      {/* Highlight indicator for active territory */}
      {hoverD && (
        <div style={highlightIndicatorStyle}>
          <span style={highlightPulseStyle}></span>
          TERRITORY HIGHLIGHTED
        </div>
      )}
    </div>
  );
};

// Military theme styles
const containerStyle = {
  position: 'relative',
  width: '100%',
  height: '100vh',
  backgroundColor: '#0A0A0A',
  overflow: 'hidden',
  fontFamily: 'monospace',
  color: '#8FBC8F',
  border: '2px solid #4B5320',
  boxSizing: 'border-box'
};

const headerStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  padding: '10px 20px',
  backgroundColor: 'rgba(10, 10, 10, 0.8)',
  borderBottom: '2px solid #4B5320',
  zIndex: 10,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
};

const titleStyle = {
  fontSize: '1.5rem',
  fontWeight: 'bold',
  letterSpacing: '2px',
  color: '#8FBC8F'
};

const coordsStyle = {
  fontSize: '1rem',
  fontFamily: 'monospace',
  color: '#8FBC8F'
};

const radarStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  width: '400px',
  height: '400px',
  transform: 'translate(-50%, -50%)',
  borderRadius: '50%',
  border: '2px solid rgba(139, 188, 143, 0.3)',
  pointerEvents: 'none',
  zIndex: 5
};

const radarSweepStyle = {
  position: 'absolute',
  top: '0',
  left: '50%',
  width: '1px',
  height: '50%',
  backgroundColor: 'rgba(139, 188, 143, 0.7)',
  transformOrigin: 'bottom center',
  boxShadow: '0 0 10px rgba(139, 188, 143, 0.7)'
};

const radarGridStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  borderRadius: '50%',
  background: 'radial-gradient(circle, transparent 0%, transparent 70%, rgba(139, 188, 143, 0.1) 70%, rgba(139, 188, 143, 0.1) 71%, transparent 71%, transparent 80%, rgba(139, 188, 143, 0.1) 80%, rgba(139, 188, 143, 0.1) 81%, transparent 81%), linear-gradient(to right, transparent 49.5%, rgba(139, 188, 143, 0.1) 49.5%, rgba(139, 188, 143, 0.1) 50.5%, transparent 50.5%), linear-gradient(to bottom, transparent 49.5%, rgba(139, 188, 143, 0.1) 49.5%, rgba(139, 188, 143, 0.1) 50.5%, transparent 50.5%)'
};

const footerStyle = {
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  padding: '10px 20px',
  backgroundColor: 'rgba(10, 10, 10, 0.8)',
  borderTop: '2px solid #4B5320',
  zIndex: 10,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
};

const infoBoxStyle = {
  padding: '5px 10px',
  border: '1px solid #4B5320',
  backgroundColor: 'rgba(10, 10, 10, 0.8)',
  fontFamily: 'monospace',
  minWidth: '250px'
};

const infoLabelStyle = {
  color: '#4B5320',
  fontWeight: 'bold',
  marginRight: '5px'
};

const infoValueStyle = {
  color: '#8FBC8F'
};

const statusStyle = {
  display: 'flex',
  alignItems: 'center',
  marginTop: '5px',
  fontSize: '0.8rem',
  color: '#8FBC8F'
};

const statusDotStyle = {
  width: '8px',
  height: '8px',
  borderRadius: '50%',
  backgroundColor: '#8FBC8F',
  marginRight: '5px',
  animation: 'pulse 1.5s infinite',
  boxShadow: '0 0 5px #8FBC8F'
};

const controlsInfoStyle = {
  fontSize: '0.8rem',
  color: '#4B5320'
};

const cornerStyle = {
  position: 'absolute',
  width: '20px',
  height: '20px',
  border: '2px solid #4B5320',
  zIndex: 10
};

const highlightIndicatorStyle = {
  position: 'absolute',
  top: '70px',
  right: '20px',
  padding: '5px 10px',
  backgroundColor: 'rgba(10, 10, 10, 0.8)',
  border: '1px solid #8FBC8F',
  color: '#8FBC8F',
  fontFamily: 'monospace',
  fontSize: '0.8rem',
  display: 'flex',
  alignItems: 'center',
  zIndex: 10,
  animation: 'fadeIn 0.3s'
};

const highlightPulseStyle = {
  display: 'inline-block',
  width: '10px',
  height: '10px',
  borderRadius: '50%',
  backgroundColor: '#8FBC8F',
  marginRight: '8px',
  boxShadow: '0 0 10px #8FBC8F',
  animation: 'pulse 1s infinite'
};

// Add CSS animations
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = `
  @keyframes pulse {
    0% { opacity: 1; }
    50% { opacity: 0.3; }
    100% { opacity: 1; }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;
document.head.appendChild(styleSheet);

export default GlobeView;