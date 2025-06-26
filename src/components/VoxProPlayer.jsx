import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';

// Universal Media Player Component
const UniversalMediaPlayer = ({ assignment, onClose, onMinimize, isMinimized, windowId }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mediaType, setMediaType] = useState(null);
  const playerRef = useRef(null);
  const canvasRef = useRef(null);
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

  // Start audio visualization animation
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

  // Stop visualization
  const stopVisualization = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  };

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
          <div className="flex gap-1 ml-2">
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
    <div className="fixed bottom-4 right-4 bg-gray-900 border border-gray-600 rounded-lg shadow-2xl z-40 w-[800px] max-h-[600px] overflow-hidden">
      {/* Window Title Bar */}
      <div className="bg-gray-800 px-4 py-2 flex items-center justify-between border-b border-gray-600">
        <div className="flex items-center gap-2">
          <div className="text-green-400">▶</div>
          <span className="text-white font-medium">Universal Player</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onMinimize(true)}
            className="text-gray-400 hover:text-white px-2 py-1 rounded"
            title="Minimize"
          >
            −
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
      <div className="flex h-96">
        {/* Media Player Section */}
        <div className="flex-1 p-4">
          <div className="mb-2">
            <h3 className="text-white font-semibold text-lg">{assignment?.title || 'No Title'}</h3>
            <p className="text-gray-400 text-sm">Key: {assignment?.key_slot} | Type: {mediaType || 'Unknown'}</p>
          </div>
          {renderMediaContent()}
        </div>

        {/* Description Panel */}
        <div className="w-80 bg-gray-800 border-l border-gray-600 p-4">
          <h4 className="text-green-400 font-semibold mb-3">Media Description</h4>
          <div className="text-gray-300 text-sm leading-relaxed max-h-80 overflow-y-auto">
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
  const [playingKeys, setPlayingKeys] = useState(new Set());

  // Initialize Supabase connection - NO POPUP CODE
  useEffect(() => {
    const initializeConnection = async () => {
      try {
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

    // Check if this key is currently playing
    if (playingKeys.has(keySlot)) {
      // Stop playback
      setPlayingKeys(prev => {
        const newSet = new Set(prev);
        newSet.delete(keySlot);
        return newSet;
      });
      
      // Close the window
      setActiveWindows(prev => prev.filter(w => w.assignment.key_slot !== keySlot));
      return;
    }

    // Start playback
    setPlayingKeys(prev => new Set([...prev, keySlot]));

    // Check if window is already open for this assignment
    const existingWindow = activeWindows.find(w => w.assignment.id === assignment.id);
    if (existingWindow) {
      // If minimized, restore it
      if (existingWindow.isMinimized) {
        setActiveWindows(prev => 
          prev.map(w => 
            w.id === existingWindow.id 
              ? { ...w, isMinimized: false }
              : w
          )
        );
      }
      return;
    }

    // Create new window
    const newWindow = {
      id: windowCounter,
      assignment,
      isMinimized: false
    };

    setActiveWindows(prev => [...prev, newWindow]);
    setWindowCounter(prev => prev + 1);
  };

  const closeWindow = (windowId) => {
    const window = activeWindows.find(w => w.id === windowId);
    if (window) {
      // Stop playback for this key
      setPlayingKeys(prev => {
        const newSet = new Set(prev);
        newSet.delete(window.assignment.key_slot);
        return newSet;
      });
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
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-green-400 mb-2">The Back Corner</h1>
          <h2 className="text-2xl text-gray-300 mb-4">VoxPro Media Player</h2>
          <p className="text-gray-400">Compact professional media player for broadcasting operations.</p>
        </div>

        {/* Main Control Panel */}
        <div className="max-w-2xl mx-auto bg-gray-800 rounded-lg p-8 shadow-2xl border border-gray-600">
          {/* VoxPro Header */}
          <div className="text-center mb-6">
            <h3 className="text-3xl font-bold text-green-400 mb-2">VoxPro Media Player</h3>
            <p className="text-gray-400 text-sm">Professional Broadcasting Control System</p>
            
            {/* Connection Status */}
            <div className="mt-4">
              <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                connectionStatus === 'connected' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-red-600 text-white'
              }`}>
                <div className={`w-2 h-2 rounded-full mr-2 ${
                  connectionStatus === 'connected' ? 'bg-green-300' : 'bg-red-300'
                } animate-pulse`}></div>
                {statusMessage}
              </div>
            </div>
          </div>

          {/* START Keys - Using Reference File Styling */}
          <div className="mb-6">
            <div className="grid grid-cols-5 gap-3 justify-center">
              {[1, 2, 3, 4, 5].map((key) => {
                const assignment = getKeyAssignment(key.toString());
                const isPlaying = playingKeys.has(key.toString());
                
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
                      w-20 h-20 rounded-lg font-bold text-white text-xl
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

          {/* Control Buttons - Using Reference File Styling */}
          <div className="grid grid-cols-4 gap-3 mb-6">
            {/* Row 1 */}
            <button className="w-16 h-12 bg-gradient-to-b from-gray-600 to-gray-800 hover:from-gray-500 hover:to-gray-700 rounded border-2 border-gray-500 font-bold text-white transition-all">A</button>
            <button className="w-16 h-12 bg-gradient-to-b from-gray-600 to-gray-800 hover:from-gray-500 hover:to-gray-700 rounded border-2 border-gray-500 font-bold text-white transition-all">B</button>
            <button className="w-16 h-12 bg-gradient-to-b from-gray-600 to-gray-800 hover:from-gray-500 hover:to-gray-700 rounded border-2 border-gray-500 font-bold text-white transition-all">C</button>
            <button className="w-16 h-12 bg-gradient-to-b from-gray-600 to-gray-800 hover:from-gray-500 hover:to-gray-700 rounded border-2 border-gray-500 font-bold text-white transition-all">D</button>
            
            {/* Row 2 */}
            <button className="w-16 h-12 bg-gradient-to-b from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700 rounded border-2 border-gray-500 font-bold text-white transition-all text-xs">DUP</button>
            <button className="w-16 h-12 bg-gradient-to-b from-yellow-600 to-yellow-800 hover:from-yellow-500 hover:to-yellow-700 rounded border-2 border-gray-500 font-bold text-white transition-all text-xs">CUE</button>
            <button className="w-16 h-12 bg-gradient-to-b from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 rounded border-2 border-gray-500 font-bold text-white transition-all text-xs">REC</button>
            <div className="w-16 h-12 bg-gradient-to-b from-gray-700 to-gray-900 rounded border-2 border-gray-500 flex items-center justify-center">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Status Display */}
          <div className="text-center">
            <div className="bg-gray-800 px-4 py-2 rounded border border-gray-600">
              <div className="text-green-400 text-sm font-medium">
                Active Windows: {activeWindows.filter(w => !w.isMinimized).length} | 
                Minimized: {activeWindows.filter(w => w.isMinimized).length}
              </div>
            </div>
          </div>
        </div>

        {/* Assignment List */}
        <div className="mt-8 bg-gray-800 rounded-lg p-6 max-w-6xl mx-auto">
          <h3 className="text-green-400 font-semibold text-lg mb-4">Current Key Assignments</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {assignments.map((assignment) => (
              <div key={assignment.id} className="bg-gray-700 rounded p-4 border border-gray-600">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-green-400 font-bold">Key {assignment.key_slot}</span>
                  <span className="text-xs text-gray-400">{assignment.media_type}</span>
                </div>
                <h4 className="text-white font-medium mb-1">{assignment.title}</h4>
                <p className="text-gray-400 text-sm mb-2 line-clamp-2">{assignment.description}</p>
                <div className="text-xs text-gray-500">
                  By: {assignment.submitted_by} | {new Date(assignment.created_at).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Windows */}
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

