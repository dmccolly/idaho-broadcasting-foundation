import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';

// Enhanced Universal Media Player Component - FROM YOUR WORKING FILE
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
      console.log('✅ Green visualization bars created');
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
      console.log(`✅ ${mediaType} loaded:`, assignment.title, `Duration: ${mediaElement.duration}s`);
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
    console.log(`🔊 ${mediaType} playing - you should hear sound:`, assignment.title);

    if (mediaType === 'audio') {
      startVisualization();
    }
  };

  const handlePause = () => {
    setIsPlaying(false);
    console.log(`⏸️ ${mediaType} paused:`, assignment.title);

    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    console.log(`⏹️ ${mediaType} ended:`, assignment.title);

    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  };

  const handleError = (e) => {
    console.error(`${mediaType} error:`, e.target.error);
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
        console.error('Play failed:', error);
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
              style={{
                zoom: Math.min(windowSize.width / 600, windowSize.height / 800),
                transformOrigin: 'top left'
              }}
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
            {/* MODIFICATION: Pass windowId to the parent's toggle function */}
            <button
              onClick={() => onMinimize(windowId)}
              className="text-gray-400 hover:text-white p-1"
              title="Restore"
            >
              ⬜
            </button>
            {/* MODIFICATION: Pass windowId to the parent's close function */}
            <button
              onClick={() => onClose(windowId)}
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
          {/* MODIFICATION: Pass windowId to the parent's toggle function */}
          <button
            onClick={() => onMinimize(windowId)}
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
          {/* MODIFICATION: Pass windowId to the parent's close function */}
          <button
            onClick={() => onClose(windowId)}
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


// Main Component from the Management Tool
const VoxProManagement = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState('');
  const [openWindows, setOpenWindows] = useState([]);
  const [selectedKeySlot, setSelectedKeySlot] = useState(null);
  const [mediaTitle, setMediaTitle] = useState('');
  const [mediaDescription, setMediaDescription] = useState('');

  const fileInputRef = useRef(null);

  useEffect(() => {
    loadAssignments();
  }, []);

  const loadAssignments = async () => {
    try {
      const { data, error } = await supabase
        .from('assignments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAssignments(data || []);
    } catch (error) {
      console.error('Error loading assignments:', error);
      setError('Failed to load assignments');
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file || !selectedKeySlot) return;

    setIsUploading(true);
    setUploadProgress(0);
    setUploadStatus('Uploading...');

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;

      setUploadProgress(30);

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('media-files')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      setUploadProgress(70);

      const { data: urlData } = supabase.storage
        .from('media-files')
        .getPublicUrl(fileName);

      const existingAssignment = assignments.find(a => a.key_slot === selectedKeySlot);

      if (existingAssignment) {
        const { error: updateError } = await supabase
          .from('assignments')
          .update({
            title: mediaTitle || file.name,
            description: mediaDescription || `Updated ${file.type || 'file'}`,
            media_url: urlData.publicUrl,
            media_type: file.type,
            updated_at: new Date().toISOString()
          })
          .eq('key_slot', selectedKeySlot);

        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from('assignments')
          .insert([{
            key_slot: selectedKeySlot,
            title: mediaTitle || file.name,
            description: mediaDescription || `New ${file.type || 'file'}`,
            media_url: urlData.publicUrl,
            media_type: file.type,
            submitted_by: 'VoxPro Manager',
            created_at: new Date().toISOString()
          }]);

        if (insertError) throw insertError;
      }

      setUploadProgress(100);
      setUploadStatus('Complete!');

      setSelectedKeySlot(null);
      setMediaTitle('');
      setMediaDescription('');

      await loadAssignments();

      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
        setUploadStatus('');
      }, 1000);

    } catch (error) {
      console.error('Upload error:', error);
      setError(`Upload failed: ${error.message}`);
      setIsUploading(false);
      setUploadProgress(0);
      setUploadStatus('');
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getKeyAssignment = (keySlot) => {
    return assignments.find(a => a.key_slot === keySlot.toString());
  };

  const openWindow = (assignment) => {
    const windowId = `window-${assignment.id}-${Date.now()}`;
    const newWindow = {
      id: windowId,
      assignment,
      isMinimized: false
    };
    setOpenWindows(prev => [...prev, newWindow]);
  };

  const closeWindow = (windowId) => {
    setOpenWindows(prev => prev.filter(w => w.id !== windowId));
  };

  const toggleMinimize = (windowId) => {
    setOpenWindows(prev => prev.map(w =>
      w.id === windowId ? { ...w, isMinimized: !w.isMinimized } : w
    ));
  };

  const clearForm = () => {
    setSelectedKeySlot(null);
    setMediaTitle('');
    setMediaDescription('');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-green-400 mb-2">VoxPro Management System</h1>
        <p className="text-gray-400">Professional Control System with Media Management</p>
      </div>

      <div className="flex gap-6 max-w-7xl mx-auto">

        <div className="flex-1 bg-gray-800 rounded-lg border border-gray-600 p-6">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-green-400 mb-2">VoxPro Control Interface</h2>

            <div className="bg-gray-900 rounded-lg border border-gray-700 p-4 mb-6">
              <div className="text-lg font-bold text-white mb-2">VoxPro</div>
              <div className="text-sm text-gray-400 mb-4">Professional Control System</div>

              <div className="bg-blue-600 text-white px-4 py-2 rounded-lg mb-6">
                VoxPro Media Interface - Ready
              </div>

              <div className="grid grid-cols-5 gap-3 mb-6">
                {[1, 2, 3, 4, 5].map((key) => {
                  const assignment = getKeyAssignment(key);
            _BAP_REPLACE_THE_FOLLOWING_SECTION_WITH_THE_MODIFIED_CODE_
                    <button
                      key={key}
                      onClick={() => assignment && openWindow(assignment)}
                      className={`
                        h-12 rounded-lg font-bold text-white transition-all
                        ${assignment
                          ? 'bg-red-600 hover:bg-red-500'
                          : 'bg-gray-600 hover:bg-gray-500'
                        }
                      `}
                      title={assignment ? assignment.title : `Key ${key} - No Assignment`}
                    >
                      START {key}
                    </button>
                  );
                })}
              </div>

              <div className="grid grid-cols-4 gap-2 mb-4">
                <button className="h-10 bg-gray-600 hover:bg-gray-500 rounded text-sm font-bold">A</button>
                <button className="h-10 bg-gray-600 hover:bg-gray-500 rounded text-sm font-bold">B</button>
                <button className="h-10 bg-gray-600 hover:bg-gray-500 rounded text-sm font-bold">C</button>
                <button className="h-10 bg-gray-600 hover:bg-gray-500 rounded text-sm font-bold">DUR</button>

                <button className="h-10 bg-gray-600 hover:bg-gray-500 rounded text-sm font-bold">D</button>
                <button className="h-10 bg-gray-600 hover:bg-gray-500 rounded text-sm font-bold">E</button>
                <button className="h-10 bg-gray-600 hover:bg-gray-500 rounded text-sm font-bold">F</button>
                <button className="h-10 bg-gray-600 hover:bg-gray-500 rounded text-sm font-bold">CUE</button>

                <button className="h-10 bg-gray-600 hover:bg-gray-500 rounded text-sm font-bold">G</button>
                <button className="h-10 bg-gray-600 hover:bg-gray-500 rounded text-sm font-bold">H</button>
                <button className="h-10 bg-gray-600 hover:bg-gray-500 rounded text-sm font-bold">I</button>
                <button className="h-10 bg-gray-600 hover:bg-gray-500 rounded text-sm font-bold">STOP</button>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <button className="h-8 bg-gray-600 hover:bg-gray-500 rounded text-xs font-bold">FADE</button>
                <button className="h-8 bg-gray-600 hover:bg-gray-500 rounded text-xs font-bold">NEXT</button>
                <button className="h-8 bg-gray-600 hover:bg-gray-500 rounded text-xs font-bold">PREV</button>
              </div>
            </div>
    _BAP_REPLACE_THE_PRECEDING_SECTION_WITH_THE_MODIFIED_CODE_    </div>
        </div>

        <div className="w-80 bg-gray-800 rounded-lg border border-gray-600 p-6">
          <h2 className="text-xl font-bold text-green-400 mb-4">Media Management</h2>

          {error && (
            <div className="bg-red-900 text-red-100 p-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Select Key Slot
              </label>
              <select
                value={selectedKeySlot || ''}
                onChange={(e) => setSelectedKeySlot(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
              >
                <option value="">Choose a key slot...</option>
                {[1, 2, 3, 4, 5].map(key => {
                  const assignment = getKeyAssignment(key);
                  return (
                    <option key={key} value={key}>
                      Key {key} {assignment ? `(${assignment.title})` : '(Empty)'}
                    </option>
                  );
                })}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Media Title
              </label>
              <input
                type="text"
                value={mediaTitle}
                onChange={(e) => setMediaTitle(e.target.value)}
                placeholder="Enter media title..."
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description
              </label>
              <textarea
                value={mediaDescription}
                onChange={(e) => setMediaDescription(e.target.value)}
                placeholder="Enter description..."
                rows={3}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Upload Media File
              </label>
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileSelect}
                accept="audio/*,video/*,.pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif,.webp,.svg"
                disabled={!selectedKeySlot || isUploading}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white file:mr-4 file:py-1 file:px-2 file:rounded file:border-0 file:text-sm file:bg-green-600 file:text-white hover:file:bg-green-500"
              />
            </div>

            {isUploading && (
              <div className="bg-gray-700 rounded-lg p-3">
                <div className="text-sm text-gray-300 mb-2">{uploadStatus}</div>
                <div className="w-full bg-gray-600 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
          _BAP_REPLACE_THE_FOLLOWING_SECTION_WITH_THE_MODIFIED_CODE_
                </div>
              </div>
            )}

            <div className="flex gap-2">
        _BAP_REPLACE_THE_FOLLOWING_SECTION_WITH_THE_MODIFIED_CODE_
              <button
                onClick={clearForm}
                className="flex-1 bg-gray-600 hover:bg-gray-500 text-white py-2 px-4 rounded-lg transition-colors"
              >
                Clear
              </button>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-bold text-green-400 mb-3">Current Assignments</h3>
            {loading ? (
              <div className="text-center text-gray-400">Loading...</div>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {assignments.map(assignment => (
                  <div
                    key={assignment.id}
                    className="bg-gray-700 rounded-lg p-3 cursor-pointer hover:bg-gray-600 transition-colors"
                    onClick={() => openWindow(assignment)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="font-medium text-white text-sm">
                          Key {assignment.key_slot}: {assignment.title}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          {assignment.description}
                        </div>
                      </div>
                      <div className="text-xs text-green-400 ml-2">
                        {assignment.media_type?.split('/')[0] || 'unknown'}
                      </div>
                    </div>
                  </div>
                ))}
                {assignments.length === 0 && (
                  <div className="text-center text-gray-400 text-sm">
                    No assignments yet
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {openWindows.map(window => (
        <UniversalMediaPlayer
          key={window.id}
          windowId={window.id}
          assignment={window.assignment}
          isMinimized={window.isMinimized}
          onClose={closeWindow}
          onMinimize={toggleMinimize}
        />
      ))}
    </div>
  );
};

export default VoxProManagement;
_BAP_REPLACE_THE_PRECEDING_SECTION_WITH_THE_MODIFIED_CODE_
