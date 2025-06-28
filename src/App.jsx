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
// Home Page Component
const HomePage = () => {
  const radioStations = [
    {
      station: "KIDO - 104.3 FM",
      frequency: "104.3 FM",
      description: "KIDO is a dynamic station, combining the best of country and rock to deliver a unique sound that reaches across generations. KIDO puts you at the center for a vibrant community entertainment and diverse music selection."
    },
    {
      station: "KCIX - 105.9 FM",
      frequency: "105.9 FM", 
      description: "KCIX 'Mix 105.9' offers a diverse blend of adult contemporary hits, making it a popular choice for a wide demographic. Its commitment to local events and community involvement keeps listeners in central Idaho tuned along."
    },
    {
      station: "KTHI - 107.1 FM",
      frequency: "107.1 FM",
      description: "KTHI '107.1 FM' specializes in classic hits from the 70s, 80s, and 90s, bringing a nostalgic experience to its listeners. It's celebrated for its variety playlist and engaging on-station segments."
    },
    {
      station: "KQXR - 100.3 FM",
      frequency: "100.3 FM",
      description: "KQXR delivers contemporary hits and classic rock favorites to the Treasure Valley, connecting communities through music and local programming."
    },
    {
      station: "KIDZ - 690 AM",
      frequency: "690 AM",
      description: "KIDZ focuses on news, talk, and sports programming, serving as a vital information source for Idaho listeners seeking current events and community discussion."
    },
    {
      station: "KIZD - 630 AM",
      frequency: "630 AM",
      description: "KIZD brings classic talk radio and news coverage to Idaho, maintaining the tradition of AM radio excellence with local and national programming."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <HeroSection />
      
      {/* Introduction Section */}
      <div className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Welcome to Idaho Broadcasting Heritage
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            The Idaho Broadcasting Foundation preserves and celebrates the rich history of radio and 
            television in the Gem State. From pioneering stations to modern digital broadcasting, 
            we document the evolution of how Idahoans have stayed connected to their communities.
          </p>
        </div>
      </div>
      
      {/* Radio Stations Grid */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Featured Idaho Radio Stations
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Explore the diverse landscape of Idaho's radio broadcasting, from contemporary hits 
            to classic rock, news, and community programming.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {radioStations.map((station, index) => (
            <RadioStationCard
              key={index}
              station={station.station}
              frequency={station.frequency}
              description={station.description}
            />
          ))}
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="bg-blue-600 text-white py-16">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold mb-4">
            Preserve Idaho's Broadcasting Heritage
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Help us document and preserve the stories of Idaho's radio and television industry 
            for future generations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200">
              Share Your Story
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors duration-200">
              Visit Museum
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main App Component
const App = () => {
  const [currentPage, setCurrentPage] = useState('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'museum':
        return <div className="max-w-4xl mx-auto px-4 py-16"><h1 className="text-4xl font-bold text-gray-900 mb-8">Broadcasting Museum</h1><p className="text-lg text-gray-600">Explore artifacts, equipment, and memorabilia from Idaho's broadcasting history.</p></div>;
      case 'events':
        return <div className="max-w-4xl mx-auto px-4 py-16"><h1 className="text-4xl font-bold text-gray-900 mb-8">Events</h1><p className="text-lg text-gray-600">Stay updated on upcoming events, reunions, and broadcasting industry gatherings.</p></div>;
      case 'back-corner':
        return <div className="min-h-screen bg-gray-900 text-white"><div className="max-w-7xl mx-auto px-4 py-8"><div className="text-center mb-8"><h1 className="text-3xl font-bold text-green-400 mb-2">The Back Corner</h1><p className="text-gray-400">VoxPro Media Management System</p><div className="mt-4 p-4 bg-gray-800 rounded-lg"><p className="text-sm text-gray-300">🚧 VoxPro Management tools will be restored here soon.</p></div></div></div></div>;
      case 'gallery':
        return <div className="max-w-4xl mx-auto px-4 py-16"><h1 className="text-4xl font-bold text-gray-900 mb-8">Gallery</h1><p className="text-lg text-gray-600">Browse photos and videos from Idaho's broadcasting heritage.</p></div>;
      case 'about':
        return <div className="max-w-4xl mx-auto px-4 py-16"><h1 className="text-4xl font-bold text-gray-900 mb-8">About & Contact</h1><p className="text-lg text-gray-600">Learn more about the Idaho Broadcasting Foundation and how to get in touch.</p></div>;
      case 'news':
        return <div className="max-w-4xl mx-auto px-4 py-16"><h1 className="text-4xl font-bold text-gray-900 mb-8">News & Social</h1><p className="text-lg text-gray-600">Latest news and updates from the Idaho broadcasting community.</p></div>;
      case 'admin':
        return <div className="max-w-4xl mx-auto px-4 py-16"><h1 className="text-4xl font-bold text-gray-900 mb-8">Administration</h1><p className="text-lg text-gray-600">Administrative tools and resources for foundation management.</p></div>;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation currentPage={currentPage} setCurrentPage={setCurrentPage} />
      {renderPage()}
    </div>
  );
};

export default App;
