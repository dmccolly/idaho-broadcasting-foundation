import { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import VoxProPlayerWidget from '../VoxProPlayerWidget.jsx';

// Enhanced Universal Media Player Component - CONTENT GROWS WITH WINDOW
const UniversalMediaPlayer = ({ assignment, onClose, onMinimize, isMinimized, windowId }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mediaType, setMediaType] = useState(null);
  const [windowSize, setWindowSize] = useState({ width: 500, height: 500 });
  // Default lower-left placement so popups never hide player controls
  const [windowPosition, setWindowPosition] = useState({
    x: 20,
    y: Math.max(0, window.innerHeight - 520)
  });
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

      case 'document': {
        const url = assignment.media_url;
        const ext = url.split('.').pop().toLowerCase();
        const embedUrl =
          ext === 'pdf'
            ? url
            : `https://docs.google.com/gview?embedded=1&url=${encodeURIComponent(url)}`;
        return (
          <div className="h-full w-full">
            {ext === 'pdf' ? (
              <object
                data={embedUrl}
                type="application/pdf"
                className="w-full h-full"
              >
                <iframe
                  src={embedUrl}
                  className="w-full h-full border-0"
                  title={assignment.title}
                />
              </object>
            ) : (
              <iframe
                src={embedUrl}
                className="w-full h-full border-0"
                title={assignment.title}
              />
            )}
          </div>
        );
      }

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

export default UniversalMediaPlayer;
