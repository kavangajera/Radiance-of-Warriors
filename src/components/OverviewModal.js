import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import OverviewCard from './OverviewCard';

const OverviewModal = ({ country, onClose }) => {
  const [overviewData, setOverviewData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (country) {
      loadOverviewData(country.properties.name);
    }
  }, [country]);

  const loadOverviewData = async (countryName) => {
    setLoading(true);
    try {
      // Map country names to data files
      const countryDataMap = {
        'India': 'india_overview.json',
        'Russia': 'russia_overview.json', // You can add this later
        'China': 'china_overview.json',   // You can add this later
        // Add more countries as needed
      };

      const dataFile = countryDataMap[countryName];
      if (dataFile) {
        const response = await fetch(`/data/${dataFile}`);
        if (response.ok) {
          const data = await response.json();
          setOverviewData(data);
        } else {
          // Fallback data if file doesn't exist
          setOverviewData(getDefaultOverviewData(countryName));
        }
      } else {
        // Default data for countries without specific data files
        setOverviewData(getDefaultOverviewData(countryName));
      }
    } catch (error) {
      console.error('Error loading overview data:', error);
      setOverviewData(getDefaultOverviewData(countryName));
    } finally {
      setLoading(false);
    }
  };

  const getDefaultOverviewData = (countryName) => {
    return [
      {
        title: `${countryName} Air Force`,
        description: `Comprehensive overview of ${countryName}'s aerial military capabilities and aircraft fleet.`,
        image_url: 'https://via.placeholder.com/300x200/4B5320/8FBC8F?text=Air+Force',
        url: '#airforce'
      },
      {
        title: `${countryName} Ground Forces`,
        description: `Analysis of ${countryName}'s land-based military assets including armor and artillery.`,
        image_url: 'https://via.placeholder.com/300x200/4B5320/8FBC8F?text=Ground+Forces',
        url: '#ground'
      },
      {
        title: `${countryName} Naval Power`,
        description: `Maritime military strength and naval fleet composition of ${countryName}.`,
        image_url: 'https://via.placeholder.com/300x200/4B5320/8FBC8F?text=Naval+Power',
        url: '#naval'
      },
      {
        title: `${countryName} Defense Systems`,
        description: `Defensive capabilities and strategic military infrastructure.`,
        image_url: 'https://via.placeholder.com/300x200/4B5320/8FBC8F?text=Defense+Systems',
        url: '#defense'
      },
      {
        title: `${countryName} Military Personnel`,
        description: `Armed forces structure and personnel organization.`,
        image_url: 'https://via.placeholder.com/300x200/4B5320/8FBC8F?text=Personnel',
        url: '#personnel'
      },
      {
        title: `${countryName} Strategic Assets`,
        description: `Special military capabilities and strategic resources.`,
        image_url: 'https://via.placeholder.com/300x200/4B5320/8FBC8F?text=Strategic+Assets',
        url: '#strategic'
      }
    ];
  };

  const handleCardClick = (card) => {
    const countryName = country.properties.name.toLowerCase();
    
    // Determine which page to navigate to based on card title
    if (card.title.toLowerCase().includes('air') || card.title.toLowerCase().includes('tempest')) {
      navigate(`/aircraft/${countryName}`);
    } else if (card.title.toLowerCase().includes('ground') || card.title.toLowerCase().includes('land')) {
      navigate(`/land/${countryName}`);
    } else if (card.title.toLowerCase().includes('naval') || card.title.toLowerCase().includes('navy')) {
      navigate(`/naval/${countryName}`);
    } else if (card.title.toLowerCase().includes('drone') || card.title.toLowerCase().includes('unmanned')) {
      navigate(`/drone/${countryName}`);
    }
    else {
      // For other cards, you can add more specific routing or open external URLs
      
        navigate(`/aircraft/${countryName}`);
      
    }
  };

  if (!country) return null;

  return (
    <div className="overview-modal-overlay" style={overlayStyle} onClick={onClose}>
      <div className="overview-modal" style={modalStyle} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header" style={headerStyle}>
          <div style={titleContainerStyle}>
            <h2 style={modalTitleStyle}>
              {country.properties.name.toUpperCase()} - MILITARY OVERVIEW
            </h2>
            <div style={classificationStyle}>CLASSIFIED - RESTRICTED ACCESS</div>
          </div>
          <button 
            onClick={onClose}
            style={closeButtonStyle}
            onMouseOver={(e) => e.target.style.color = '#FF6B6B'}
            onMouseOut={(e) => e.target.style.color = '#8FBC8F'}
          >
            ✕
          </button>
        </div>

        {/* Loading state */}
        {loading && (
          <div style={loadingStyle}>
            <div style={loadingSpinnerStyle}>◐</div>
            <div>ACCESSING CLASSIFIED DATABASE...</div>
          </div>
        )}

        {/* Cards grid */}
        {!loading && (
          <div className="cards-grid" style={cardsGridStyle}>
            {overviewData.map((card, index) => (
              <OverviewCard
                key={index}
                card={card}
                onClick={handleCardClick}
                index={index}
              />
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="modal-footer" style={footerStyle}>
          <div style={footerTextStyle}>
            SELECT A CATEGORY TO ACCESS DETAILED INTELLIGENCE
          </div>
          <div style={warningStyle}>
            ⚠ UNAUTHORIZED ACCESS PROHIBITED
          </div>
        </div>
      </div>
    </div>
  );
};

// Modal styles
const overlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.9)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
  animation: 'modalFadeIn 0.3s ease'
};

const modalStyle = {
  backgroundColor: 'rgba(10, 10, 10, 0.95)',
  border: '2px solid #4B5320',
  borderRadius: '10px',
  width: '90%',
  maxWidth: '1200px',
  maxHeight: '90vh',
  overflow: 'auto',
  fontFamily: 'monospace',
  color: '#8FBC8F',
  boxShadow: '0 0 50px rgba(75, 83, 32, 0.5)',
  position: 'relative'
};

const headerStyle = {
  padding: '20px',
  borderBottom: '2px solid #4B5320',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  backgroundColor: 'rgba(75, 83, 32, 0.1)'
};

const titleContainerStyle = {
  flex: 1
};

const modalTitleStyle = {
  margin: 0,
  fontSize: '1.5rem',
  fontWeight: 'bold',
  color: '#8FBC8F',
  letterSpacing: '2px'
};

const classificationStyle = {
  fontSize: '0.8rem',
  color: '#FF6B6B',
  fontWeight: 'bold',
  marginTop: '5px',
  letterSpacing: '1px'
};

const closeButtonStyle = {
  background: 'none',
  border: 'none',
  color: '#8FBC8F',
  fontSize: '1.5rem',
  cursor: 'pointer',
  padding: '10px',
  borderRadius: '5px',
  transition: 'color 0.3s ease'
};

const loadingStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '60px',
  color: '#8FBC8F'
};

const loadingSpinnerStyle = {
  fontSize: '2rem',
  marginBottom: '20px',
  animation: 'spin 1s linear infinite'
};

const cardsGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
  gap: '20px',
  padding: '30px',
  maxHeight: '70vh',
  overflowY: 'auto'
};

