import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';

const VoxProPlayer = () => {
  // State management
  const [connectionStatus, setConnectionStatus] = useState('connecting');
  const [statusMessage, setStatusMessage] = useState('Connecting to Supabase...');
  const [assignments, setAssignments] = useState([]);
  const [mediaViewers, setMediaViewers] = useState([]);
  const [hoveredKey, setHoveredKey] = useState(null);
  const [playingKeys, setPlayingKeys] = useState(new Set());
  
  // Audio visualization refs
  const audioContextRef = useRef(null);
  const analyzerRef = useRef(null);
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

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

      } catch (error) {
        console.error('Connection initialization error:', error);
        setConnectionStatus('disconnected');
        setStatusMessage('Connection initialization failed');
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
      console.error('Error loading assignments:', error);
    }
  };

  // Get assignment for a specific key
  const getAssignmentForKey = (keySlot) => {
    return assignments.find(assignment => assignment.key_slot === keySlot);
  };

  // Handle key click - open media viewer
  const handleKeyClick = (keySlot) => {
    const assignment = getAssignmentForKey(keySlot);
    
    if (!assignment) {
      console.log(`No assignment for key ${keySlot}`);
      return;
    }

    // Check if this key is already playing
    if (playingKeys.has(keySlot)) {
      stopPlayback(keySlot);
      return;
    }

    startPlayback(keySlot, assignment);
  };

  // Start playback for a key
  const startPlayback = (keySlot, assignment) => {
    setPlayingKeys(prev => new Set([...prev, keySlot]));
    
    const newViewer = {
      id: Date.now(),
      keySlot,
      assignment,
      isMinimized: false,
      position: {
        x: window.innerWidth - 520,
        y: 100 + (mediaViewers.length * 30)
      }
    };

    setMediaViewers(prev => [...prev, newViewer]);
  };

  // Stop playback for a key
  const stopPlayback = (keySlot) => {
    setPlayingKeys(prev => {
      const newSet = new Set(prev);
      newSet.delete(keySlot);
      return newSet;
    });

    setMediaViewers(prev => prev.filter(viewer => viewer.keySlot !== keySlot));
  };

  // Close media viewer
  const closeViewer = (viewerId) => {
    const viewer = mediaViewers.find(v => v.id === viewerId);
    if (viewer) {
      stopPlayback(viewer.keySlot);
    }
  };

  // Minimize/restore viewer
  const toggleMinimize = (viewerId) => {
    setMediaViewers(prev => prev.map(viewer => 
      viewer.id === viewerId 
        ? { ...viewer, isMinimized: !viewer.isMinimized }
        : viewer
    ));
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

  // Media content renderer
  const renderMediaContent = (assignment) => {
    const { media_url, media_type, title } = assignment;

    if (media_type?.startsWith('video/')) {
      return (
        <video 
          controls 
          className="w-full h-48 bg-black rounded"
        >
          <source src={media_url} type={media_type} />
          Your browser does not support the video tag.
        </video>
      );
    }

    if (media_type?.startsWith('audio/')) {
      return (
        <div className="w-full">
          <audio 
            controls 
            className="w-full mb-2"
            onPlay={(e) => setupAudioVisualization(e.target)}
            onPause={stopVisualization}
            onEnded={stopVisualization}
          >
            <source src={media_url} type={media_type} />
            Your browser does not support the audio tag.
          </audio>
          <canvas 
            ref={canvasRef}
            width="300" 
            height="100" 
            className="w-full h-20 bg-gray-900 rounded border"
          />
        </div>
      );
    }

    if (media_type?.startsWith('image/')) {
      return (
        <img 
          src={media_url} 
          alt={title}
          className="w-full h-48 object-contain bg-black rounded"
        />
      );
    }

    return (
      <div className="w-full h-48 bg-gray-800 rounded flex flex-col items-center justify-center">
        <div className="text-4xl mb-2">📄</div>
        <div className="text-sm text-gray-300 text-center">
          <div className="font-medium">{title}</div>
          <div className="text-xs mt-1">Click to open document</div>
        </div>
        <a 
          href={media_url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="mt-2 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded transition-colors"
        >
          Open Document
        </a>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">The Back Corner</h1>
        <div className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">VoxPro Media Player</h2>
          <p className="text-gray-600">Professional media player for broadcasting operations.</p>
        </div>
      </div>

      {/* VoxPro Player Interface - PERFECT ORIGINAL SLEEK DESIGN */}
      <div className="max-w-3xl mx-auto">
        <div 
          className="relative bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 rounded-2xl shadow-2xl p-8"
          style={{
            background: 'linear-gradient(145deg, #2d3748, #1a202c)',
            boxShadow: '20px 20px 60px #1a1a1a, -20px -20px 60px #2a2a2a'
          }}
        >
          {/* Clean Header */}
          <div className="text-center mb-6">
            <h2 
              className="text-3xl font-bold mb-2"
              style={{
                background: 'linear-gradient(45deg, #10b981, #34d399, #6ee7b7)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 0 20px rgba(16, 185, 129, 0.5)'
              }}
            >
              VoxPro Media Player
            </h2>
            <p className="text-gray-400 text-sm">Professional Broadcasting Control System</p>
          </div>

          {/* Control Panel */}
          <div 
            className="rounded-xl p-6 mb-6"
            style={{
              background: 'linear-gradient(145deg, #374151, #1f2937)',
              boxShadow: 'inset 5px 5px 15px #1a1a1a, inset -5px -5px 15px #404040'
            }}
          >
            {/* VoxPro Logo */}
            <div className="text-center mb-4">
              <div 
                className="text-2xl font-bold mb-2"
                style={{
                  background: 'linear-gradient(45deg, #10b981, #34d399)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textShadow: '0 0 15px rgba(16, 185, 129, 0.7)'
                }}
              >
                VoxPro
              </div>
              <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                connectionStatus === 'connected' 
                  ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-500/30' 
                  : 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/30'
              }`}>
                <div className={`w-3 h-3 rounded-full mr-2 ${
                  connectionStatus === 'connected' ? 'bg-green-300' : 'bg-red-300'
                } animate-pulse`}></div>
                {statusMessage}
              </div>
            </div>

            {/* START Keys - Clean Professional Design */}
            <div className="grid grid-cols-5 gap-4 mb-6">
              {[1, 2, 3, 4, 5].map((keyNum) => {
                const assignment = getAssignmentForKey(keyNum.toString());
                const isPlaying = playingKeys.has(keyNum.toString());
                
                return (
                  <button
                    key={keyNum}
                    onClick={() => handleKeyClick(keyNum.toString())}
                    onMouseEnter={() => setHoveredKey(keyNum.toString())}
                    onMouseLeave={() => setHoveredKey(null)}
                    className={`h-14 rounded-lg font-bold text-lg transition-all duration-300 transform hover:scale-110 active:scale-95 ${
                      isPlaying
                        ? 'text-white shadow-2xl'
                        : assignment
                        ? 'text-white shadow-2xl'
                        : 'text-gray-400 shadow-lg'
                    }`}
                    style={{
                      background: isPlaying
                        ? 'linear-gradient(145deg, #10b981, #059669)'
                        : assignment
                        ? 'linear-gradient(145deg, #dc2626, #b91c1c)'
                        : 'linear-gradient(145deg, #6b7280, #4b5563)',
                      boxShadow: isPlaying
                        ? '8px 8px 16px #0d4f3c, -8px -8px 16px #13c896, inset 2px 2px 4px rgba(255,255,255,0.1)'
                        : assignment
                        ? '8px 8px 16px #7f1d1d, -8px -8px 16px #ef4444, inset 2px 2px 4px rgba(255,255,255,0.1)'
                        : '8px 8px 16px #374151, -8px -8px 16px #9ca3af, inset 2px 2px 4px rgba(255,255,255,0.1)'
                    }}
                    title={assignment ? assignment.title : `Key ${keyNum} - No assignment`}
                  >
                    {isPlaying ? 'STOP' : keyNum}
                  </button>
                );
              })}
            </div>

            {/* Control Buttons */}
            <div className="grid grid-cols-4 gap-3 mb-4">
              {['A', 'B', 'C', 'D'].map((letter) => (
                <button
                  key={letter}
                  className="h-12 text-black font-bold text-sm rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95"
                  style={{
                    background: 'linear-gradient(145deg, #fbbf24, #f59e0b)',
                    boxShadow: '6px 6px 12px #d97706, -6px -6px 12px #fcd34d, inset 2px 2px 4px rgba(255,255,255,0.2)'
                  }}
                >
                  {letter}
                </button>
              ))}
            </div>

            {/* Function Buttons */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <button 
                className="h-12 text-white font-bold text-sm rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95"
                style={{
                  background: 'linear-gradient(145deg, #3b82f6, #2563eb)',
                  boxShadow: '6px 6px 12px #1d4ed8, -6px -6px 12px #60a5fa, inset 2px 2px 4px rgba(255,255,255,0.1)'
                }}
              >
                DUP
              </button>
              <button 
                className="h-12 text-white font-bold text-sm rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95"
                style={{
                  background: 'linear-gradient(145deg, #f97316, #ea580c)',
                  boxShadow: '6px 6px 12px #c2410c, -6px -6px 12px #fb923c, inset 2px 2px 4px rgba(255,255,255,0.1)'
                }}
              >
                CUE
              </button>
              <button 
                className="h-12 text-white font-bold text-sm rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95"
                style={{
                  background: 'linear-gradient(145deg, #dc2626, #b91c1c)',
                  boxShadow: '6px 6px 12px #991b1b, -6px -6px 12px #ef4444, inset 2px 2px 4px rgba(255,255,255,0.1)'
                }}
              >
                REC
              </button>
            </div>

            {/* Status Display */}
            <div className="text-center">
              <div 
                className="text-sm font-medium"
                style={{
                  color: '#10b981',
                  textShadow: '0 0 10px rgba(16, 185, 129, 0.5)'
                }}
              >
                Active Windows: {mediaViewers.filter(v => !v.isMinimized).length} | 
                Minimized: {mediaViewers.filter(v => v.isMinimized).length}
              </div>
            </div>
          </div>

          {/* Current Assignments Display */}
          {assignments.length > 0 && (
            <div 
              className="rounded-lg p-4"
              style={{
                background: 'linear-gradient(145deg, #374151, #1f2937)',
                boxShadow: 'inset 3px 3px 8px #1a1a1a, inset -3px -3px 8px #404040'
              }}
            >
              <h3 
                className="text-lg font-semibold mb-3"
                style={{
                  background: 'linear-gradient(45deg, #10b981, #34d399)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                Current Assignments
              </h3>
              <div className="space-y-2">
                {[1, 2, 3, 4, 5].map((keyNum) => {
                  const assignment = getAssignmentForKey(keyNum.toString());
                  return (
                    <div key={keyNum} className="flex items-center justify-between text-sm">
                      <span className={`font-medium ${
                        playingKeys.has(keyNum.toString()) 
                          ? 'text-green-400' 
                          : 'text-gray-300'
                      }`}>
                        Key {keyNum}:
                      </span>
                      <span className="text-gray-400 truncate ml-2">
                        {assignment ? assignment.title : 'No assignment'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Media Viewer Windows - Clean Professional Design */}
      {mediaViewers.map((viewer) => (
        <div
          key={viewer.id}
          className={`fixed rounded-lg shadow-2xl border border-gray-600 transition-all duration-300 ${
            viewer.isMinimized ? 'w-80 h-14' : 'w-[500px] h-auto'
          }`}
          style={{
            left: `${viewer.position.x}px`,
            top: `${viewer.position.y}px`,
            zIndex: 1000 + viewer.id,
            background: 'linear-gradient(145deg, #374151, #1f2937)',
            boxShadow: '15px 15px 30px #1a1a1a, -15px -15px 30px #404040'
          }}
        >
          {/* Window Header */}
          <div 
            className="flex items-center justify-between text-white p-3 rounded-t-lg"
            style={{
              background: 'linear-gradient(145deg, #10b981, #059669)',
              boxShadow: 'inset 2px 2px 4px rgba(255,255,255,0.1), inset -2px -2px 4px rgba(0,0,0,0.2)'
            }}
          >
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-300 rounded-full mr-2 animate-pulse"></div>
              <span className="text-sm font-medium">Universal Player</span>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => toggleMinimize(viewer.id)}
                className="w-7 h-7 rounded font-bold text-xs transition-all duration-200 transform hover:scale-110"
                style={{
                  background: 'linear-gradient(145deg, #fbbf24, #f59e0b)',
                  color: 'black',
                  boxShadow: '3px 3px 6px #d97706, -3px -3px 6px #fcd34d'
                }}
              >
                {viewer.isMinimized ? '□' : '−'}
              </button>
              <button
                onClick={() => closeViewer(viewer.id)}
                className="w-7 h-7 rounded text-white font-bold text-xs transition-all duration-200 transform hover:scale-110"
                style={{
                  background: 'linear-gradient(145deg, #dc2626, #b91c1c)',
                  boxShadow: '3px 3px 6px #991b1b, -3px -3px 6px #ef4444'
                }}
              >
                ✕
              </button>
            </div>
          </div>

          {/* Window Content */}
          {!viewer.isMinimized && (
            <div className="p-4">
              <div className="grid grid-cols-3 gap-4">
                {/* Media Content */}
                <div className="col-span-2">
                  {renderMediaContent(viewer.assignment)}
                </div>

                {/* Media Information */}
                <div 
                  className="rounded p-3"
                  style={{
                    background: 'linear-gradient(145deg, #4b5563, #374151)',
                    boxShadow: 'inset 3px 3px 6px #2d3748, inset -3px -3px 6px #6b7280'
                  }}
                >
                  <h4 
                    className="font-medium text-sm mb-3"
                    style={{
                      background: 'linear-gradient(45deg, #10b981, #34d399)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent'
                    }}
                  >
                    Media Description
                  </h4>
                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="text-gray-400">Title:</span>
                      <div className="text-white font-medium">{viewer.assignment.title}</div>
                    </div>
                    <div>
                      <span className="text-gray-400">Type:</span>
                      <div className="text-white">{viewer.assignment.media_type || 'Auto-detected'}</div>
                    </div>
                    <div>
                      <span className="text-gray-400">Submitted by:</span>
                      <div className="text-white">{viewer.assignment.submitted_by}</div>
                    </div>
                    <div>
                      <span className="text-gray-400">Created:</span>
                      <div className="text-white">{new Date(viewer.assignment.created_at).toLocaleDateString()}</div>
                    </div>
                    <div>
                      <span className="text-gray-400">Key:</span>
                      <div className="text-white">Key {viewer.assignment.key_slot}</div>
                    </div>
                  </div>
                  
                  {/* Description */}
                  {viewer.assignment.description && (
                    <div className="mt-3">
                      <span className="text-gray-400 text-xs">Description:</span>
                      <div className="text-white text-xs mt-1 max-h-24 overflow-y-auto">
                        {viewer.assignment.description}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default VoxProPlayer;

