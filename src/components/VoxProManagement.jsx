import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import WaveSurfer from 'wavesurfer.js';

// Enhanced Universal Media Player Component - FINAL
const UniversalMediaPlayer = ({ assignment, onClose, onMinimize, isMinimized, windowId }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mediaType, setMediaType] = useState(null);
  const [windowSize, setWindowSize] = useState({ width: 800, height: 600 });
  const [windowPosition, setWindowPosition] = useState({ x: window.innerWidth - 820, y: window.innerHeight - 620 });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isMaximized, setIsMaximized] = useState(false);
  const [previousSize, setPreviousSize] = useState(null);

  // Audio states
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [audioReady, setAudioReady] = useState(false);

  const playerRef = useRef(null); // HTML5 audio element for SOUND ONLY
  const waveformRef = useRef(null);
  const wavesurferRef = useRef(null); // Wavesurfer for VISUALIZATION ONLY
  const windowRef = useRef(null);

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

  const initializeWavesurfer = async () => {
    if (!waveformRef.current || mediaType !== 'audio' || !assignment?.media_url) return;

    if (wavesurferRef.current) {
        wavesurferRef.current.destroy();
    }

    try {
      const ws = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: '#4ade80',
        progressColor: '#059669',
        cursorColor: '#ffffff',
        height: 80,
        normalize: true,
        interact: true, // Allow seeking
        barWidth: 2,
        barGap: 1,
        barRadius: 3,
        responsive: true,
        hideScrollbar: true,
        fillParent: true
      });
      wavesurferRef.current = ws;

      ws.on('seek', (progress) => {
        if (playerRef.current) {
          playerRef.current.currentTime = playerRef.current.duration * progress;
        }
      });

      ws.on('ready', () => ws.setMuted(true));
      ws.on('error', () => createFallbackVisualization());
      ws.load(assignment.media_url);

    } catch (error) {
      createFallbackVisualization();
    }
  };

  const createFallbackVisualization = () => {
    if (!waveformRef.current) return;
    waveformRef.current.innerHTML = `<div class="w-full h-full flex items-center justify-center bg-gray-900 text-gray-400">Waveform unavailable.</div>`;
  };

  useEffect(() => {
    if (mediaType === 'audio') {
      initializeWavesurfer();
    }
    return () => {
      if (wavesurferRef.current) {
        wavesurferRef.current.destroy();
      }
    };
  }, [mediaType, assignment?.media_url]);

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
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
    if (isDragging) setWindowPosition({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
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
    const moveHandler = isDragging ? handleMouseMove : handleResizeMove;
    if (isDragging || isResizing) {
      document.addEventListener('mousemove', moveHandler);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', moveHandler);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isResizing]);

  const renderMediaContent = () => {
    if (isLoading) return <div className="flex items-center justify-center h-64 bg-gray-800 rounded"><div className="text-green-400">Loading media...</div></div>;
    if (error) return <div className="flex items-center justify-center h-64 bg-gray-800 rounded text-red-400 text-center p-4">Error: {error}</div>;

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
            <audio
              ref={playerRef}
              src={assignment.media_url}
              preload="metadata"
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onEnded={() => { setIsPlaying(false); setCurrentTime(0); }}
              onLoadedMetadata={(e) => { setDuration(e.target.duration); setAudioReady(true); }}
              onError={() => setError('Audio playback failed')}
              onTimeUpdate={(e) => {
                  const newTime = e.target.currentTime;
                  setCurrentTime(newTime);
                  // *** THIS IS THE CORRECTED SYNC LOGIC ***
                  if (wavesurferRef.current && playerRef.current.duration) {
                      wavesurferRef.current.seekTo(newTime / playerRef.current.duration);
                  }
              }}
              volume={volume}
              crossOrigin="anonymous"
            />
            <div className="mb-4">
              <div ref={waveformRef} className="w-full h-20 bg-gray-900 rounded border border-gray-600" style={{ minHeight: '80px', cursor: 'pointer' }} />
            </div>
            <div className="flex items-center justify-between bg-gray-900 rounded p-3">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => { playerRef.current?.paused ? playerRef.current?.play() : playerRef.current?.pause(); }}
                  disabled={!audioReady}
                  className="flex items-center justify-center w-10 h-10 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-full transition-colors"
                >
                  {isPlaying ? '⏸️' : '▶️'}
                </button>
                <div className="text-sm text-gray-300">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-400">🔊</span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={(e) => {
                    const newVolume = parseFloat(e.target.value);
                    setVolume(newVolume);
                    if (playerRef.current) {
                      playerRef.current.volume = newVolume;
                    }
                  }}
                  className="w-16"
                />
                <span className="text-xs text-gray-400 w-6">
                  {Math.round(volume * 100)}%
                </span>
              </div>
            </div>
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

      {/* Content Area */}
      <div className="flex h-full overflow-hidden" style={{ height: `calc(100% - 40px)` }}>
        {/* Media Player Section */}
        <div className="flex-1 p-4 overflow-auto">
          <div className="mb-2">
            <h3 className="text-white font-semibold text-lg">{assignment?.title || 'No Title'}</h3>
            <p className="text-gray-400 text-sm">Key: {assignment?.key_slot} | Type: {mediaType || 'Unknown'}</p>
          </div>
          {renderMediaContent()}
        </div>

        {/* Description Panel */}
        <div className="w-80 bg-gray-800 border-l border-gray-600 p-4 overflow-auto">
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
              {mediaType === 'audio' && (
                <>
                  <div><strong>Audio Ready:</strong> {audioReady ? '✅ Yes' : '❌ No'}</div>
                  <div><strong>Duration:</strong> {formatTime(duration)}</div>
                </>
              )}
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
const VoxProManagement = () => {
  // State management
  const [connectionStatus, setConnectionStatus] = useState('connecting');
  const [statusMessage, setStatusMessage] = useState('Connecting to Supabase...');
  const [assignments, setAssignments] = useState([]);
  const [activeWindows, setActiveWindows] = useState([]);
  const [windowCounter, setWindowCounter] = useState(0);
  const [currentPlayingKey, setCurrentPlayingKey] = useState(null); // Only one key can play at a time

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    submittedBy: '',
    keySlot: '',
    mediaFile: null
  });

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState('');

  // File input ref
  const fileInputRef = useRef(null);

  // Initialize Supabase connection
  useEffect(() => {
    const initializeConnection = async () => {
      try {
        // Silent connection - no user prompts or popups
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
  const getKeyAssignment = (keySlot) => {
    return assignments.find(assignment => assignment.key_slot === keySlot);
  };

  // Handle key click - open media viewer
  const handleKeyClick = (keySlot) => {
    const assignment = getKeyAssignment(keySlot);

    if (!assignment) {
      console.log(`No assignment for key ${keySlot}`);
      return;
    }

    // If this key is currently playing, stop it
    if (currentPlayingKey === keySlot) {
      setCurrentPlayingKey(null);
      setActiveWindows(prev => prev.filter(w => w.assignment.key_slot !== keySlot));
      return;
    }

    // Stop any currently playing key and close its window
    if (currentPlayingKey) {
      setActiveWindows(prev => prev.filter(w => w.assignment.key_slot !== currentPlayingKey));
    }

    // Start playing this key
    setCurrentPlayingKey(keySlot);

    // Create new window
    const newWindow = {
      id: windowCounter,
      assignment,
      isMinimized: false
    };

    setActiveWindows([newWindow]); // Only one window at a time
    setWindowCounter(prev => prev + 1);
  };

  const closeWindow = (windowId) => {
    const window = activeWindows.find(w => w.id === windowId);
    if (window) {
      // Stop playback for this key
      if (currentPlayingKey === window.assignment.key_slot) {
        setCurrentPlayingKey(null);
      }
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

  // Trigger file input
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, mediaFile: file }));
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Upload and assign media with accurate progress tracking
  const uploadAndAssign = async () => {
    if (!formData.mediaFile || !formData.title || !formData.keySlot) {
      alert('Please fill in all required fields and select a file');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setUploadStatus('Preparing upload...');

    try {
      // Simulate progress for preparation
      setUploadProgress(5);

      // Upload file to Supabase Storage with accurate progress tracking
      setUploadStatus('Uploading file...');
      const fileExt = formData.mediaFile.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('media-files')
        .upload(fileName, formData.mediaFile, {
          onUploadProgress: (progress) => {
            // More accurate progress calculation
            const percentage = Math.round((progress.loaded / progress.total) * 80) + 5; // 5-85%
            setUploadProgress(percentage);
            setUploadStatus(`Uploading... ${Math.round((progress.loaded / progress.total) * 100)}%`);
          }
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

      // Save assignment to database
      const { data: assignmentData, error: assignmentError } = await supabase
        .from('assignments')
        .insert([
          {
            title: formData.title,
            description: formData.description,
            submitted_by: formData.submittedBy,
            media_url: urlData.publicUrl,
            media_type: formData.mediaFile.type,
            key_slot: formData.keySlot,
            created_at: new Date().toISOString()
          }
        ]);

      if (assignmentError) {
        throw assignmentError;
      }

      setUploadProgress(100);
      setUploadStatus('Upload complete!');

      // Clear form
      clearForm();

      // Reload assignments
      loadAssignments();

      setTimeout(() => {
        setUploadStatus('');
        setUploadProgress(0);
      }, 2000);

    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus(`Upload failed: ${error.message}`);
      setTimeout(() => {
        setUploadStatus('');
        setUploadProgress(0);
      }, 3000);
    } finally {
      setIsUploading(false);
    }
  };

  // Clear form
  const clearForm = () => {
    setFormData({
      title: '',
      description: '',
      submittedBy: '',
      keySlot: '',
      mediaFile: null
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Delete assignment
  const deleteAssignment = async (assignmentId, keySlot) => {
    try {
      const { error } = await supabase
        .from('assignments')
        .delete()
        .eq('id', assignmentId);

      if (error) {
        throw error;
      }

      // Stop playback if this key is playing
      if (currentPlayingKey === keySlot) {
        setCurrentPlayingKey(null);
        setActiveWindows(prev => prev.filter(w => w.assignment.key_slot !== keySlot));
      }

      loadAssignments();
    } catch (error) {
      console.error('Delete error:', error);
      alert(`Failed to delete assignment: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-green-400 mb-2">Admin Portal</h1>
          <h2 className="text-2xl text-gray-300 mb-4">VoxPro Management Tool</h2>
          <p className="text-gray-400">Administrative access for media upload, assignment, and system management.</p>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">

          {/* Column 1: VoxPro Management Console */}
          <div className="bg-gray-800 rounded-lg p-6 shadow-2xl border border-gray-600">
            {/* Header */}
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-green-400 mb-2">VoxPro Management Console</h3>
              <p className="text-gray-400 text-sm">Professional Broadcasting Control & Assignment System</p>
            </div>

            {/* Connection Status */}
            <div className="text-center mb-6">
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

            {/* START Keys */}
            <div className="mb-6">
              <div className="grid grid-cols-5 gap-2">
                {[1, 2, 3, 4, 5].map((key) => {
                  const assignment = getKeyAssignment(key.toString());
                  const isPlaying = currentPlayingKey === key.toString();

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
                        w-16 h-16 rounded-lg font-bold text-white text-lg
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

            {/* Control Buttons */}
            <div className="grid grid-cols-4 gap-2 mb-4">
              {/* Row 1 */}
              <button className="w-12 h-10 bg-gradient-to-b from-gray-600 to-gray-800 hover:from-gray-500 hover:to-gray-700 rounded border-2 border-gray-500 font-bold text-white transition-all text-sm">A</button>
              <button className="w-12 h-10 bg-gradient-to-b from-gray-600 to-gray-800 hover:from-gray-500 hover:to-gray-700 rounded border-2 border-gray-500 font-bold text-white transition-all text-sm">B</button>
              <button className="w-12 h-10 bg-gradient-to-b from-gray-600 to-gray-800 hover:from-gray-500 hover:to-gray-700 rounded border-2 border-gray-500 font-bold text-white transition-all text-sm">C</button>
              <button className="w-12 h-10 bg-gradient-to-b from-gray-600 to-gray-800 hover:from-gray-500 hover:to-gray-700 rounded border-2 border-gray-500 font-bold text-white transition-all text-sm">D</button>

              {/* Row 2 */}
              <button className="w-12 h-10 bg-gradient-to-b from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700 rounded border-2 border-gray-500 font-bold text-white transition-all text-xs">DUP</button>
              <button className="w-12 h-10 bg-gradient-to-b from-yellow-600 to-yellow-800 hover:from-yellow-500 hover:to-yellow-700 rounded border-2 border-gray-500 font-bold text-white transition-all text-xs">CUE</button>
              <button className="w-12 h-10 bg-gradient-to-b from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 rounded border-2 border-gray-500 font-bold text-white transition-all text-xs">REC</button>
              <div className="w-12 h-10 bg-gradient-to-b from-gray-700 to-gray-900 rounded border-2 border-gray-500 flex items-center justify-center">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                </div>
              </div>
            </div>

            {/* Status Display */}
            <div className="text-center">
              <div className="bg-gray-800 px-3 py-2 rounded border border-gray-600">
                <div className="text-green-400 text-xs font-medium">
                  {currentPlayingKey ? `Playing: Key ${currentPlayingKey}` : 'Ready'} | Windows: {activeWindows.filter(w => !w.isMinimized).length}
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: Key Assignment Management */}
          <div className="bg-gray-800 rounded-lg p-6 shadow-2xl border border-gray-600">
            <h3 className="text-xl font-bold text-green-400 mb-4">Key Assignment Management</h3>

            {/* Upload Form */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-300 mb-3">Upload & Assign Media</h4>

              {/* File Upload */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">Media File</label>
                <div
                  onClick={triggerFileInput}
                  className="border-2 border-dashed border-gray-500 rounded-lg p-4 text-center cursor-pointer hover:border-gray-400 transition-colors bg-gray-700"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileChange}
                    accept="*/*"
                    className="hidden"
                  />
                  <div className="text-gray-300">
                    {formData.mediaFile ? (
                      <div>
                        <div className="text-green-400 font-medium">✓ {formData.mediaFile.name}</div>
                        <div className="text-xs text-gray-400 mt-1">
                          Size: {(formData.mediaFile.size / 1024 / 1024).toFixed(2)} MB
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="text-2xl mb-2">📁</div>
                        <div>Click to select file or drag & drop here</div>
                        <div className="text-xs text-gray-400 mt-1">ALL file types supported - NO size limits - NO restrictions</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    maxLength={100}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-white"
                    placeholder="Enter media title"
                  />
                  <div className="text-xs text-gray-400 mt-1">{formData.title.length}/100 characters</div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    maxLength={2000}
                    rows={4}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-white"
                    placeholder="Enter description (up to 2000 characters)"
                  />
                  <div className="text-xs text-gray-400 mt-1">{formData.description.length}/2000 characters</div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Submitted By</label>
                  <input
                    type="text"
                    name="submittedBy"
                    value={formData.submittedBy}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-white"
                    placeholder="Enter your name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Assign to Key *</label>
                  <select
                    name="keySlot"
                    value={formData.keySlot}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-white"
                  >
                    <option value="">Select a key (1-5)</option>
                    {[1, 2, 3, 4, 5].map((keyNum) => (
                      <option key={keyNum} value={keyNum.toString()}>
                        Key {keyNum}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Upload Progress */}
              {isUploading && (
                <div className="mt-4">
                  <div className="flex justify-between text-sm text-gray-300 mb-1">
                    <span>{uploadStatus}</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Upload Button */}
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={uploadAndAssign}
                  disabled={isUploading || !formData.mediaFile || !formData.title || !formData.keySlot}
                  className="flex-1 bg-gradient-to-b from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 disabled:from-gray-600 disabled:to-gray-800 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded transition-colors border-2 border-gray-500"
                >
                  {isUploading ? 'Uploading...' : 'Upload & Assign Media'}
                </button>
                <button
                  onClick={clearForm}
                  disabled={isUploading}
                  className="bg-gradient-to-b from-gray-600 to-gray-800 hover:from-gray-500 hover:to-gray-700 disabled:from-gray-700 disabled:to-gray-900 text-white font-bold py-2 px-4 rounded transition-colors border-2 border-gray-500"
                >
                  Clear
                </button>
              </div>
            </div>

            {/* Current Key Assignments */}
            <div>
              <h4 className="text-lg font-semibold text-gray-300 mb-3">Current Key Assignments</h4>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {[1, 2, 3, 4, 5].map((keyNum) => {
                  const assignment = getKeyAssignment(keyNum.toString());
                  return (
                    <div key={keyNum}
                      className={`p-3 rounded-lg border ${
                        currentPlayingKey === keyNum.toString()
                          ? 'border-green-500 bg-green-900/20'
                          : 'border-gray-600 bg-gray-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <span className={`inline-flex items-center justify-center w-8 h-8 rounded font-bold text-sm mr-3 ${
                            currentPlayingKey === keyNum.toString()
                              ? 'bg-green-500 text-white'
                              : assignment
                              ? 'bg-red-500 text-white'
                              : 'bg-gray-500 text-white'
                          }`}>
                            {currentPlayingKey === keyNum.toString() ? 'STOP' : keyNum}
                          </span>
                          <div>
                            <div className="font-medium text-white">
                              {assignment ? assignment.title : 'No assignment'}
                            </div>
                            {assignment && (
                              <div className="text-sm text-gray-400">
                                by {assignment.submitted_by} • {assignment.media_type}
                              </div>
                            )}
                          </div>
                        </div>
                        {assignment && (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleKeyClick(keyNum.toString())}
                              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                                currentPlayingKey === keyNum.toString()
                                  ? 'bg-green-600 hover:bg-green-700 text-white'
                                  : 'bg-blue-600 hover:bg-blue-700 text-white'
                              }`}
                            >
                              {currentPlayingKey === keyNum.toString() ? 'Stop' : 'Play'}
                            </button>
                            <button
                              onClick={() => deleteAssignment(assignment.id, keyNum.toString())}
                              className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm font-medium transition-colors"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Resizable Window Area */}
        <div className="mt-6 text-center text-gray-400">
          <div className="text-4xl mb-4">🎵</div>
          <p>Click a key to open resizable media player window</p>
          <p className="text-sm mt-2">Player windows will appear and can be moved, resized, and maximized</p>
        </div>
      </div>

      {/* Enhanced Floating Windows */}
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

export default VoxProManagement;