const footerStyle = {
  padding: '15px 20px',
  borderTop: '2px solid #4B5320',
  backgroundColor: 'rgba(75, 83, 32, 0.1)',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
};

const footerTextStyle = {
  fontSize: '0.9rem',
  color: '#8FBC8F',
  fontWeight: 'bold'
};

const warningStyle = {
  fontSize: '0.8rem',
  color: '#FF6B6B',
  fontWeight: 'bold'
};

// Add CSS animations if not already present
if (!document.querySelector('#overview-modal-styles')) {
  const styleSheet = document.createElement("style");
  styleSheet.id = 'overview-modal-styles';
  styleSheet.type = "text/css";
  styleSheet.innerText = `
    @keyframes modalFadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    
    .overview-modal {
      transform: translateY(-20px);
      animation: modalSlideIn 0.4s ease forwards;
    }
    
    @keyframes modalSlideIn {
      to {
        transform: translateY(0);
      }
    }
    
    /* Custom scrollbar for the modal */
    .overview-modal::-webkit-scrollbar,
    .cards-grid::-webkit-scrollbar {
      width: 8px;
    }
    
    .overview-modal::-webkit-scrollbar-track,
    .cards-grid::-webkit-scrollbar-track {
      background: rgba(75, 83, 32, 0.1);
    }
    
    .overview-modal::-webkit-scrollbar-thumb,
    .cards-grid::-webkit-scrollbar-thumb {
      background: #4B5320;
      border-radius: 4px;
    }
    
    .overview-modal::-webkit-scrollbar-thumb:hover,
    .cards-grid::-webkit-scrollbar-thumb:hover {
      background: #8FBC8F;
    }
  `;
  document.head.appendChild(styleSheet);
}

export default OverviewModal;