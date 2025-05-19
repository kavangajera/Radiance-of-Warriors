
import React, { useState } from 'react';

const AircraftCard = ({ aircraft }) => {
  const [showModal, setShowModal] = useState(false);
  const [flagError, setFlagError] = useState(false);
  
  // Check if 3D model is available
  const has3DModel = aircraft.sketchfab_embed_url && aircraft.sketchfab_embed_url !== "NOT FOUND";
  
  return (
    <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-700 hover:shadow-xl transition-shadow duration-300">
      <div className="relative">
        <img 
          src={aircraft.image_url} 
          alt={aircraft.name} 
          className="w-full h-56 object-cover opacity-90 hover:opacity-100 transition-opacity duration-300"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/api/placeholder/400/320";
          }}
        />
        <div className="absolute top-0 left-0 w-full bg-gradient-to-b from-black to-transparent h-16 opacity-70"></div>
        <div className="absolute top-2 right-2 flex items-center bg-gray-900 px-2 py-1 rounded-sm border border-gray-600">
          {!flagError && (
            <img 
              src={`/data/flags/${aircraft.country.toLowerCase()}.jpg`}
              alt={aircraft.country} 
              className="w-5 h-3 mr-1"
              onError={(e) => {
                setFlagError(true);
                e.target.onerror = null;
              }}
            />
          )}
          <span className="text-gray-200 text-xs font-mono tracking-wide">{aircraft.country}</span>
        </div>
        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black to-transparent h-16 opacity-70"></div>
        <div className="absolute bottom-2 left-2">
          <span className="bg-green-800 text-gray-100 px-2 py-1 rounded-sm text-xs font-mono tracking-wide border border-green-700">{aircraft.service}</span>
        </div>
      </div>
      
      <div className="p-4 text-gray-200">
        <div className="flex justify-between items-start mb-3">
          <h2 className="text-xl font-bold text-gray-100 truncate">{aircraft.name}</h2>
          <span className="text-xs font-mono bg-gray-700 px-2 py-1 rounded-sm border-l-4 border-blue-500">{aircraft.role}</span>
        </div>
        
        <p className="text-sm text-gray-400 mb-2 font-mono">{aircraft.model}</p>
        
        <div className="flex justify-between text-sm mb-3">
          <div className="flex items-center space-x-1">
            <span className="font-medium text-gray-300">UNITS:</span>
            <span className="text-gray-400 font-mono">{aircraft.units}</span>
          </div>
        </div>
        
        <div className="border-t border-gray-700 my-3"></div>
        
        <p className="text-gray-300 text-sm mb-4 line-clamp-3">{aircraft.description}</p>
        
        <div className="flex justify-between items-center mt-4">
          <span className="text-sm font-medium px-2 py-1 bg-gray-700 rounded-sm border-l-4 border-yellow-500 text-gray-200">
            {aircraft.assessment}
          </span>
          
          <button 
            className={`px-4 py-2 rounded-sm text-gray-200 text-sm font-mono tracking-wider uppercase ${has3DModel ? 'bg-green-800 hover:bg-green-700 border border-green-600' : 'bg-gray-700 border border-gray-600 opacity-50 cursor-not-allowed'}`}
            onClick={() => has3DModel && setShowModal(true)}
            disabled={!has3DModel}
          >
            3D View
          </button>
        </div>
      </div>
      
      {/* 3D Model Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-lg w-11/12 md:w-3/4 lg:w-2/3 h-3/4 p-4 border border-gray-700">
            <div className="flex justify-between items-center mb-4 border-b border-gray-700 pb-2">
              <h3 className="text-xl font-bold text-gray-100 font-mono tracking-wide">{aircraft.name} 3D MODEL</h3>
              <button 
                onClick={() => setShowModal(false)}
                className="bg-red-800 hover:bg-red-700 text-white px-4 py-2 rounded-sm border border-red-700 text-sm font-mono"
              >
                CLOSE
              </button>
            </div>
            
            <div className="w-full h-5/6">
              <iframe
                title={`${aircraft.name} 3D Model`}
                frameBorder="0"
                allowFullScreen
                mozallowfullscreen="true"
                webkitallowfullscreen="true"
                allow="autoplay; fullscreen; xr-spatial-tracking"
                src={aircraft.sketchfab_embed_url}
                className="w-full h-full"
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AircraftCard;