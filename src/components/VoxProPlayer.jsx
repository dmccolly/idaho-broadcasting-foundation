import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';

// Floating window media player used by BackCornerPage
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

  const createAudioVisualization = () => {
    setTimeout(() => {
      if (!visualizationRef.current) return;
      visualizationRef.current.innerHTML = '';
      const container = document.createElement('div');
      container.className = 'flex items-end justify-center h-16 gap-1 bg-gray-900 rounded p-2';
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

  const startVisualization = () => {
    if (!visualizationRef.current) return;
    const bars = visualizationRef.current.querySelectorAll('div > div');
    const animate = () => {
      if (!isPlaying) return;
      bars.forEach((bar, index) => {
        const wave = Math.sin(Date.now() * 0.01 + index * 0.2) * 25 + 15;
        const randomHeight = Math.random() * 20 + 10;
        const finalHeight = Math.max(4, wave + randomHeight);
        bar.style.height = `${finalHeight}px`;
        bar.style.opacity = Math.random() * 0.5 + 0.5;
      });
      animationRef.current = requestAnimationFrame(animate);
    };
    animate();
  };

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
    if (mediaType === 'audio') startVisualization();
  };
  const handlePause = () => {
    setIsPlaying(false);
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
  };
  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
  };
  const handleError = (e) => {
    setError(`${mediaType} playback error: ${e.target.error?.message || 'Unknown error'}`);
    setIsLoading(false);
    setIsPlaying(false);
  };

  const togglePlayPause = () => {
    const mediaElement = playerRef.current;
    if (!mediaElement) return;
    if (isPlaying) {
      mediaElement.pause();
    } else {
      mediaElement.play().catch((error) => setError(`Play failed: ${error.message}`));
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
    if (mediaElement) mediaElement.volume = newVolume;
  };
  const toggleMute = () => {
    const mediaElement = playerRef.current;
    if (!mediaElement) return;
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    mediaElement.muted = newMuted;
  };

  const formatTime = (seconds) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleMouseDown = (e) => {
    if (e.target.closest('.window-controls') || e.target.closest('.resize-handle')) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - windowPosition.x, y: e.clientY - windowPosition.y });
  };
  const handleMouseMove = (e) => {
    if (isDragging) {
      setWindowPosition({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
    }
  };
  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
  };
  const handleResizeStart = (e) => {
    e.stopPropagation();
    setIsResizing(true);
    setDragStart({ x: e.clientX, y: e.clientY, width: windowSize.width, height: windowSize.height });
  };
  const handleResizeMove = (e) => {
    if (isResizing) {
      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;
      setWindowSize({ width: Math.max(400, dragStart.width + deltaX), height: Math.max(300, dragStart.height + deltaY) });
    }
  };
  const toggleMaximize = () => {
    if (isMaximized) {
      setWindowSize(previousSize.size);
      setWindowPosition(previousSize.position);
      setIsMaximized(false);
    } else {
      setPreviousSize({ size: windowSize, position: windowPosition });
      setWindowSize({ width: window.innerWidth - 40, height: window.innerHeight - 40 });
      setWindowPosition({ x: 20, y: 20 });
      setIsMaximized(true);
    }
  };

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
              <div ref={visualizationRef} className="w-full flex-1 max-h-32 mb-4" />
            </div>
            <div className="bg-gray-900 rounded p-3 mt-auto">
              <div className="flex items-center gap-4 mb-3">
                <button onClick={togglePlayPause} className="text-2xl hover:text-green-400 transition-colors" disabled={!duration}>
                  {isPlaying ? '⏸️' : '▶️'}
                </button>
                <div className="text-sm text-gray-400">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </div>
                <div className="flex items-center gap-2 ml-auto">
                  <button onClick={toggleMute} className="text-lg hover:text-yellow-400 transition-colors">
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
              <div className="w-full h-2 bg-gray-700 rounded-full cursor-pointer overflow-hidden" onClick={handleSeek}>
                <div className="h-full bg-green-500 transition-all duration-100" style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }} />
              </div>
            </div>
          </div>
        );
      case 'image':
        return (
          <div className="bg-gray-800 rounded p-2 h-full flex items-center justify-center">
            <img src={assignment.media_url} alt={assignment.title} className="max-w-full max-h-full object-contain rounded" onError={() => setError('Failed to load image')} />
          </div>
        );
      case 'document':
        return (
          <div className="h-full w-full">
            <iframe src={assignment.media_url} className="w-full h-full border-0 rounded" title={assignment.title} />
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
            <button onClick={() => window.open(assignment.media_url, '_blank')} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors">
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
            <button onClick={() => onMinimize(false)} className="text-gray-400 hover:text-white p-1" title="Restore">
              ⬜
            </button>
            <button onClick={onClose} className="text-gray-400 hover:text-red-400 p-1" title="Close">
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
      className="fixed bg-gray-900 border border-gray-600 rounded-lg shadow-2xl p-4 z-50"
      style={{ width: windowSize.width, height: windowSize.height, left: windowPosition.x, top: windowPosition.y }}
      onMouseDown={handleMouseDown}
    >
      <div className="flex justify-between items-center mb-2 window-controls">
        <div className="font-semibold text-white truncate pr-2">{assignment?.title || 'Media Player'}</div>
        <div className="flex gap-1">
          <button onClick={toggleMaximize} className="text-gray-400 hover:text-white p-1" title={isMaximized ? 'Restore' : 'Maximize'}>
            {isMaximized ? '🗗' : '🗖'}
          </button>
          <button onClick={() => onMinimize(true)} className="text-gray-400 hover:text-white p-1" title="Minimize">
            —
          </button>
          <button onClick={onClose} className="text-gray-400 hover:text-red-400 p-1" title="Close">
            ✕
          </button>
        </div>
      </div>
      <div className="w-full h-[calc(100%-2rem)]" onMouseDown={(e) => e.stopPropagation()}>
        {renderMediaContent()}
        <div className="absolute bottom-0 right-0 w-4 h-4 bg-gray-600 cursor-se-resize resize-handle" onMouseDown={handleResizeStart} title="Resize window">
          <div className="absolute bottom-1 right-1 w-2 h-2 border-r-2 border-b-2 border-gray-400" />
        </div>
      </div>
    </div>
  );
};

