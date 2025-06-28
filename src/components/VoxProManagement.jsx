import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';

// Error Boundary Component
const ErrorBoundary = ({ children, fallback }) => {
  const [hasError, setHasError] = useState(false);
  
  useEffect(() => {
    const handleError = (error) => {
      console.error('Error caught by boundary:', error);
      setHasError(true);
    };
    
    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);
  
  if (hasError) {
    return fallback || <div className="text-red-400 p-4">Something went wrong with media playback</div>;
  }
  
  return children;
};

// Enhanced Universal Media Player Component
const UniversalMediaPlayer = ({ assignment, onClose, onMinimize, isMinimized, windowId }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [error, setError] = useState(null);
  const [visualizationType, setVisualizationType] = useState('none');

  // Media refs
  const audioRef = useRef(null);
  const videoRef = useRef(null);
  const waveformRef = useRef(null);
  const wavesurferRef = useRef(null);
  const animationRef = useRef(null);

  // Window drag/resize state
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [windowPos, setWindowPos] = useState({ x: 100, y: 100 });
  const [windowSize, setWindowSize] = useState({ width: 800, height: 600 });
  const windowRef = useRef(null);

  const mediaType = assignment?.media_url ? 
    (assignment.media_url.match(/\.(mp3|wav|ogg|m4a|aac)$/i) ? 'audio' : 
     assignment.media_url.match(/\.(mp4|webm|mov|avi)$/i) ? 'video' : 
     assignment.media_url.match(/\.(pdf)$/i) ? 'pdf' : 'unknown') : 'unknown';

  // FIXED: Proper useEffect dependencies and cleanup
  useEffect(() => {
    if (assignment?.media_url) {
      const timer = setTimeout(() => {
        loadMedia();
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [assignment?.media_url, mediaType]); // Added proper dependencies

  // Cleanup effect
  useEffect(() => {
    return () => {
      // Cleanup WaveSurfer more safely
      if (wavesurferRef.current) {
        try {
          if (typeof wavesurferRef.current.destroy === 'function') {
            wavesurferRef.current.destroy();
          }
        } catch (e) {
          console.warn('Wavesurfer cleanup error:', e);
        }
        wavesurferRef.current = null;
      }
      
      // Cleanup animation
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, []);

  const loadMedia = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (mediaType === 'audio' && audioRef.current) {
        audioRef.current.src = assignment.media_url;
        audioRef.current.load();
        // Add delay before initializing visualization
        setTimeout(() => {
          initializeVisualization();
        }, 200);
      } else if (mediaType === 'video' && videoRef.current) {
        videoRef.current.src = assignment.media_url;
        videoRef.current.load();
      } else if (mediaType === 'pdf') {
        setIsLoading(false);
      }

    } catch (error) {
      setError(`Failed to load ${mediaType}: ${error.message}`);
      setIsLoading(false);
    }
  };

  // FIXED: Improved WaveSurfer initialization with better error handling
  const initializeVisualization = async () => {
    if (!waveformRef.current || mediaType !== 'audio' || !assignment?.media_url) return;

    try {
      // Cleanup existing instance more safely
      if (wavesurferRef.current) {
        try {
          if (typeof wavesurferRef.current.destroy === 'function') {
            wavesurferRef.current.destroy();
          }
        } catch (e) {
          console.warn('Error destroying previous Wavesurfer:', e);
        }
        wavesurferRef.current = null;
      }

      // Clear container safely
      if (waveformRef.current) {
        waveformRef.current.innerHTML = '';
      }

      // Check if WaveSurfer is available and properly imported
      let WaveSurfer;
      try {
        // Try different import patterns
        WaveSurfer = (await import('wavesurfer.js')).default;
        if (!WaveSurfer && window.WaveSurfer) {
          WaveSurfer = window.WaveSurfer;
        }
      } catch (importError) {
        console.warn('WaveSurfer import failed:', importError);
        createFallbackVisualization();
        return;
      }

      if (!WaveSurfer || typeof WaveSurfer.create !== 'function') {
        console.warn('WaveSurfer not available, using fallback');
        createFallbackVisualization();
        return;
      }

      const ws = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: '#4ade80',
        progressColor: '#059669',
        cursorColor: '#ffffff',
        height: 80,
        normalize: true,
        backend: 'MediaElement',
        interact: false,
        barWidth: 2,
        barGap: 1,
        barRadius: 3,
        responsive: true,
        hideScrollbar: true,
        fillParent: true
      });

      wavesurferRef.current = ws;
      
      // Add error handler for loading
      ws.on('error', (error) => {
        console.error('WaveSurfer error:', error);
        createFallbackVisualization();
      });
      
      await ws.load(assignment.media_url);
      ws.setMuted(true);
      ws.setVolume(0);
      setVisualizationType('wavesurfer');

    } catch (error) {
      console.error('WaveSurfer initialization failed:', error);
      createFallbackVisualization();
    }
  };

  // FIXED: Safer DOM manipulation and better error handling
  const createFallbackVisualization = () => {
    if (!waveformRef.current) return;

    try {
      // Create container with React-friendly approach
      const container = document.createElement('div');
      container.className = 'flex items-end justify-center h-20 gap-1 bg-gray-900 rounded p-2';

      for (let i = 0; i < 60; i++) {
        const bar = document.createElement('div');
        bar.className = 'bg-green-500 rounded-t transition-all duration-150';
        bar.style.width = '2px';
        bar.style.height = '4px';
        bar.style.opacity = '0.7';
        container.appendChild(bar);
      }

      // Clear and append safely
      waveformRef.current.innerHTML = '';
      waveformRef.current.appendChild(container);
      setVisualizationType('animated');

      if (isPlaying) {
        startFallbackAnimation();
      }
    } catch (error) {
      console.error('Failed to create fallback visualization:', error);
      setVisualizationType('none');
    }
  };

  // FIXED: Better animation cleanup and error handling
  const startFallbackAnimation = () => {
    if (!waveformRef.current || visualizationType !== 'animated') return;
    
    // Cancel existing animation
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    
    const bars = waveformRef.current.querySelectorAll('div > div');
    
    const animate = () => {
      // Check if component is still mounted and playing
      if (!isPlaying || !waveformRef.current) {
        animationRef.current = null;
        return;
      }
      
      bars.forEach((bar, index) => {
        try {
          const wave = Math.sin((Date.now() * 0.01) + (index * 0.2)) * 25 + 15;
          const randomHeight = Math.random() * 20 + 10;
          const finalHeight = Math.max(4, wave + randomHeight);
          
          bar.style.height = `${finalHeight}px`;
          bar.style.opacity = Math.random() * 0.5 + 0.5;
        } catch (error) {
          console.warn('Animation error:', error);
        }
      });
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
  };

  const handleLoadedData = () => {
    const mediaElement = mediaType === 'audio' ? audioRef.current : videoRef.current;
    if (mediaElement) {
      setDuration(mediaElement.duration);
      setIsLoading(false);
    }
  };

  // FIXED: Safer handleTimeUpdate with better error handling
  const handleTimeUpdate = () => {
    const mediaElement = mediaType === 'audio' ? audioRef.current : videoRef.current;
    if (!mediaElement) return;
    
    setCurrentTime(mediaElement.currentTime);
    
    // Safer wavesurfer update
    if (wavesurferRef.current && 
        visualizationType === 'wavesurfer' && 
        typeof wavesurferRef.current.seekTo === 'function' &&
        mediaElement.duration > 0) {
      try {
        const progress = mediaElement.currentTime / mediaElement.duration;
        wavesurferRef.current.seekTo(progress);
      } catch (error) {
        console.warn('WaveSurfer seek error:', error);
      }
    }
  };

  const handlePlay = () => {
    setIsPlaying(true);

    if (visualizationType === 'animated') {
      startFallbackAnimation();
    }
  };

  const handlePause = () => {
    setIsPlaying(false);

    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);

    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  };

  const handleError = (e) => {
    const errorMessage = e.target.error?.message || 'Unknown error';
    setError(`${mediaType} playback error: ${errorMessage}`);
    setIsLoading(false);
    setIsPlaying(false);
  };

  const togglePlayPause = () => {
    const mediaElement = mediaType === 'audio' ? audioRef.current : videoRef.current;
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
    const mediaElement = mediaType === 'audio' ? audioRef.current : videoRef.current;
    if (!mediaElement || !duration) return;

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

    const mediaElement = mediaType === 'audio' ? audioRef.current : videoRef.current;
    if (mediaElement) {
      mediaElement.volume = newVolume;
    }
  };

  const toggleMute = () => {
    const mediaElement = mediaType === 'audio' ? audioRef.current : videoRef.current;
    if (!mediaElement) return;

    const newMuted = !isMuted;
    setIsMuted(newMuted);
    mediaElement.muted = newMuted;
  };

  const handleMouseDown = (e) => {
    if (e.target.closest('.resize-handle')) return;

    setIsDragging(true);
    setDragStart({
      x: e.clientX - windowPos.x,
      y: e.clientY - windowPos.y
    });
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      setWindowPos({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
  };

  const handleResizeStart = (e) => {
    e.stopPropagation();
    setIsResizing(true);
    setDragStart({
      x: e.clientX,
      y: e.clientY
    });
  };

  const handleResizeMove = (e) => {
    if (isResizing) {
      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;

      setWindowSize(prev => ({
        width: Math.max(400, prev.width + deltaX),
        height: Math.max(300, prev.height + deltaY)
      }));

      setDragStart({
        x: e.clientX,
        y: e.clientY
      });
    }
  };

  // FIXED: Better event listener management
  useEffect(() => {
    if (isDragging || isResizing) {
      const handleMove = isDragging ? handleMouseMove : handleResizeMove;
      
      document.addEventListener('mousemove', handleMove);
      document.addEventListener('mouseup', handleMouseUp);

      return () => {
        document.removeEventListener('mousemove', handleMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isResizing, dragStart, windowPos]);

  const formatTime = (seconds) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 bg-gray-800 text-white p-2 rounded-lg shadow-lg z-50">
        <div className="flex items-center gap-2">
          <span className="text-sm">{assignment?.title}</span>
          <button
            onClick={() => onMinimize(windowId)}
            className="text-blue-400 hover:text-blue-300"
          >
            ↗️
          </button>
          <button
            onClick={() => onClose(windowId)}
            className="text-red-400 hover:text-red-300"
          >
            ✕
          </button>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary fallback={<div className="text-red-400 p-4">Media player error occurred</div>}>
      <div
        ref={windowRef}
        className="fixed bg-gray-900 border border-gray-600 rounded-lg shadow-2xl z-40 overflow-hidden"
        style={{
          left: windowPos.x,
          top: windowPos.y,
          width: windowSize.width,
          height: windowSize.height,
          cursor: isDragging ? 'grabbing' : 'grab'
        }}
      >
        <div
          className="bg-gray-800 text-white p-3 flex justify-between items-center cursor-grab active:cursor-grabbing select-none"
          onMouseDown={handleMouseDown}
        >
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium truncate">
              {assignment?.title || 'Media Player'}
            </span>
            {mediaType && (
              <span className="text-xs bg-gray-700 px-2 py-1 rounded">
                {mediaType.toUpperCase()}
              </span>
            )}
            {visualizationType !== 'none' && (
              <span className="text-xs bg-green-700 px-2 py-1 rounded">
                {visualizationType === 'wavesurfer' ? '📊 WAVE' : '🎨 ANIM'}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onMinimize(windowId)}
              className="text-blue-400 hover:text-blue-300 text-sm"
            >
              ➖
            </button>
            <button
              onClick={() => onClose(windowId)}
              className="text-red-400 hover:text-red-300 text-sm"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="flex-1 bg-gray-800 text-white overflow-hidden" style={{ height: 'calc(100% - 48px)' }}>
          {error && (
            <div className="p-4 bg-red-900 text-red-100 text-sm">
              ⚠️ {error}
            </div>
          )}

          {isLoading && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin text-2xl mb-2">⏳</div>
                <div>Loading {mediaType}...</div>
              </div>
            </div>
          )}

          {mediaType === 'pdf' && !isLoading && (
            <div className="h-full w-full">
              <iframe
                src={assignment.media_url}
                className="w-full h-full border-0"
                style={{
                  zoom: Math.min(windowSize.width / 600, windowSize.height / 800),
                  transformOrigin: 'top left'
                }}
                title={assignment.title}
              />
            </div>
          )}

          {mediaType === 'audio' && !isLoading && (
            <div className="h-full flex flex-col">
              <audio
                ref={audioRef}
                onLoadedData={handleLoadedData}
                onTimeUpdate={handleTimeUpdate}
                onPlay={handlePlay}
                onPause={handlePause}
                onEnded={handleEnded}
                onError={handleError}
                preload="metadata"
              />

              <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 p-4">
                <div className="text-center w-full">
                  <div className="text-6xl mb-4">🎵</div>
                  <div className="text-xl font-medium mb-2">{assignment?.title}</div>
                  <div className="text-gray-400 mb-4">Audio File</div>

                  <div className="relative w-full h-20 mb-4 bg-gray-900 rounded border border-gray-700 overflow-hidden">
                    <div 
                      ref={waveformRef}
                      className="absolute inset-0 w-full h-full"
                    />

                    {duration > 0 && (
                      <div 
                        className="absolute top-0 left-0 h-full bg-green-600 bg-opacity-30 transition-all duration-100"
                        style={{ width: `${(currentTime / duration) * 100}%` }}
                      />
                    )}
                  </div>

                  <div className="text-xs text-gray-500">
                    {visualizationType === 'wavesurfer' && '📊 Wavesurfer Visualization'}
                    {visualizationType === 'animated' && '🎨 Enhanced Audio Visualization'}
                    {visualizationType === 'none' && '⚪ No Visualization'}
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gray-900 border-t border-gray-700">
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
          )}

          {mediaType === 'video' && !isLoading && (
            <div className="h-full flex flex-col">
              <video
                ref={videoRef}
                onLoadedData={handleLoadedData}
                onTimeUpdate={handleTimeUpdate}
                onPlay={handlePlay}
                onPause={handlePause}
                onEnded={handleEnded}
                onError={handleError}
                className="flex-1 w-full object-contain bg-black"
                controls
                preload="metadata"
              />
            </div>
          )}
        </div>

        <div
          className="absolute bottom-0 right-0 w-4 h-4 cursor-nw-resize resize-handle"
          onMouseDown={handleResizeStart}
          style={{
            background: 'linear-gradient(-45deg, transparent 30%, #4b5563 30%, #4b5563 70%, transparent 70%)'
          }}
        />
      </div>
    </ErrorBoundary>
  );
};

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

  // FIXED: Improved file upload with validation and better error handling
  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file || !selectedKeySlot) return;

    // Validate file size (100MB limit)
    const maxSize = 100 * 1024 * 1024; // 100MB
    if (file.size > maxSize) {
      setError('File too large. Maximum size is 100MB.');
      return;
    }

    // Validate file type
    const allowedTypes = [
      'audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/m4a', 'audio/aac',
      'video/mp4', 'video/webm', 'video/mov',
      'application/pdf'
    ];
    
    if (!allowedTypes.includes(file.type)) {
      setError('Unsupported file type. Please upload audio, video, or PDF files.');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setUploadStatus('Uploading...');
    setError(null); // Clear previous errors

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
    } finally {
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
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
    setError(null); // Clear errors when clearing form
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

              <div className="bg-blue-600 text-white px-4 py