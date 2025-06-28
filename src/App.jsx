import React, { useState, useEffect, useRef } from 'react';

// --- Helper Functions, Mock Data, and All Components are now in this file ---

// Mock Supabase Client to prevent import errors
const supabase = {
  from: () => ({
    select: () => ({
      limit: () => Promise.resolve({ data: [], error: null }),
      order: () => Promise.resolve({ data: [
          {id: 1, key_slot: '1', title: 'Morning Drive Intro', description: 'Upbeat music for show start.', submitted_by: 'Admin', created_at: '2025-06-28T10:00:00Z', media_url: '#', media_type: 'audio/mp3'},
          {id: 2, key_slot: '2', title: 'Weather Jingle', description: 'Official station weather jingle.', submitted_by: 'Admin', created_at: '2025-06-28T10:05:00Z', media_url: '#', media_type: 'audio/mp3'},
          {id: 3, key_slot: '3', title: 'Station ID - Rock', description: 'High-energy station identification.', submitted_by: 'Admin', created_at: '2025-06-28T10:10:00Z', media_url: '#', media_type: 'audio/mp3'},
          {id: 4, key_slot: '4', title: 'Promo: Summer Concert', description: 'Promotional spot for the summer concert series.', submitted_by: 'Admin', created_at: '2025-06-28T10:15:00Z', media_url: '#', media_type: 'audio/mp3'},
      ], error: null }),
    })
  })
};

// --- Player Component Definitions ---

const UniversalMediaPlayer = ({ assignment, onClose, onMinimize, isMinimized, windowId }) => {
    // This is a placeholder for the full UniversalMediaPlayer component.
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
            <div className="bg-gray-900 text-white rounded-lg border border-gray-700 p-4 h-full flex flex-col space-y-4 shadow-2xl">
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
                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${connectionStatus === 'connected' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
                            <div className={`w-1.5 h-1.5 rounded-full mr-2 ${connectionStatus === 'connected' ? 'bg-green-300' : 'bg-red-300'} animate-pulse`}></div>{statusMessage}
                        </div>
                    </div>
                </div>
                <div className="bg-gray-800 rounded-lg p-4 flex-1 flex flex-col min-h-0 border border-gray-600">
                    <h3 className="text-green-400 font-semibold text-lg mb-3 flex-shrink-0">Current Key Assignments</h3>
                    <div className="overflow-y-auto flex-1">
                        <div className="grid grid-cols-1 gap-3">
                            {[...assignments]
                                .sort((a, b) => parseInt(a.key_slot) - parseInt(b.key_slot))
                                .map((assignment) => (
                                <div key={assignment.id} className="bg-gray-700 rounded p-3 border border-gray-600">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className={`text-sm font-bold ${currentPlayingKey === assignment.key_slot ? 'text-green-400' : 'text-red-400'}`}>
                                            Key {assignment.key_slot} {currentPlayingKey === assignment.key_slot ? '(Playing)' : ''}
                                        </span>
                                        <span className="text-xs text-gray-400">{assignment.media_type}</span>
                                    </div>
                                    <h4 className="text-white font-medium mb-1 text-sm">{assignment.title}</h4>
                                    <p className="text-gray-400 text-xs mb-2 line-clamp-2">{assignment.description}</p>
                                    <div className="text-xs text-gray-500">
                                        By: {assignment.submitted_by} | {new Date(assignment.created_at).toLocaleDateString()}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            {activeWindows.map((window) => (
                <UniversalMediaPlayer
                    key={window.id}
                    assignment={window.assignment}
                    onClose={closeWindow}
                    onMinimize={minimizeWindow}
                    isMinimized={window.isMinimized}
                    windowId={window.id}
                />
            ))}
        </>
    );
};


// --- Placeholder Page Components ---
const RadioPage = () => <div className="p-4 bg-white rounded shadow">Radio Page Content</div>;
const NewsSocialFeed = () => <div className="p-4 bg-white rounded shadow">News & Social Feed Content</div>;
const VoxProManagement = () => <div className="p-4 bg-white rounded shadow">VoxPro Management Content</div>;
const Button = ({ children, onClick, className, size = 'md' }) => (
    <button onClick={onClick} className={`font-semibold text-white rounded-md shadow-sm transition-colors px-4 py-2 text-sm ${className}`}>
      {children}
    </button>
);

// --- Main App Component ---
function App() {
  const [activeTab, setActiveTab] = useState('The Back Corner');

  const navigationTabs = [
    'HOME', 'Radio', 'Television', 'Events', 'The Back Corner', 
    'Gallery', 'About/Contact', 'News/Social', 'Admin'
  ];

  const renderContent = () => {
    switch (activeTab) {
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
                  <p>
                    This is a placeholder for the text content you will provide later. This area can contain detailed descriptions, history, or any other information you'd like to feature alongside the media player.
                  </p>
                  <p>
                    The layout is set up so that this text content will occupy the left two-thirds of the page, while the interactive player and its key assignments are neatly organized in the column to the right.
                  </p>
                  <p>
                    You can use this space to explain the history of the VoxPro system, tell stories about the content assigned to the keys, or provide instructions on how to use the player.
                  </p>
                </div>
              </div>
              <div className="lg:col-span-1">
                <VoxProPlayer />
              </div>
            </div>
          </div>
        );
      
      // --- Other Cases (Shortened for brevity) ---
      case 'HOME': return <div>Home Page Content</div>;
      case 'Radio': return <RadioPage />;
      case 'Television': return <div>Television Page Content</div>;
      case 'Events': return <div>Events Page Content</div>;
      case 'Gallery': return <div>Gallery Page Content</div>;
      case 'About/Contact': return <div>About/Contact Page Content</div>;
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
