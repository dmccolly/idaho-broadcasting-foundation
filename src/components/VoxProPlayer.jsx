import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const VoxProPlayer = () => {
  // State management
  const [connectionStatus, setConnectionStatus] = useState('connecting');
  const [statusMessage, setStatusMessage] = useState('Connecting to Supabase...');
  const [assignments, setAssignments] = useState([]);
  const [currentMedia, setCurrentMedia] = useState(null);
  const [mediaViewers, setMediaViewers] = useState([]); // Array to handle multiple open viewers
  const [hoveredKey, setHoveredKey] = useState(null);

  // Initialize Supabase connection
  useEffect(() => {
    const initializeConnection = async () => {
      try {
        // Test Supabase connection
        const { data, error } = await supabase
          .from('assignments')
          .select('*')
          .limit(1);

        if (error) {
          console.error('Supabase connection error:', error);
          setConnectionStatus('disconnected');
          setStatusMessage('Failed to connect to Supabase');
          return;
        }

        // Connection successful
        setConnectionStatus('connected');
        setStatusMessage('Connected to Supabase');
        
        // Load current assignments
        loadAssignments();

      } catch (error) {
        console.error('Connection initialization error:', error);
        setConnectionStatus('disconnected');
        setStatusMessage('Connection failed');
      }
    };

    initializeConnection();
  }, []);

  // Load assignments from Supabase
  const loadAssignments = async () => {
    try {
      const { data, error } = await supabase
        .from('assignments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading assignments:', error);
        return;
      }

      setAssignments(data || []);
    } catch (error) {
      console.error('Error in loadAssignments:', error);
    }
  };

  // Handle key click to open media viewer
  const handleKeyClick = async (keySlot) => {
    try {
      // Find assignment for this key
      const assignment = assignments.find(a => a.key_slot === keySlot);
      
      if (!assignment) {
        console.log(`No media assigned to key ${keySlot}`);
        return;
      }

      console.log('Playing media:', assignment);
      
      // Set current media for display
      setCurrentMedia(assignment);
      
      // Open media viewer window
      openMediaViewer(assignment);
      
    } catch (error) {
      console.error('Error playing media:', error);
    }
  };

  // Open media viewer window
  const openMediaViewer = (assignment) => {
    const viewerId = `viewer_${assignment.key_slot}_${Date.now()}`;
    
    const newViewer = {
      id: viewerId,
      assignment: assignment,
      position: getNextViewerPosition(),
      isMinimized: false
    };
    
    setMediaViewers(prev => [...prev, newViewer]);
  };

  // Get position for next viewer window (lower right area)
  const getNextViewerPosition = () => {
    const baseRight = 20;
    const baseBottom = 20;
    const offset = mediaViewers.length * 30;
    
    return {
      right: baseRight + offset,
      bottom: baseBottom + offset
    };
  };

  // Close media viewer
  const closeMediaViewer = (viewerId) => {
    setMediaViewers(prev => prev.filter(viewer => viewer.id !== viewerId));
  };

  // Minimize/maximize viewer
  const toggleViewerMinimize = (viewerId) => {
    setMediaViewers(prev => 
      prev.map(viewer => 
        viewer.id === viewerId 
          ? { ...viewer, isMinimized: !viewer.isMinimized }
          : viewer
      )
    );
  };

  // Get file type from URL or filename
  const getFileType = (url, filename) => {
    if (!url && !filename) return 'unknown';
    
    const fileStr = url || filename || '';
    const extension = fileStr.split('.').pop().toLowerCase();
    
    // Video types
    if (['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm'].includes(extension)) {
      return 'video';
    }
    
    // Audio types
    if (['mp3', 'wav', 'ogg', 'aac', 'm4a', 'flac'].includes(extension)) {
      return 'audio';
    }
    
    // Image types
    if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp'].includes(extension)) {
      return 'image';
    }
    
    // Document types
    if (['pdf', 'doc', 'docx', 'txt', 'rtf', 'odt'].includes(extension)) {
      return 'document';
    }
    
    return 'unknown';
  };

  // Render media content based on type
  const renderMediaContent = (assignment) => {
    const fileType = getFileType(assignment.media_url, assignment.media_file_name);
    
    switch (fileType) {
      case 'video':
        return (
          <video 
            controls 
            className="w-full h-64 bg-black rounded shadow-inner"
            src={assignment.media_url}
            poster=""
          >
            Your browser does not support video playback.
          </video>
        );
        
      case 'audio':
        return (
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-lg shadow-lg">
            <div className="text-center mb-6">
              <div className="text-6xl mb-3 animate-pulse">🎵</div>
              <div className="text-white font-bold text-lg">{assignment.title}</div>
              <div className="text-gray-300 text-sm mt-1">Audio Playback</div>
            </div>
            <audio 
              controls 
              className="w-full h-12 rounded-lg"
              src={assignment.media_url}
            >
              Your browser does not support audio playback.
            </audio>
          </div>
        );
        
      case 'image':
        return (
          <div className="text-center bg-gray-50 p-4 rounded-lg">
            <img 
              src={assignment.media_url}
              alt={assignment.title}
              className="max-w-full max-h-64 object-contain rounded-lg shadow-md mx-auto"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'block';
              }}
            />
            <div className="hidden text-gray-400 p-8">
              <div className="text-6xl mb-3">🖼️</div>
              <div className="font-medium">Image could not be loaded</div>
              <div className="text-sm mt-1">Check file URL or format</div>
            </div>
          </div>
        );
        
      case 'document':
        return (
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg text-center">
            <div className="text-6xl mb-4">📄</div>
            <div className="text-gray-800 font-bold text-lg mb-2">{assignment.title}</div>
            <div className="text-gray-600 text-sm mb-4">Document Viewer</div>
            <a 
              href={assignment.media_url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg inline-block transition-colors shadow-md hover:shadow-lg"
            >
              📖 Open Document
            </a>
          </div>
        );
        
      default:
        return (
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-lg text-center">
            <div className="text-6xl mb-4">📁</div>
            <div className="text-gray-800 font-bold text-lg mb-2">{assignment.title}</div>
            <div className="text-gray-600 text-sm mb-4">File Viewer</div>
            <a 
              href={assignment.media_url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-600 hover:bg-gray-700 text-white font-medium px-6 py-3 rounded-lg inline-block transition-colors shadow-md hover:shadow-lg"
            >
              🔗 Open File
            </a>
          </div>
        );
    }
  };

  // Handle key hover for title display
  const handleKeyHover = (keySlot) => {
    const assignment = assignments.find(a => a.key_slot === keySlot);
    setHoveredKey(assignment);
  };

  // Get connection status color
  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return 'text-green-400';
      case 'connecting': return 'text-yellow-400';
      case 'disconnected': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  // Get connection status indicator
  const getStatusIndicator = () => {
    switch (connectionStatus) {
      case 'connected': return '🟢';
      case 'connecting': return '🟡';
      case 'disconnected': return '🔴';
      default: return '⚪';
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6 relative">
      {/* Enhanced Header with Gradient */}
      <div className="bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 text-white p-6 rounded-t-xl shadow-lg">
        <h2 className="text-3xl font-bold text-center text-green-400 mb-2">VoxPro Media Player</h2>
        <p className="text-center text-gray-300 text-lg">Professional Broadcasting Control System</p>
        <div className="w-24 h-1 bg-green-400 mx-auto mt-3 rounded-full"></div>
      </div>

      {/* Main Interface with Enhanced Styling */}
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-8 rounded-b-xl shadow-2xl">
        {/* Status Header with Better Spacing */}
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-green-400 mb-3">VoxPro Media Interface</h3>
          <p className="text-gray-300 text-lg mb-4">Professional Control System</p>
          <div className={`flex items-center justify-center gap-3 ${getStatusColor()} bg-gray-800 rounded-full px-6 py-3 inline-flex shadow-lg`}>
            <span className="text-xl">{getStatusIndicator()}</span>
            <span className="font-medium">{statusMessage}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Enhanced Control Interface */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-700 p-6 rounded-xl shadow-xl border border-gray-600">
            <h4 className="text-xl font-bold text-green-400 mb-6 text-center">Control Interface</h4>
            
            <div className="text-center mb-6 bg-gray-900 p-4 rounded-lg">
              <h5 className="text-white font-bold text-lg">VoxPro</h5>
              <p className="text-gray-400">Media Control System</p>
            </div>

            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white text-center py-3 px-6 rounded-lg mb-6 font-bold shadow-lg">
              Ready - Select Media to Play
            </div>

            {/* Enhanced START Keys (1-5) with Better Spacing */}
            <div className="grid grid-cols-5 gap-3 mb-6">
              {[1, 2, 3, 4, 5].map(num => {
                const assignment = assignments.find(a => a.key_slot === num.toString());
                return (
                  <button
                    key={num}
                    onClick={() => handleKeyClick(num.toString())}
                    onMouseEnter={() => handleKeyHover(num.toString())}
                    onMouseLeave={() => setHoveredKey(null)}
                    className={`
                      h-14 rounded-lg font-bold text-white border-2 flex items-center justify-center
                      transition-all duration-300 hover:scale-110 transform shadow-lg
                      ${assignment 
                        ? 'bg-gradient-to-br from-red-500 to-red-700 border-red-400 hover:from-red-400 hover:to-red-600 cursor-pointer shadow-red-500/25' 
                        : 'bg-gradient-to-br from-red-800 to-red-900 border-red-700 opacity-50 cursor-not-allowed'
                      }
                    `}
                    title={assignment?.title || `START ${num}`}
                    disabled={!assignment}
                  >
                    <span className="text-lg font-black">{num}</span>
                  </button>
                );
              })}
            </div>

            {/* Enhanced Media Keys with Improved Layout */}
            <div className="grid grid-cols-3 gap-3 mb-3">
              {['A', 'B', 'DUP'].map(key => {
                const assignment = assignments.find(a => a.key_slot === key);
                return (
                  <button
                    key={key}
                    onClick={() => handleKeyClick(key)}
                    onMouseEnter={() => handleKeyHover(key)}
                    onMouseLeave={() => setHoveredKey(null)}
                    className={`
                      h-14 rounded-lg font-bold text-white border-2 flex items-center justify-center
                      transition-all duration-300 hover:scale-110 transform shadow-lg
                      ${assignment 
                        ? 'bg-gradient-to-br from-purple-500 to-purple-700 border-purple-400 hover:from-purple-400 hover:to-purple-600 cursor-pointer shadow-purple-500/25' 
                        : 'bg-gradient-to-br from-purple-800 to-purple-900 border-purple-700 opacity-50 cursor-not-allowed'
                      }
                    `}
                    title={assignment?.title || key}
                    disabled={!assignment}
                  >
                    <span className="text-sm font-black">{key}</span>
                  </button>
                );
              })}
            </div>

            <div className="grid grid-cols-3 gap-3 mb-3">
              {[
                { key: 'C', color: 'teal' },
                { key: 'D', color: 'red' },
                { key: 'CUE', color: 'blue' }
              ].map(({ key, color }) => {
                const assignment = assignments.find(a => a.key_slot === key);
                return (
                  <button
                    key={key}
                    onClick={() => handleKeyClick(key)}
                    onMouseEnter={() => handleKeyHover(key)}
                    onMouseLeave={() => setHoveredKey(null)}
                    className={`
                      h-14 rounded-lg font-bold text-white border-2 flex items-center justify-center
                      transition-all duration-300 hover:scale-110 transform shadow-lg
                      ${assignment 
                        ? `bg-gradient-to-br from-${color}-500 to-${color}-700 border-${color}-400 hover:from-${color}-400 hover:to-${color}-600 cursor-pointer shadow-${color}-500/25` 
                        : `bg-gradient-to-br from-${color}-800 to-${color}-900 border-${color}-700 opacity-50 cursor-not-allowed`
                      }
                    `}
                    title={assignment?.title || key}
                    disabled={!assignment}
                  >
                    <span className="text-sm font-black">{key}</span>
                  </button>
                );
              })}
            </div>

            <div className="grid grid-cols-3 gap-3 mb-4">
              {[
                { key: 'E', color: 'red' },
                { key: 'F', color: 'green' },
                { key: 'REC', color: 'blue' }
              ].map(({ key, color }) => {
                const assignment = assignments.find(a => a.key_slot === key);
                return (
                  <button
                    key={key}
                    onClick={() => handleKeyClick(key)}
                    onMouseEnter={() => handleKeyHover(key)}
                    onMouseLeave={() => setHoveredKey(null)}
                    className={`
                      h-14 rounded-lg font-bold text-white border-2 flex items-center justify-center
                      transition-all duration-300 hover:scale-110 transform shadow-lg
                      ${assignment 
                        ? `bg-gradient-to-br from-${color}-500 to-${color}-700 border-${color}-400 hover:from-${color}-400 hover:to-${color}-600 cursor-pointer shadow-${color}-500/25` 
                        : `bg-gradient-to-br from-${color}-800 to-${color}-900 border-${color}-700 opacity-50 cursor-not-allowed`
                      }
                    `}
                    title={assignment?.title || key}
                    disabled={!assignment}
                  >
                    <span className="text-sm font-black">{key}</span>
                  </button>
                );
              })}
            </div>

            {/* G Key - Special Styling */}
            <div className="flex justify-center mb-6">
              {(() => {
                const assignment = assignments.find(a => a.key_slot === 'G');
                return (
                  <button
                    onClick={() => handleKeyClick('G')}
                    onMouseEnter={() => handleKeyHover('G')}
                    onMouseLeave={() => setHoveredKey(null)}
                    className={`
                      h-14 w-24 rounded-lg font-bold text-white border-2 flex items-center justify-center
                      transition-all duration-300 hover:scale-110 transform shadow-lg
                      ${assignment 
                        ? 'bg-gradient-to-br from-yellow-500 to-yellow-700 border-yellow-400 hover:from-yellow-400 hover:to-yellow-600 cursor-pointer shadow-yellow-500/25' 
                        : 'bg-gradient-to-br from-yellow-800 to-yellow-900 border-yellow-700 opacity-50 cursor-not-allowed'
                      }
                    `}
                    title={assignment?.title || 'G'}
                    disabled={!assignment}
                  >
                    <span className="text-lg font-black">G</span>
                  </button>
                );
              })()}
            </div>

            {/* Enhanced Status Indicator */}
            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-full border-4 border-green-400 flex items-center justify-center bg-gray-900 shadow-lg shadow-green-400/25">
                <div className="w-3 h-10 bg-green-400 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Enhanced Current Media Display */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-700 p-6 rounded-xl shadow-xl border border-gray-600">
            <h4 className="text-xl font-bold text-green-400 mb-6 text-center">Current Media</h4>
            
            <div className="bg-black rounded-xl p-6 mb-6 min-h-64 flex items-center justify-center shadow-inner border border-gray-700">
              {hoveredKey ? (
                <div className="text-center animate-fade-in">
                  <div className="text-green-400 font-bold text-xl mb-3">{hoveredKey.title}</div>
                  <div className="text-gray-300 text-base mb-2">{hoveredKey.description}</div>
                  <div className="text-xs text-gray-500 bg-gray-800 rounded-full px-3 py-1 inline-block">
                    Key: {hoveredKey.key_slot}
                  </div>
                </div>
              ) : currentMedia ? (
                <div className="text-center animate-fade-in">
                  <div className="text-green-400 font-bold text-xl mb-3">{currentMedia.title}</div>
                  <div className="text-gray-300 text-base mb-3">{currentMedia.description}</div>
                  <div className="text-xs text-gray-500 space-x-2">
                    <span className="bg-gray-800 rounded-full px-3 py-1">Key: {currentMedia.key_slot}</span>
                    <span className="bg-gray-800 rounded-full px-3 py-1">By: {currentMedia.submitted_by}</span>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-400">
                  <div className="text-6xl mb-4 animate-pulse">📺</div>
                  <div className="text-xl font-medium mb-2">No Media Selected</div>
                  <div className="text-sm">Select a key to load media</div>
                </div>
              )}
            </div>

            {/* Enhanced Status Information */}
            <div className="bg-gray-900 rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400 font-medium">Media Server:</span>
                <span className="text-green-400 font-bold flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  Connected
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 font-medium">Player Status:</span>
                <span className="text-blue-400 font-bold">Ready</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 font-medium">Audio Level:</span>
                <span className="text-green-400 font-bold">Normal</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Media Viewer Windows */}
      {mediaViewers.map(viewer => (
        <div
          key={viewer.id}
          className="fixed bg-white rounded-xl shadow-2xl border border-gray-300 z-50 overflow-hidden"
          style={{
            right: `${viewer.position.right}px`,
            bottom: `${viewer.position.bottom}px`,
            width: viewer.isMinimized ? '320px' : '450px',
            maxHeight: viewer.isMinimized ? '70px' : '600px'
          }}
        >
          {/* Enhanced Window Header */}
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white p-3 flex justify-between items-center">
            <div className="font-bold truncate flex items-center gap-2">
              <span className="text-green-400">🎬</span>
              {viewer.assignment.title} (Key {viewer.assignment.key_slot})
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => toggleViewerMinimize(viewer.id)}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-md text-sm font-bold transition-colors"
              >
                {viewer.isMinimized ? '□' : '_'}
              </button>
              <button
                onClick={() => closeMediaViewer(viewer.id)}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm font-bold transition-colors"
              >
                ×
              </button>
            </div>
          </div>

          {/* Enhanced Window Content */}
          {!viewer.isMinimized && (
            <div className="p-6">
              {/* Media Content */}
              <div className="mb-6">
                {renderMediaContent(viewer.assignment)}
              </div>

              {/* Enhanced Media Information */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-lg border">
                <div className="font-bold text-gray-800 text-lg mb-2">{viewer.assignment.title}</div>
                {viewer.assignment.description && (
                  <div className="text-gray-600 mb-3 leading-relaxed">{viewer.assignment.description}</div>
                )}
                <div className="text-xs text-gray-500 space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">Submitted by:</span>
                    <span>{viewer.assignment.submitted_by}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Key:</span>
                    <span className="bg-gray-800 text-white px-2 py-1 rounded">{viewer.assignment.key_slot}</span>
                  </div>
                  {viewer.assignment.media_file_name && (
                    <div className="flex justify-between">
                      <span className="font-medium">File:</span>
                      <span className="truncate ml-2">{viewer.assignment.media_file_name}</span>
                    </div>
                  )}
                  {viewer.assignment.created_at && (
                    <div className="flex justify-between">
                      <span className="font-medium">Added:</span>
                      <span>{new Date(viewer.assignment.created_at).toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default VoxProPlayer;

