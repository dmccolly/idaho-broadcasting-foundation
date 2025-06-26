import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';

// Enhanced Universal Media Player Component with resize/drag capabilities
const UniversalMediaPlayer = ({ assignment, onClose, onMinimize, isMinimized, windowId }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mediaType, setMediaType] = useState(null);
  const [windowSize, setWindowSize] = useState({ width: 800, height: 600 });
  const [windowPosition, setWindowPosition] = useState({ x: window.innerWidth - 820, y: window.innerHeight - 620 });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isMaximized, setIsMaximized] = useState(false);
  const [previousSize, setPreviousSize] = useState(null);
  
  const playerRef = useRef(null);
  const canvasRef = useRef(null);
  const windowRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyzerRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    if (assignment?.media_url) {
      detectMediaType(assignment.media_url);
    }
  }, [assignment]);

  const detectMediaType = (url) => {
    const extension = url.split('.').pop().toLowerCase();
    
    if (['mp4', 'webm', 'ogg', 'mov', 'avi'].includes(extension)) {
      setMediaType('video');
    } else if (['mp3', 'wav', 'ogg', 'aac', 'm4a'].includes(extension)) {
      setMediaType('audio');
    } else if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension)) {
      setMediaType('image');
    } else if (['pdf', 'doc', 'docx', 'txt'].includes(extension)) {
      setMediaType('document');
    } else {
      setMediaType('unknown');
    }
    setIsLoading(false);
  };

  // Audio visualization setup
  const setupAudioVisualization = (audioElement) => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      analyzerRef.current = audioContextRef.current.createAnalyser();
      analyzerRef.current.fftSize = 256;
    }

    const source = audioContextRef.current.createMediaElementSource(audioElement);
    source.connect(analyzerRef.current);
    analyzerRef.current.connect(audioContextRef.current.destination);

    startVisualization();
  };

  const startVisualization = () => {
    if (!canvasRef.current || !analyzerRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const bufferLength = analyzerRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      analyzerRef.current.getByteFrequencyData(dataArray);

      ctx.fillStyle = 'rgb(20, 20, 30)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const barWidth = (canvas.width / bufferLength) * 2.5;
      let barHeight;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        barHeight = (dataArray[i] / 255) * canvas.height * 0.8;

        const r = barHeight + 25 * (i / bufferLength);
        const g = 250 * (i / bufferLength);
        const b = 50;

        ctx.fillStyle = `rgb(${r},${g},${b})`;
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

        x += barWidth + 1;
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();
  };

  const stopVisualization = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
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
      document.addEventListener('mousemove', isDragging ? handleMouseMove : handleResizeMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', isDragging ? handleMouseMove : handleResizeMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isResizing, dragStart, windowPosition, windowSize]);

  const renderMediaContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-64 bg-gray-800 rounded">
          <div className="text-green-400">Loading media...</div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex items-center justify-center h-64 bg-gray-800 rounded text-red-400">
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
            className="w-full h-64 bg-black rounded"
            onError={() => setError('Failed to load video')}
          >
            <source src={assignment.media_url} />
            Your browser does not support the video tag.
          </video>
        );

      case 'audio':
        return (
          <div className="bg-gray-800 rounded p-4">
            <div className="flex items-center justify-center h-32 mb-4">
              <div className="text-green-400 text-6xl">🎵</div>
            </div>
            <audio
              ref={playerRef}
              controls
              className="w-full mb-2"
              onPlay={(e) => setupAudioVisualization(e.target)}
              onPause={stopVisualization}
              onEnded={stopVisualization}
              onError={() => setError('Failed to load audio')}
            >
              <source src={assignment.media_url} />
              Your browser does not support the audio tag.
            </audio>
            <canvas 
              ref={canvasRef}
              width="300" 
              height="80" 
              className="w-full h-16 bg-gray-900 rounded border"
            />
          </div>
        );

      case 'image':
        return (
          <div className="bg-gray-800 rounded p-2">
            <img
              src={assignment.media_url}
              alt={assignment.title}
              className="w-full h-64 object-contain rounded"
              onError={() => setError('Failed to load image')}
            />
          </div>
        );

      case 'document':
        return (
          <div className="bg-gray-800 rounded p-6 h-64 flex flex-col items-center justify-center">
            <div className="text-yellow-400 text-6xl mb-4">📄</div>
            <div className="text-white text-center mb-4">
              <div className="font-semibold">{assignment.title}</div>
              <div className="text-sm text-gray-400">Document File</div>
            </div>
            <button
              onClick={() => window.open(assignment.media_url, '_blank')}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors"
            >
              Open Document
            </button>
          </div>
        );

      default:
        return (
          <div className="bg-gray-800 rounded p-6 h-64 flex flex-col items-center justify-center">
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

      {/* Content Area */}
      <div className="flex h-full overflow-hidden" style={{ height: windowSize.height - 40 }}>
        {/* Media Player Section */}
        <div className="flex-1 p-4 overflow-auto">
          <div className="mb-2">
            <h3 className="text-white font-semibold text-lg">{assignment?.title || 'No Title'}</h3>
            <p className="text-gray-400 text-sm">Key: {assignment?.key_slot} | Type: {mediaType || 'Unknown'}</p>
          </div>
          {renderMediaContent()}
        </div>

        {/* Description Panel */}
        <div className="w-80 bg-gray-800 border-l border-gray-600 p-4 overflow-auto">
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

const VoxProPlayer = () => {
  // State management
  const [connectionStatus, setConnectionStatus] = useState('connecting');
  const [statusMessage, setStatusMessage] = useState('Connecting to Supabase...');
  const [assignments, setAssignments] = useState([]);
  const [activeWindows, setActiveWindows] = useState([]);
  const [windowCounter, setWindowCounter] = useState(0);
  const [currentPlayingKey, setCurrentPlayingKey] = useState(null); // Only one key can play at a time

  // Initialize Supabase connection - NO POPUP CODE, SILENT CONNECTION
  useEffect(() => {
    const initializeConnection = async () => {
      try {
        // Silent connection - no user prompts or popups
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

        setConnectionStatus('connected');
        setStatusMessage('Connected to Supabase');
        loadAssignments();
      } catch (err) {
        console.error('Connection initialization error:', err);
        setConnectionStatus('error');
        setStatusMessage('Connection error occurred');
      }
    };

    // Prevent any popup dialogs
    window.addEventListener('beforeunload', (e) => {
      e.preventDefault();
      return undefined;
    });

    initializeConnection();
  }, []);

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

    // If this key is currently playing, stop it
    if (currentPlayingKey === keySlot) {
      setCurrentPlayingKey(null);
      setActiveWindows(prev => prev.filter(w => w.assignment.key_slot !== keySlot));
      return;
    }

    // Stop any currently playing key and close its window
    if (currentPlayingKey) {
      setActiveWindows(prev => prev.filter(w => w.assignment.key_slot !== currentPlayingKey));
    }

    // Start playing this key
    setCurrentPlayingKey(keySlot);

    // Create new window
    const newWindow = {
      id: windowCounter,
      assignment,
      isMinimized: false
    };

    setActiveWindows([newWindow]); // Only one window at a time
    setWindowCounter(prev => prev + 1);
  };

  const closeWindow = (windowId) => {
    const window = activeWindows.find(w => w.id === windowId);
    if (window) {
      // Stop playback for this key
      if (currentPlayingKey === window.assignment.key_slot) {
        setCurrentPlayingKey(null);
      }
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
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-6">
        {/* Compact Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-green-400 mb-1">The Back Corner</h1>
          <h2 className="text-xl text-gray-300 mb-2">VoxPro Media Player</h2>
          <p className="text-gray-400 text-sm">Compact professional media player for broadcasting operations.</p>
        </div>

        {/* Compact Main Control Panel */}
        <div className="max-w-xl mx-auto bg-gray-800 rounded-lg p-6 shadow-2xl border border-gray-600">
          {/* Compact VoxPro Header */}
          <div className="text-center mb-4">
            <h3 className="text-2xl font-bold text-green-400 mb-1">VoxPro Media Player</h3>
            <p className="text-gray-400 text-xs">Professional Broadcasting Control System</p>
            
            {/* Connection Status */}
            <div className="mt-3">
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                connectionStatus === 'connected' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-red-600 text-white'
              }`}>
                <div className={`w-1.5 h-1.5 rounded-full mr-2 ${
                  connectionStatus === 'connected' ? 'bg-green-300' : 'bg-red-300'
                } animate-pulse`}></div>
                {statusMessage}
              </div>
            </div>
          </div>

          {/* Compact START Keys */}
          <div className="mb-4">
            <div className="grid grid-cols-5 gap-2 justify-center">
              {[1, 2, 3, 4, 5].map((key) => {
                const assignment = getKeyAssignment(key.toString());
                const isPlaying = currentPlayingKey === key.toString();
                
                return (
                  <button
                    key={key}
                    onClick={() => handleKeyClick(key.toString())}
                    onMouseEnter={() => {
                      if (assignment) {
                        setStatusMessage(`Key ${key}: ${assignment.title}`);
                      }
                    }}
                    onMouseLeave={() => {
                      setStatusMessage(connectionStatus === 'connected' ? 'Connected to Supabase' : statusMessage);
                    }}
                    className={`
                      w-16 h-16 rounded-lg font-bold text-white text-lg
                      transition-all duration-200 transform hover:scale-105
                      ${isPlaying
                        ? 'bg-gradient-to-b from-green-500 to-green-700 hover:from-green-400 hover:to-green-600 shadow-lg' 
                        : assignment 
                        ? 'bg-gradient-to-b from-red-500 to-red-700 hover:from-red-400 hover:to-red-600 shadow-lg' 
                        : 'bg-gradient-to-b from-gray-600 to-gray-800 hover:from-gray-500 hover:to-gray-700'
                      }
                      border-2 border-gray-500 shadow-md
                    `}
                    title={assignment ? assignment.title : `Key ${key} - No Assignment`}
                  >
                    {isPlaying ? 'STOP' : key}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Compact Control Buttons */}
          <div className="grid grid-cols-4 gap-2 mb-4">
            {/* Row 1 */}
            <button className="w-12 h-10 bg-gradient-to-b from-gray-600 to-gray-800 hover:from-gray-500 hover:to-gray-700 rounded border-2 border-gray-500 font-bold text-white transition-all text-sm">A</button>
            <button className="w-12 h-10 bg-gradient-to-b from-gray-600 to-gray-800 hover:from-gray-500 hover:to-gray-700 rounded border-2 border-gray-500 font-bold text-white transition-all text-sm">B</button>
            <button className="w-12 h-10 bg-gradient-to-b from-gray-600 to-gray-800 hover:from-gray-500 hover:to-gray-700 rounded border-2 border-gray-500 font-bold text-white transition-all text-sm">C</button>
            <button className="w-12 h-10 bg-gradient-to-b from-gray-600 to-gray-800 hover:from-gray-500 hover:to-gray-700 rounded border-2 border-gray-500 font-bold text-white transition-all text-sm">D</button>
            
            {/* Row 2 */}
            <button className="w-12 h-10 bg-gradient-to-b from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700 rounded border-2 border-gray-500 font-bold text-white transition-all text-xs">DUP</button>
            <button className="w-12 h-10 bg-gradient-to-b from-yellow-600 to-yellow-800 hover:from-yellow-500 hover:to-yellow-700 rounded border-2 border-gray-500 font-bold text-white transition-all text-xs">CUE</button>
            <button className="w-12 h-10 bg-gradient-to-b from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 rounded border-2 border-gray-500 font-bold text-white transition-all text-xs">REC</button>
            <div className="w-12 h-10 bg-gradient-to-b from-gray-700 to-gray-900 rounded border-2 border-gray-500 flex items-center justify-center">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Compact Status Display */}
          <div className="text-center">
            <div className="bg-gray-800 px-3 py-1 rounded border border-gray-600">
              <div className="text-green-400 text-xs font-medium">
                {currentPlayingKey ? `Playing: Key ${currentPlayingKey}` : 'Ready'} | 
                Windows: {activeWindows.filter(w => !w.isMinimized).length}
              </div>
            </div>
          </div>
        </div>

        {/* Compact Assignment List */}
        <div className="mt-6 bg-gray-800 rounded-lg p-4 max-w-4xl mx-auto">
          <h3 className="text-green-400 font-semibold text-lg mb-3">Current Key Assignments</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {assignments.map((assignment) => (
              <div key={assignment.id} className="bg-gray-700 rounded p-3 border border-gray-600">
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-sm font-bold ${
                    currentPlayingKey === assignment.key_slot ? 'text-green-400' : 'text-red-400'
                  }`}>
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

export default VoxProPlayer;

