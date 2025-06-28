import React, { useState } from 'react';

const App = () => {
  const [currentPage, setCurrentPage] = useState('home');

  // Navigation
  const Navigation = () => (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <button 
            onClick={() => setCurrentPage('home')}
            className="text-2xl font-bold text-blue-600"
          >
            History of Idaho Broadcasting Foundation
          </button>
          <div className="flex space-x-8">
            {['HOME', 'MUSEUM', 'EVENTS', 'THE BACK CORNER', 'GALLERY', 'ABOUT/CONTACT', 'NEWS/SOCIAL', 'ADMIN'].map((item) => (
              <button
                key={item}
                onClick={() => setCurrentPage(item.toLowerCase().replace(/[^a-z]/g, ''))}
                className={`px-3 py-2 text-sm font-medium ${
                  currentPage === item.toLowerCase().replace(/[^a-z]/g, '')
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );

  // Home Page
  const HomePage = () => (
    <div>
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-900 to-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-6xl font-bold mb-6">Radio History</h1>
              <p className="text-2xl mb-8 text-blue-100">an adventure in evolution</p>
              <p className="text-lg text-blue-50">
                Discover the rich heritage of Idaho's broadcasting industry.
              </p>
            </div>
            <div className="w-full h-64 bg-gray-800 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">🎙️</div>
                <p className="text-gray-300">Vintage Broadcasting Equipment</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Radio Stations */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { station: "KIDO - 104.3 FM", freq: "104.3 FM", desc: "KIDO is a dynamic station, combining the best of country and rock..." },
            { station: "KCIX - 105.9 FM", freq: "105.9 FM", desc: "KCIX 'Mix 105.9' offers a diverse blend of adult contemporary hits..." },
            { station: "KTHI - 107.1 FM", freq: "107.1 FM", desc: "KTHI specializes in classic hits from the 70s, 80s, and 90s..." },
            { station: "KQXR - 100.3 FM", freq: "100.3 FM", desc: "KQXR delivers contemporary hits and classic rock favorites..." },
            { station: "KIDZ - 690 AM", freq: "690 AM", desc: "KIDZ focuses on news, talk, and sports programming..." },
            { station: "KIZD - 630 AM", freq: "630 AM", desc: "KIZD brings classic talk radio and news coverage..." }
          ].map((station, i) => (
            <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-48 bg-gray-200 flex items-center justify-center">
                <div className="text-4xl">📻</div>
              </div>
              <div className="p-6">
                <div className="flex justify-between mb-2">
                  <h3 className="text-xl font-bold">{station.station}</h3>
                  <span className="text-blue-600 font-semibold">{station.freq}</span>
                </div>
                <p className="text-gray-600 text-sm mb-4">{station.desc}</p>
                <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                  Read Full History
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      {currentPage === 'home' ? <HomePage /> : (
        <div className="max-w-4xl mx-auto px-4 py-16">
          <h1 className="text-4xl font-bold mb-8 capitalize">{currentPage.replace(/([A-Z])/g, ' $1')}</h1>
          <p className="text-lg text-gray-600">Content for {currentPage} page will be added here.</p>
        </div>
      )}
    </div>
  );
};

export default App;
