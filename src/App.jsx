import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import AdminDashboard from './components/AdminDashboard';
import EventsPage from './components/EventsPage';
import EventsManager from './components/EventsManager';
import GalleryPage from './components/GalleryPage';
import BackCornerPage from './components/BackCornerPage';

// Main Layout Component
const Layout = ({ children }) => {
  const location = useLocation();
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Navigation */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Link to="/" className="text-2xl font-bold text-gray-800">
                Idaho Broadcasting Foundation
              </Link>
            </div>
            
            <nav className="hidden md:flex space-x-8">
              <Link 
                to="/" 
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === '/' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                HOME
              </Link>
              <Link 
                to="/events" 
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === '/events' 
                    ? 'bg-orange-100 text-orange-700' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                EVENTS
              </Link>
              <Link 
                to="/back-corner" 
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === '/back-corner' 
                    ? 'bg-purple-100 text-purple-700' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                THE BACK CORNER
              </Link>
              <Link 
                to="/gallery" 
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === '/gallery' 
                    ? 'bg-green-100 text-green-700' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                GALLERY
              </Link>
              <Link 
                to="/about" 
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === '/about' 
                    ? 'bg-pink-100 text-pink-700' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                ABOUT/CONTACT
              </Link>
              <Link 
                to="/news" 
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === '/news' 
                    ? 'bg-indigo-100 text-indigo-700' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                NEWS/SOCIAL
              </Link>
              <Link 
                to="/admin" 
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname.startsWith('/admin') 
                    ? 'bg-red-100 text-red-700' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                ADMIN
              </Link>
            </nav>
            
            {/* Mobile menu button */}
            <div className="md:hidden">
              <button className="text-gray-600 hover:text-gray-900">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main>
        {children}
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-300">
              © 2025 Idaho Broadcasting Foundation. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Home Page Component
const HomePage = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-6">
        Welcome to Idaho Broadcasting Foundation
      </h1>
      <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
        Supporting broadcasting excellence across Idaho through education, 
        resources, and community engagement.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Broadcasting Events</h3>
          <p className="text-gray-600">
            Join our conferences, workshops, and seminars designed for broadcasting professionals.
          </p>
          <Link to="/events" className="text-blue-600 hover:text-blue-800 font-medium mt-3 inline-block">
            View Events →
          </Link>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">The Back Corner</h3>
          <p className="text-gray-600">
            Explore our interactive broadcasting tools and resources.
          </p>
          <Link to="/back-corner" className="text-blue-600 hover:text-blue-800 font-medium mt-3 inline-block">
            Explore Tools →
          </Link>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">News & Updates</h3>
          <p className="text-gray-600">
            Stay informed with the latest broadcasting news and foundation updates.
          </p>
          <Link to="/news" className="text-blue-600 hover:text-blue-800 font-medium mt-3 inline-block">
            Read News →
          </Link>
        </div>
      </div>
    </div>
  </div>
);


// About Page Component
const AboutPage = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div className="text-center">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">About & Contact</h1>
      <p className="text-lg text-gray-600 mb-8">
        Learn more about the Idaho Broadcasting Foundation
      </p>
      <div className="bg-white p-8 rounded-lg shadow-sm">
        <div className="max-w-3xl mx-auto text-left">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Our Mission</h2>
          <p className="text-gray-600 mb-6">
            The Idaho Broadcasting Foundation is dedicated to supporting and advancing 
            the broadcasting industry throughout Idaho through education, professional 
            development, and community engagement.
          </p>
          
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h2>
          <div className="text-gray-600">
            <p className="mb-2">Email: info@idahobroadcasting.org</p>
            <p className="mb-2">Phone: (208) 555-0123</p>
            <p>Address: Boise, Idaho</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// News Page Component
import BroadcastingNewsFeed from './components/BroadcastingNewsFeed.jsx';
const NewsPage = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div className="text-center mb-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">News & Social</h1>
      <p className="text-lg text-gray-600 mb-8">
        Latest news and social media updates
      </p>
    </div>
    <BroadcastingNewsFeed />
  </div>
);

// Main App Component
function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/back-corner" element={<BackCornerPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/events" element={<EventsManager />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;

