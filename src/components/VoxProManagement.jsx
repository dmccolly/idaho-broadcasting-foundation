import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';

const VoxProManagement = () => {
  // State management
  const [connectionStatus, setConnectionStatus] = useState('connecting');
  const [statusMessage, setStatusMessage] = useState('Connecting to Supabase...');
  const [assignments, setAssignments] = useState([]);
  const [mediaViewers, setMediaViewers] = useState([]);
  const [playingKeys, setPlayingKeys] = useState(new Set());
  
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

  // File input ref for direct access
  const fileInputRef = useRef(null);
  
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
        x: window.innerWidth - 520, // Position at lower right
        y: 100 + (mediaViewers.length * 30)
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

  // Trigger file input
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Handle file selection - ALLOW ALL FILE TYPES, NO SIZE LIMITS
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, mediaFile: file }));
    }
  };

  // Handle form input changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Handle key selection
  const handleKeySelection = (keySlot) => {
    setFormData(prev => ({ ...prev, keySlot }));
  };

  // Upload and assign media with accurate progress tracking
  const uploadAndAssignMedia = async () => {
    if (!formData.mediaFile || !formData.title || !formData.keySlot) {
      alert('Please fill in all required fields and select a file');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setUploadStatus('Preparing upload...');

    try {
      // File preparation
      const fileExt = formData.mediaFile.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `media/${fileName}`;

      setUploadProgress(5);
      setUploadStatus('Starting file upload...');

      // Upload file to Supabase Storage with progress tracking
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('media-files')
        .upload(filePath, formData.mediaFile, {
          onUploadProgress: (progress) => {
            // Calculate accurate progress (upload is 80% of total process)
            const uploadPercent = Math.round((progress.loaded / progress.total) * 80);
            setUploadProgress(5 + uploadPercent);
            setUploadStatus(`Uploading file... ${Math.round((progress.loaded / progress.total) * 100)}%`);
          }
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        alert('Failed to upload file: ' + uploadError.message);
        return;
      }

      setUploadProgress(85);
      setUploadStatus('Getting file URL...');

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('media-files')
        .getPublicUrl(filePath);

      setUploadProgress(90);
      setUploadStatus('Updating database...');

      // Delete existing assignment for this key
      await supabase
        .from('assignments')
        .delete()
        .eq('key_slot', formData.keySlot);

      setUploadProgress(95);
      setUploadStatus('Creating assignment...');

      // Create new assignment record
      const { data: assignmentData, error: assignmentError } = await supabase
        .from('assignments')
        .insert([
          {
            title: formData.title,
            description: formData.description,
            submitted_by: formData.submittedBy,
            media_url: urlData.publicUrl,
            media_type: formData.mediaFile.type,
            key_slot: formData.keySlot
          }
        ]);

      if (assignmentError) {
        console.error('Assignment error:', assignmentError);
        alert('Failed to create assignment: ' + assignmentError.message);
        return;
      }

      setUploadProgress(100);
      setUploadStatus('Upload complete!');
      
      // Clear form and reload assignments
      setTimeout(() => {
        clearForm();
        loadAssignments();
        alert('Media uploaded and assigned successfully!');
      }, 500);

    } catch (error) {
      console.error('Upload process error:', error);
      alert('Upload failed: ' + error.message);
    } finally {
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
        setUploadStatus('');
      }, 1000);
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
  const deleteAssignment = async (keySlot) => {
    if (!confirm(`Are you sure you want to delete the assignment for Key ${keySlot}?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('assignments')
        .delete()
        .eq('key_slot', keySlot);

      if (error) {
        console.error('Delete error:', error);
        alert('Failed to delete assignment');
        return;
      }

      // Stop playback if this key is playing
      if (playingKeys.has(keySlot)) {
        stopPlayback(keySlot);
      }

      loadAssignments();
      alert('Assignment deleted successfully');

    } catch (error) {
      console.error('Delete process error:', error);
      alert('Delete failed');
    }
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
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Portal</h1>
        <div className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">VoxPro Management Tool</h2>
          <p className="text-gray-600">Administrative access for media upload, assignment, and system management.</p>
        </div>
      </div>

      {/* Main Interface - Three Column Layout with Sleek Metallic Design */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Column 1: VoxPro Control Panel - Sleek Metallic */}
        <div 
          className="rounded-2xl shadow-2xl p-6"
          style={{
            background: 'linear-gradient(145deg, #2d3748, #1a202c)',
            boxShadow: '20px 20px 60px #1a1a1a, -20px -20px 60px #2a2a2a'
          }}
        >
          <div className="text-center mb-4">
            <h2 
              className="text-xl font-bold mb-1"
              style={{
                background: 'linear-gradient(45deg, #10b981, #34d399, #6ee7b7)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 0 20px rgba(16, 185, 129, 0.5)'
              }}
            >
              VoxPro Management Console
            </h2>
            <p className="text-gray-400 text-xs">Professional Broadcasting Control & Assignment System</p>
          </div>

          {/* Control Panel with Metallic Finish */}
          <div 
            className="rounded-xl p-4"
            style={{
              background: 'linear-gradient(145deg, #374151, #1f2937)',
              boxShadow: 'inset 5px 5px 15px #1a1a1a, inset -5px -5px 15px #404040'
            }}
          >
            <div className="text-center mb-3">
              <div 
                className="text-lg font-bold mb-2"
                style={{
                  background: 'linear-gradient(45deg, #10b981, #34d399)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textShadow: '0 0 15px rgba(16, 185, 129, 0.7)'
                }}
              >
                VoxPro
              </div>
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 ${
                connectionStatus === 'connected' 
                  ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-500/30' 
                  : 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/30'
              }`}>
                <div className={`w-2 h-2 rounded-full mr-2 ${
                  connectionStatus === 'connected' ? 'bg-green-300' : 'bg-red-300'
                } animate-pulse`}></div>
                {statusMessage}
              </div>
            </div>

            {/* START Keys with Metallic 3D Effect */}
            <div className="grid grid-cols-5 gap-2 mb-3">
              {[1, 2, 3, 4, 5].map((keyNum) => {
                const assignment = getAssignmentForKey(keyNum.toString());
                const isPlaying = playingKeys.has(keyNum.toString());
                
                return (
                  <button
                    key={keyNum}
                    onClick={() => handleKeyClick(keyNum.toString())}
                    className={`h-12 rounded font-bold text-sm transition-all duration-300 transform hover:scale-110 active:scale-95 ${
                      isPlaying
                        ? 'text-white shadow-xl'
                        : assignment
                        ? 'text-white shadow-xl'
                        : 'text-gray-400 shadow-lg'
                    }`}
                    style={{
                      background: isPlaying
                        ? 'linear-gradient(145deg, #10b981, #059669)'
                        : assignment
                        ? 'linear-gradient(145deg, #dc2626, #b91c1c)'
                        : 'linear-gradient(145deg, #6b7280, #4b5563)',
                      boxShadow: isPlaying
                        ? '6px 6px 12px #0d4f3c, -6px -6px 12px #13c896, inset 2px 2px 4px rgba(255,255,255,0.1)'
                        : assignment
                        ? '6px 6px 12px #7f1d1d, -6px -6px 12px #ef4444, inset 2px 2px 4px rgba(255,255,255,0.1)'
                        : '6px 6px 12px #374151, -6px -6px 12px #9ca3af, inset 2px 2px 4px rgba(255,255,255,0.1)'
                    }}
                    title={assignment ? assignment.title : `Key ${keyNum} - No assignment`}
                  >
                    {isPlaying ? 'STOP' : keyNum}
                  </button>
                );
              })}
            </div>

            {/* Control Buttons with Metallic Effect */}
            <div className="grid grid-cols-4 gap-2 mb-3">
              {['A', 'B', 'C', 'D'].map((letter) => (
                <button
                  key={letter}
                  className="h-10 text-black font-bold text-xs rounded transition-all duration-300 transform hover:scale-105 active:scale-95"
                  style={{
                    background: 'linear-gradient(145deg, #fbbf24, #f59e0b)',
                    boxShadow: '4px 4px 8px #d97706, -4px -4px 8px #fcd34d, inset 2px 2px 4px rgba(255,255,255,0.2)'
                  }}
                >
                  {letter}
                </button>
              ))}
            </div>

            {/* Function Buttons with Metallic Effect */}
            <div className="grid grid-cols-3 gap-2 mb-3">
              <button 
                className="h-10 text-white font-bold text-xs rounded transition-all duration-300 transform hover:scale-105 active:scale-95"
                style={{
                  background: 'linear-gradient(145deg, #3b82f6, #2563eb)',
                  boxShadow: '4px 4px 8px #1d4ed8, -4px -4px 8px #60a5fa, inset 2px 2px 4px rgba(255,255,255,0.1)'
                }}
              >
                DUP
              </button>
              <button 
                className="h-10 text-white font-bold text-xs rounded transition-all duration-300 transform hover:scale-105 active:scale-95"
                style={{
                  background: 'linear-gradient(145deg, #f97316, #ea580c)',
                  boxShadow: '4px 4px 8px #c2410c, -4px -4px 8px #fb923c, inset 2px 2px 4px rgba(255,255,255,0.1)'
                }}
              >
                CUE
              </button>
              <button 
                className="h-10 text-white font-bold text-xs rounded transition-all duration-300 transform hover:scale-105 active:scale-95"
                style={{
                  background: 'linear-gradient(145deg, #dc2626, #b91c1c)',
                  boxShadow: '4px 4px 8px #991b1b, -4px -4px 8px #ef4444, inset 2px 2px 4px rgba(255,255,255,0.1)'
                }}
              >
                REC
              </button>
            </div>

            {/* Status Display */}
            <div className="text-center">
              <div 
                className="text-xs font-medium"
                style={{
                  color: '#10b981',
                  textShadow: '0 0 10px rgba(16, 185, 129, 0.5)'
                }}
              >
                Windows: {mediaViewers.filter(v => !v.isMinimized).length} | Min: {mediaViewers.filter(v => v.isMinimized).length}
              </div>
            </div>
          </div>
        </div>

        {/* Column 2: Key Assignment Management with Sleek Styling */}
        <div 
          className="rounded-xl shadow-lg p-4"
          style={{
            background: 'linear-gradient(145deg, #f8fafc, #e2e8f0)',
            boxShadow: '10px 10px 20px #d1d5db, -10px -10px 20px #ffffff'
          }}
        >
          <h3 className="text-lg font-bold text-gray-800 mb-4">Key Assignment Management</h3>
          
          {/* Current Assignments */}
          <div className="mb-6">
            <h4 className="text-md font-semibold text-gray-700 mb-3">Current Key Assignments</h4>
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((keyNum) => {
                const assignment = getAssignmentForKey(keyNum.toString());
                return (
                  <div 
                    key={keyNum} 
                    className="rounded-lg p-3"
                    style={{
                      background: 'linear-gradient(145deg, #f1f5f9, #e2e8f0)',
                      boxShadow: '5px 5px 10px #cbd5e1, -5px -5px 10px #ffffff'
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span 
                          className={`inline-flex items-center justify-center w-8 h-8 rounded font-bold text-sm ${
                            playingKeys.has(keyNum.toString()) 
                              ? 'text-white' 
                              : assignment 
                              ? 'text-white' 
                              : 'text-white'
                          }`}
                          style={{
                            background: playingKeys.has(keyNum.toString()) 
                              ? 'linear-gradient(145deg, #10b981, #059669)'
                              : assignment 
                              ? 'linear-gradient(145deg, #dc2626, #b91c1c)'
                              : 'linear-gradient(145deg, #6b7280, #4b5563)',
                            boxShadow: '3px 3px 6px #94a3b8, -3px -3px 6px #ffffff'
                          }}
                        >
                          {keyNum}
                        </span>
                        <div className="ml-3">
                          <div className="font-medium text-sm text-gray-800">
                            {assignment ? assignment.title : 'No assignment'}
                          </div>
                          {assignment && (
                            <div className="text-xs text-gray-500">
                              {assignment.media_type} • {assignment.submitted_by}
                            </div>
                          )}
                        </div>
                      </div>
                      {assignment && (
                        <div className="flex space-x-1">
                          <button
                            onClick={() => handleKeyClick(keyNum.toString())}
                            className="px-2 py-1 text-white text-xs rounded transition-all duration-200 transform hover:scale-105"
                            style={{
                              background: 'linear-gradient(145deg, #3b82f6, #2563eb)',
                              boxShadow: '2px 2px 4px #1e40af, -2px -2px 4px #60a5fa'
                            }}
                          >
                            {playingKeys.has(keyNum.toString()) ? 'Stop' : 'Play'}
                          </button>
                          <button
                            onClick={() => deleteAssignment(keyNum.toString())}
                            className="px-2 py-1 text-white text-xs rounded transition-all duration-200 transform hover:scale-105"
                            style={{
                              background: 'linear-gradient(145deg, #dc2626, #b91c1c)',
                              boxShadow: '2px 2px 4px #991b1b, -2px -2px 4px #ef4444'
                            }}
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

          {/* Upload & Assign Media with Sleek Styling */}
          <div 
            className="rounded-lg p-4"
            style={{
              background: 'linear-gradient(145deg, #e2e8f0, #cbd5e1)',
              boxShadow: 'inset 5px 5px 10px #94a3b8, inset -5px -5px 10px #f8fafc'
            }}
          >
            <h4 className="text-md font-semibold text-gray-700 mb-3">Upload & Assign Media</h4>
            
            {/* File Upload - NO SIZE LIMITS, ALL FILE TYPES */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Media File</label>
              <div 
                onClick={triggerFileInput}
                className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-gray-400 transition-all duration-200 transform hover:scale-[1.02]"
                style={{
                  background: 'linear-gradient(145deg, #f8fafc, #e2e8f0)',
                  boxShadow: 'inset 3px 3px 6px #cbd5e1, inset -3px -3px 6px #ffffff'
                }}
              >
                <div className="text-2xl mb-2">📁</div>
                <div className="text-sm text-gray-600">
                  {formData.mediaFile ? formData.mediaFile.name : 'Click to select file or drag & drop here'}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  ✅ ALL file types supported - NO size limits - NO restrictions
                </div>
                {formData.mediaFile && (
                  <div className="text-xs text-green-600 mt-1 font-medium">
                    File size: {(formData.mediaFile.size / (1024 * 1024)).toFixed(2)} MB
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileSelect}
                className="hidden"
                accept="*/*"
              />
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Enter media title"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{
                    background: 'linear-gradient(145deg, #ffffff, #f1f5f9)',
                    boxShadow: 'inset 2px 2px 4px #e2e8f0, inset -2px -2px 4px #ffffff'
                  }}
                  maxLength={100}
                />
                <div className="text-xs text-gray-500 mt-1">{formData.title.length}/100</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Submitted By</label>
                <input
                  type="text"
                  value={formData.submittedBy}
                  onChange={(e) => handleInputChange('submittedBy', e.target.value)}
                  placeholder="Your name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{
                    background: 'linear-gradient(145deg, #ffffff, #f1f5f9)',
                    boxShadow: 'inset 2px 2px 4px #e2e8f0, inset -2px -2px 4px #ffffff'
                  }}
                />
              </div>
            </div>

            {/* Description */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description (300 words max)</label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Enter detailed description of the media content"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{
                  background: 'linear-gradient(145deg, #ffffff, #f1f5f9)',
                  boxShadow: 'inset 2px 2px 4px #e2e8f0, inset -2px -2px 4px #ffffff'
                }}
                maxLength={2000}
              />
              <div className="text-xs text-gray-500 mt-1">{formData.description.length}/2000 characters</div>
            </div>

            {/* Key Selection with Metallic Effect */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Assign to Key *</label>
              <div className="grid grid-cols-5 gap-2">
                {[1, 2, 3, 4, 5].map((keyNum) => (
                  <button
                    key={keyNum}
                    onClick={() => handleKeySelection(keyNum.toString())}
                    className={`h-10 rounded font-bold text-sm transition-all duration-200 transform hover:scale-105 ${
                      formData.keySlot === keyNum.toString()
                        ? 'text-white'
                        : 'text-gray-700'
                    }`}
                    style={{
                      background: formData.keySlot === keyNum.toString()
                        ? 'linear-gradient(145deg, #3b82f6, #2563eb)'
                        : 'linear-gradient(145deg, #e5e7eb, #d1d5db)',
                      boxShadow: formData.keySlot === keyNum.toString()
                        ? '4px 4px 8px #1e40af, -4px -4px 8px #60a5fa'
                        : '4px 4px 8px #9ca3af, -4px -4px 8px #f3f4f6'
                    }}
                  >
                    {keyNum}
                  </button>
                ))}
              </div>
            </div>

            {/* Accurate Upload Progress */}
            {isUploading && (
              <div className="mb-4">
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>{uploadStatus}</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div 
                  className="h-3 rounded-full overflow-hidden"
                  style={{
                    background: 'linear-gradient(145deg, #e5e7eb, #d1d5db)',
                    boxShadow: 'inset 2px 2px 4px #9ca3af, inset -2px -2px 4px #f3f4f6'
                  }}
                >
                  <div 
                    className="h-full transition-all duration-300 rounded-full"
                    style={{ 
                      width: `${uploadProgress}%`,
                      background: 'linear-gradient(145deg, #10b981, #059669)',
                      boxShadow: '0 0 10px rgba(16, 185, 129, 0.5)'
                    }}
                  ></div>
                </div>
              </div>
            )}

            {/* Action Buttons with Metallic Effect */}
            <div className="flex space-x-2">
              <button
                onClick={uploadAndAssignMedia}
                disabled={isUploading || !formData.mediaFile || !formData.title || !formData.keySlot}
                className="flex-1 text-white font-bold py-2 px-4 rounded transition-all duration-200 transform hover:scale-105 active:scale-95 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: isUploading || !formData.mediaFile || !formData.title || !formData.keySlot
                    ? 'linear-gradient(145deg, #6b7280, #4b5563)'
                    : 'linear-gradient(145deg, #dc2626, #b91c1c)',
                  boxShadow: isUploading || !formData.mediaFile || !formData.title || !formData.keySlot
                    ? '4px 4px 8px #374151, -4px -4px 8px #9ca3af'
                    : '4px 4px 8px #991b1b, -4px -4px 8px #ef4444'
                }}
              >
                {isUploading ? 'Uploading...' : 'Upload & Assign Media'}
              </button>
              <button
                onClick={clearForm}
                disabled={isUploading}
                className="text-white font-bold py-2 px-4 rounded transition-all duration-200 transform hover:scale-105 active:scale-95 text-sm disabled:opacity-50"
                style={{
                  background: 'linear-gradient(145deg, #6b7280, #4b5563)',
                  boxShadow: '4px 4px 8px #374151, -4px -4px 8px #9ca3af'
                }}
              >
                Clear Form
              </button>
            </div>
          </div>
        </div>

        {/* Column 3: Universal Player with Sleek Styling */}
        <div 
          className="rounded-xl shadow-lg p-4"
          style={{
            background: 'linear-gradient(145deg, #1f2937, #111827)',
            boxShadow: '10px 10px 20px #0f172a, -10px -10px 20px #374151'
          }}
        >
          <h3 
            className="text-lg font-bold mb-4"
            style={{
              background: 'linear-gradient(45deg, #10b981, #34d399)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            Universal Player
          </h3>
          {mediaViewers.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              <div className="text-4xl mb-2">🎵</div>
              <div className="text-sm">Click a key to open media player</div>
            </div>
          ) : (
            <div className="space-y-4">
              {mediaViewers.slice(0, 1).map((viewer) => (
                <div 
                  key={viewer.id} 
                  className="rounded-lg p-3"
                  style={{
                    background: 'linear-gradient(145deg, #374151, #1f2937)',
                    boxShadow: 'inset 3px 3px 6px #111827, inset -3px -3px 6px #4b5563'
                  }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div 
                      className="font-medium text-sm"
                      style={{
                        background: 'linear-gradient(45deg, #10b981, #34d399)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                      }}
                    >
                      Key {viewer.keySlot} - {viewer.assignment.title}
                    </div>
                    <button
                      onClick={() => closeViewer(viewer.id)}
                      className="w-6 h-6 rounded text-white text-xs font-bold transition-all duration-200 transform hover:scale-110"
                      style={{
                        background: 'linear-gradient(145deg, #dc2626, #b91c1c)',
                        boxShadow: '2px 2px 4px #991b1b, -2px -2px 4px #ef4444'
                      }}
                    >
                      ✕
                    </button>
                  </div>
                  
                  <div className="mb-3">
                    {renderMediaContent(viewer.assignment)}
                  </div>

                  {/* Media Information with Metallic Styling */}
                  <div 
                    className="rounded p-2"
                    style={{
                      background: 'linear-gradient(145deg, #4b5563, #374151)',
                      boxShadow: 'inset 2px 2px 4px #1f2937, inset -2px -2px 4px #6b7280'
                    }}
                  >
                    <div className="text-xs space-y-1">
                      <div><span className="text-gray-400">Type:</span> <span className="text-white">{viewer.assignment.media_type || 'Auto-detected'}</span></div>
                      <div><span className="text-gray-400">Submitted by:</span> <span className="text-white">{viewer.assignment.submitted_by}</span></div>
                      <div><span className="text-gray-400">Created:</span> <span className="text-white">{new Date(viewer.assignment.created_at).toLocaleDateString()}</span></div>
                    </div>
                    
                    {viewer.assignment.description && (
                      <div className="mt-2">
                        <span className="text-gray-400 text-xs">Description:</span>
                        <div className="text-white text-xs mt-1 max-h-16 overflow-y-auto">
                          {viewer.assignment.description}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Floating Media Viewer Windows with Sleek Metallic Styling */}
      {mediaViewers.slice(1).map((viewer) => (
        <div
          key={viewer.id}
          className={`fixed rounded-lg shadow-2xl border border-gray-600 transition-all duration-300 ${
            viewer.isMinimized ? 'w-80 h-14' : 'w-[500px] h-auto'
          }`}
          style={{
            left: `${viewer.position.x}px`,
            top: `${viewer.position.y}px`,
            zIndex: 1000 + viewer.id,
            background: 'linear-gradient(145deg, #374151, #1f2937)',
            boxShadow: '15px 15px 30px #1a1a1a, -15px -15px 30px #404040'
          }}
        >
          {/* Window Header with Metallic Effect */}
          <div 
            className="flex items-center justify-between text-white p-3 rounded-t-lg"
            style={{
              background: 'linear-gradient(145deg, #10b981, #059669)',
              boxShadow: 'inset 2px 2px 4px rgba(255,255,255,0.1), inset -2px -2px 4px rgba(0,0,0,0.2)'
            }}
          >
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-300 rounded-full mr-2 animate-pulse"></div>
              <span className="text-sm font-medium">Universal Player</span>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => toggleMinimize(viewer.id)}
                className="w-7 h-7 rounded font-bold text-xs transition-all duration-200 transform hover:scale-110"
                style={{
                  background: 'linear-gradient(145deg, #fbbf24, #f59e0b)',
                  color: 'black',
                  boxShadow: '3px 3px 6px #d97706, -3px -3px 6px #fcd34d'
                }}
              >
                {viewer.isMinimized ? '□' : '−'}
              </button>
              <button
                onClick={() => closeViewer(viewer.id)}
                className="w-7 h-7 rounded text-white font-bold text-xs transition-all duration-200 transform hover:scale-110"
                style={{
                  background: 'linear-gradient(145deg, #dc2626, #b91c1c)',
                  boxShadow: '3px 3px 6px #991b1b, -3px -3px 6px #ef4444'
                }}
              >
                ✕
              </button>
            </div>
          </div>

          {/* Window Content */}
          {!viewer.isMinimized && (
            <div className="p-4">
              <div className="grid grid-cols-3 gap-4">
                {/* Media Content */}
                <div className="col-span-2">
                  {renderMediaContent(viewer.assignment)}
                </div>

                {/* Media Information with Metallic Styling */}
                <div 
                  className="rounded p-3"
                  style={{
                    background: 'linear-gradient(145deg, #4b5563, #374151)',
                    boxShadow: 'inset 3px 3px 6px #2d3748, inset -3px -3px 6px #6b7280'
                  }}
                >
                  <h4 
                    className="font-medium text-sm mb-2"
                    style={{
                      background: 'linear-gradient(45deg, #10b981, #34d399)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent'
                    }}
                  >
                    Media Description
                  </h4>
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

export default VoxProManagement;

