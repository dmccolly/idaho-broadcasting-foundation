import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import WaveSurfer from 'wavesurfer.js';

// Enhanced Universal Media Player Component - VISUALIZATION ONLY WAVESURFER
const UniversalMediaPlayer = ({ assignment, onClose, onMinimize, isMinimized, windowId }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mediaType, setMediaType] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  // Refs
  const containerRef = useRef(null);
  const waveformRef = useRef(null);
  const wavesurferRef = useRef(null);
  const audioElementRef = useRef(null); // Separate HTML5 audio for playback
  const isDraggingRef = useRef(false);
  const dragOffsetRef = useRef({ x: 0, y: 0 });

  // Window positioning and sizing
  const [position, setPosition] = useState({
    x: 100 + (windowId * 50),
    y: 100 + (windowId * 50)
  });
  const [size, setSize] = useState({ width: 600, height: 400 });

  // Detect media type
  useEffect(() => {
    if (!assignment?.media_url) {
      setError('No media URL provided');
      setIsLoading(false);
      return;
    }

    const ext = assignment.media_url.split('.').pop()?.toLowerCase();
    const audioExts = ['mp3', 'wav', 'ogg', 'aac', 'm4a', 'flac'];
    const videoExts = ['mp4', 'webm', 'avi', 'mov', 'mkv'];
    const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
    const docExts = ['pdf', 'doc', 'docx', 'txt', 'rtf'];

    if (audioExts.includes(ext)) setMediaType('audio');
    else if (videoExts.includes(ext)) setMediaType('video');
    else if (imageExts.includes(ext)) setMediaType('image');
    else if (docExts.includes(ext)) setMediaType('document');
    else setMediaType('unknown');

    setIsLoading(false);
  }, [assignment]);

  // Initialize Wavesurfer for VISUALIZATION ONLY (completely muted)
  const initializeWavesurfer = async () => {
    if (!waveformRef.current || mediaType !== 'audio' || !assignment?.media_url) return;

    try {
      console.log('🎨 Initializing Wavesurfer for VISUALIZATION ONLY:', assignment.title);

      // Clean up existing instance
      if (wavesurferRef.current) {
        wavesurferRef.current.destroy();
        wavesurferRef.current = null;
      }

      // Create Wavesurfer instance - VISUALIZATION ONLY
      const ws = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: '#4ade80',
        progressColor: '#059669',
        cursorColor: '#ffffff',
        barWidth: 2,
        barRadius: 3,
        responsive: true,
        height: 60,
        normalize: true,
        backend: 'WebAudio', // For waveform generation
        interact: false, // Disable interaction - visualization only
        hideScrollbar: true
      });

      wavesurferRef.current = ws;

      // Load audio for waveform generation only
      await ws.load(assignment.media_url);

      // CRITICAL: Immediately mute Wavesurfer completely
      ws.setMuted(true);
      ws.setVolume(0);

      // Disable all Wavesurfer audio output
      if (ws.backend && ws.backend.ac) {
        try {
          ws.backend.disconnectSource();
        } catch (e) {
          console.log('Wavesurfer already disconnected');
        }
      }

      console.log('✅ Wavesurfer ready for VISUALIZATION ONLY:', assignment.title);

    } catch (error) {
      console.error('❌ Wavesurfer initialization error:', error);
      setError(`Visualization error: ${error.message}`);
    }
  };

  // Initialize HTML5 audio for PLAYBACK ONLY
  const initializeHTML5Audio = () => {
    if (!audioElementRef.current || mediaType !== 'audio') return;

    const audio = audioElementRef.current;
    
    console.log('🔊 Initializing HTML5 Audio for PLAYBACK ONLY:', assignment.title);

    // Event listeners for HTML5 audio
    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      console.log('📊 Audio metadata loaded, duration:', audio.duration);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      
      // Sync Wavesurfer visualization with HTML5 audio progress
      if (wavesurferRef.current && duration > 0) {
        const progress = audio.currentTime / duration;
        wavesurferRef.current.seekTo(progress);
      }
    };

    const handlePlay = () => {
      setIsPlaying(true);
      console.log('🎵 HTML5 Audio playing - you should hear sound');
    };

    const handlePause = () => {
      setIsPlaying(false);
      console.log('⏸️ HTML5 Audio paused');
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      console.log('🏁 HTML5 Audio ended');
    };

    const handleError = (e) => {
      console.error('❌ HTML5 Audio error:', e);
      setError('Audio playback error');
    };

    // Add event listeners
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    // Set initial volume
    audio.volume = volume;
    audio.muted = isMuted;

    // Cleanup function
    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  };

  // Initialize audio systems
  useEffect(() => {
    if (mediaType === 'audio' && assignment?.media_url) {
      initializeWavesurfer();
      const cleanup = initializeHTML5Audio();
      return cleanup;
    }
  }, [assignment?.media_url, mediaType]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (wavesurferRef.current) {
        wavesurferRef.current.destroy();
      }
    };
  }, []);

  // Audio control functions - ONLY control HTML5 audio
  const handlePlay = async () => {
    if (!audioElementRef.current) return;

    try {
      // Resume audio context if needed
      if (wavesurferRef.current?.backend?.ac?.state === 'suspended') {
        await wavesurferRef.current.backend.ac.resume();
        console.log('📢 Audio context resumed');
      }

      await audioElementRef.current.play();
      console.log('▶️ Starting playback...');
    } catch (error) {
      console.error('❌ Play error:', error);
      setError(`Playback error: ${error.message}`);
    }
  };

  const handlePause = () => {
    if (audioElementRef.current) {
      audioElementRef.current.pause();
    }
  };

  const handleStop = () => {
    if (audioElementRef.current) {
      audioElementRef.current.pause();
      audioElementRef.current.currentTime = 0;
    }
  };

  const handleVolumeChange = (newVolume) => {
    setVolume(newVolume);
    if (audioElementRef.current) {
      audioElementRef.current.volume = newVolume;
    }
  };

  const handleMuteToggle = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    if (audioElementRef.current) {
      audioElementRef.current.muted = newMuted;
    }
  };

  const handleSeek = (seekTime) => {
    if (audioElementRef.current) {
      audioElementRef.current.currentTime = seekTime;
    }
  };

  // Drag functionality
  const handleMouseDown = (e) => {
    if (e.target.closest('.resize-handle') || e.target.closest('.controls')) return;
    
    isDraggingRef.current = true;
    const rect = containerRef.current.getBoundingClientRect();
    dragOffsetRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e) => {
    if (!isDraggingRef.current) return;
    
    setPosition({
      x: e.clientX - dragOffsetRef.current.x,
      y: e.clientY - dragOffsetRef.current.y
    });
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  // Format time display
  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Render media content based on type
  const renderMediaContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-40">
          <div className="text-green-400">Loading...</div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex items-center justify-center h-40">
          <div className="text-red-400">Error: {error}</div>
        </div>
      );
    }

    switch (mediaType) {
      case 'audio':
        return (
          <div className="bg-gray-800 rounded p-4">
            <div className="flex items-center justify-center h-20 mb-4">
              <div className="text-green-400 text-4xl">🎵</div>
              <div className="ml-4 text-center">
                <div className="text-lg font-medium">{assignment.title}</div>
                <div className="text-sm text-gray-400">Audio File</div>
              </div>
            </div>

            {/* HIDDEN HTML5 Audio Element - PLAYBACK ONLY */}
            <audio
              ref={audioElementRef}
              src={assignment.media_url}
              preload="metadata"
              style={{ display: 'none' }}
            />

            {/* Wavesurfer Visualization Container - VISUALIZATION ONLY */}
            <div 
              ref={waveformRef} 
              className="w-full bg-gray-900 rounded mb-4"
              style={{ height: '60px' }}
            />

            {/* Audio Controls - Control HTML5 Audio Only */}
            <div className="controls space-y-4">
              {/* Playback Controls */}
              <div className="flex items-center justify-center space-x-4">
                <button
                  onClick={handlePlay}
                  disabled={isPlaying}
                  className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 px-4 py-2 rounded text-white font-medium"
                >
                  ▶️ Play
                </button>
                <button
                  onClick={handlePause}
                  disabled={!isPlaying}
                  className="bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-600 px-4 py-2 rounded text-white font-medium"
                >
                  ⏸️ Pause
                </button>
                <button
                  onClick={handleStop}
                  className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-white font-medium"
                >
                  ⏹️ Stop
                </button>
              </div>

              {/* Time Display */}
              <div className="text-center text-white">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>

              {/* Volume Control */}
              <div className="flex items-center justify-center space-x-2">
                <button
                  onClick={handleMuteToggle}
                  className="text-white hover:text-green-400"
                >
                  {isMuted ? '🔇' : '🔊'}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                  className="w-24"
                />
                <span className="text-white text-sm">
                  {Math.round((isMuted ? 0 : volume) * 100)}%
                </span>
              </div>

              {/* Debug Information */}
              <div className="text-xs text-gray-500 space-y-1">
                <div>🎵 HTML5 Audio: {isPlaying ? 'Playing' : 'Stopped'}</div>
                <div>📊 Wavesurfer: Visualization Only (Muted)</div>
                <div>🔊 Audio Source: HTML5 Element</div>
                <div>📈 Visualization: Wavesurfer Waveform</div>
              </div>
            </div>
          </div>
        );

      case 'video':
        return (
          <div className="bg-gray-800 rounded p-4">
            <video
              src={assignment.media_url}
              controls
              className="w-full h-64 bg-black rounded"
              onError={(e) => setError('Video loading failed')}
            />
          </div>
        );

      case 'image':
        return (
          <div className="bg-gray-800 rounded p-4">
            <img
              src={assignment.media_url}
              alt={assignment.title}
              className="w-full h-auto max-h-96 object-contain rounded"
              onError={(e) => setError('Image loading failed')}
            />
          </div>
        );

      case 'document':
        return (
          <div className="bg-gray-800 rounded p-4">
            <div className="text-center">
              <div className="text-6xl mb-4">📄</div>
              <div className="text-lg font-medium">{assignment.title}</div>
              <a
                href={assignment.media_url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white"
              >
                Open Document
              </a>
            </div>
          </div>
        );

      default:
        return (
          <div className="bg-gray-800 rounded p-4">
            <div className="text-center">
              <div className="text-6xl mb-4">❓</div>
              <div className="text-lg font-medium">Unknown File Type</div>
              <a
                href={assignment.media_url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded text-white"
              >
                Download File
              </a>
            </div>
          </div>
        );
    }
  };

  if (isMinimized) {
    return (
      <div
        className="fixed bg-gray-800 border border-gray-600 rounded p-2 cursor-pointer z-50"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          width: '200px'
        }}
        onClick={() => onMinimize(false)}
      >
        <div className="text-white text-sm truncate">{assignment?.title || 'Media Player'}</div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="fixed bg-gray-900 border border-gray-600 rounded-lg shadow-2xl z-40"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${size.width}px`,
        height: `${size.height}px`
      }}
    >
      {/* Title Bar */}
      <div
        className="bg-gray-700 rounded-t-lg p-3 cursor-move flex items-center justify-between"
        onMouseDown={handleMouseDown}
      >
        <div className="text-white font-medium truncate flex-1">
          {assignment?.title || 'Media Player'}
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => onMinimize(true)}
            className="text-gray-300 hover:text-white w-6 h-6 flex items-center justify-center"
          >
            ➖
          </button>
          <button
            onClick={onClose}
            className="text-gray-300 hover:text-red-400 w-6 h-6 flex items-center justify-center"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-4 overflow-auto" style={{ height: `${size.height - 60}px` }}>
        {renderMediaContent()}
      </div>

      {/* Resize Handle */}
      <div
        className="resize-handle absolute bottom-0 right-0 w-4 h-4 cursor-se-resize"
        onMouseDown={(e) => {
          e.preventDefault();
          const startX = e.clientX;
          const startY = e.clientY;
          const startWidth = size.width;
          const startHeight = size.height;

          const handleResize = (e) => {
            setSize({
              width: Math.max(400, startWidth + (e.clientX - startX)),
              height: Math.max(300, startHeight + (e.clientY - startY))
            });
          };

          const handleStopResize = () => {
            document.removeEventListener('mousemove', handleResize);
            document.removeEventListener('mouseup', handleStopResize);
          };

          document.addEventListener('mousemove', handleResize);
          document.addEventListener('mouseup', handleStopResize);
        }}
      >
        <div className="w-full h-full bg-gray-600 opacity-50"></div>
      </div>
    </div>
  );
};

// Main VoxPro Management Component
const VoxProManagement = () => {
  const [assignments, setAssignments] = useState([]);
  const [openWindows, setOpenWindows] = useState([]);
  const [minimizedWindows, setMinimizedWindows] = useState(new Set());
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [notification, setNotification] = useState(null);

  // Load assignments from Supabase
  useEffect(() => {
    loadAssignments();
  }, []);

  const loadAssignments = async () => {
    try {
      const { data, error } = await supabase
        .from('assignments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading assignments:', error);
        showNotification('Error loading assignments', 'error');
      } else {
        setAssignments(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
      showNotification('Failed to load assignments', 'error');
    }
  };

  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const openWindow = (assignment) => {
    const windowId = Date.now();
    setOpenWindows(prev => [...prev, { id: windowId, assignment }]);
  };

  const closeWindow = (windowId) => {
    setOpenWindows(prev => prev.filter(w => w.id !== windowId));
    setMinimizedWindows(prev => {
      const newSet = new Set(prev);
      newSet.delete(windowId);
      return newSet;
    });
  };

  const toggleMinimize = (windowId, minimize) => {
    setMinimizedWindows(prev => {
      const newSet = new Set(prev);
      if (minimize) {
        newSet.add(windowId);
      } else {
        newSet.delete(windowId);
      }
      return newSet;
    });
  };

  const handleFileUpload = async (formData) => {
    setIsUploading(true);
    setUploadProgress(0);

    try {
      if (!formData.mediaFile || !formData.title) {
        throw new Error('Please provide both a file and title');
      }

      // Upload file to Supabase Storage
      const fileExt = formData.mediaFile.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('media-files')
        .upload(fileName, formData.mediaFile);

      if (uploadError) throw uploadError;

      setUploadProgress(50);

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('media-files')
        .getPublicUrl(fileName);

      setUploadProgress(75);

      // Save assignment to database
      const { data, error } = await supabase
        .from('assignments')
        .insert([
          {
            title: formData.title,
            description: formData.description || '',
            media_url: urlData.publicUrl,
            key_assignment: formData.keyAssignment || null
          }
        ])
        .select();

      if (error) throw error;

      setUploadProgress(100);
      showNotification('File uploaded successfully!', 'success');
      loadAssignments(); // Refresh the list

    } catch (error) {
      console.error('Upload error:', error);
      showNotification(`Upload failed: ${error.message}`, 'error');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-green-400 mb-2">VoxPro Management</h1>
          <p className="text-gray-400">Professional Audio Visualization Platform</p>
        </div>

        {/* Notification */}
        {notification && (
          <div className={`fixed top-4 right-4 p-4 rounded-lg z-50 ${
            notification.type === 'error' ? 'bg-red-600' : 
            notification.type === 'success' ? 'bg-green-600' : 'bg-blue-600'
          }`}>
            {notification.message}
          </div>
        )}

        {/* Upload Section */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Upload Media</h2>
          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = {
              title: formData.get('title'),
              description: formData.get('description'),
              keyAssignment: formData.get('keyAssignment'),
              mediaFile: formData.get('mediaFile')
            };
            handleFileUpload(data);
          }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <input
                  type="text"
                  name="title"
                  required
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded focus:border-green-400 focus:outline-none"
                  placeholder="Assignment title..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Key Assignment (1-5)</label>
                <select
                  name="keyAssignment"
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded focus:border-green-400 focus:outline-none"
                >
                  <option value="">Select key...</option>
                  <option value="1">Key 1</option>
                  <option value="2">Key 2</option>
                  <option value="3">Key 3</option>
                  <option value="4">Key 4</option>
                  <option value="5">Key 5</option>
                </select>
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                name="description"
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded focus:border-green-400 focus:outline-none"
                rows="3"
                placeholder="Optional description..."
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Media File</label>
              <input
                type="file"
                name="mediaFile"
                required
                accept="audio/*,video/*,image/*,.pdf,.doc,.docx,.txt"
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded focus:border-green-400 focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-green-600 file:text-white hover:file:bg-green-700"
              />
            </div>
            {isUploading && (
              <div className="mb-4">
                <div className="bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="text-sm text-gray-400 mt-1">Uploading... {uploadProgress}%</p>
              </div>
            )}
            <button
              type="submit"
              disabled={isUploading}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 py-3 px-6 rounded font-medium transition-colors"
            >
              {isUploading ? 'Uploading...' : 'Upload Media'}
            </button>
          </form>
        </div>

        {/* Assignment Keys */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Assignment Keys</h2>
          <div className="grid grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5].map(keyNum => {
              const assignment = assignments.find(a => a.key_assignment === keyNum.toString());
              return (
                <div
                  key={keyNum}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    assignment 
                      ? 'bg-green-800 border-green-600 hover:bg-green-700' 
                      : 'bg-gray-700 border-gray-600 hover:bg-gray-600'
                  }`}
                  onClick={() => assignment && openWindow(assignment)}
                >
                  <div className="text-center">
                    <div className="text-2xl font-bold mb-2">{keyNum}</div>
                    {assignment ? (
                      <div>
                        <div className="text-sm font-medium truncate">{assignment.title}</div>
                        <div className="text-xs text-gray-300 mt-1">
                          {assignment.media_url?.split('.').pop()?.toUpperCase()}
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm text-gray-400">Empty</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* All Assignments List */}
        <div className="bg-gray-800 rounded-lg p-6 mt-8">
          <h2 className="text-2xl font-semibold mb-4">All Assignments</h2>
          {assignments.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              No assignments uploaded yet
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {assignments.map(assignment => (
                <div
                  key={assignment.id}
                  className="bg-gray-700 rounded-lg p-4 cursor-pointer hover:bg-gray-600 transition-colors"
                  onClick={() => openWindow(assignment)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium truncate">{assignment.title}</h3>
                    <span className="text-xs bg-green-600 px-2 py-1 rounded">
                      {assignment.media_url?.split('.').pop()?.toUpperCase()}
                    </span>
                  </div>
                  {assignment.description && (
                    <p className="text-sm text-gray-400 mb-2 line-clamp-2">
                      {assignment.description}
                    </p>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      {new Date(assignment.created_at).toLocaleDateString()}
                    </span>
                    {assignment.key_assignment && (
                      <span className="text-xs bg-blue-600 px-2 py-1 rounded">
                        Key {assignment.key_assignment}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Open Windows */}
      {openWindows.map(window => (
        <UniversalMediaPlayer
          key={window.id}
          assignment={window.assignment}
          windowId={window.id}
          isMinimized={minimizedWindows.has(window.id)}
          onClose={() => closeWindow(window.id)}
          onMinimize={(minimize) => toggleMinimize(window.id, minimize)}
        />
      ))}
    </div>
  );
};

export default VoxProManagement;
