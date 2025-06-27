import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import WaveSurfer from 'wavesurfer.js';

// Enhanced Universal Media Player Component - VISUALIZATION SYNC FIXED
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
  const wavesurferRef = useRef(null); // Wavesurfer for VISUALIZATION & SEEKING
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

  const initializeWavesurfer = () => {
    if (!waveformRef.current || mediaType !== 'audio' || !assignment?.media_url) {
        return;
    }

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
            interact: true, 
            barWidth: 2,
            barGap: 1,
            barRadius: 3,
            responsive: true,
            hideScrollbar: true,
        });

        wavesurferRef.current = ws;

        ws.on('seek', (progress) => {
            if (playerRef.current && duration > 0) {
                const newTime = duration * progress;
                playerRef.current.currentTime = newTime;
                setCurrentTime(newTime);
            }
        });
        
        ws.on('ready', () => {
            ws.setMuted(true);
            ws.setVolume(0);
        });

        ws.on('error', (err) => {
            console.warn('Wavesurfer error:', err);
            createFallbackVisualization();
        });

        ws.load(assignment.media_url);

    } catch (error) {
        console.warn('Wavesurfer init failed:', error);
        createFallbackVisualization();
    }
  };

  const createFallbackVisualization = () => {
    if (!waveformRef.current) return;
    waveformRef.current.innerHTML = `
      <div class="w-full h-20 bg-gray-800 rounded flex items-center justify-center text-gray-400 text-sm">
        Waveform visualization not available.
      </div>`;
  };

  useEffect(() => {
    if (mediaType === 'audio') {
        initializeWavesurfer();
    }
    
    return () => {
      if (wavesurferRef.current) {
        try {
          wavesurferRef.current.destroy();
        } catch (e) { console.warn('Cleanup error:', e); }
        wavesurferRef.current = null;
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
    const moveHandler = isDragging ? handleMouseMove : handleResizeMove;
    if (isDragging || isResizing) {
      document.addEventListener('mousemove', moveHandler);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', moveHandler);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isResizing, dragStart, windowPosition, windowSize]);

  const renderMediaContent = () => {
    if (isLoading) return <div className="flex items-center justify-center h-64 bg-gray-800 rounded"><div className="text-green-400">Loading media...</div></div>;
    if (error) return <div className="flex items-center justify-center h-64 bg-gray-800 rounded text-red-400 p-4">Error: {error}</div>;

    switch (mediaType) {
      case 'audio':
        return (
          <div className="bg-gray-800 rounded p-4">
            <div className="flex items-center justify-center h-20 mb-4">
              <div className="text-green-400 text-4xl">🎵</div>
              <div className="ml-4 text-center"><div className="text-white font-medium">{assignment.title}</div><div className="text-gray-400 text-sm">Audio File</div></div>
            </div>
            
            <audio
              ref={playerRef}
              className="hidden"
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
                  // *** THIS IS THE FIX ***
                  // Directly sync the visualizer to the audio's progress.
                  if (wavesurferRef.current && duration > 0) {
                      wavesurferRef.current.seekTo(newTime / duration);
                  }
              }}
              volume={volume}
              crossOrigin="anonymous"
            />
            
            <div className="mb-4">
              <div ref={waveformRef} className="w-full h-20 bg-gray-900 rounded border border-gray-600" style={{ cursor: 'pointer' }} />
            </div>

            <div className="flex items-center justify-between bg-gray-900 rounded p-3">
              <div className="flex items-center space-x-3">
                <button onClick={() => playerRef.current?.paused ? playerRef.current?.play() : playerRef.current?.pause()} disabled={!audioReady} className="flex items-center justify-center w-10 h-10 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 rounded-full">
                  {isPlaying ? '⏸️' : '▶️'}
                </button>
                <button onClick={() => { if(playerRef.current) playerRef.current.currentTime = 0; }} disabled={!audioReady} className="flex items-center justify-center w-8 h-8 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-600 rounded-full">
                  ⏹️
                </button>
                <div className="text-sm text-gray-300">{formatTime(currentTime)} / {formatTime(duration)}</div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-400">🔊</span>
                <input type="range" min="0" max="1" step="0.1" value={volume} onChange={(e) => { const newVol = parseFloat(e.target.value); setVolume(newVol); if(playerRef.current) playerRef.current.volume = newVol; }} className="w-16"/>
                <span className="text-xs text-gray-400 w-6">{Math.round(volume * 100)}%</span>
              </div>
            </div>
          </div>
        );
      // Other cases remain the same
      default:
        return <div className="bg-gray-800 rounded p-6 h-64 flex flex-col items-center justify-center">... Non-audio content ...</div>;
    }
  };

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 bg-gray-800 border border-gray-600 rounded-lg p-2 shadow-lg z-50">
        <div className="flex items-center justify-between min-w-48">
          <span className="text-white text-sm truncate">{assignment?.title || 'Media Player'}</span>
          <div className="flex gap-1 ml-2 window-controls">
            <button onClick={() => onMinimize(false)} className="text-gray-400 hover:text-white p-1" title="Restore">⬜</button>
            <button onClick={onClose} className="text-gray-400 hover:text-red-400 p-1" title="Close">✕</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={windowRef} className="fixed bg-gray-900 border border-gray-600 rounded-lg shadow-2xl z-40 overflow-hidden select-none" style={{ left: windowPosition.x, top: windowPosition.y, width: windowSize.width, height: windowSize.height, cursor: isDragging ? 'grabbing' : 'default' }} onMouseDown={handleMouseDown}>
      <div className="bg-gray-800 px-4 py-2 flex items-center justify-between border-b border-gray-600 cursor-grab">
        <div className="flex items-center gap-2"><div className="text-green-400">▶</div><span className="text-white font-medium">Universal Player - {assignment?.title}</span></div>
        <div className="flex gap-2 window-controls">
          <button onClick={() => onMinimize(true)} className="text-gray-400 hover:text-white px-2 py-1 rounded" title="Minimize">−</button>
          <button onClick={toggleMaximize} className="text-gray-400 hover:text-white px-2 py-1 rounded" title={isMaximized ? "Restore" : "Maximize"}>{isMaximized ? "⧉" : "⬜"}</button>
          <button onClick={onClose} className="text-gray-400 hover:text-red-400 px-2 py-1 rounded" title="Close">✕</button>
        </div>
      </div>
      <div className="flex h-full overflow-hidden" style={{ height: `calc(${windowSize.height}px - 40px)` }}>
        <div className="flex-1 p-4 overflow-auto">{renderMediaContent()}</div>
        <div className="w-80 bg-gray-800 border-l border-gray-600 p-4 overflow-auto">
          <h4 className="text-green-400 font-semibold mb-3">Media Description</h4>
          <div className="text-gray-300 text-sm leading-relaxed">{assignment?.description || 'No description available.'}</div>
        </div>
      </div>
      <div className="absolute bottom-0 right-0 w-4 h-4 bg-gray-600 cursor-se-resize resize-handle" onMouseDown={handleResizeStart} title="Resize window"><div className="absolute bottom-1 right-1 w-2 h-2 border-r-2 border-b-2 border-gray-400"></div></div>
    </div>
  );
};


// Main VoxProManagement Component (No changes needed here)
const VoxProManagement = () => {
    // State management
    const [connectionStatus, setConnectionStatus] = useState('connecting');
    const [statusMessage, setStatusMessage] = useState('Connecting to Supabase...');
    const [assignments, setAssignments] = useState([]);
    const [activeWindows, setActiveWindows] = useState([]);
    const [windowCounter, setWindowCounter] = useState(0);
    const [currentPlayingKey, setCurrentPlayingKey] = useState(null);
    
    // Form state
    const [formData, setFormData] = useState({ title: '', description: '', submittedBy: '', keySlot: '', mediaFile: null });
    const [isUploading, setIsUploading] = useState(false);
    
    const fileInputRef = useRef(null);
  
    useEffect(() => {
      const initializeConnection = async () => {
        try {
          const { error } = await supabase.from('assignments').select('*').limit(1);
          if (error) throw error;
          setConnectionStatus('connected');
          setStatusMessage('Connected to Supabase');
          loadAssignments();
        } catch (error) {
          console.error('Connection error:', error);
          setConnectionStatus('disconnected');
          setStatusMessage('Connection Failed');
        }
      };
      initializeConnection();
    }, []);
  
    const loadAssignments = async () => {
      try {
        const { data, error } = await supabase.from('assignments').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        setAssignments(data || []);
      } catch (error) {
        console.error('Error loading assignments:', error);
      }
    };
  
    const getKeyAssignment = (keySlot) => assignments.find(a => a.key_slot === keySlot);
  
    const handleKeyClick = (keySlot) => {
      const assignment = getKeyAssignment(keySlot);
      if (!assignment) return;
  
      if (currentPlayingKey === keySlot) {
        setCurrentPlayingKey(null);
        setActiveWindows([]);
        return;
      }
  
      setCurrentPlayingKey(keySlot);
      setActiveWindows([{ id: windowCounter, assignment, isMinimized: false }]);
      setWindowCounter(prev => prev + 1);
    };
  
    const closeWindow = (windowId) => {
        const window = activeWindows.find(w => w.id === windowId);
        if (window && currentPlayingKey === window.assignment.key_slot) {
          setCurrentPlayingKey(null);
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
  
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
    };
  
    const uploadAndAssign = async () => {
      if (!formData.mediaFile || !formData.title || !formData.keySlot) {
        alert('Please fill all required fields and select a file.');
        return;
      }
      setIsUploading(true);
      try {
        const fileExt = formData.mediaFile.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from('media-files').upload(fileName, formData.mediaFile);
        if (uploadError) throw uploadError;
  
        const { data: urlData } = supabase.storage.from('media-files').getPublicUrl(fileName);
        const { error: assignmentError } = await supabase.from('assignments').insert([{...formData, media_url: urlData.publicUrl, media_type: formData.mediaFile.type }]);
        if (assignmentError) throw assignmentError;
  
        loadAssignments();
        setFormData({ title: '', description: '', submittedBy: '', keySlot: '', mediaFile: null });
        if(fileInputRef.current) fileInputRef.current.value = '';
  
      } catch (error) {
        alert(`Upload failed: ${error.message}`);
      } finally {
        setIsUploading(false);
      }
    };
  
    const deleteAssignment = async (assignmentId, keySlot) => {
      if (!window.confirm("Are you sure you want to delete this assignment?")) return;
      try {
        const { error } = await supabase.from('assignments').delete().eq('id', assignmentId);
        if (error) throw error;
        if (currentPlayingKey === keySlot) {
          setCurrentPlayingKey(null);
          setActiveWindows([]);
        }
        loadAssignments();
      } catch (error) {
        alert(`Delete failed: ${error.message}`);
      }
    };
    
    return (
        <div className="min-h-screen bg-gray-900 text-white">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-green-400 mb-2">Admin Portal</h1>
              <h2 className="text-2xl text-gray-300 mb-4">VoxPro Management Tool</h2>
              <p className="text-gray-400">Administrative access for media upload, assignment, and system management.</p>
            </div>
    
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
              {/* Left Column: Console */}
              <div className="bg-gray-800 rounded-lg p-6 shadow-2xl border border-gray-600">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-green-400 mb-2">VoxPro Management Console</h3>
                  <p className="text-gray-400 text-sm">Professional Broadcasting Control & Assignment System</p>
                </div>
                <div className="text-center mb-6">
                  <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${connectionStatus === 'connected' ? 'bg-green-600' : 'bg-red-600'}`}>
                    <div className={`w-2 h-2 rounded-full mr-2 ${connectionStatus === 'connected' ? 'bg-green-300' : 'bg-red-300'} animate-pulse`}></div>
                    {statusMessage}
                  </div>
                </div>
                <div className="mb-6">
                  <div className="grid grid-cols-5 gap-2">
                    {[1, 2, 3, 4, 5].map((key) => {
                      const assignment = getKeyAssignment(String(key));
                      const isPlaying = currentPlayingKey === String(key);
                      return (
                        <button
                          key={key}
                          onClick={() => handleKeyClick(String(key))}
                          className={`w-16 h-16 rounded-lg font-bold text-lg transition-all transform hover:scale-105 ${isPlaying ? 'bg-green-500' : assignment ? 'bg-red-500' : 'bg-gray-600'} border-2 border-gray-500`}
                          title={assignment ? assignment.title : `Key ${key} - Empty`}
                        >
                          {isPlaying ? '■' : key}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
    
              {/* Right Column: Assignment Management */}
              <div className="bg-gray-800 rounded-lg p-6 shadow-2xl border border-gray-600">
                <h3 className="text-xl font-bold text-green-400 mb-4">Key Assignment Management</h3>
                <div className="space-y-4">
                  <input ref={fileInputRef} type="file" onChange={(e) => setFormData(p => ({...p, mediaFile: e.target.files[0]}))} className="w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"/>
                  <input type="text" name="title" value={formData.title} onChange={handleInputChange} placeholder="Title *" className="w-full p-2 bg-gray-700 rounded"/>
                  <textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="Description" className="w-full p-2 bg-gray-700 rounded" rows="3"/>
                  <input type="text" name="submittedBy" value={formData.submittedBy} onChange={handleInputChange} placeholder="Submitted By" className="w-full p-2 bg-gray-700 rounded"/>
                  <select name="keySlot" value={formData.keySlot} onChange={handleInputChange} className="w-full p-2 bg-gray-700 rounded">
                    <option value="">Select a key *</option>
                    {[1, 2, 3, 4, 5].map(k => <option key={k} value={String(k)}>Key {k}</option>)}
                  </select>
                  <button onClick={uploadAndAssign} disabled={isUploading} className="w-full p-2 bg-red-600 rounded disabled:bg-gray-500">{isUploading ? 'Uploading...' : 'Assign to Key'}</button>
                </div>
                <div className="mt-6">
                  <h4 className="text-lg font-semibold text-gray-300 mb-3">Current Assignments</h4>
                  <div className="space-y-2">
                  {[1, 2, 3, 4, 5].map((keyNum) => {
                      const assignment = getKeyAssignment(String(keyNum));
                      return (
                          <div key={keyNum} className="flex items-center justify-between p-2 bg-gray-700 rounded">
                              <span className="font-bold">Key {keyNum}:</span>
                              <span className="truncate mx-2">{assignment ? assignment.title : 'Empty'}</span>
                              {assignment && <button onClick={() => deleteAssignment(assignment.id, String(keyNum))} className="px-2 py-1 text-xs bg-red-800 rounded">Delete</button>}
                          </div>
                      )
                  })}
                  </div>
                </div>
              </div>
            </div>
          </div>
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
