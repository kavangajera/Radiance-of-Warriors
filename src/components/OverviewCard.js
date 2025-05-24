import React from 'react';

const OverviewCard = ({ card, onClick, index }) => {
  return (
    <div 
      className="overview-card"
      onClick={() => onClick(card)}
      style={{
        ...cardStyle,
        animationDelay: `${index * 0.1}s`
      }}
    >
      <div className="card-image-container" style={imageContainerStyle}>
        <img 
          src={card.image_url} 
          alt={card.title}
          style={imageStyle}
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300x200/4B5320/8FBC8F?text=Military+Asset';
          }}
        />
        <div className="card-overlay" style={overlayStyle}>
          <div style={overlayTextStyle}>CLASSIFIED</div>
        </div>
      </div>
      
      <div className="card-content" style={contentStyle}>
        <h3 style={titleStyle}>{card.title}</h3>
        <p style={descriptionStyle}>{card.description}</p>
        
        <div className="card-footer" style={footerStyle}>
          <div style={statusIndicatorStyle}>
            <div style={statusDotStyle}></div>
            <span>OPERATIONAL</span>
          </div>
          <div style={accessLevelStyle}>
            LEVEL: RESTRICTED
          </div>
        </div>
      </div>
      
      {/* Military corner decorations */}
      <div style={{...cornerDecorStyle, top: '5px', left: '5px'}}></div>
      <div style={{...cornerDecorStyle, top: '5px', right: '5px'}}></div>
      <div style={{...cornerDecorStyle, bottom: '5px', left: '5px'}}></div>
      <div style={{...cornerDecorStyle, bottom: '5px', right: '5px'}}></div>
    </div>
  );
};

// Military-themed card styles
const cardStyle = {
  width: '350px',
  height: '280px',
  backgroundColor: 'rgba(10, 10, 10, 0.9)',
  border: '2px solid #4B5320',
  borderRadius: '8px',
  overflow: 'hidden',
  cursor: 'pointer',
  position: 'relative',
  transition: 'all 0.3s ease',
  fontFamily: 'monospace',
  color: '#8FBC8F',
  boxShadow: '0 0 20px rgba(75, 83, 32, 0.3)',
  transform: 'translateY(20px) scale(0.95)',
  opacity: 0,
  animation: 'cardSlideIn 0.6s ease forwards',
  ':hover': {
    transform: 'translateY(-5px) scale(1.02)',
    boxShadow: '0 10px 30px rgba(139, 188, 143, 0.4)',
    borderColor: '#8FBC8F'
  }
};

const imageContainerStyle = {
  width: '100%',
  height: '140px',
  position: 'relative',
  overflow: 'hidden',
  borderBottom: '1px solid #4B5320'
};

const imageStyle = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  transition: 'transform 0.3s ease'
};

const overlayStyle = {
  position: 'absolute',
  top: '10px',
  right: '10px',
  backgroundColor: 'rgba(139, 188, 143, 0.9)',
  color: '#0A0A0A',
  padding: '2px 8px',
  fontSize: '0.7rem',
  fontWeight: 'bold',
  borderRadius: '3px',
  letterSpacing: '1px'
};

const overlayTextStyle = {
  fontSize: '0.7rem',
  fontWeight: 'bold'
};

const contentStyle = {
  padding: '15px',
  height: 'calc(100% - 140px)',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between'
};

const titleStyle = {
  fontSize: '1rem',
  fontWeight: 'bold',
  color: '#8FBC8F',
  margin: '0 0 8px 0',
  lineHeight: '1.2',
  textTransform: 'uppercase',
  letterSpacing: '0.5px'
};

const descriptionStyle = {
  fontSize: '0.8rem',
  color: '#B0C4B0',
  margin: '0',
  lineHeight: '1.4',
  flex: 1,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  display: '-webkit-box',
  WebkitLineClamp: 3,
  WebkitBoxOrient: 'vertical'
};

const footerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginTop: '10px',
  padding: '8px 0',
  borderTop: '1px solid #4B5320'
};

const statusIndicatorStyle = {
  display: 'flex',
  alignItems: 'center',
  fontSize: '0.7rem',
  color: '#8FBC8F'
};

const statusDotStyle = {
  width: '6px',
  height: '6px',
  borderRadius: '50%',
  backgroundColor: '#8FBC8F',
  marginRight: '5px',
  boxShadow: '0 0 5px #8FBC8F',
  animation: 'pulse 2s infinite'
};

const accessLevelStyle = {
  fontSize: '0.6rem',
  color: '#4B5320',
  fontWeight: 'bold',
  letterSpacing: '0.5px'
};

const cornerDecorStyle = {
  position: 'absolute',
  width: '12px',
  height: '12px',
  border: '1px solid #4B5320',
  zIndex: 2
};

// Add CSS animations if not already present
if (!document.querySelector('#overview-card-styles')) {
  const styleSheet = document.createElement("style");
  styleSheet.id = 'overview-card-styles';
  styleSheet.type = "text/css";
  styleSheet.innerText = `
    @keyframes cardSlideIn {
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }
    
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.3; }
    }
    
    .overview-card:hover {
      transform: translateY(-5px) scale(1.02) !important;
      box-shadow: 0 10px 30px rgba(139, 188, 143, 0.4) !important;
      border-color: #8FBC8F !important;
    }
    
    .overview-card:hover img {
      transform: scale(1.1);
    }
  `;
  document.head.appendChild(styleSheet);
}

export default OverviewCard;