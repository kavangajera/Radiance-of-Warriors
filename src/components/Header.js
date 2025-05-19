import React from 'react';

const Header = ({ title }) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-sm border-b border-gray-800">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <h1 className="text-xl font-bold text-white">{title}</h1>
        
        <nav className="flex space-x-4">
          <a href="/" className="text-gray-300 hover:text-white">Home</a>
          <a href="/aircraft/all" className="text-gray-300 hover:text-white">Aircraft Database</a>
          <a href="/about" className="text-gray-300 hover:text-white">About</a>
        </nav>
      </div>
    </header>
  );
};

export default Header;