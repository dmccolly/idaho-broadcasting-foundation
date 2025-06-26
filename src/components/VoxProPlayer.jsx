import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';

const VoxProPlayer = () => {
  // State management
  const [connectionStatus, setConnectionStatus] = useState('connecting');
  const [statusMessage, setStatusMessage] = useState('Connecting to Supabase...');
  const [assignments, setAssignments] = useState([]);
  const [mediaViewers, setMediaViewers] = useState([]);
  const [hoveredKey, setHoveredKey] = useState(null);
  const [playingKeys, setPlayingKeys] = useState(new Set()); // Track which keys are playing
  
  // Audio visualization refs
  const audioContextRef = useRef(null);
  const analyzerRef = useRef(null);
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

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
      // Stop playback
      stopPlayback(keySlot);
      return;
    }

    // Start playback
    startPlayback(keySlot, assignment);
  };

  // Start playback for a key
  const startPlayback = (keySlot, assignment) => {
    setPlayingKeys(prev => new Set([...prev, keySlot]));
    
    // Create new media viewer window
    const newViewer = {
      id: Date.now(),
      keySlot,
      assignment,
      isMinimized: false,
      position: {
        x: 20 + (mediaViewers.length * 30),
        y: 20 + (mediaViewers.length * 30)
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

    // Close the media viewer for this key
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
          onPlay={(e) => {
            // Video doesn't need audio visualization
          }}
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

    // Documents and other files
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
          <p className="text-gray-600">Compact professional media player for broadcasting operations.</p>
        </div>
      </div>

      {/* VoxPro Player Interface - Compact Design */}
      <div className="max-w-2xl mx-auto bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-2xl p-6">
        {/* Header */}
        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold text-green-400 mb-1">VoxPro Media Player</h2>
          <p className="text-gray-400 text-sm">Professional Broadcasting Control System</p>
        </div>

        {/* Control Panel - Compact */}
        <div className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg p-4 mb-4">
          <div className="text-center mb-3">
            <div className="text-lg font-bold text-green-400">VoxPro</div>
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
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

          {/* START Keys - Compact Grid */}
          <div className="grid grid-cols-5 gap-2 mb-3">
            {[1, 2, 3, 4, 5].map((keyNum) => {
              const assignment = getAssignmentForKey(keyNum.toString());
              const isPlaying = playingKeys.has(keyNum.toString());
              
              return (
                <button
                  key={keyNum}
                  onClick={() => handleKeyClick(keyNum.toString())}
                  onMouseEnter={() => setHoveredKey(keyNum.toString())}
                  onMouseLeave={() => setHoveredKey(null)}
                  className={`h-12 rounded-lg font-bold text-sm transition-all duration-200 transform hover:scale-105 ${
                    isPlaying
                      ? 'bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg shadow-green-500/30'
                      : assignment
                      ? 'bg-gradient-to-br from-red-500 to-red-600 text-white shadow-lg shadow-red-500/30'
                      : 'bg-gradient-to-br from-gray-500 to-gray-600 text-gray-300'
                  }`}
                  title={assignment ? assignment.title : `Key ${keyNum} - No assignment`}
                >
                  {isPlaying ? 'STOP' : keyNum}
                </button>
              );
            })}
          </div>

          {/* Control Buttons - Compact */}
          <div className="grid grid-cols-4 gap-2 mb-3">
            {['A', 'B', 'C', 'D'].map((letter) => (
              <button
                key={letter}
                className="h-10 bg-gradient-to-br from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-black font-bold text-sm rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg shadow-yellow-500/30"
              >
                {letter}
              </button>
            ))}
          </div>

          {/* Function Buttons - Compact */}
          <div className="grid grid-cols-3 gap-2">
            <button className="h-10 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white font-bold text-xs rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg shadow-blue-500/30">
              DUP
            </button>
            <button className="h-10 bg-gradient-to-br from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white font-bold text-xs rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg shadow-orange-500/30">
              CUE
            </button>
            <button className="h-10 bg-gradient-to-br from-red-500 to-red-600 hover:from-red-400 hover:to-red-500 text-white font-bold text-xs rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg shadow-red-500/30">
              REC
            </button>
          </div>

          {/* Status Display - Compact */}
          <div className="mt-3 text-center">
            <div className="text-xs text-gray-400">
              Active Windows: {mediaViewers.filter(v => !v.isMinimized).length} | 
              Minimized: {mediaViewers.filter(v => v.isMinimized).length}
            </div>
          </div>
        </div>

        {/* Current Assignments Display - Compact */}
        {assignments.length > 0 && (
          <div className="bg-gray-700 rounded-lg p-3">
            <h3 className="text-sm font-semibold text-green-400 mb-2">Current Assignments</h3>
            <div className="space-y-1">
              {[1, 2, 3, 4, 5].map((keyNum) => {
                const assignment = getAssignmentForKey(keyNum.toString());
                return (
                  <div key={keyNum} className="flex items-center justify-between text-xs">
                    <span className={`font-medium ${
                      playingKeys.has(keyNum.toString()) ? 'text-green-400' : 'text-gray-300'
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

      {/* Media Viewer Windows - Compact */}
      {mediaViewers.map((viewer) => (
        <div
          key={viewer.id}
          className={`fixed bg-gray-800 rounded-lg shadow-2xl border border-gray-600 transition-all duration-300 ${
            viewer.isMinimized ? 'w-64 h-12' : 'w-96 h-auto'
          }`}
          style={{
            left: `${viewer.position.x}px`,
            top: `${viewer.position.y}px`,
            zIndex: 1000 + viewer.id
          }}
        >
          {/* Window Header - Compact */}
          <div className="flex items-center justify-between bg-gradient-to-r from-green-600 to-green-700 text-white p-2 rounded-t-lg">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-300 rounded-full mr-2 animate-pulse"></div>
              <span className="text-sm font-medium">Universal Player</span>
            </div>
            <div className="flex space-x-1">
              <button
                onClick={() => toggleMinimize(viewer.id)}
                className="w-6 h-6 bg-yellow-500 hover:bg-yellow-400 rounded text-black text-xs font-bold transition-colors"
              >
                {viewer.isMinimized ? '□' : '−'}
              </button>
              <button
                onClick={() => closeViewer(viewer.id)}
                className="w-6 h-6 bg-red-500 hover:bg-red-400 rounded text-white text-xs font-bold transition-colors"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Window Content - Compact */}
          {!viewer.isMinimized && (
            <div className="p-3">
              <div className="grid grid-cols-3 gap-3">
                {/* Media Content - Compact */}
                <div className="col-span-2">
                  {renderMediaContent(viewer.assignment)}
                </div>

                {/* Media Information - Compact */}
                <div className="bg-gray-700 rounded p-2">
                  <h4 className="text-green-400 font-medium text-sm mb-2">Media Description</h4>
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
                      <div className="text-white text-xs mt-1 max-h-20 overflow-y-auto">
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

