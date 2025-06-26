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

  // File input ref
  const fileInputRef = useRef(null);
  
  // Audio visualization refs
  const audioContextRef = useRef(null);
  const analyzerRef = useRef(null);
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  // Initialize Supabase connection - NO POPUP CODE
  useEffect(() => {
    const initializeConnection = async () => {
      try {
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

    if (playingKeys.has(keySlot)) {
      stopPlayback(keySlot);
      return;
    }

    startPlayback(keySlot, assignment);
  };

  // Start playback for a key
  const startPlayback = (keySlot, assignment) => {
    setPlayingKeys(prev => new Set([...prev, keySlot]));
    
    const newViewer = {
      id: Date.now(),
      keySlot,
      assignment,
      isMinimized: false,
      position: {
        x: window.innerWidth - 520,
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

  // Upload and assign media
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
      
      // Upload file to Supabase Storage
      setUploadStatus('Uploading file...');
      const fileExt = formData.mediaFile.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('media-files')
        .upload(fileName, formData.mediaFile, {
          onUploadProgress: (progress) => {
            const percentage = Math.round((progress.loaded / progress.total) * 80) + 5; // 5-85%
            setUploadProgress(percentage);
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
      if (playingKeys.has(keySlot)) {
        stopPlayback(keySlot);
      }

      loadAssignments();
    } catch (error) {
      console.error('Delete error:', error);
      alert(`Failed to delete assignment: ${error.message}`);
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

      {/* Three Column Layout */}
      <div className="max-w-7xl mx-auto grid grid-cols-3 gap-6">
        
        {/* Column 1: VoxPro Management Console - PERFECT ORIGINAL SLEEK DESIGN */}
        <div 
          className="rounded-xl shadow-2xl p-6"
          style={{
            background: 'linear-gradient(145deg, #2d3748, #1a202c)',
            boxShadow: '15px 15px 30px #1a1a1a, -15px -15px 30px #2a2a2a'
          }}
        >
          {/* Header */}
          <div className="text-center mb-6">
            <h2 
              className="text-2xl font-bold mb-2"
              style={{
                background: 'linear-gradient(45deg, #10b981, #34d399, #6ee7b7)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 0 15px rgba(16, 185, 129, 0.5)'
              }}
            >
              VoxPro Management Console
            </h2>
            <p className="text-gray-400 text-sm">Professional Broadcasting Control & Assignment System</p>
          </div>

          {/* Control Panel */}
          <div 
            className="rounded-lg p-4 mb-6"
            style={{
              background: 'linear-gradient(145deg, #374151, #1f2937)',
              boxShadow: 'inset 4px 4px 10px #1a1a1a, inset -4px -4px 10px #404040'
            }}
          >
            {/* VoxPro Logo */}
            <div className="text-center mb-4">
              <div 
                className="text-xl font-bold mb-2"
                style={{
                  background: 'linear-gradient(45deg, #10b981, #34d399)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textShadow: '0 0 10px rgba(16, 185, 129, 0.7)'
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

            {/* START Keys */}
            <div className="grid grid-cols-5 gap-2 mb-4">
              {[1, 2, 3, 4, 5].map((keyNum) => {
                const assignment = getAssignmentForKey(keyNum.toString());
                const isPlaying = playingKeys.has(keyNum.toString());
                
                return (
                  <button
                    key={keyNum}
                    onClick={() => handleKeyClick(keyNum.toString())}
                    className={`h-10 rounded font-bold text-sm transition-all duration-300 transform hover:scale-110 active:scale-95 ${
                      isPlaying
                        ? 'text-white shadow-lg'
                        : assignment
                        ? 'text-white shadow-lg'
                        : 'text-gray-400 shadow-md'
                    }`}
                    style={{
                      background: isPlaying
                        ? 'linear-gradient(145deg, #10b981, #059669)'
                        : assignment
                        ? 'linear-gradient(145deg, #dc2626, #b91c1c)'
                        : 'linear-gradient(145deg, #6b7280, #4b5563)',
                      boxShadow: isPlaying
                        ? '6px 6px 12px #0d4f3c, -6px -6px 12px #13c896, inset 1px 1px 2px rgba(255,255,255,0.1)'
                        : assignment
                        ? '6px 6px 12px #7f1d1d, -6px -6px 12px #ef4444, inset 1px 1px 2px rgba(255,255,255,0.1)'
                        : '6px 6px 12px #374151, -6px -6px 12px #9ca3af, inset 1px 1px 2px rgba(255,255,255,0.1)'
                    }}
                    title={assignment ? assignment.title : `Key ${keyNum} - No assignment`}
                  >
                    {isPlaying ? 'STOP' : keyNum}
                  </button>
                );
              })}
            </div>

            {/* Control Buttons */}
            <div className="grid grid-cols-4 gap-2 mb-3">
              {['A', 'B', 'C', 'D'].map((letter) => (
                <button
                  key={letter}
                  className="h-8 text-black font-bold text-xs rounded transition-all duration-300 transform hover:scale-105 active:scale-95"
                  style={{
                    background: 'linear-gradient(145deg, #fbbf24, #f59e0b)',
                    boxShadow: '4px 4px 8px #d97706, -4px -4px 8px #fcd34d, inset 1px 1px 2px rgba(255,255,255,0.2)'
                  }}
                >
                  {letter}
                </button>
              ))}
            </div>

            {/* Function Buttons */}
            <div className="grid grid-cols-3 gap-2 mb-3">
              <button 
                className="h-8 text-white font-bold text-xs rounded transition-all duration-300 transform hover:scale-105 active:scale-95"
                style={{
                  background: 'linear-gradient(145deg, #3b82f6, #2563eb)',
                  boxShadow: '4px 4px 8px #1d4ed8, -4px -4px 8px #60a5fa, inset 1px 1px 2px rgba(255,255,255,0.1)'
                }}
              >
                DUP
              </button>
              <button 
                className="h-8 text-white font-bold text-xs rounded transition-all duration-300 transform hover:scale-105 active:scale-95"
                style={{
                  background: 'linear-gradient(145deg, #f97316, #ea580c)',
                  boxShadow: '4px 4px 8px #c2410c, -4px -4px 8px #fb923c, inset 1px 1px 2px rgba(255,255,255,0.1)'
                }}
              >
                CUE
              </button>
              <button 
                className="h-8 text-white font-bold text-xs rounded transition-all duration-300 transform hover:scale-105 active:scale-95"
                style={{
                  background: 'linear-gradient(145deg, #dc2626, #b91c1c)',
                  boxShadow: '4px 4px 8px #991b1b, -4px -4px 8px #ef4444, inset 1px 1px 2px rgba(255,255,255,0.1)'
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
                  textShadow: '0 0 8px rgba(16, 185, 129, 0.5)'
                }}
              >
                Active: {mediaViewers.filter(v => !v.isMinimized).length} | Min: {mediaViewers.filter(v => v.isMinimized).length}
              </div>
            </div>
          </div>
        </div>

        {/* Column 2: Key Assignment Management */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Key Assignment Management</h3>
          
          {/* Upload Form */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-gray-700 mb-3">Upload & Assign Media</h4>
            
            {/* File Upload */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Media File</label>
              <div 
                onClick={triggerFileInput}
                className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-gray-400 transition-colors"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileChange}
                  accept="*/*"
                  className="hidden"
                />
                <div className="text-gray-600">
                  {formData.mediaFile ? (
                    <div>
                      <div className="text-green-600 font-medium">✓ {formData.mediaFile.name}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        Size: {(formData.mediaFile.size / 1024 / 1024).toFixed(2)} MB
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="text-2xl mb-2">📁</div>
                      <div>Click to select file or drag & drop here</div>
                      <div className="text-xs text-gray-500 mt-1">ALL file types supported - NO size limits - NO restrictions</div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  maxLength={100}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter media title"
                />
                <div className="text-xs text-gray-500 mt-1">{formData.title.length}/100 characters</div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  maxLength={2000}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter description (up to 2000 characters)"
                />
                <div className="text-xs text-gray-500 mt-1">{formData.description.length}/2000 characters</div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Submitted By</label>
                <input
                  type="text"
                  name="submittedBy"
                  value={formData.submittedBy}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Assign to Key *</label>
                <select
                  name="keySlot"
                  value={formData.keySlot}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>{uploadStatus}</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
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
                className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded transition-colors"
              >
                {isUploading ? 'Uploading...' : 'Upload & Assign Media'}
              </button>
              <button
                onClick={clearForm}
                disabled={isUploading}
                className="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-800 text-white font-bold py-2 px-4 rounded transition-colors"
              >
                Clear Form
              </button>
            </div>
          </div>

          {/* Current Key Assignments */}
          <div>
            <h4 className="text-lg font-semibold text-gray-700 mb-3">Current Key Assignments</h4>
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((keyNum) => {
                const assignment = getAssignmentForKey(keyNum.toString());
                return (
                  <div key={keyNum} 
                    className={`p-3 rounded-lg border ${
                      playingKeys.has(keyNum.toString()) 
                        ? 'border-green-500 bg-green-50' 
                        : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className={`inline-flex items-center justify-center w-8 h-8 rounded font-bold text-sm mr-3 ${
                          playingKeys.has(keyNum.toString())
                            ? 'bg-green-500 text-white'
                            : assignment
                            ? 'bg-red-500 text-white'
                            : 'bg-gray-400 text-white'
                        }`}>
                          {playingKeys.has(keyNum.toString()) ? 'STOP' : keyNum}
                        </span>
                        <div>
                          <div className="font-medium text-gray-800">
                            {assignment ? assignment.title : 'No assignment'}
                          </div>
                          {assignment && (
                            <div className="text-sm text-gray-600">
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
                              playingKeys.has(keyNum.toString())
                                ? 'bg-green-600 hover:bg-green-700 text-white'
                                : 'bg-blue-600 hover:bg-blue-700 text-white'
                            }`}
                          >
                            {playingKeys.has(keyNum.toString()) ? 'Stop' : 'Play'}
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

        {/* Column 3: Universal Player */}
        <div 
          className="rounded-lg shadow-lg p-6"
          style={{
            background: 'linear-gradient(145deg, #374151, #1f2937)',
            boxShadow: '10px 10px 20px #1a1a1a, -10px -10px 20px #404040'
          }}
        >
          <div className="flex items-center mb-4">
            <div className="w-3 h-3 bg-green-400 rounded-full mr-3 animate-pulse"></div>
            <h3 
              className="text-lg font-bold"
              style={{
                background: 'linear-gradient(45deg, #10b981, #34d399)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              Universal Player
            </h3>
          </div>
          
          <div className="text-center text-gray-400 py-12">
            <div className="text-4xl mb-4">🎵</div>
            <p>Click a key to open media player</p>
            <p className="text-sm mt-2">Player windows will appear here</p>
          </div>
        </div>
      </div>

      {/* Media Viewer Windows - Clean Professional Design */}
      {mediaViewers.map((viewer) => (
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
          {/* Window Header */}
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

                {/* Media Information */}
                <div 
                  className="rounded p-3"
                  style={{
                    background: 'linear-gradient(145deg, #4b5563, #374151)',
                    boxShadow: 'inset 3px 3px 6px #2d3748, inset -3px -3px 6px #6b7280'
                  }}
                >
                  <h4 
                    className="font-medium text-sm mb-3"
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
                      <div className="text-white text-xs mt-1 max-h-24 overflow-y-auto">
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

