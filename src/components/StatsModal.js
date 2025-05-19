import React from 'react';
import { getStatsForCountry } from '../data/countryStats';

const StatsModal = ({ country, onClose }) => {
  const name = country.properties.name;
  const stats = getStatsForCountry(name);

  return (
    <div className="stats-modal">
      <button className="close-btn" onClick={onClose}>×</button>
      <h2>{name} Military Stats</h2>
      <img src={`https://flagcdn.com/w160/${name.toLowerCase().slice(0, 2)}.png`} alt={name} width="80" />
      <div className="stats-list">
        {stats ? (
          Object.entries(stats).map(([key, value]) => (
            <div key={key} className="stat-row">
              <span className="label">{key}</span>
              <span className="value">{value}</span>
            </div>
          ))
        ) : (
          <p>No data available</p>
        )}
      </div>
    </div>
  );
};

export default StatsModal;
