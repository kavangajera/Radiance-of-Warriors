import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
const News = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedArticle, setSelectedArticle] = useState(null);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/get-latest-news`,{
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      setNews(data.news || []);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      console.log(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/get-latest-news`)
      console.log(err.message);
      setLoading(false);
    }
  };

  const selectArticle = (article) => {
    setSelectedArticle(article);
  };

  return (
    <div style={containerStyle}>
      {/* Military-style header */}
      <Header title={"GLOBAL MILITARY INTELLIGENCE BRIEFING"} />
      <div style={headerStyle}>
        <div style={titleStyle}>GLOBAL MILITARY INTELLIGENCE BRIEFING</div>
        <div style={coordsStyle}>
          <div style={statusDotStyle}></div>
          LIVE INTELLIGENCE FEED
        </div>
      </div>
      
      {/* Content area with news list and article detail */}
      <div style={contentContainerStyle}>
        {/* News list sidebar */}
        <div style={sidebarStyle}>
          <div style={sidebarHeaderStyle}>
            <div style={sidebarTitleStyle}>INTEL REPORTS</div>
            <div style={refreshButtonStyle} onClick={fetchNews}>
              REFRESH
            </div>
          </div>
          
          {loading ? (
            <div style={loadingStyle}>
              <div style={spinnerStyle}></div>
              RETRIEVING INTELLIGENCE DATA...
            </div>
          ) : error ? (
            <div style={errorStyle}>
              COMMUNICATION ERROR: {error}
            </div>
          ) : (
            <div style={newsListStyle}>
              {news.length === 0 ? (
                <div style={noNewsStyle}>NO INTELLIGENCE REPORTS AVAILABLE</div>
              ) : (
                news.map((article, index) => (
                  <div 
                    key={index} 
                    style={{
                      ...newsItemStyle,
                      ...(selectedArticle === article ? selectedNewsItemStyle : {})
                    }}
                    onClick={() => selectArticle(article)}
                  >
                    <div style={newsDateStyle}>
                      {new Date(article.publishedAt).toLocaleDateString()} / {article.source}
                    </div>
                    <div style={newsTitleStyle}>{article.title}</div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
        
        {/* Article detail panel */}
        <div style={articlePanelStyle}>
          {selectedArticle ? (
            <>
              <div style={articleHeaderStyle}>
                <div style={articleSourceStyle}>{selectedArticle.source}</div>
                <div style={articleDateStyle}>
                  {new Date(selectedArticle.publishedAt).toLocaleString()}
                </div>
              </div>
              
              <h2 style={articleTitleStyle}>{selectedArticle.title}</h2>
              
              {selectedArticle.image && (
                <div style={imageContainerStyle}>
                  <img 
                    src={selectedArticle.image} 
                    alt={selectedArticle.title} 
                    style={articleImageStyle}
                  />
                  <div style={imageScanlineStyle}></div>
                </div>
              )}
              
              <p style={articleDescriptionStyle}>
                {selectedArticle.description}
              </p>
              
              <div style={articleContentStyle}>
                {selectedArticle.content}
              </div>
              
              <a 
                href={selectedArticle.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                style={readMoreStyle}
              >
                ACCESS FULL REPORT →
              </a>
            </>
          ) : (
            <div style={noSelectionStyle}>
              <div style={noSelectionIconStyle}>⚠</div>
              SELECT AN INTELLIGENCE REPORT TO VIEW DETAILS
            </div>
          )}
        </div>
      </div>
      
      {/* Footer */}
      <div style={footerStyle}>
        <div style={infoBoxStyle}>
          <span style={infoLabelStyle}>STATUS:</span> 
          <span style={infoValueStyle}>MONITORING GLOBAL MILITARY ACTIVITIES</span>
        </div>
        <div style={controlsInfoStyle}>
          <div>CLASSIFIED: FOR AUTHORIZED PERSONNEL ONLY</div>
        </div>
      </div>
      
      {/* Corner decorations */}
      <div style={{...cornerStyle, top: 0, left: 0}}></div>
      <div style={{...cornerStyle, top: 0, right: 0}}></div>
      <div style={{...cornerStyle, bottom: 0, left: 0}}></div>
      <div style={{...cornerStyle, bottom: 0, right: 0}}></div>
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
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'column'
};

const headerStyle = {
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
  color: '#8FBC8F',
  display: 'flex',
  alignItems: 'center'
};

const statusDotStyle = {
  width: '8px',
  height: '8px',
  borderRadius: '50%',
  backgroundColor: '#8FBC8F',
  marginRight: '10px',
  animation: 'pulse 1.5s infinite',
  boxShadow: '0 0 5px #8FBC8F'
};

const contentContainerStyle = {
  display: 'flex',
  flex: 1,
  overflow: 'hidden'
};

const sidebarStyle = {
  width: '350px',
  borderRight: '2px solid #4B5320',
  backgroundColor: 'rgba(20, 20, 20, 0.8)',
  display: 'flex',
  flexDirection: 'column'
};

const sidebarHeaderStyle = {
  padding: '10px 15px',
  borderBottom: '1px solid #4B5320',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
};

const sidebarTitleStyle = {
  fontSize: '1rem',
  fontWeight: 'bold',
  color: '#4B5320'
};

const refreshButtonStyle = {
  fontSize: '0.8rem',
  color: '#8FBC8F',
  border: '1px solid #4B5320',
  padding: '3px 8px',
  cursor: 'pointer',
  backgroundColor: 'rgba(75, 83, 32, 0.3)',
  transition: 'all 0.2s ease',
  ':hover': {
    backgroundColor: 'rgba(75, 83, 32, 0.5)'
  }
};

const loadingStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '30px',
  fontSize: '0.9rem',
  color: '#8FBC8F',
  flex: 1
};

const spinnerStyle = {
  width: '30px',
  height: '30px',
  border: '3px solid rgba(75, 83, 32, 0.3)',
  borderTop: '3px solid #8FBC8F',
  borderRadius: '50%',
  marginBottom: '15px',
  animation: 'spin 1s linear infinite'
};

const errorStyle = {
  padding: '20px',
  color: '#ff6b6b',
  fontSize: '0.9rem',
  backgroundColor: 'rgba(255, 107, 107, 0.1)',
  border: '1px solid rgba(255, 107, 107, 0.3)',
  margin: '15px'
};

const newsListStyle = {
  flex: 1,
  overflowY: 'auto',
  padding: '5px'
};

const noNewsStyle = {
  padding: '20px',
  textAlign: 'center',
  color: '#4B5320',
  fontSize: '0.9rem'
};

const newsItemStyle = {
  padding: '12px 15px',
  borderBottom: '1px solid rgba(75, 83, 32, 0.3)',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  position: 'relative',
  ':hover': {
    backgroundColor: 'rgba(75, 83, 32, 0.2)'
  }
};

const selectedNewsItemStyle = {
  backgroundColor: 'rgba(75, 83, 32, 0.3)',
  borderLeft: '4px solid #8FBC8F'
};

const newsDateStyle = {
  fontSize: '0.8rem',
  color: '#4B5320',
  marginBottom: '5px'
};

const newsTitleStyle = {
  fontSize: '0.9rem',
  color: '#8FBC8F'
};

const articlePanelStyle = {
  flex: 1,
  padding: '20px',
  overflowY: 'auto',
  backgroundColor: 'rgba(10, 10, 10, 0.8)',
  position: 'relative'
};

const articleHeaderStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  borderBottom: '1px solid #4B5320',
  paddingBottom: '10px',
  marginBottom: '15px'
};

const articleSourceStyle = {
  color: '#4B5320',
  fontSize: '0.9rem',
  fontWeight: 'bold',
  backgroundColor: 'rgba(75, 83, 32, 0.1)',
  padding: '3px 8px',
  border: '1px solid #4B5320'
};

const articleDateStyle = {
  color: '#8FBC8F',
  fontSize: '0.9rem'
};

const articleTitleStyle = {
  color: '#8FBC8F',
  fontSize: '1.3rem',
  marginBottom: '20px',
  fontWeight: 'bold',
  lineHeight: '1.4',
  position: 'relative',
  paddingLeft: '15px',
  borderLeft: '3px solid #8FBC8F'
};

const imageContainerStyle = {
  position: 'relative',
  marginBottom: '20px',
  borderLeft: '3px solid #4B5320',
  borderBottom: '3px solid #4B5320',
  padding: '3px'
};

const articleImageStyle = {
  width: '100%',
  maxHeight: '300px',
  objectFit: 'cover'
};

const imageScanlineStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.1), rgba(0,0,0,0.1) 1px, transparent 1px, transparent 2px)',
  pointerEvents: 'none'
};

const articleDescriptionStyle = {
  fontSize: '1rem',
  color: '#8FBC8F',
  marginBottom: '20px',
  lineHeight: '1.6',
  padding: '10px',
  backgroundColor: 'rgba(75, 83, 32, 0.1)',
  border: '1px solid #4B5320'
};

const articleContentStyle = {
  fontSize: '0.9rem',
  color: '#8FBC8F',
  marginBottom: '30px',
  lineHeight: '1.7'
};

const readMoreStyle = {
  display: 'inline-block',
  color: '#8FBC8F',
  textDecoration: 'none',
  fontSize: '0.9rem',
  border: '1px solid #4B5320',
  padding: '8px 15px',
  backgroundColor: 'rgba(75, 83, 32, 0.3)',
  transition: 'all 0.2s ease',
  fontWeight: 'bold',
  ':hover': {
    backgroundColor: 'rgba(75, 83, 32, 0) !important'
  }
};

const noSelectionStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
  color: '#4B5320',
  fontSize: '1rem',
  textAlign: 'center'
};

const noSelectionIconStyle = {
  fontSize: '3rem',
  marginBottom: '15px',
  color: '#8FBC8F'
};

const footerStyle = {
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

// Add CSS animations
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = `
  @keyframes pulse {
    0% { opacity: 1; }
    50% { opacity: 0.3; }
    100% { opacity: 1; }
  }
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(styleSheet);

export default News;