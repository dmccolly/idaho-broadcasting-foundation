import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import WaveSurfer from 'wavesurfer.js';

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

  useEffect(() => {
    if (assignment?.media_url) {
      // Simple delay to ensure refs are available
      setTimeout(() => {
        loadMedia();
      }, 100);
    }
    
    return () => {
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
        audioRef.current.src = assignment.media_url;
        audioRef.current.load();
        initializeVisualization();
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

  const initializeVisualization = async () => {
    if (!waveformRef.current || mediaType !== 'audio' || !assignment?.media_url) return;

    try {
      if (wavesurferRef.current) {
        try {
          wavesurferRef.current.destroy();
        } catch (e) {
          console.warn('Error destroying previous Wavesurfer:', e);
        }
        wavesurferRef.current = null;
      }

      waveformRef.current.innerHTML = '';

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
      await ws.load(assignment.media_url);
      ws.setMuted(true);
      ws.setVolume(0);
      setVisualizationType('wavesurfer');

    } catch (error) {
      createFallbackVisualization();
    }
  };

  const createFallbackVisualization = () => {
    if (!waveformRef.current) return;

    waveformRef.current.innerHTML = '';
    
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
    
    waveformRef.current.appendChild(container);
    setVisualizationType('animated');
    
    if (isPlaying) {
      startFallbackAnimation();
    }
  };

  const startFallbackAnimation = () => {
    if (!waveformRef.current || visualizationType !== 'animated') return;
    
    const bars = waveformRef.current.querySelectorAll('div > div');
    
    const animate = () => {
      if (!isPlaying) return;
      
      bars.forEach((bar, index) => {
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

  const handleLoadedData = () => {
    const mediaElement = mediaType === 'audio' ? audioRef.current : videoRef.current;
    if (mediaElement) {
      setDuration(mediaElement.duration);
      setIsLoading(false);
    }
  };

  const handleTimeUpdate = () => {
    const mediaElement = mediaType === 'audio' ? audioRef.current : videoRef.current;
    if (mediaElement) {
      setCurrentTime(mediaElement.currentTime);
      
      if (wavesurferRef.current && visualizationType === 'wavesurfer') {
        const progress = mediaElement.currentTime / mediaElement.duration;
        wavesurferRef.current.seekTo(progress);
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
                  return (
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
          </div>
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
                accept="audio/*,video/*,.pdf"
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
                </div>
              </div>
            )}

            <div className="flex gap-2">
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

