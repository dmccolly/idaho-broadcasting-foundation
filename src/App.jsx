import { useState } from 'react';
import { Button } from '@/components/ui/button.jsx';
import VoxProPlayer from './components/VoxProPlayer.jsx';
import VoxProManagement from './components/VoxProManagement.jsx';
import NewsSocialFeed from './components/NewsSocialFeed.jsx';
import RadioPage from './components/RadioPage.jsx';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('The Back Corner');

  const navigationTabs = [
    'HOME',
    'Radio',
    'Television',
    'Events',
    'The Back Corner',
    'Gallery',
    'About/Contact',
    'News/Social',
    'Admin'
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'HOME':
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-800 mb-4">
                History of Idaho Broadcasting Foundation
              </h1>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Preserving and celebrating the rich heritage of radio and television broadcasting in Idaho.
                Our foundation is dedicated to documenting the stories, people, and technology that shaped
                Idaho's broadcasting landscape.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md border">
                <h3 className="text-xl font-semibold mb-3 text-gray-800">Radio Heritage</h3>
                <p className="text-gray-600">
                  Explore the evolution of radio broadcasting in Idaho, from the early AM stations
                  to modern digital broadcasting.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md border">
                <h3 className="text-xl font-semibold mb-3 text-gray-800">Television History</h3>
                <p className="text-gray-600">
                  Discover the development of television in Idaho, including pioneering stations
                  and technological milestones.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md border">
                <h3 className="text-xl font-semibold mb-3 text-gray-800">Broadcasting Pioneers</h3>
                <p className="text-gray-600">
                  Learn about the visionaries and professionals who built Idaho's broadcasting industry
                  from the ground up.
                </p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Featured Systems</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2 text-blue-800">VoxPro Player</h4>
                  <p className="text-blue-600 text-sm mb-3">Compact media player for broadcasting</p>
                  <Button
                    onClick={() => setActiveTab('The Back Corner')}
                    className="bg-blue-600 hover:bg-blue-700"
                    size="sm"
                  >
                    Access Player
                  </Button>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2 text-green-800">News & Social Hub</h4>
                  <p className="text-green-600 text-sm mb-3">Stay connected with the broadcasting community</p>
                  <Button
                    onClick={() => setActiveTab('News/Social')}
                    className="bg-green-600 hover:bg-green-700"
                    size="sm"
                  >
                    View Feed
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );
      case 'Radio':
        return <RadioPage />;
      case 'Television':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-800">Television Broadcasting in Idaho</h2>
            <div className="bg-white p-6 rounded-lg shadow-md border">
              <h3 className="text-xl font-semibold mb-4">Television Milestones</h3>
              <p className="text-gray-600 mb-4">
                Television came to Idaho in the 1950s, transforming how Idahoans received news
                and entertainment, and connecting the state to national programming.
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>First television stations in Idaho</li>
                <li>Transition from black and white to color</li>
                <li>Local news and programming development</li>
                <li>Digital television transition</li>
              </ul>
            </div>
          </div>
        );
      case 'Events':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-800">Foundation Events</h2>
            <div className="bg-white p-6 rounded-lg shadow-md border">
              <h3 className="text-xl font-semibold mb-4">Upcoming Events</h3>
              <p className="text-gray-600 mb-4">
                Join us for events celebrating Idaho's broadcasting heritage and connecting
                industry professionals past and present.
              </p>
              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-semibold">Larry Lomax Memorial Tribute Luncheon</h4>
                  <p className="text-gray-600">June 27th, 2025 - Honoring legendary radio personality "The Emperor"</p>
                  <p className="text-sm text-gray-500 mt-2">RSVP: 208-853-7756 or KIBF@Q.com</p>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="font-semibold">Annual Broadcasting Heritage Dinner</h4>
                  <p className="text-gray-600">Celebrating Idaho broadcasting pioneers</p>
                </div>
              </div>
            </div>
          </div>
        );
      case 'The Back Corner':
        return (
          <div>
            <div className="text-center mb-10">
              <h2 className="text-4xl font-bold text-gray-800">The Back Corner</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto mt-2">
                An interactive media player experience, showcasing curated audio and video from our archives.
              </p>
            </div>
            <div className="grid lg:grid-cols-3 gap-8 items-start">
              <div className="lg:col-span-2 bg-white p-8 rounded-lg shadow-md border">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">About the Media Player</h3>
                <div className="text-gray-700 leading-relaxed space-y-4">
                  <p>This is a placeholder for the text content you will provide later. This area can contain detailed descriptions, history, or any other information you'd like to feature alongside the media player.</p>
                  <p>The layout is set up so that this text content will occupy the left two-thirds of the page, while the interactive player and its key assignments are neatly organized in the column to the right.</p>
                  <p>You can use this space to explain the history of the VoxPro system, tell stories about the content assigned to the keys, or provide instructions on how to use the player.</p>
                </div>
              </div>
              <div className="lg:col-span-1">
                <VoxProPlayer />
              </div>
            </div>
          </div>
        );
      case 'Gallery':
        return (
          <div className="space-y-8">
            <div className="text-center bg-gradient-to-r from-blue-50 to-gray-50 p-8 rounded-lg">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">Video Gallery</h2>
              <p className="text-xl text-gray-600 max-w-4xl mx-auto">
                In our ongoing effort to visually preserve Idaho's fascinating radio and television past,
                the History of Idaho Broadcasting Foundation has conducted more than 75 video interviews
                with media legends and personalities throughout the state who have generously shared
                anecdotal insights into their careers.
              </p>
            </div>
          </div>
        );
      case 'About/Contact':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-800">About the Foundation</h2>
            <div className="bg-white p-6 rounded-lg shadow-md border">
              <h3 className="text-xl font-semibold mb-4">Our Mission</h3>
              <p className="text-gray-600 mb-4">
                The History of Idaho Broadcasting Foundation is dedicated to preserving,
                documenting, and sharing the rich heritage of radio and television broadcasting in Idaho.
              </p>
              <h3 className="text-xl font-semibold mb-4 mt-6">Contact Information</h3>
              <div className="space-y-2 text-gray-600">
                <p><strong>Address:</strong> Idaho Broadcasting Foundation</p>
                <p><strong>Email:</strong> info@idahobroadcasting.org</p>
                <p><strong>Phone:</strong> (208) 555-0123</p>
              </div>
            </div>
          </div>
        );
      case 'News/Social':
        return <NewsSocialFeed />;
      case 'Admin':
        return <VoxProManagement />;
      default:
        return <div>Page not found</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-blue-600">History of Idaho Broadcasting Foundation</h1>
            </div>
          </div>
        </div>
      </header>
      <nav className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto">
            {navigationTabs.map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`py-4 px-2 whitespace-nowrap text-sm font-medium border-b-2 transition-colors ${activeTab === tab ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                {tab}
              </button>
            ))}
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2025 History of Idaho Broadcasting Foundation. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
