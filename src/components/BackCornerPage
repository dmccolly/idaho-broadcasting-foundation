import { useState, useEffect, useRef } from 'react';

// Mock Supabase for demo - replace with your actual supabase import
import { supabase } from '../lib/supabase';
  from: () => ({
    select: () => ({
      limit: () => Promise.resolve({ data: [], error: null }),
      order: () => Promise.resolve({ 
        data: [
          { id: 1, key_slot: '1', title: 'Morning Show Intro', description: 'Daily morning show opening music and jingle', media_type: 'audio', media_url: '/audio/intro.mp3', submitted_by: 'Producer', created_at: '2024-06-28' },
          { id: 2, key_slot: '2', title: 'News Transition', description: 'Smooth transition music for news segments', media_type: 'audio', media_url: '/audio/news.mp3', submitted_by: 'Editor', created_at: '2024-06-28' },
          { id: 3, key_slot: '3', title: 'Weather Report', description: 'Background music for weather forecasts', media_type: 'audio', media_url: '/audio/weather.mp3', submitted_by: 'Meteorologist', created_at: '2024-06-27' },
          { id: 4, key_slot: '4', title: 'Commercial Break', description: 'Standard commercial break transition', media_type: 'audio', media_url: '/audio/commercial.mp3', submitted_by: 'Producer', created_at: '2024-06-27' },
          { id: 5, key_slot: '5', title: 'Sports Update', description: 'Energetic sports segment opener', media_type: 'audio', media_url: '/audio/sports.mp3', submitted_by: 'Sports Desk', created_at: '2024-06-26' }
        ], 
        error: null 
      })
    })
  }),
  channel: () => ({
    on: () => ({ subscribe: () => {} }),
  }),
  removeChannel: () => {}
};

