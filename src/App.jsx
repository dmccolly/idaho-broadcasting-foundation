import React, { useState, useEffect, useRef } from 'react';

// --- Helper Functions & Mock/Placeholder Data ---

// Since we cannot import from external files, we'll create a mock Supabase client.
// In a real project, you would use your actual Supabase client instance.
const supabase = {
  from: () => ({
    select: () => ({
      limit: () => Promise.resolve({ data: [], error: null }),
      order: () => Promise.resolve({ data: [
          {id: 1, key_slot: '1', title: 'Morning Drive Intro', description: 'Upbeat music for show start.', submitted_by: 'Admin', created_at: '2025-06-28T10:00:00Z', media_url: '#', media_type: 'audio/mp3'},
          {id: 2, key_slot: '2', title: 'Weather Jingle', description: 'Official station weather jingle.', submitted_by: 'Admin', created_at: '2025-06-28T10:05:00Z', media_url: '#', media_type: 'audio/mp3'},
          {id: 3, key_slot: '3', title: 'Station ID - Rock', description: 'High-energy station identification.', submitted_by: 'Admin', created_at: '2025-06-28T10:10:00Z', media_url: '#', media_type: 'audio/mp3'},
      ], error: null }),
      update: () => ({
        eq: () => Promise.resolve({ error: null })
      }),
      insert: () => Promise.resolve({ error: null })
    })
  }),
  storage: {
    from: () => ({
      upload: () => Promise.resolve({ error: null }),
      getPublicUrl: () => ({ data: { publicUrl: '#' } })
    })
  }
};


// --- Placeholder Components ---
// These are created to resolve the import errors. Replace them with your actual components.

const RadioPage = () => (
  <div className="bg-white p-6 rounded-lg shadow-md border">
    <h2 className="text-2xl font-bold text-gray-800">Radio Page</h2>
    <p className="text-gray-600 mt-2">Content for the Radio page goes here.</p>
  </div>
);

const NewsSocialFeed = () => (
  <div className="bg-white p-6 rounded-lg shadow-md border">
    <h2 className="text-2xl font-bold text-gray-800">News & Social Feed</h2>
    <p className="text-gray-600 mt-2">Content for the News & Social Feed page goes here.</p>
  </div>
);

const VoxProManagement = () => (
  <div className="bg-white p-6 rounded-lg shadow-md border">
    <h2 className="text-2xl font-bold text-gray-800">VoxPro Management</h2>
    <p className="text-gray-600 mt-2">Content for the VoxPro Management page goes here.</p>
  </div>
);

// A simple, locally-defined Button to replace the one from a UI library.
const Button = ({ children, onClick, className, size = 'md' }) => {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };
  return (
    <button
      onClick={onClick}
      className={`font-semibold text-white rounded-md shadow-sm transition-colors ${sizeClasses[size]} ${className}`}
    >
      {children}
    </button>
  );
};


// --- VoxProPlayer Component and its dependencies are now inside this file ---

const UniversalMediaPlayer = ({ assignment, onClose, onMinimize, isMinimized, windowId }) => {
    // This is a collapsed version of the UniversalMediaPlayer from previous steps.
    // For this demonstration, we'll just show the minimized state.
    if (isMinimized) {
        return (
            <div className="fixed bottom-4 right-4 bg-gray-800 border border-gray-600 rounded-lg p-2 shadow-lg z-50 animate-pulse">
                <div className="flex items-center justify-between min-w-48">
                    <span className="text-white text-sm truncate">{assignment?.title || 'Media Player'}</span>
                    <div className="flex gap-1 ml-2 window-controls">
                        <button onClick={() => onMinimize(windowId, false)} className="text-gray-400 hover:text-white p-1" title="Restore">⬜</button>
                        <button onClick={() => onClose(windowId)} className="text-gray-400 hover:text-red-400 p-1" title="Close">✕</button>
                    </div>
                </div>
            </div>
        );
    }
    // A full implementation would render the draggable, resizable window here when not minimized.
    return null; 
};

