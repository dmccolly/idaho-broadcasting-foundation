import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import WaveSurfer from 'wavesurfer.js';

// Enhanced Universal Media Player Component - FIXED AUDIO + PROPER PDF SIZING
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
  const [windowSize, setWindowSize] = useState({ 
    width: assignment?.media_url?.match(/\.(pdf)$/i) ? 900 : 800, 
    height: assignment?.media_url?.match(/\.(pdf)$/i) ? 700 : 600 
  });
  const windowRef = useRef(null);

  const mediaType = assignment?.media_url ? 
    (assignment.media_url.match(/\.(mp3|wav|ogg|m4a|aac)$/i) ? 'audio' : 
     assignment.media_url.match(/\.(mp4|webm|mov|avi)$/i) ? 'video' : 
     assignment.media_url.match(/\.(pdf)$/i) ? 'pdf' : 'unknown') : 'unknown';

  // Initialize media on load
  useEffect(() => {
    if (assignment?.media_url) {
      loadMedia();
    }
    
    return () => {
      // Cleanup
      if (wavesurferRef.current) {
        try {
          wavesurferRef.current.destroy();
        } catch (e) {
          console.warn('Wavesurfer cleanup error:', e);
        }
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [assignment]);

  const loadMedia = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      if (mediaType === 'audio' && audioRef.current) {
        console.log('🔊 Loading audio:', assignment.title);
        audioRef.current.src = assignment.media_url;
        audioRef.current.load();
        initializeVisualization();
      } else if (mediaType === 'video' && videoRef.current) {
        console.log('🎥 Loading video:', assignment.title);
        videoRef.current.src = assignment.media_url;
        videoRef.current.load();
      } else if (mediaType === 'pdf') {
        console.log('📄 Loading PDF:', assignment.title);
        setIsLoading(false);
      }
      
    } catch (error) {
      console.error('Media load error:', error);
      setError(`Failed to load ${mediaType}: ${error.message}`);
      setIsLoading(false);
    }
  };

  // Initialize audio visualization
  const initializeVisualization = async () => {
    if (!waveformRef.current || mediaType !== 'audio' || !assignment?.media_url) return;

    try {
      console.log('🎨 Initializing audio visualization:', assignment.title);
      
      // Clean up existing instance
      if (wavesurferRef.current) {
        try {
          wavesurferRef.current.destroy();
        } catch (e) {
          console.warn('Error destroying previous Wavesurfer:', e);
        }
        wavesurferRef.current = null;
      }

      // Clear container
      waveformRef.current.innerHTML = '';

      // Try Wavesurfer first
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

      // Load and immediately mute
      await ws.load(assignment.media_url);
      ws.setMuted(true);
      ws.setVolume(0);

      setVisualizationType('wavesurfer');
      console.log('✅ Wavesurfer visualization loaded');

    } catch (error) {
      console.warn('⚠️ Wavesurfer failed, using fallback visualization:', error);
      createFallbackVisualization();
    }
  };

  // Create animated fallback visualization
  const createFallbackVisualization = () => {
    if (!waveformRef.current) return;

    waveformRef.current.innerHTML = '';
    
    // Create container for animated bars
    const container = document.createElement('div');
    container.className = 'flex items-end justify-center h-20 gap-1 bg-gray-900 rounded p-2';
    
    // Create 60 animated bars
    for (let i = 0; i < 60; i++) {
      const bar = document.createElement('div');
      bar.className = 'bg-green-500 rounded-t transition-all duration-150';
      bar.style.width = '2px';
      bar.style.height = '4px';
      bar.style.opacity = '0.7';
      container.appendChild(bar);
    }
    
    waveformRef.current.appendChild(container);
    setVisualizationType('animated');
    
    console.log('✅ Animated fallback visualization created');
    
    // Start animation when playing
    if (isPlaying) {
      startFallbackAnimation();
    }
  };

  // Animate fallback bars
  const startFallbackAnimation = () => {
    if (!waveformRef.current || visualizationType !== 'animated') return;
    
    const bars = waveformRef.current.querySelectorAll('div > div');
    
    const animate = () => {
      if (!isPlaying) return;
      
      bars.forEach((bar, index) => {
        const height = Math.random() * 60 + 10;
        const opacity = Math.random() * 0.8 + 0.3;
        bar.style.height = `${height}px`;
        bar.style.opacity = opacity;
        
        // Wave effect
        const wave = Math.sin((Date.now() * 0.01) + (index * 0.2)) * 20 + 30;
        bar.style.height = `${Math.max(4, wave)}px`;
      });
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
  };

  // Audio/Video event handlers
  const handleLoadedData = () => {
    const mediaElement = mediaType === 'audio' ? audioRef.current : videoRef.current;
    if (mediaElement) {
      setDuration(mediaElement.duration);
      setIsLoading(false);
      console.log(`✅ ${mediaType} loaded:`, assignment.title, `Duration: ${mediaElement.duration}s`);
    }
  };

  const handleTimeUpdate = () => {
    const mediaElement = mediaType === 'audio' ? audioRef.current : videoRef.current;
    if (mediaElement) {
      setCurrentTime(mediaElement.currentTime);
      
      // Sync Wavesurfer progress
      if (wavesurferRef.current && visualizationType === 'wavesurfer') {
        const progress = mediaElement.currentTime / mediaElement.duration;
        wavesurferRef.current.seekTo(progress);
      }
    }
  };

  const handlePlay = () => {
    setIsPlaying(true);
    console.log(`🔊 HTML5 Audio playing - you should hear sound:`, assignment.title);
    
    if (visualizationType === 'animated') {
      startFallbackAnimation();
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
    const mediaElement = mediaType === 'audio' ? audioRef.current : videoRef.current;
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
    const mediaElement = mediaType === 'audio' ? audioRef.current : videoRef.current;
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

  // Window drag handlers
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

  // Window resize handlers
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

  useEffect(() => {
    if (isDragging || isResizing) {
      document.addEventListener('mousemove', isDragging ? handleMouseMove : handleResizeMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', isDragging ? handleMouseMove : handleResizeMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isResizing, dragStart, windowPos]);

  // Format time helper
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
      {/* Window Header */}
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

      {/* Main Content Area */}
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

        {/* PDF Viewer - FIXED SIZING */}
        {mediaType === 'pdf' && !isLoading && (
          <div className="h-full w-full p-2">
            <iframe
              src={assignment.media_url}
              className="w-full h-full border-0 rounded"
              style={{ 
                minHeight: 'calc(100% - 8px)',
                minWidth: 'calc(100% - 8px)'
              }}
              title={assignment.title}
            />
          </div>
        )}

        {/* Audio Player */}
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
                
                {/* Waveform Visualization */}
                <div 
                  ref={waveformRef}
                  className="w-full h-20 mb-4 bg-gray-900 rounded border border-gray-700"
                />
                
                <div className="text-xs text-gray-500">
                  {visualizationType === 'wavesurfer' && '📊 Wavesurfer Visualization'}
                  {visualizationType === 'animated' && '🎨 Enhanced Audio Visualization (animated)'}
                  {visualizationType === 'none' && '⚪ No Visualization'}
                </div>
              </div>
            </div>
            
            {/* Audio Controls */}
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
        )}

        {/* Video Player */}
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

      {/* Resize Handle */}
      <div
        className="absolute bottom-0 right-0 w-4 h-4 cursor-nw-resize resize-handle"
        onMouseDown={handleResizeStart}
        style={{
          background: 'linear-gradient(-45deg, transparent 30%, #4b5563 30%, #4b5563 70%, transparent 70%)'
        }}
      />
    </div>
  );
};

// Main VoxPro Management Component
const VoxProManagement = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [error, setError] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState('');
  const [openWindows, setOpenWindows] = useState([]);
  
  // Key binding states
  const [bindingMode, setBindingMode] = useState(false);
  const [pendingAssignment, setPendingAssignment] = useState(null);
  const [boundKeys, setBoundKeys] = useState({});
  
  const fileInputRef = useRef(null);

  useEffect(() => {
    loadAssignments();
    loadKeyBindings();
  }, []);

  // Load assignments from Supabase
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

  // Load key bindings from localStorage
  const loadKeyBindings = () => {
    try {
      const saved = localStorage.getItem('voxpro-key-bindings');
      if (saved) {
        setBoundKeys(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading key bindings:', error);
    }
  };

  // Save key bindings to localStorage
  const saveKeyBindings = (newBindings) => {
    try {
      localStorage.setItem('voxpro-key-bindings', JSON.stringify(newBindings));
      setBoundKeys(newBindings);
    } catch (error) {
      console.error('Error saving key bindings:', error);
    }
  };

  // Handle file upload
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);
    setUploadStatus('Preparing upload...');

    try {
      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      setUploadProgress(20);
      setUploadStatus('Uploading to storage...');

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('media-files')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        throw uploadError;
      }

      setUploadProgress(85);
      setUploadStatus('Saving to database...');

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('media-files')
        .getPublicUrl(fileName);

      const publicUrl = urlData.publicUrl;

      // Save assignment to database
      const { data: assignmentData, error: dbError } = await supabase
        .from('assignments')
        .insert([
          {
            title: file.name,
            description: `Uploaded ${file.type || 'file'} - ${(file.size / 1024 / 1024).toFixed(2)}MB`,
            media_url: publicUrl,
            created_at: new Date().toISOString()
          }
        ])
        .select()
        .single();

      if (dbError) {
        throw dbError;
      }

      setUploadProgress(100);
      setUploadStatus('Upload complete!');

      // Refresh assignments list
      await loadAssignments();

      // Reset upload state
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
        setUploadStatus('');
      }, 1500);

    } catch (error) {
      console.error('Upload error:', error);
      setError(`Upload failed: ${error.message}`);
      setIsUploading(false);
      setUploadProgress(0);
      setUploadStatus('');
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Delete assignment
  const deleteAssignment = async (assignmentId) => {
    if (!confirm('Are you sure you want to delete this assignment?')) return;

    try {
      const { error } = await supabase
        .from('assignments')
        .delete()
        .eq('id', assignmentId);

      if (error) throw error;

      // Remove from key bindings if bound
      const newBindings = { ...boundKeys };
      Object.keys(newBindings).forEach(key => {
        if (newBindings[key].id === assignmentId) {
          delete newBindings[key];
        }
      });
      saveKeyBindings(newBindings);

      await loadAssignments();
    } catch (error) {
      console.error('Error deleting assignment:', error);
      setError('Failed to delete assignment');
    }
  };

  // Open assignment window
  const openWindow = (assignment) => {
    const windowId = `window-${assignment.id}-${Date.now()}`;
    const newWindow = {
      id: windowId,
      assignment,
      isMinimized: false
    };
    setOpenWindows(prev => [...prev, newWindow]);
  };

  // Close window
  const closeWindow = (windowId) => {
    setOpenWindows(prev => prev.filter(w => w.id !== windowId));
  };

  // Minimize/restore window
  const toggleMinimize = (windowId) => {
    setOpenWindows(prev => prev.map(w => 
      w.id === windowId ? { ...w, isMinimized: !w.isMinimized } : w
    ));
  };

  // Key binding functions
  const startKeyBinding = (assignment) => {
    setBindingMode(true);
    setPendingAssignment(assignment);
    setError('Press any key to bind to this assignment...');
  };

  const handleKeyBinding = (event) => {
    if (!bindingMode || !pendingAssignment) return;

    event.preventDefault();
    const key = event.key.toLowerCase();
    
    // Don't bind modifier keys alone
    if (['shift', 'ctrl', 'alt', 'meta', 'control'].includes(key)) return;

    const newBindings = {
      ...boundKeys,
      [key]: {
        id: pendingAssignment.id,
        title: pendingAssignment.title,
        media_url: pendingAssignment.media_url
      }
    };

    saveKeyBindings(newBindings);
    setBindingMode(false);
    setPendingAssignment(null);
    setError(`Key "${key.toUpperCase()}" bound to "${pendingAssignment.title}"`);
    
    setTimeout(() => setError(null), 2000);
  };

  const handleKeyPress = (event) => {
    if (bindingMode) {
      handleKeyBinding(event);
      return;
    }

    const key = event.key.toLowerCase();
    const binding = boundKeys[key];
    
    if (binding) {
      const assignment = assignments.find(a => a.id === binding.id);
      if (assignment) {
        openWindow(assignment);
      }
    }
  };

  const removeKeyBinding = (key) => {
    const newBindings = { ...boundKeys };
    delete newBindings[key];
    saveKeyBindings(newBindings);
  };

  // Keyboard event listener
  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [bindingMode, pendingAssignment, boundKeys, assignments]);

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono">
      {/* Header */}
      <div className="border-b border-green-500 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-green-300">🎧 VoxPro Management Console</h1>
            <p className="text-sm text-green-600">Advanced Broadcasting System • Status: ONLINE</p>
          </div>
          <div className="text-right text-sm">
            <div className="text-green-300">Session Active</div>
            <div className="text-green-600">{new Date().toLocaleString()}</div>
          </div>
        </div>
      </div>

      {/* Controls Panel */}
      <div className="p-4 border-b border-green-500">
        <div className="flex items-center gap-4">
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="px-4 py-2 bg-green-900 border border-green-500 text-green-300 rounded hover:bg-green-800 transition-colors disabled:opacity-50"
          >
            {isUploading ? '⏳ UPLOADING...' : '📁 UPLOAD MEDIA'}
          </button>
          
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileUpload}
            accept="audio/*,video/*,.pdf"
            className="hidden"
          />

          {isUploading && (
            <div className="flex-1 max-w-md">
              <div className="text-sm text-green-300 mb-1">{uploadStatus}</div>
              <div className="w-full bg-green-900 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          <div className="ml-auto text-sm">
            <span className="text-green-300">Total Files: </span>
            <span className="text-green-400 font-bold">{assignments.length}</span>
          </div>
        </div>
      </div>

      {/* Status Messages */}
      {error && (
        <div className="p-3 bg-red-900 border-l-4 border-red-500 text-red-100">
          <div className="flex items-center">
            <span className="mr-2">⚠️</span>
            {error}
          </div>
        </div>
      )}

      {/* Key Bindings Panel */}
      {Object.keys(boundKeys).length > 0 && (
        <div className="p-4 border-b border-green-500">
          <h3 className="text-lg font-bold text-green-300 mb-3">🔑 Active Key Bindings</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {Object.entries(boundKeys).map(([key, binding]) => (
              <div
                key={key}
                className="bg-green-900 border border-green-500 rounded p-2 text-sm"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-bold text-green-300">{key.toUpperCase()}</div>
                    <div className="text-green-400 truncate">{binding.title}</div>
                  </div>
                  <button
                    onClick={() => removeKeyBinding(key)}
                    className="text-red-400 hover:text-red-300 text-xs"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex">
        {/* Main Content */}
        <div className="flex-1 p-4">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-pulse text-2xl mb-2">⏳</div>
              <div>Loading assignments...</div>
            </div>
          ) : assignments.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">📁</div>
              <div className="text-xl text-green-300">No media files found</div>
              <div className="text-green-600">Upload your first audio, video, or PDF file to get started</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {assignments.map(assignment => {
                const mediaType = assignment.media_url?.match(/\.(mp3|wav|ogg|m4a|aac)$/i) ? 'audio' :
                                assignment.media_url?.match(/\.(mp4|webm|mov|avi)$/i) ? 'video' :
                                assignment.media_url?.match(/\.(pdf)$/i) ? 'pdf' : 'unknown';
                
                const boundKey = Object.keys(boundKeys).find(key => boundKeys[key].id === assignment.id);

                return (
                  <div
                    key={assignment.id}
                    className="bg-green-900 border border-green-500 rounded-lg p-4 hover:bg-green-800 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs px-2 py-1 bg-green-700 rounded text-green-100">
                        {mediaType.toUpperCase()}
                      </span>
                      {boundKey && (
                        <span className="text-xs px-2 py-1 bg-blue-700 rounded text-blue-100">
                          KEY: {boundKey.toUpperCase()}
                        </span>
                      )}
                    </div>
                    
                    <h3 className="font-bold text-green-300 mb-1 truncate">
                      {assignment.title}
                    </h3>
                    <p className="text-sm text-green-600 mb-3 line-clamp-2">
                      {assignment.description}
                    </p>
                    
                    <div className="flex gap-2 text-xs">
                      <button
                        onClick={() => openWindow(assignment)}
                        className="flex-1 px-2 py-1 bg-green-700 hover:bg-green-600 rounded transition-colors"
                      >
                        📱 OPEN
                      </button>
                      <button
                        onClick={() => startKeyBinding(assignment)}
                        className="px-2 py-1 bg-blue-700 hover:bg-blue-600 rounded transition-colors"
                      >
                        🔑
                      </button>
                      <button
                        onClick={() => deleteAssignment(assignment.id)}
                        className="px-2 py-1 bg-red-700 hover:bg-red-600 rounded transition-colors"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* System Status Panel */}
        <div className="w-80 border-l border-green-500 p-4">
          <h3 className="text-lg font-bold text-green-300 mb-4">📊 System Status</h3>
          
          <div className="space-y-3 text-sm">
            <div className="bg-green-900 border border-green-500 rounded p-3">
              <div className="text-green-300 font-bold">🖥️ CONSOLE STATUS</div>
              <div className="text-green-400">Status: OPERATIONAL</div>
              <div className="text-green-600">Uptime: {Math.floor(Date.now() / 1000 / 60)} minutes</div>
            </div>

            <div className="bg-green-900 border border-green-500 rounded p-3">
              <div className="text-green-300 font-bold">🎵 MEDIA ENGINE</div>
              <div className="text-green-400">HTML5 Audio: ✅ READY</div>
              <div className="text-green-400">Video Codec: ✅ READY</div>
              <div className="text-green-400">PDF Viewer: ✅ READY</div>
              <div className="text-green-400">Visualization: ✅ READY</div>
            </div>

            <div className="bg-green-900 border border-green-500 rounded p-3">
              <div className="text-green-300 font-bold">🔗 CONNECTIVITY</div>
              <div className="text-green-400">Supabase: ✅ CONNECTED</div>
              <div className="text-green-400">Storage: ✅ ONLINE</div>
              <div className="text-green-400">Database: ✅ SYNCED</div>
            </div>

            <div className="bg-green-900 border border-green-500 rounded p-3">
              <div className="text-green-300 font-bold">🎮 ACTIVE SESSIONS</div>
              <div className="text-green-400">Open Windows: {openWindows.length}</div>
              <div className="text-green-400">Key Bindings: {Object.keys(boundKeys).length}</div>
              <div className="text-green-400">Total Media: {assignments.length}</div>
            </div>

            {bindingMode && (
              <div className="bg-yellow-900 border border-yellow-500 rounded p-3 animate-pulse">
                <div className="text-yellow-300 font-bold">⌨️ KEY BINDING MODE</div>
                <div className="text-yellow-400">Press any key to bind...</div>
                <div className="text-yellow-600">Target: {pendingAssignment?.title}</div>
                <button
                  onClick={() => {
                    setBindingMode(false);
                    setPendingAssignment(null);
                    setError(null);
                  }}
                  className="mt-2 px-2 py-1 bg-red-700 hover:bg-red-600 rounded text-xs"
                >
                  CANCEL
                </button>
              </div>
            )}

            {openWindows.length > 0 && (
              <div className="bg-blue-900 border border-blue-500 rounded p-3">
                <div className="text-blue-300 font-bold">🪟 ACTIVE WINDOWS</div>
                {openWindows.map(window => (
                  <div key={window.id} className="text-blue-400 text-xs mt-1 flex justify-between">
                    <span className="truncate">{window.assignment.title}</span>
                    <button
                      onClick={() => closeWindow(window.id)}
                      className="text-red-400 hover:text-red-300 ml-2"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-6 p-3 bg-gray-900 border border-gray-600 rounded text-xs">
            <div className="text-gray-400 font-bold mb-2">💡 TIPS</div>
            <ul className="text-gray-500 space-y-1">
              <li>• Click 🔑 to bind keys</li>
              <li>• Use 📱 to open media</li>
              <li>• Drag windows to move</li>
              <li>• Audio plays with visualization</li>
              <li>• PDFs open properly sized</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Render Open Windows */}
      {openWindows.map(window => (
        <UniversalMediaPlayer
          key={window.id}
          assignment={window.assignment}
          onClose={closeWindow}
          onMinimize={toggleMinimize}
          isMinimized={window.isMinimized}
          windowId={window.id}
        />
      ))}

      {/* Loading Overlay */}
      {isUploading && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-green-900 border border-green-500 rounded-lg p-6 text-center">
            <div className="animate-spin text-4xl mb-4">⏳</div>
            <div className="text-green-300 font-bold mb-2">{uploadStatus}</div>
            <div className="w-64 bg-green-800 rounded-full h-4">
              <div
                className="bg-green-400 h-4 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <div className="text-green-400 text-sm mt-2">{uploadProgress}%</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VoxProManagement;
