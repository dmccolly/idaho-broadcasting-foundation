import React, { useState } from 'react';

// Navigation Component
const Navigation = ({ currentPage, setCurrentPage }) => {
  const navItems = [
    { id: 'home', label: 'HOME' },
    { id: 'museum', label: 'MUSEUM' },
    { id: 'events', label: 'EVENTS' },
    { id: 'back-corner', label: 'THE BACK CORNER' },
    { id: 'gallery', label: 'GALLERY' },
    { id: 'about', label: 'ABOUT/CONTACT' },
    { id: 'news', label: 'NEWS/SOCIAL' },
    { id: 'admin', label: 'ADMIN' }
  ];

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <button 
              onClick={() => setCurrentPage('home')}
              className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors"
            >
              History of Idaho Broadcasting Foundation
            </button>
          </div>
          <div className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  currentPage === item.id
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
          
          <div className="md:hidden">
            <button className="text-gray-500 hover:text-gray-700">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

// Radio Station Card Component
const RadioStationCard = ({ station, frequency, description }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden flex items-center justify-center">
        <div className="text-center text-gray-500">
          <div className="text-4xl mb-2">📻</div>
          <p className="text-sm">{station}</p>
        </div>
      </div>
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-bold text-gray-900">{station}</h3>
          <span className="text-blue-600 font-semibold bg-blue-50 px-2 py-1 rounded">
            {frequency}
          </span>
        </div>
        <p className="text-gray-600 text-sm leading-relaxed mb-4">
          {description}
        </p>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors duration-200 w-full sm:w-auto">
          Read Full History
        </button>
      </div>
    </div>
  );
};

// Hero Section Component
const HeroSection = () => {
  return (
    <div className="relative bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 text-white overflow-hidden">
      <div className="absolute inset-0 bg-black opacity-40"></div>
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-32 h-32 bg-blue-500 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 bg-blue-400 rounded-full opacity-30 animate-pulse delay-1000"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="z-10">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Radio History
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 font-light">
              an adventure in evolution
            </p>
            <p className="text-lg leading-relaxed text-blue-50 mb-8 max-w-lg">
              Discover the rich heritage of Idaho's broadcasting industry, from the early days 
              of AM radio to today's digital revolution.
            </p>
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200">
              Explore Our History
            </button>
          </div>
          
          <div className="relative z-10">
            <div className="w-full h-80 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-2xl flex items-center justify-center border border-gray-700">
              <div className="text-center">
                <div className="text-8xl mb-4">🎙️</div>
                <p className="text-gray-300 text-lg font-medium">Vintage Broadcasting</p>
                <p className="text-gray-400 text-sm">Equipment & Memories</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