const VoxProPlayer = () => {
    const [connectionStatus, setConnectionStatus] = useState('connecting');
    const [statusMessage, setStatusMessage] = useState('Connecting to Supabase...');
    const [assignments, setAssignments] = useState([]);
    const [activeWindows, setActiveWindows] = useState([]);
    const [windowCounter, setWindowCounter] = useState(0);
    const [currentPlayingKey, setCurrentPlayingKey] = useState(null);

    useEffect(() => {
        const initializeConnection = async () => {
            try {
                const { error } = await supabase.from('assignments').select('*').limit(1);
                if (error) throw error;
                setConnectionStatus('connected');
                setStatusMessage('Connected to Supabase');
                loadAssignments();
            } catch (err) {
                setConnectionStatus('error');
                setStatusMessage('Connection error');
            }
        };
        initializeConnection();
    }, []);

    const loadAssignments = async () => {
        const { data, error } = await supabase.from('assignments').select('*').order('created_at', { ascending: false });
        if (error) console.error('Error loading assignments:', error);
        else setAssignments(data || []);
    };

    const getKeyAssignment = (keySlot) => assignments.find(a => a.key_slot === keySlot);

    const handleKeyClick = async (keySlot) => {
        const assignment = getKeyAssignment(keySlot);
        if (!assignment) return;
        if (currentPlayingKey === keySlot) {
            setCurrentPlayingKey(null);
            setActiveWindows(prev => prev.filter(w => w.assignment.key_slot !== keySlot));
            return;
        }
        if (currentPlayingKey) {
            setActiveWindows(prev => prev.filter(w => w.assignment.key_slot !== currentPlayingKey));
        }
        setCurrentPlayingKey(keySlot);
        const newWindow = { id: windowCounter, assignment, isMinimized: false };
        setActiveWindows([newWindow]);
        setWindowCounter(prev => prev + 1);
    };

    const closeWindow = (windowId) => {
        const windowToClose = activeWindows.find(w => w.id === windowId);
        if (windowToClose && currentPlayingKey === windowToClose.assignment.key_slot) {
            setCurrentPlayingKey(null);
        }
        setActiveWindows(prev => prev.filter(w => w.id !== windowId));
    };

    const minimizeWindow = (windowId, minimize) => {
        setActiveWindows(prev => prev.map(w => w.id === windowId ? { ...w, isMinimized: minimize } : w));
    };

    return (
        <>
            {/* The GUI is now a self-contained unit. */}
            <div className="bg-gray-900 text-white rounded-lg border border-gray-700 p-4 h-full flex flex-col space-y-4 shadow-2xl">
                
                {/* Player Controls Section */}
                <div className="bg-gray-800 rounded-lg p-4 shadow-xl border border-gray-600">
                    <div className="text-center mb-4">
                        <h3 className="text-xl font-bold text-green-400">VoxPro Media Player</h3>
                        <p className="text-gray-400 text-xs">Broadcasting Control System</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <div className="grid grid-cols-3 gap-2">
                                {[1, 2, 3].map((key) => {
                                    const assignment = getKeyAssignment(key.toString());
                                    const isPlaying = currentPlayingKey === key.toString();
                                    return <button key={key} onClick={() => handleKeyClick(key.toString())} className={`h-16 rounded-lg font-bold text-white text-lg transition-all transform hover:scale-105 ${isPlaying ? 'bg-gradient-to-b from-green-500 to-green-700' : assignment ? 'bg-gradient-to-b from-red-500 to-red-700' : 'bg-gradient-to-b from-gray-600 to-gray-800'} border-2 border-gray-500 shadow-md`} title={assignment ? assignment.title : `Key ${key} - No Assignment`}>{isPlaying ? 'STOP' : key}</button>;
                                })}
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                {[4, 5].map((key) => {
                                    const assignment = getKeyAssignment(key.toString());
                                    const isPlaying = currentPlayingKey === key.toString();
                                    return <button key={key} onClick={() => handleKeyClick(key.toString())} className={`h-16 rounded-lg font-bold text-white text-lg transition-all transform hover:scale-105 ${isPlaying ? 'bg-gradient-to-b from-green-500 to-green-700' : assignment ? 'bg-gradient-to-b from-red-500 to-red-700' : 'bg-gradient-to-b from-gray-600 to-gray-800'} border-2 border-gray-500 shadow-md`} title={assignment ? assignment.title : `Key ${key} - No Assignment`}>{isPlaying ? 'STOP' : key}</button>;
                                })}
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <button className="h-10 bg-gradient-to-b from-gray-600 to-gray-800 rounded border-2 border-gray-500 font-bold text-white text-sm">A</button>
                            <button className="h-10 bg-gradient-to-b from-gray-600 to-gray-800 rounded border-2 border-gray-500 font-bold text-white text-sm">B</button>
                            <button className="h-10 bg-gradient-to-b from-gray-600 to-gray-800 rounded border-2 border-gray-500 font-bold text-white text-sm">C</button>
                            <button className="h-10 bg-gradient-to-b from-gray-600 to-gray-800 rounded border-2 border-gray-500 font-bold text-white text-sm">D</button>
                            <button className="h-10 bg-gradient-to-b from-blue-600 to-blue-800 rounded border-2 border-gray-500 font-bold text-white text-xs">DUP</button>
                            <button className="h-10 bg-gradient-to-b from-yellow-600 to-yellow-800 rounded border-2 border-gray-500 font-bold text-white text-xs">CUE</button>
                            <button className="h-10 bg-gradient-to-b from-red-600 to-red-800 rounded border-2 border-gray-500 font-bold text-white text-xs">REC</button>
                            <div className="h-10 bg-gradient-to-b from-gray-700 to-gray-900 rounded border-2 border-gray-500 flex items-center justify-center"><div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"><div className="w-1.5 h-1.5 bg-white rounded-full"></div></div></div>
                        </div>
                    </div>
                     <div className="mt-4 text-center">
                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium mb-2 ${connectionStatus === 'connected' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
                            <div className={`w-1.5 h-1.5 rounded-full mr-2 ${connectionStatus === 'connected' ? 'bg-green-300' : 'bg-red-300'} animate-pulse`}></div>{statusMessage}
                        </div>
                    </div>
                </div>
                
                {/* Key Assignments Section */}
                <div className="bg-gray-800 rounded-lg p-4 flex-1 flex flex-col min-h-0 border border-gray-600">
                    <h3 className="text-green-400 font-semibold text-lg mb-3 flex-shrink-0">Current Key Assignments</h3>
                    <div className="overflow-y-auto flex-1">
                        <div className="grid grid-cols-1 gap-3">
                            {[...assignments].sort((a, b) => parseInt(a.key_slot) - parseInt(b.key_slot)).map((assignment) => (
                                <div key={assignment.id} className="bg-gray-700 rounded p-3 border border-gray-600">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className={`text-sm font-bold ${currentPlayingKey === assignment.key_slot ? 'text-green-400' : 'text-red-400'}`}>Key {assignment.key_slot} {currentPlayingKey === assignment.key_slot ? '(Playing)' : ''}</span>
                                        <span className="text-xs text-gray-400">{assignment.media_type}</span>
                                    </div>
                                    <h4 className="text-white font-medium mb-1 text-sm">{assignment.title}</h4>
                                    <p className="text-gray-400 text-xs mb-2 line-clamp-2">{assignment.description}</p>
                                    <div className="text-xs text-gray-500">By: {assignment.submitted_by} | {new Date(assignment.created_at).toLocaleDateString()}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            {activeWindows.map((window) => (
                <UniversalMediaPlayer key={window.id} assignment={window.assignment} onClose={closeWindow} onMinimize={minimizeWindow} isMinimized={window.isMinimized} windowId={window.id} />
            ))}
        </>
    );
};


// --- Main App Component ---

function App() {
  const [activeTab, setActiveTab] = useState('The Back Corner')

  const navigationTabs = [ 'HOME', 'Radio', 'Television', 'Events', 'The Back Corner', 'Gallery', 'About/Contact', 'News/Social', 'Admin' ];

  const renderContent = () => {
    switch(activeTab) {
      case 'HOME':
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-800 mb-4">History of Idaho Broadcasting Foundation</h1>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">Preserving and celebrating the rich heritage of radio and television broadcasting in Idaho. Our foundation is dedicated to documenting the stories, people, and technology that shaped Idaho's broadcasting landscape.</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md border"><h3 className="text-xl font-semibold mb-3 text-gray-800">Radio Heritage</h3><p className="text-gray-600">Explore the evolution of radio broadcasting in Idaho, from the early AM stations to modern digital broadcasting.</p></div>
              <div className="bg-white p-6 rounded-lg shadow-md border"><h3 className="text-xl font-semibold mb-3 text-gray-800">Television History</h3><p className="text-gray-600">Discover the development of television in Idaho, including pioneering stations and technological milestones.</p></div>
              <div className="bg-white p-6 rounded-lg shadow-md border"><h3 className="text-xl font-semibold mb-3 text-gray-800">Broadcasting Pioneers</h3><p className="text-gray-600">Learn about the visionaries and professionals who built Idaho's broadcasting industry from the ground up.</p></div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Featured Systems</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2 text-blue-800">VoxPro Player</h4>
                  <p className="text-blue-600 text-sm mb-3">Compact media player for broadcasting</p>
                  <Button onClick={() => setActiveTab('The Back Corner')} className="bg-blue-600 hover:bg-blue-700" size="sm">Access Player</Button>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2 text-green-800">News & Social Hub</h4>
                  <p className="text-green-600 text-sm mb-3">Stay connected with the broadcasting community</p>
                  <Button onClick={() => setActiveTab('News/Social')} className="bg-green-600 hover:bg-green-700" size="sm">View Feed</Button>
                </div>
              </div>
            </div>
          </div>
        );
      case 'Radio': return <RadioPage />;
      case 'Television':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-800">Television Broadcasting in Idaho</h2>
            <div className="bg-white p-6 rounded-lg shadow-md border"><h3 className="text-xl font-semibold mb-4">Television Milestones</h3><p className="text-gray-600 mb-4">Television came to Idaho in the 1950s, transforming how Idahoans received news and entertainment, and connecting the state to national programming.</p><ul className="list-disc list-inside text-gray-600 space-y-2"><li>First television stations in Idaho</li><li>Transition from black and white to color</li><li>Local news and programming development</li><li>Digital television transition</li></ul></div>
          </div>
        );
      case 'Events':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-800">Foundation Events</h2>
            <div className="bg-white p-6 rounded-lg shadow-md border"><h3 className="text-xl font-semibold mb-4">Upcoming Events</h3><p className="text-gray-600 mb-4">Join us for events celebrating Idaho's broadcasting heritage and connecting industry professionals past and present.</p><div className="space-y-4"><div className="border-l-4 border-blue-500 pl-4"><h4 className="font-semibold">Larry Lomax Memorial Tribute Luncheon</h4><p className="text-gray-600">June 27th, 2025 - Honoring legendary radio personality "The Emperor"</p><p className="text-sm text-gray-500 mt-2">RSVP: 208-853-7756 or KIBF@Q.com</p></div><div className="border-l-4 border-green-500 pl-4"><h4 className="font-semibold">Annual Broadcasting Heritage Dinner</h4><p className="text-gray-600">Celebrating Idaho broadcasting pioneers</p></div></div></div>
          </div>
        );
      case 'The Back Corner':
        return (
            <div>
                {/* Page Header */}
                <div className="text-center mb-8">
                    <h2 className="text-4xl font-bold text-gray-800">The Back Corner</h2>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto mt-2">An interactive media player experience, showcasing curated audio and video from our archives.</p>
                </div>

                {/* Two-Column Layout */}
                <div className="grid lg:grid-cols-3 gap-8 items-start">
                
                    {/* Left Column: Text Content on White Background */}
                    <div className="lg:col-span-2 bg-white p-8 rounded-lg shadow-md border">
                        <h3 className="text-2xl font-bold text-gray-800 mb-4">About the Media Player</h3>
                        <div className="text-gray-700 leading-relaxed space-y-4">
                            <p>This is a placeholder for the text content you will provide later. This area can contain detailed descriptions, history, or any other information you'd like to feature alongside the media player.</p>
                            <p>The layout is set up so that this text content will occupy the left two-thirds of the page, while the interactive player and its key assignments are neatly organized in the column to the right.</p>
                            <p>You can use this space to explain the history of the VoxPro system, tell stories about the content assigned to the keys, or provide instructions on how to use the player.</p>
                        </div>
                    </div>

                    {/* Right Column: GUI Player */}
                    <div className="lg:col-span-1">
                        <VoxProPlayer />
                    </div>
                </div>
            </div>
        );
      case 'Gallery':
        return (
          <div className="space-y-8">
            <div className="text-center bg-gradient-to-r from-blue-50 to-gray-50 p-8 rounded-lg"><h2 className="text-4xl font-bold text-gray-800 mb-4">Video Gallery</h2><p className="text-xl text-gray-600 max-w-4xl mx-auto">In our ongoing effort to visually preserve Idaho's fascinating radio and television past, the History of Idaho Broadcasting Foundation has conducted more than 75 video interviews with media legends and personalities throughout the state who have generously shared anecdotal insights into their careers.</p></div>
            <div>
              <h3 className="text-3xl font-bold text-gray-800 mb-6 text-center">Broadcasting Legend Interviews</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">{/* Video items would go here */}</div>
            </div>
          </div>
        );
      case 'About/Contact':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-800">About the Foundation</h2>
            <div className="bg-white p-6 rounded-lg shadow-md border"><h3 className="text-xl font-semibold mb-4">Our Mission</h3><p className="text-gray-600 mb-4">The History of Idaho Broadcasting Foundation is dedicated to preserving, documenting, and sharing the rich heritage of radio and television broadcasting in Idaho.</p><h3 className="text-xl font-semibold mb-4 mt-6">Contact Information</h3><div className="space-y-2 text-gray-600"><p><strong>Address:</strong> Idaho Broadcasting Foundation</p><p><strong>Email:</strong> info@idahobroadcasting.org</p><p><strong>Phone:</strong> (208) 555-0123</p></div></div>
          </div>
        );
      case 'News/Social': return <NewsSocialFeed />;
      case 'Admin': return <VoxProManagement />;
      default: return <div>Page not found</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-blue-600">History of Idaho Broadcasting Foundation</h1>
              <img src="/microphone-logo.png" alt="Broadcasting Microphone Logo" className="w-8 h-8 object-contain" style={{ filter: 'brightness(0)' }} onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/32x32/000000/FFFFFF?text=Logo' }}/>
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
            <p className="mt-2 text-sm">Preserving Idaho's broadcasting heritage for future generations.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
