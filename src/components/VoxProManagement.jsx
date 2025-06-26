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
        x: 20 + (mediaViewers.length * 30),
        y: 20 + (mediaViewers.length * 30)
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

  // Handle file selection - ALLOW ALL FILE TYPES
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

  // Upload and assign media
  const uploadAndAssignMedia = async () => {
    if (!formData.mediaFile || !formData.title || !formData.keySlot) {
      alert('Please fill in all required fields and select a file');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Upload file to Supabase Storage
      const fileExt = formData.mediaFile.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `media/${fileName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('media-files')
        .upload(filePath, formData.mediaFile);

      if (uploadError) {
        console.error('Upload error:', uploadError);
        alert('Failed to upload file');
        return;
      }

      setUploadProgress(50);

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('media-files')
        .getPublicUrl(filePath);

      setUploadProgress(75);

      // Delete existing assignment for this key
      await supabase
        .from('assignments')
        .delete()
        .eq('key_slot', formData.keySlot);

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
        alert('Failed to create assignment');
        return;
      }

      setUploadProgress(100);
      
      // Clear form and reload assignments
      clearForm();
      loadAssignments();
      
      alert('Media uploaded and assigned successfully!');

    } catch (error) {
      console.error('Upload process error:', error);
      alert('Upload failed');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
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

      {/* Main Interface - Three Column Layout */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Column 1: VoxPro Control Panel - Compact */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-2xl p-4">
          <div className="text-center mb-3">
            <h2 className="text-xl font-bold text-green-400 mb-1">VoxPro Management Console</h2>
            <p className="text-gray-400 text-xs">Professional Broadcasting Control & Assignment System</p>
          </div>

          {/* Control Panel - Compact */}
          <div className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg p-3">
            <div className="text-center mb-3">
              <div className="text-lg font-bold text-green-400">VoxPro</div>
              <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
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

            {/* START Keys - Compact */}
            <div className="grid grid-cols-5 gap-1 mb-2">
              {[1, 2, 3, 4, 5].map((keyNum) => {
                const assignment = getAssignmentForKey(keyNum.toString());
                const isPlaying = playingKeys.has(keyNum.toString());
                
                return (
                  <button
                    key={keyNum}
                    onClick={() => handleKeyClick(keyNum.toString())}
                    className={`h-10 rounded font-bold text-xs transition-all duration-200 transform hover:scale-105 ${
                      isPlaying
                        ? 'bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg shadow-green-500/30'
                        : assignment
                        ? 'bg-gradient-to-br from-red-500 to-red-600 text-white shadow-lg shadow-red-500/30'
                        : 'bg-gradient-to-br from-gray-500 to-gray-600 text-gray-300'
                    }`}
                    title={assignment ? assignment.title : `Key ${keyNum} - No assignment`}
                  >
                    {isPlaying ? 'STOP' : keyNum}
                  </button>
                );
              })}
            </div>

            {/* Control Buttons - Compact */}
            <div className="grid grid-cols-4 gap-1 mb-2">
              {['A', 'B', 'C', 'D'].map((letter) => (
                <button
                  key={letter}
                  className="h-8 bg-gradient-to-br from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-black font-bold text-xs rounded transition-all duration-200 transform hover:scale-105 shadow-lg shadow-yellow-500/30"
                >
                  {letter}
                </button>
              ))}
            </div>

            {/* Function Buttons - Compact */}
            <div className="grid grid-cols-3 gap-1">
              <button className="h-8 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white font-bold text-xs rounded transition-all duration-200 transform hover:scale-105 shadow-lg shadow-blue-500/30">
                DUP
              </button>
              <button className="h-8 bg-gradient-to-br from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white font-bold text-xs rounded transition-all duration-200 transform hover:scale-105 shadow-lg shadow-orange-500/30">
                CUE
              </button>
              <button className="h-8 bg-gradient-to-br from-red-500 to-red-600 hover:from-red-400 hover:to-red-500 text-white font-bold text-xs rounded transition-all duration-200 transform hover:scale-105 shadow-lg shadow-red-500/30">
                REC
              </button>
            </div>

            {/* Status Display */}
            <div className="mt-2 text-center">
              <div className="text-xs text-gray-400">
                Windows: {mediaViewers.filter(v => !v.isMinimized).length} | Min: {mediaViewers.filter(v => v.isMinimized).length}
              </div>
            </div>
          </div>
        </div>

        {/* Column 2: Key Assignment Management */}
        <div className="bg-white rounded-xl shadow-lg p-4">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Key Assignment Management</h3>
          
          {/* Current Assignments */}
          <div className="mb-6">
            <h4 className="text-md font-semibold text-gray-700 mb-3">Current Key Assignments</h4>
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((keyNum) => {
                const assignment = getAssignmentForKey(keyNum.toString());
                return (
                  <div key={keyNum} className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className={`inline-flex items-center justify-center w-8 h-8 rounded font-bold text-sm ${
                          playingKeys.has(keyNum.toString()) 
                            ? 'bg-green-500 text-white' 
                            : assignment 
                            ? 'bg-red-500 text-white' 
                            : 'bg-gray-400 text-white'
                        }`}>
                          Key {keyNum}
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
                            className="px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white text-xs rounded transition-colors"
                          >
                            {playingKeys.has(keyNum.toString()) ? 'Stop' : 'Play'}
                          </button>
                          <button
                            onClick={() => deleteAssignment(keyNum.toString())}
                            className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white text-xs rounded transition-colors"
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

          {/* Upload & Assign Media */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-md font-semibold text-gray-700 mb-3">Upload & Assign Media</h4>
            
            {/* File Upload - ALLOW ALL FILE TYPES */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Media File</label>
              <div 
                onClick={triggerFileInput}
                className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-gray-400 transition-colors"
              >
                <div className="text-2xl mb-2">📁</div>
                <div className="text-sm text-gray-600">
                  {formData.mediaFile ? formData.mediaFile.name : 'Click to select file or drag & drop here'}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  All file types supported - no restrictions
                </div>
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
                maxLength={2000}
              />
              <div className="text-xs text-gray-500 mt-1">{formData.description.length}/2000 characters</div>
            </div>

            {/* Key Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Assign to Key *</label>
              <div className="grid grid-cols-5 gap-2">
                {[1, 2, 3, 4, 5].map((keyNum) => (
                  <button
                    key={keyNum}
                    onClick={() => handleKeySelection(keyNum.toString())}
                    className={`h-10 rounded font-bold text-sm transition-all duration-200 ${
                      formData.keySlot === keyNum.toString()
                        ? 'bg-blue-500 text-white shadow-lg'
                        : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                    }`}
                  >
                    {keyNum}
                  </button>
                ))}
              </div>
            </div>

            {/* Upload Progress */}
            {isUploading && (
              <div className="mb-4">
                <div className="bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-600 mt-1">Uploading... {uploadProgress}%</div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-2">
              <button
                onClick={uploadAndAssignMedia}
                disabled={isUploading || !formData.mediaFile || !formData.title || !formData.keySlot}
                className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded transition-colors text-sm"
              >
                {isUploading ? 'Uploading...' : 'Upload & Assign Media'}
              </button>
              <button
                onClick={clearForm}
                disabled={isUploading}
                className="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-800 text-white font-bold py-2 px-4 rounded transition-colors text-sm"
              >
                Clear Form
              </button>
            </div>
          </div>
        </div>

        {/* Column 3: Universal Player (when active) */}
        <div className="bg-gray-800 rounded-xl shadow-lg p-4">
          <h3 className="text-lg font-bold text-green-400 mb-4">Universal Player</h3>
          {mediaViewers.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              <div className="text-4xl mb-2">🎵</div>
              <div className="text-sm">Click a key to open media player</div>
            </div>
          ) : (
            <div className="space-y-4">
              {mediaViewers.slice(0, 1).map((viewer) => (
                <div key={viewer.id} className="bg-gray-700 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-green-400 font-medium text-sm">Key {viewer.keySlot} - {viewer.assignment.title}</div>
                    <button
                      onClick={() => closeViewer(viewer.id)}
                      className="w-6 h-6 bg-red-500 hover:bg-red-400 rounded text-white text-xs font-bold transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                  
                  <div className="mb-3">
                    {renderMediaContent(viewer.assignment)}
                  </div>

                  {/* Media Information */}
                  <div className="bg-gray-600 rounded p-2">
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

      {/* Floating Media Viewer Windows (for additional windows) */}
      {mediaViewers.slice(1).map((viewer) => (
        <div
          key={viewer.id}
          className={`fixed bg-gray-800 rounded-lg shadow-2xl border border-gray-600 transition-all duration-300 ${
            viewer.isMinimized ? 'w-64 h-12' : 'w-96 h-auto'
          }`}
          style={{
            left: `${viewer.position.x}px`,
            top: `${viewer.position.y}px`,
            zIndex: 1000 + viewer.id
          }}
        >
          {/* Window Header */}
          <div className="flex items-center justify-between bg-gradient-to-r from-green-600 to-green-700 text-white p-2 rounded-t-lg">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-300 rounded-full mr-2 animate-pulse"></div>
              <span className="text-sm font-medium">Universal Player</span>
            </div>
            <div className="flex space-x-1">
              <button
                onClick={() => toggleMinimize(viewer.id)}
                className="w-6 h-6 bg-yellow-500 hover:bg-yellow-400 rounded text-black text-xs font-bold transition-colors"
              >
                {viewer.isMinimized ? '□' : '−'}
              </button>
              <button
                onClick={() => closeViewer(viewer.id)}
                className="w-6 h-6 bg-red-500 hover:bg-red-400 rounded text-white text-xs font-bold transition-colors"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Window Content */}
          {!viewer.isMinimized && (
            <div className="p-3">
              <div className="grid grid-cols-3 gap-3">
                {/* Media Content */}
                <div className="col-span-2">
                  {renderMediaContent(viewer.assignment)}
                </div>

                {/* Media Information */}
                <div className="bg-gray-700 rounded p-2">
                  <h4 className="text-green-400 font-medium text-sm mb-2">Media Description</h4>
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