// Enhanced Universal Media Player Component - CONTENT GROWS WITH WINDOW
const UniversalMediaPlayer = ({ assignment, onClose, onMinimize, isMinimized, windowId }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mediaType, setMediaType] = useState(null);
  const [windowSize, setWindowSize] = useState({
    width: assignment?.media_url?.match(/\.(pdf)$/i) ? 900 : 800,
    height: assignment?.media_url?.match(/\.(pdf)$/i) ? 700 : 600
  });
  const [windowPosition, setWindowPosition] = useState({ x: window.innerWidth - 820, y: window.innerHeight - 620 });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isMaximized, setIsMaximized] = useState(false);
  const [previousSize, setPreviousSize] = useState(null);

  // Audio state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  const playerRef = useRef(null);
  const windowRef = useRef(null);
  const visualizationRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    if (assignment?.media_url) {
      detectMediaType(assignment.media_url);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [assignment]);

  const detectMediaType = (url) => {
    const extension = url.split('.').pop().toLowerCase();

    if (['mp4', 'webm', 'ogg', 'mov', 'avi'].includes(extension)) {
      setMediaType('video');
    } else if (['mp3', 'wav', 'ogg', 'aac', 'm4a'].includes(extension)) {
      setMediaType('audio');
      createAudioVisualization();
    } else if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension)) {
      setMediaType('image');
    } else if (['pdf', 'doc', 'docx', 'txt'].includes(extension)) {
      setMediaType('document');
    } else {
      setMediaType('unknown');
    }
    setIsLoading(false);
  };

  // Create green audio visualization bars
  const createAudioVisualization = () => {
    setTimeout(() => {
      if (!visualizationRef.current) return;

      visualizationRef.current.innerHTML = '';

      // Create container for animated bars
      const container = document.createElement('div');
      container.className = 'flex items-end justify-center h-16 gap-1 bg-gray-900 rounded p-2';

      // Create 60 green animated bars
      for (let i = 0; i < 60; i++) {
        const bar = document.createElement('div');
        bar.className = 'bg-green-500 rounded-t transition-all duration-150';
        bar.style.width = '2px';
        bar.style.height = '4px';
        bar.style.opacity = '0.7';
        container.appendChild(bar);
      }

      visualizationRef.current.appendChild(container);
    }, 100);
  };

  // Animate visualization when playing
  const startVisualization = () => {
    if (!visualizationRef.current) return;

    const bars = visualizationRef.current.querySelectorAll('div > div');

    const animate = () => {
      if (!isPlaying) return;

      bars.forEach((bar, index) => {
        // Create wave animation
        const wave = Math.sin((Date.now() * 0.01) + (index * 0.2)) * 25 + 15;
        const randomHeight = Math.random() * 20 + 10;
        const finalHeight = Math.max(4, wave + randomHeight);

        bar.style.height = `${finalHeight}px`;
        bar.style.opacity = Math.random() * 0.5 + 0.5;
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();
  };

  // Audio/Video event handlers
  const handleLoadedData = () => {
    const mediaElement = playerRef.current;
    if (mediaElement) {
      setDuration(mediaElement.duration);
      setIsLoading(false);
    }
  };

  const handleTimeUpdate = () => {
    const mediaElement = playerRef.current;
    if (mediaElement) {
      setCurrentTime(mediaElement.currentTime);
    }
  };

  const handlePlay = () => {
    setIsPlaying(true);
    if (mediaType === 'audio') {
      startVisualization();
    }
  };

  const handlePause = () => {
    setIsPlaying(false);
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  };

  const handleError = (e) => {
    setError(`${mediaType} playback error: ${e.target.error?.message || 'Unknown error'}`);
    setIsLoading(false);
    setIsPlaying(false);
  };

  // Media controls
  const togglePlayPause = () => {
    const mediaElement = playerRef.current;
    if (!mediaElement) return;

    if (isPlaying) {
      mediaElement.pause();
    } else {
      mediaElement.play().catch(error => {
        setError(`Play failed: ${error.message}`);
      });
    }
  };

  const handleSeek = (e) => {
    const mediaElement = playerRef.current;
    if (!mediaElement) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const newTime = percentage * duration;

    mediaElement.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);

    const mediaElement = playerRef.current;
    if (mediaElement) {
      mediaElement.volume = newVolume;
    }
  };

  const toggleMute = () => {
    const mediaElement = playerRef.current;
    if (!mediaElement) return;

    const newMuted = !isMuted;
    setIsMuted(newMuted);
    mediaElement.muted = newMuted;
  };

  // Format time helper
  const formatTime = (seconds) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Window dragging
  const handleMouseDown = (e) => {
    if (e.target.closest('.window-controls') || e.target.closest('.resize-handle')) return;

    setIsDragging(true);
    setDragStart({
      x: e.clientX - windowPosition.x,
      y: e.clientY - windowPosition.y
    });
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      setWindowPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
  };

  // Window resizing
  const handleResizeStart = (e) => {
    e.stopPropagation();
    setIsResizing(true);
    setDragStart({
      x: e.clientX,
      y: e.clientY,
      width: windowSize.width,
      height: windowSize.height
    });
  };

  const handleResizeMove = (e) => {
    if (isResizing) {
      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;

      setWindowSize({
        width: Math.max(400, dragStart.width + deltaX),
        height: Math.max(300, dragStart.height + deltaY)
      });
    }
  };

  // Window maximize/restore
  const toggleMaximize = () => {
    if (isMaximized) {
      // Restore
      setWindowSize(previousSize.size);
      setWindowPosition(previousSize.position);
      setIsMaximized(false);
    } else {
      // Maximize
      setPreviousSize({
        size: windowSize,
        position: windowPosition
      });
      setWindowSize({
        width: window.innerWidth - 40,
        height: window.innerHeight - 40
      });
      setWindowPosition({ x: 20, y: 20 });
      setIsMaximized(true);
    }
  };

  // Add event listeners
  useEffect(() => {
    if (isDragging || isResizing) {
      const moveHandler = isDragging ? handleMouseMove : handleResizeMove;
      document.addEventListener('mousemove', moveHandler);
      document.addEventListener('mouseup', handleMouseUp);

      return () => {
        document.removeEventListener('mousemove', moveHandler);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isResizing, dragStart]);

  const renderMediaContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-full bg-gray-800 rounded">
          <div className="text-green-400">Loading media...</div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex items-center justify-center h-full bg-gray-800 rounded text-red-400">
          Error loading media: {error}
        </div>
      );
    }

    switch (mediaType) {
      case 'video':
        return (
          <video
            ref={playerRef}
            controls
            className="w-full h-full bg-black rounded object-contain"
            onLoadedData={handleLoadedData}
            onTimeUpdate={handleTimeUpdate}
            onPlay={handlePlay}
            onPause={handlePause}
            onEnded={handleEnded}
            onError={handleError}
            preload="metadata"
          >
            <source src={assignment.media_url} />
            Your browser does not support the video tag.
          </video>
        );

      case 'audio':
        return (
          <div className="bg-gray-800 rounded p-4 h-full flex flex-col">
            {/* Hidden HTML5 Audio Element */}
            <audio
              ref={playerRef}
              onLoadedData={handleLoadedData}
              onTimeUpdate={handleTimeUpdate}
              onPlay={handlePlay}
              onPause={handlePause}
              onEnded={handleEnded}
              onError={handleError}
              preload="metadata"
            >
              <source src={assignment.media_url} />
              Your browser does not support the audio tag.
            </audio>

            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="text-green-400 text-6xl mb-4">🎵</div>

              {/* Green Visualization Bars - Grows with window */}
              <div
                ref={visualizationRef}
                className="w-full flex-1 max-h-32 mb-4"
              />
            </div>

            {/* Audio Controls - Fixed at bottom */}
            <div className="bg-gray-900 rounded p-3 mt-auto">
              <div className="flex items-center gap-4 mb-3">
                <button
                  onClick={togglePlayPause}
                  className="text-2xl hover:text-green-400 transition-colors"
                  disabled={!duration}
                >
                  {isPlaying ? '⏸️' : '▶️'}
                </button>

                <div className="text-sm text-gray-400">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </div>

                <div className="flex items-center gap-2 ml-auto">
                  <button
                    onClick={toggleMute}
                    className="text-lg hover:text-yellow-400 transition-colors"
                  >
                    {isMuted ? '🔇' : '🔊'}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="w-20"
                  />
                </div>
              </div>

              {/* Progress Bar */}
              <div
                className="w-full h-2 bg-gray-700 rounded-full cursor-pointer overflow-hidden"
                onClick={handleSeek}
              >
                <div
                  className="h-full bg-green-500 transition-all duration-100"
                  style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>
        );

      case 'image':
        return (
          <div className="bg-gray-800 rounded p-2 h-full flex items-center justify-center">
            <img
              src={assignment.media_url}
              alt={assignment.title}
              className="max-w-full max-h-full object-contain rounded"
              onError={() => setError('Failed to load image')}
            />
          </div>
        );

      case 'document':
        return (
          <div className="h-full w-full">
            <iframe
              src={assignment.media_url}
              className="w-full h-full border-0 rounded"
              title={assignment.title}
            />
          </div>
        );

      default:
        return (
          <div className="bg-gray-800 rounded p-6 h-full flex flex-col items-center justify-center">
            <div className="text-gray-400 text-6xl mb-4">📎</div>
            <div className="text-white text-center mb-4">
              <div className="font-semibold">{assignment.title}</div>
              <div className="text-sm text-gray-400">Unknown File Type</div>
            </div>
            <button
              onClick={() => window.open(assignment.media_url, '_blank')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
            >
              Download File
            </button>
          </div>
        );
    }
  };

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 bg-gray-800 border border-gray-600 rounded-lg p-2 shadow-lg z-50">
        <div className="flex items-center justify-between min-w-48">
          <span className="text-white text-sm truncate">{assignment?.title || 'Media Player'}</span>
          <div className="flex gap-1 ml-2 window-controls">
            <button
              onClick={() => onMinimize(false)}
              className="text-gray-400 hover:text-white p-1"
              title="Restore"
            >
              ⬜
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-red-400 p-1"
              title="Close"
            >
              ✕
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={windowRef}
      className="fixed bg-gray-900 border border-gray-600 rounded-lg shadow-2xl z-40 overflow-hidden select-none"
      style={{
        left: windowPosition.x,
        top: windowPosition.y,
        width: windowSize.width,
        height: windowSize.height,
        cursor: isDragging ? 'grabbing' : 'default'
      }}
      onMouseDown={handleMouseDown}
    >
      {/* Window Title Bar */}
      <div className="bg-gray-800 px-4 py-2 flex items-center justify-between border-b border-gray-600 cursor-grab">
        <div className="flex items-center gap-2">
          <div className="text-green-400">▶</div>
          <span className="text-white font-medium">Universal Player - {assignment?.title}</span>
        </div>
        <div className="flex gap-2 window-controls">
          <button
            onClick={() => onMinimize(true)}
            className="text-gray-400 hover:text-white px-2 py-1 rounded"
            title="Minimize"
          >
            −
          </button>
          <button
            onClick={toggleMaximize}
            className="text-gray-400 hover:text-white px-2 py-1 rounded"
            title={isMaximized ? "Restore" : "Maximize"}
          >
            {isMaximized ? "⧉" : "⬜"}
          </button>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-red-400 px-2 py-1 rounded"
            title="Close"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Content Area - GROWS WITH WINDOW */}
      <div className="flex h-full overflow-hidden" style={{ height: `calc(${windowSize.height}px - 40px)` }}>
        {/* Media Player Section - GROWS */}
        <div className="flex-1 p-4 overflow-hidden flex flex-col">
          <div className="mb-2 flex-shrink-0">
            <h3 className="text-white font-semibold text-lg">{assignment?.title || 'No Title'}</h3>
            <p className="text-gray-400 text-sm">Key: {assignment?.key_slot} | Type: {mediaType || 'Unknown'}</p>
          </div>

          {/* Media Content - TAKES REMAINING SPACE */}
          <div className="flex-1 overflow-hidden">
            {renderMediaContent()}
          </div>
        </div>

        {/* Description Panel */}
        <div className="w-80 bg-gray-800 border-l border-gray-600 p-4 overflow-auto flex-shrink-0">
          <h4 className="text-green-400 font-semibold mb-3">Media Description</h4>
          <div className="text-gray-300 text-sm leading-relaxed">
            {assignment?.description || 'No description available for this media file.'}
          </div>

          {/* Additional Info */}
          <div className="mt-4 pt-4 border-t border-gray-700">
            <div className="text-xs text-gray-500 space-y-1">
              <div><strong>Submitted by:</strong> {assignment?.submitted_by || 'Unknown'}</div>
              <div><strong>Created:</strong> {assignment?.created_at ? new Date(assignment.created_at).toLocaleDateString() : 'Unknown'}</div>
              <div><strong>File Type:</strong> {assignment?.media_type || 'Auto-detected'}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Resize Handle */}
      <div
        className="absolute bottom-0 right-0 w-4 h-4 bg-gray-600 cursor-se-resize resize-handle"
        onMouseDown={handleResizeStart}
        title="Resize window"
      >
        <div className="absolute bottom-1 right-1 w-2 h-2 border-r-2 border-b-2 border-gray-400"></div>
      </div>
    </div>
  );
};