const VoxProPlayerWidget = ({ onKeyClick, currentPlayingKey, assignments, connectionStatus, statusMessage, setStatusMessage }) => {
  const getKeyAssignment = (keySlot) => assignments.find((a) => a.key_slot === keySlot);
  return (
    <div className="bg-gray-900 rounded-lg p-4 shadow-xl border border-gray-700">
      <div className="text-center mb-4">
        <h3 className="text-lg font-bold text-green-400 mb-1">VoxPro Media Player</h3>
        <p className="text-gray-400 text-xs">Professional Broadcasting Control</p>
        <div className="mt-2">
          <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${connectionStatus === 'connected' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>\
            <div className={`w-1.5 h-1.5 rounded-full mr-2 ${connectionStatus === 'connected' ? 'bg-green-300' : 'bg-red-300'} ${connectionStatus === 'connected' ? 'animate-pulse' : ''}`}></div>
            {statusMessage}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-5 gap-2">
        {[1, 2, 3, 4, 5].map((key) => {
          const assignment = getKeyAssignment(key.toString());
          const isPlaying = currentPlayingKey === key.toString();
          return (
            <button
              key={key}
              onClick={() => onKeyClick(key.toString())}
              onMouseEnter={() => assignment && setStatusMessage(`Key ${key}: ${assignment.title}`)}
              onMouseLeave={() => setStatusMessage(connectionStatus === 'connected' ? 'Connected to Supabase' : 'Failed to connect to Supabase')}
              className={`w-14 h-14 rounded-lg font-bold text-white text-base transition-all duration-200 transform hover:scale-105 flex items-center justify-center ${isPlaying ? 'bg-gradient-to-b from-green-500 to-green-700 hover:from-green-400 hover:to-green-600 shadow-lg ring-2 ring-green-300' : assignment ? 'bg-gradient-to-b from-red-500 to-red-700 hover:from-red-400 hover:to-red-600 shadow-lg' : 'bg-gradient-to-b from-gray-600 to-gray-800 hover:from-gray-500 hover:to-gray-700 cursor-not-allowed'} border-2 border-gray-500 shadow-md`}
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

const KeyAssignmentsWidget = ({ assignments, currentPlayingKey }) => (
  <div className="bg-gray-900 rounded-lg p-3 border border-gray-700 shadow-xl">
    <h3 className="text-green-400 font-semibold text-base mb-3 text-center">Current Key Assignments</h3>
    <div className="space-y-1.5">
      {assignments.map((assignment) => (
        <div key={assignment.id} className="bg-gray-800 rounded p-2 border border-gray-600">
          <div className="flex items-center justify-between">
            <span className={`text-xs font-bold ${currentPlayingKey === assignment.key_slot ? 'text-green-400' : 'text-red-400'}`}>Key {assignment.key_slot}</span>
            <span className="text-xs text-gray-400">{assignment.media_type}</span>
          </div>
          <h4 className="text-white font-medium text-xs truncate mt-1">{assignment.title}</h4>
          <p className="text-gray-400 text-xs truncate">{assignment.description}</p>
        </div>
      ))}
    </div>
  </div>
);

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
        const subscription = supabase
          .channel('public:assignments')
          .on('postgres_changes', { event: '*', schema: 'public', table: 'assignments' }, () => loadAssignments())
          .subscribe();
        return () => {
          supabase.removeChannel(subscription);
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
      const { data, error } = await supabase.from('assignments').select('*').order('created_at', { ascending: false });
      if (!error) setAssignments(data || []);
    } catch (err) {
      console.error('Error in loadAssignments:', err);
    }
  };

  const getKeyAssignment = (keySlot) => assignments.find((a) => a.key_slot === keySlot);

  const handleKeyClick = (keySlot) => {
    const assignment = getKeyAssignment(keySlot);
    if (!assignment) return;
    if (currentPlayingKey === keySlot) {
      setCurrentPlayingKey(null);
      setActiveWindows((prev) => prev.filter((w) => w.assignment.key_slot !== keySlot));
      return;
    }
    if (currentPlayingKey) {
      setActiveWindows((prev) => prev.filter((w) => w.assignment.key_slot !== currentPlayingKey));
    }
    setCurrentPlayingKey(keySlot);
    const newWindow = { id: windowCounter, assignment, isMinimized: false };
    setActiveWindows([newWindow]);
    setWindowCounter((prev) => prev + 1);
  };

  const closeWindow = (windowId) => {
    const windowToClose = activeWindows.find((w) => w.id === windowId);
    if (windowToClose && windowToClose.assignment.key_slot === currentPlayingKey) {
      setCurrentPlayingKey(null);
    }
    setActiveWindows((prev) => prev.filter((w) => w.id !== windowId));
  };

  const minimizeWindow = (windowId, minimize) => {
    setActiveWindows((prev) => prev.map((w) => (w.id === windowId ? { ...w, isMinimized: minimize } : w)));
  };

  return (
    <div className="w-72 flex flex-col gap-4">
      <VoxProPlayerWidget
        onKeyClick={handleKeyClick}
        currentPlayingKey={currentPlayingKey}
        assignments={assignments}
        connectionStatus={connectionStatus}
        statusMessage={statusMessage}
        setStatusMessage={setStatusMessage}
      />
      <KeyAssignmentsWidget assignments={assignments} currentPlayingKey={currentPlayingKey} />
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
