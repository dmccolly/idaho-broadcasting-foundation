import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import VoxProPlayer from './components/VoxProPlayer.jsx'
import VoxProManagement from './components/VoxProManagement.jsx'
import NewsSocialFeed from './components/NewsSocialFeed.jsx'
import RadioPage from './components/RadioPage.jsx'
import EventsPage from './components/EventsPage.jsx'
import HomeEventBanner from './components/HomeEventBanner.jsx'
import { eventUtils } from './data/eventsData.js'
import './App.css'

function App() {
  const [activeTab, setActiveTab] = useState('HOME')

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
  ]

  const handleEventClick = () => {
    setActiveTab('Events')
  }

  const renderContent = () => {
    switch(activeTab) {
      case 'HOME':
        return (
          <div className="space-y-8">
            {/* Event Banner - Shows only when there's a current event */}
            {eventUtils.shouldShowHomeBanner() && (
              <HomeEventBanner onEventClick={handleEventClick} />
            )}

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
        )
      
      case 'Radio':
        return <RadioPage />
      
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
        )
      
      case 'Events':
        return <EventsPage />
      
      case 'The Back Corner':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-800">The Back Corner</h2>
            <div className="bg-white p-6 rounded-lg shadow-md border">
              <h3 className="text-xl font-semibold mb-4">VoxPro Media Player</h3>
              <p className="text-gray-600 mb-6">
                Compact professional media player for broadcasting operations.
              </p>
            </div>
            
            <VoxProPlayer />
          </div>
        )
      
      case 'Gallery':
        return (
          <div className="space-y-8">
            {/* Hero Section */}
            <div className="text-center bg-gradient-to-r from-blue-50 to-gray-50 p-8 rounded-lg">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">Video Gallery</h2>
              <p className="text-xl text-gray-600 max-w-4xl mx-auto">
                In our ongoing effort to visually preserve Idaho's fascinating radio and television past, 
                the History of Idaho Broadcasting Foundation has conducted more than 75 video interviews 
                with media legends and personalities throughout the state who have generously shared 
                anecdotal insights into their careers.
              </p>
            </div>

            {/* Featured Video Section */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-6">
                <h3 className="text-2xl font-bold mb-2">Featured Special</h3>
                <p className="text-red-100">A beloved Idaho broadcasting holiday tradition</p>
              </div>
              <div className="p-6">
                <div className="grid md:grid-cols-2 gap-6 items-center">
                  <div>
                    <h4 className="text-2xl font-bold text-gray-800 mb-4">Marty Holtman's Santa Express</h4>
                    <p className="text-gray-600 mb-4">
                      Follow along in an adventure to the North Pole as our beloved Marty Holtman goes on a journey 
                      to deliver letters for Santa from the children of Idaho. This Emmy-winning holiday classic 
                      has been digitally remastered from original video tapes discovered in our archives.
                    </p>
                    <div className="flex items-center gap-4">
                      <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                        Watch Now
                      </button>
                      <span className="text-gray-500 text-sm">Duration: 7:24</span>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                      <iframe 
                        src="https://player.vimeo.com/video/1040039534?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479"
                        className="w-full h-full"
                        frameBorder="0" 
                        allow="autoplay; fullscreen; picture-in-picture; clipboard-write" 
                        title="Marty Holtman's Santa Express"
                      ></iframe>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Interview Videos Grid */}
            <div>
              <h3 className="text-3xl font-bold text-gray-800 mb-6 text-center">Broadcasting Legend Interviews</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                
                {/* Dee Sarton */}
                <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden group">
                  <div className="relative aspect-video bg-gray-200">
                    <iframe 
                      src="https://player.vimeo.com/video/982877483?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479"
                      className="w-full h-full"
                      frameBorder="0" 
                      allow="autoplay; fullscreen; picture-in-picture; clipboard-write" 
                      title="Dee Sarton Interview"
                    ></iframe>
                  </div>
                  <div className="p-4">
                    <h4 className="text-xl font-bold text-gray-800 mb-2">Dee Sarton</h4>
                    <p className="text-sm text-blue-600 mb-2">Former KTVB-TV, Channel 7 anchor/reporter</p>
                    <p className="text-gray-600 text-sm mb-3">
                      Talks about starting out as a young reporter in Boise in the late '70s, 
                      and working with legendary Channel 7 news director Sal Celeski.
                    </p>
                    <p className="text-xs text-gray-500 italic">Photos courtesy: KTVB News Group</p>
                  </div>
                </div>

                {/* Marcia Franklin */}
                <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden group">
                  <div className="relative aspect-video bg-gray-200">
                    <iframe 
                      src="https://player.vimeo.com/video/982872224?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479"
                      className="w-full h-full"
                      frameBorder="0" 
                      allow="autoplay; fullscreen; picture-in-picture; clipboard-write" 
                      title="Marcia Franklin Interview"
                    ></iframe>
                  </div>
                  <div className="p-4">
                    <h4 className="text-xl font-bold text-gray-800 mb-2">Marcia Franklin</h4>
                    <p className="text-sm text-blue-600 mb-2">Idaho Public Television producer/Dialogue host</p>
                    <p className="text-gray-600 text-sm mb-3">
                      Discusses her most memorable Sun Valley Writers' Conference interviews, 
                      including her 2016 sit-down with Game of Thrones creators David Benioff and D.B. Weiss.
                    </p>
                    <p className="text-xs text-gray-500 italic">Photos courtesy: Idaho Public Television</p>
                  </div>
                </div>

                {/* Don Nelson */}
                <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden group">
                  <div className="relative aspect-video bg-gray-200">
                    <iframe 
                      src="https://player.vimeo.com/video/982856307?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479"
                      className="w-full h-full"
                      frameBorder="0" 
                      allow="autoplay; fullscreen; picture-in-picture; clipboard-write" 
                      title="Don Nelson Interview"
                    ></iframe>
                  </div>
                  <div className="p-4">
                    <h4 className="text-xl font-bold text-gray-800 mb-2">Don Nelson</h4>
                    <p className="text-sm text-blue-600 mb-2">KIVI-TV, Channel 6 anchor/reporter</p>
                    <p className="text-gray-600 text-sm mb-3">
                      Explains how Brink Chipman came up with the now-legendary "6 On Your Side" 
                      consumer watchdog branding during his tenure as news director.
                    </p>
                    <p className="text-xs text-gray-500 italic">Photos courtesy: KIVI, Channel 6</p>
                  </div>
                </div>

                {/* Kevin Miller */}
                <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden group">
                  <div className="relative aspect-video bg-gray-200">
                    <iframe 
                      src="https://player.vimeo.com/video/982690679?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479"
                      className="w-full h-full"
                      frameBorder="0" 
                      allow="autoplay; fullscreen; picture-in-picture; clipboard-write" 
                      title="Kevin Miller Interview"
                    ></iframe>
                  </div>
                  <div className="p-4">
                    <h4 className="text-xl font-bold text-gray-800 mb-2">Kevin Miller</h4>
                    <p className="text-sm text-blue-600 mb-2">KIDO radio talk show host</p>
                    <p className="text-gray-600 text-sm mb-3">
                      Tells us how "Miller's Mission," his annual on-air fundraising effort 
                      to help support the Boise Rescue Mission, came about.
                    </p>
                    <p className="text-xs text-gray-500 italic">Photos courtesy: Boise Rescue Mission</p>
                  </div>
                </div>

                {/* Marty Holtman */}
                <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden group">
                  <div className="relative aspect-video bg-gray-200">
                    <iframe 
                      src="https://player.vimeo.com/video/967979349?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479"
                      className="w-full h-full"
                      frameBorder="0" 
                      allow="autoplay; fullscreen; picture-in-picture; clipboard-write" 
                      title="Marty Holtman Interview"
                    ></iframe>
                  </div>
                  <div className="p-4">
                    <h4 className="text-xl font-bold text-gray-800 mb-2">Marty Holtman</h4>
                    <p className="text-sm text-blue-600 mb-2">KBOI radio deejay and KBOI-TV/KBCI-TV weatherman</p>
                    <p className="text-gray-600 text-sm mb-3">
                      Reminisces about his days as late-night horror-movie-show host "Claude Gloom" 
                      and the hugely popular show "The Unknown."
                    </p>
                    <p className="text-xs text-gray-500 italic">Photos courtesy: KBOI, Channel 2</p>
                  </div>
                </div>

                {/* More Videos Placeholder */}
                <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden group border-2 border-dashed border-gray-300">
                  <div className="aspect-video flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-gray-400 rounded-full flex items-center justify-center mx-auto mb-2">
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/>
                        </svg>
                      </div>
                      <p className="text-gray-600 font-semibold text-sm">More Videos</p>
                      <p className="text-gray-500 text-xs">Coming Soon</p>
                    </div>
                  </div>
                  <div className="p-4">
                    <h4 className="text-xl font-bold text-gray-600 mb-2">Additional Interviews</h4>
                    <p className="text-gray-500 text-sm">
                      We're continuously adding more video interviews with Idaho broadcasting legends. 
                      Check back soon for new content!
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <div className="bg-blue-50 rounded-lg p-8 text-center">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Share Your Broadcasting Story</h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Do you have memories or stories from Idaho's broadcasting history? We'd love to hear from you 
                and potentially feature your story in our growing collection.
              </p>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
                Contact Us
              </button>
            </div>
          </div>
        )
      
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
        )
      
      case 'News/Social':
        return <NewsSocialFeed />
      
      case 'Admin':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-800">Admin Portal</h2>
            <div className="bg-white p-6 rounded-lg shadow-md border">
              <h3 className="text-xl font-semibold mb-4">VoxPro Management Tool</h3>
              <p className="text-gray-600 mb-6">
                Administrative access for media upload, assignment, and system management.
              </p>
            </div>
            
            <VoxProManagement />
          </div>
        )
      
      default:
        return <div>Page not found</div>
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-blue-600">
                History of Idaho Broadcasting Foundation
              </h1>
              <img 
                src="/microphone-logo.png" 
                alt="Broadcasting Microphone Logo" 
                className="w-8 h-8 object-contain"
                style={{ filter: 'brightness(0)' }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto">
            {navigationTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-2 whitespace-nowrap text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2025 History of Idaho Broadcasting Foundation. All rights reserved.</p>
            <p className="mt-2 text-sm">Preserving Idaho's broadcasting heritage for future generations.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