// VOXPRO PLAYER WIDGET FOR TOP-RIGHT
const VoxProPlayerWidget = ({ onKeyClick, currentPlayingKey, assignments, connectionStatus, statusMessage, setStatusMessage }) => {
  const getKeyAssignment = (keySlot) => {
    return assignments.find(a => a.key_slot === keySlot);
  };

  return (
    <div className="bg-gray-900 rounded-lg p-4 shadow-xl border border-gray-700">
      {/* VoxPro Header */}
      <div className="text-center mb-4">
        <h3 className="text-lg font-bold text-green-400 mb-1">VoxPro Media Player</h3>
        <p className="text-gray-400 text-xs">Professional Broadcasting Control</p>

        {/* Connection Status */}
        <div className="mt-2">
          <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
            connectionStatus === 'connected'
              ? 'bg-green-600 text-white'
              : 'bg-red-600 text-white'
          }`}>
            <div className={`w-1.5 h-1.5 rounded-full mr-2 ${
              connectionStatus === 'connected' ? 'bg-green-300' : 'bg-red-300'
            } ${connectionStatus === 'connected' ? 'animate-pulse' : ''}`}></div>
            {statusMessage}
          </div>
        </div>
      </div>

      {/* START Keys */}
      <div className="grid grid-cols-5 gap-2">
        {[1, 2, 3, 4, 5].map((key) => {
          const assignment = getKeyAssignment(key.toString());
          const isPlaying = currentPlayingKey === key.toString();

          return (
            <button
              key={key}
              onClick={() => onKeyClick(key.toString())}
              onMouseEnter={() => {
                if (assignment) {
                  setStatusMessage(`Key ${key}: ${assignment.title}`);
                }
              }}
              onMouseLeave={() => {
                setStatusMessage(connectionStatus === 'connected' ? 'Connected to Supabase' : 'Failed to connect to Supabase');
              }}
              className={`
                w-14 h-14 rounded-lg font-bold text-white text-base
                transition-all duration-200 transform hover:scale-105
                flex items-center justify-center
                ${isPlaying
                  ? 'bg-gradient-to-b from-green-500 to-green-700 hover:from-green-400 hover:to-green-600 shadow-lg ring-2 ring-green-300'
                  : assignment
                  ? 'bg-gradient-to-b from-red-500 to-red-700 hover:from-red-400 hover:to-red-600 shadow-lg'
                  : 'bg-gradient-to-b from-gray-600 to-gray-800 hover:from-gray-500 hover:to-gray-700 cursor-not-allowed'
                }
                border-2 border-gray-500 shadow-md
              `}
              title={assignment ? assignment.title : `Key ${key} - No Assignment`}
              disabled={!assignment && !isPlaying}
            >
              {isPlaying ? 'STOP' : key}
            </button>
          );
        })}
      </div>
    </div>
  );
};

// CONDENSED KEY ASSIGNMENTS WIDGET 
const KeyAssignmentsWidget = ({ assignments, currentPlayingKey }) => {
  return (
    <div className="bg-gray-900 rounded-lg p-3 border border-gray-700 shadow-xl">
      <h3 className="text-green-400 font-semibold text-base mb-3 text-center">Current Key Assignments</h3>
      <div className="space-y-1.5">
        {assignments.map((assignment) => (
          <div key={assignment.id} className="bg-gray-800 rounded p-2 border border-gray-600">
            <div className="flex items-center justify-between">
              <span className={`text-xs font-bold ${
                currentPlayingKey === assignment.key_slot ? 'text-green-400' : 'text-red-400'
              }`}>
                Key {assignment.key_slot}
              </span>
              <span className="text-xs text-gray-400">{assignment.media_type}</span>
            </div>
            <h4 className="text-white font-medium text-xs truncate mt-1">{assignment.title}</h4>
            <p className="text-gray-400 text-xs truncate">{assignment.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// MAIN BACK CORNER PAGE COMPONENT
const BackCornerPage = () => {
  // State management
  const [connectionStatus, setConnectionStatus] = useState('connecting');
  const [statusMessage, setStatusMessage] = useState('Connecting to Supabase...');
  const [assignments, setAssignments] = useState([]);
  const [activeWindows, setActiveWindows] = useState([]);
  const [windowCounter, setWindowCounter] = useState(0);
  const [currentPlayingKey, setCurrentPlayingKey] = useState(null);

  // Initialize Supabase connection
  useEffect(() => {
    const initializeConnection = async () => {
      try {
        const { error } = await mockSupabase
          .from('assignments')
          .select('*')
          .limit(1);

        if (error) {
          throw error;
        }

        setConnectionStatus('connected');
        setStatusMessage('Connected to Supabase');
        loadAssignments();

        const subscription = mockSupabase
          .channel('public:assignments')
          .on('postgres_changes', { event: '*', schema: 'public', table: 'assignments' }, payload => {
            console.log('Change received!', payload);
            loadAssignments();
          })
          .subscribe();
        
        return () => {
          mockSupabase.removeChannel(subscription);
        };

      } catch (err) {
        console.error('Supabase connection error:', err);
        setConnectionStatus('disconnected');
        setStatusMessage('Failed to connect to Supabase');
      }
    };

    initializeConnection();
  }, []);

  const loadAssignments = async () => {
    try {
      const { data, error } = await mockSupabase
        .from('assignments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading assignments:', error);
        return;
      }

      setAssignments(data || []);
    } catch (err) {
      console.error('Error in loadAssignments:', err);
    }
  };

  const getKeyAssignment = (keySlot) => {
    return assignments.find(a => a.key_slot === keySlot);
  };

  const handleKeyClick = async (keySlot) => {
    const assignment = getKeyAssignment(keySlot);

    if (!assignment) {
      console.log(`No assignment found for key ${keySlot}`);
      return;
    }

    // If this key is currently playing, stop it and close its window
    if (currentPlayingKey === keySlot) {
      setCurrentPlayingKey(null);
      setActiveWindows(prev => prev.filter(w => w.assignment.key_slot !== keySlot));
      return;
    }

    // Stop any other currently playing key and close its window
    if (currentPlayingKey) {
      setActiveWindows(prev => prev.filter(w => w.assignment.key_slot !== currentPlayingKey));
    }

    // Start playing this key
    setCurrentPlayingKey(keySlot);

    // Create a new window, replacing any existing ones
    const newWindow = {
      id: windowCounter,
      assignment,
      isMinimized: false
    };

    setActiveWindows([newWindow]);
    setWindowCounter(prev => prev + 1);
  };

  const closeWindow = (windowId) => {
    const windowToClose = activeWindows.find(w => w.id === windowId);
    if (windowToClose && windowToClose.assignment.key_slot === currentPlayingKey) {
      setCurrentPlayingKey(null);
    }
    setActiveWindows(prev => prev.filter(w => w.id !== windowId));
  };

  const minimizeWindow = (windowId, minimize) => {
    setActiveWindows(prev =>
      prev.map(w =>
        w.id === windowId
          ? { ...w, isMinimized: minimize }
          : w
      )
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex gap-6">
          
          {/* LEFT COLUMN - MAIN ARTICLE CONTENT */}
          <div className="flex-1">
            <div className="bg-white">
              
              <h1 className="text-3xl font-bold text-gray-800 mb-6">The Back Corner</h1>
              
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Welcome to The Back Corner, where we share behind-the-scenes stories, technical insights, 
                  and community highlights from our broadcasting studio. This is your normal article space 
                  where you can add any content - blog posts, news updates, photo galleries, or documentation.
                </p>

                <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Latest Stories</h2>
                
                <article className="mb-8 pb-6 border-b border-gray-200">
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Behind the Microphone: A Day in the Life</h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    Ever wondered what happens when the "ON AIR" light goes off? Join us for an exclusive look behind 
                    the scenes of our daily broadcasting operations, from early morning prep to late-night sign-off.
                  </p>
                  <div className="flex items-center text-sm text-gray-500">
                    <span>📅 June 28, 2025</span>
                    <span className="mx-2">•</span>
                    <span>👤 Radio Team</span>
                  </div>
                </article>

                <article className="mb-8 pb-6 border-b border-gray-200">
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Technical Spotlight: VoxPro Broadcasting System</h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    Our state-of-the-art VoxPro media control system enables seamless live broadcasting with 
                    professional-grade audio management. The compact interface you see on this page represents 
                    just a fraction of the system's capabilities.
                  </p>
                  <div className="flex items-center text-sm text-gray-500">
                    <span>📅 June 27, 2025</span>
                    <span className="mx-2">•</span>
                    <span>👤 Engineering Team</span>
                  </div>
                </article>

                <article>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Community Voices: Listener Stories</h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    From heartwarming thank-you messages to exciting contest wins, discover the amazing stories 
                    from our listening community. These are the moments that make broadcasting truly special.
                  </p>
                  <div className="flex items-center text-sm text-gray-500">
                    <span>📅 June 26, 2025</span>
                    <span className="mx-2">•</span>
                    <span>👤 Community Team</span>
                  </div>
                </article>

                <div className="bg-gray-50 rounded-lg p-6 mt-8">
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">📝 Add Your Content Here</h4>
                  <p className="text-gray-600">
                    This space functions like any other article page on your site. Replace this content 
                    with your actual articles, news, or any other containers you need.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN - VOXPRO WIDGETS STACKED */}
          <div className="w-72 flex flex-col gap-4">
            
            {/* VOXPRO PLAYER WIDGET (TOP) */}
            <VoxProPlayerWidget
              onKeyClick={handleKeyClick}
              currentPlayingKey={currentPlayingKey}
              assignments={assignments}
              connectionStatus={connectionStatus}
              statusMessage={statusMessage}
              setStatusMessage={setStatusMessage}
            />

            {/* KEY ASSIGNMENTS WIDGET (BOTTOM) */}
            <KeyAssignmentsWidget
              assignments={assignments}
              currentPlayingKey={currentPlayingKey}
            />
            
          </div>
        </div>
      </div>

      {/* Enhanced Floating Windows */}
      {activeWindows.map((window) => (
        <UniversalMediaPlayer
          key={window.id}
          assignment={window.assignment}
          onClose={() => closeWindow(window.id)}
          onMinimize={(minimize) => minimizeWindow(window.id, minimize)}
          isMinimized={window.isMinimized}
          windowId={window.id}
        />
      ))}
    </div>
  );
};

export default BackCornerPage;
