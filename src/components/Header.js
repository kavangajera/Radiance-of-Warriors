import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Header = ({ title }) => {
  // Animation for the status indicator
  const [blinking, setBlinking] = useState(false);
  
  // Time display
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  // Toggle blinking effect
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setBlinking(prev => !prev);
    }, 1500);
    
    return () => clearInterval(blinkInterval);
  }, []);

  return (
    <header style={headerContainerStyle}>
      {/* Military-style frame borders */}
      <div style={cornerStyle(true, true)}></div>
      <div style={cornerStyle(true, false)}></div>
      
      <div style={headerInnerStyle}>
        {/* Left side - Logo and title */}
        <div style={titleContainerStyle}>
          <div style={statusIndicatorStyle(blinking)}></div>
          <h1 style={titleStyle}>{title || "MILITARY INTELLIGENCE SYSTEM"}</h1>
        </div>
        
        {/* Right side - Navigation and time */}
        <div style={rightSectionStyle}>
          <div style={timeDisplayStyle}>
            {currentTime.toLocaleTimeString('en-US', { hour12: false })}
            <span style={dateDisplayStyle}>
              {currentTime.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })}
            </span>
          </div>
          
          <nav style={navContainerStyle}>
            <NavLink to="/">HOME</NavLink>
            <NavLink to="/aircraft/all">AIRCRAFT DB</NavLink>
            <NavLink to="/news">INTEL</NavLink>
            <NavLink to="/armory">ARMORY</NavLink>
            <NavLink to="/about">ABOUT</NavLink>
          </nav>
        </div>
      </div>
    </header>
  );
};

// Custom styled NavLink component
const NavLink = ({ to, children }) => {
  return (
    <Link 
      to={to} 
      style={navLinkStyle}
      onMouseEnter={(e) => {
        e.target.style.color = '#8FBC8F';
        e.target.style.backgroundColor = 'rgba(75, 83, 32, 0.3)';
        e.target.style.borderColor = '#8FBC8F';
      }}
      onMouseLeave={(e) => {
        e.target.style.color = '#4B5320';
        e.target.style.backgroundColor = 'transparent';
        e.target.style.borderColor = '#4B5320';
      }}
    >
      {children}
    </Link>
  );
};

// Styles
const headerContainerStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  backgroundColor: 'rgba(10, 10, 10, 0.9)',
  backdropFilter: 'blur(8px)',
  borderBottom: '2px solid #4B5320',
  zIndex: 50,
  padding: '2px', // Padding for corner elements
  height: '60px',
  fontFamily: 'monospace'
};

const headerInnerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  height: '100%',
  padding: '0 15px'
};

const titleContainerStyle = {
  display: 'flex',
  alignItems: 'center'
};

const statusIndicatorStyle = (blinking) => ({
  width: '8px',
  height: '8px',
  borderRadius: '50%',
  backgroundColor: blinking ? '#8FBC8F' : 'rgba(139, 188, 143, 0.5)',
  boxShadow: blinking ? '0 0 5px #8FBC8F' : 'none',
  marginRight: '12px',
  transition: 'all 0.3s ease'
});

const titleStyle = {
  fontSize: '1.25rem',
  fontWeight: 'bold',
  color: '#8FBC8F',
  letterSpacing: '1px',
  margin: 0
};

const rightSectionStyle = {
  display: 'flex',
  alignItems: 'center'
};

const timeDisplayStyle = {
  color: '#8FBC8F',
  fontSize: '0.8rem',
  marginRight: '20px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
  fontFamily: 'monospace'
};

const dateDisplayStyle = {
  color: '#4B5320',
  fontSize: '0.7rem',
  marginTop: '2px'
};

const navContainerStyle = {
  display: 'flex',
  gap: '12px'
};

const navLinkStyle = {
  color: '#4B5320',
  textDecoration: 'none',
  fontSize: '0.75rem',
  fontWeight: 'bold',
  padding: '4px 8px',
  border: '1px solid #4B5320',
  transition: 'all 0.2s ease',
  backgroundColor: 'transparent',
  letterSpacing: '1px'
};

const cornerStyle = (isTop, isLeft) => ({
  position: 'absolute',
  width: '12px',
  height: '12px',
  borderStyle: 'solid',
  borderColor: '#4B5320',
  borderWidth: isTop ? '2px 0 0 2px' : '0 2px 2px 0',
  top: isTop ? '0' : 'auto',
  bottom: isTop ? 'auto' : '0',
  left: isLeft ? '0' : 'auto',
  right: isLeft ? 'auto' : '0'
});

export default Header;