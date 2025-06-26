import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';

// Universal Media Player Component (same as in Player)
const UniversalMediaPlayer = ({ assignment, onClose, onMinimize, isMinimized, windowId }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mediaType, setMediaType] = useState(null);
  const playerRef = useRef(null);

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

  const renderMediaContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-64 bg-gray-800 rounded">
          <div className="text-green-400">Loading media...</div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex items-center justify-center h-64 bg-gray-800 rounded text-red-400">
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
            <div className="flex items-center justify-center h-32 mb-4">
              <div className="text-green-400 text-6xl">🎵</div>
            </div>
            <audio
              ref={playerRef}
              controls
              className="w-full"
              onError={() => setError('Failed to load audio')}
            >
              <source src={assignment.media_url} />
              Your browser does not support the audio tag.
            </audio>
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
          <div className="flex gap-1 ml-2">
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
    <div className="fixed bottom-4 right-4 bg-gray-900 border border-gray-600 rounded-lg shadow-2xl z-40 w-[800px] max-h-[600px] overflow-hidden">
      {/* Window Title Bar */}
      <div className="bg-gray-800 px-4 py-2 flex items-center justify-between border-b border-gray-600">
        <div className="flex items-center gap-2">
          <div className="text-green-400">▶</div>
          <span className="text-white font-medium">Universal Player</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onMinimize(true)}
            className="text-gray-400 hover:text-white px-2 py-1 rounded"
            title="Minimize"
          >
            −
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
      <div className="flex h-96">
        {/* Media Player Section */}
        <div className="flex-1 p-4">
          <div className="mb-2">
            <h3 className="text-white font-semibold text-lg">{assignment?.title || 'No Title'}</h3>
            <p className="text-gray-400 text-sm">Key: {assignment?.key_slot} | Type: {mediaType || 'Unknown'}</p>
          </div>
          {renderMediaContent()}
        </div>

        {/* Description Panel */}
        <div className="w-80 bg-gray-800 border-l border-gray-600 p-4">
          <h4 className="text-green-400 font-semibold mb-3">Media Description</h4>
          <div className="text-gray-300 text-sm leading-relaxed max-h-80 overflow-y-auto">
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

  // Initialize Supabase connection
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
      } catch (err) {
        console.error('Connection initialization error:', err);
        setConnectionStatus('error');
        setStatusMessage('Connection error occurred');
      }
    };

    initializeConnection();
  }, []);

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
    } catch (err) {
      console.error('Error in loadAssignments:', err);
    }
  };

  const handleKeyClick = async (keySlot) => {
    // Find assignment for this key
    const assignment = assignments.find(a => a.key_slot === keySlot);
    
    if (!assignment) {
      console.log(`No assignment found for key ${keySlot}`);
      return;
    }

    // Check if window is already open for this assignment
    const existingWindow = activeWindows.find(w => w.assignment.id === assignment.id);
    if (existingWindow) {
      // If minimized, restore it
      if (existingWindow.isMinimized) {
        setActiveWindows(prev => 
          prev.map(w => 
            w.id === existingWindow.id 
              ? { ...w, isMinimized: false }
              : w
          )
        );
      }
      return;
    }

    // Create new window
    const newWindow = {
      id: windowCounter,
      assignment,
      isMinimized: false
    };

    setActiveWindows(prev => [...prev, newWindow]);
    setWindowCounter(prev => prev + 1);
  };

  const closeWindow = (windowId) => {
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

  const getKeyAssignment = (keySlot) => {
    return assignments.find(a => a.key_slot === keySlot);
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, mediaFile: file }));
      setUploadStatus(`Selected: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleUpload = async () => {
    if (!formData.mediaFile || !formData.title || !formData.keySlot) {
      setUploadStatus('Please fill in all required fields and select a file');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setUploadStatus('Uploading file...');

    try {
      // Upload file to Supabase Storage
      const fileExt = formData.mediaFile.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('media-files')
        .upload(fileName, formData.mediaFile);

      if (uploadError) {
        throw uploadError;
      }

      setUploadProgress(50);
      setUploadStatus('Creating assignment...');

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('media-files')
        .getPublicUrl(fileName);

      // Create assignment record
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
        ])
        .select();

      if (assignmentError) {
        throw assignmentError;
      }

      setUploadProgress(100);
      setUploadStatus('Upload completed successfully!');
      
      // Clear form
      clearForm();
      
      // Reload assignments
      loadAssignments();

    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus(`Upload failed: ${error.message}`);
    } finally {
      setIsUploading(false);
      setTimeout(() => {
        setUploadProgress(0);
        setUploadStatus('');
      }, 3000);
    }
  };

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
    setUploadStatus('');
  };

  const deleteAssignment = async (assignmentId) => {
    if (!confirm('Are you sure you want to delete this assignment?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('assignments')
        .delete()
        .eq('id', assignmentId);

      if (error) {
        throw error;
      }

      loadAssignments();
      setUploadStatus('Assignment deleted successfully');
    } catch (error) {
      console.error('Delete error:', error);
      setUploadStatus(`Delete failed: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-green-400 mb-2">VoxPro Management Console</h1>
          <p className="text-gray-400">Professional Broadcasting Control & Assignment System</p>
        </div>

        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - VoxPro Control Panel */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-gray-700 to-gray-900 p-6 rounded-xl border-2 border-gray-600 shadow-2xl">
              {/* VoxPro Header */}
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-green-400 mb-2">VoxPro</h2>
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
                  connectionStatus === 'connected' ? 'bg-green-600' : 'bg-red-600'
                }`}>
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  <span className="text-white font-semibold">{statusMessage}</span>
                </div>
              </div>

              {/* START Keys */}
              <div className="mb-4">
                <div className="grid grid-cols-5 gap-2 mb-4">
                  {[1, 2, 3, 4, 5].map((key) => {
                    const assignment = getKeyAssignment(key.toString());
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
                          w-14 h-14 rounded-lg font-bold text-white text-lg
                          transition-all duration-200 transform hover:scale-105
                          ${assignment 
                            ? 'bg-gradient-to-b from-red-500 to-red-700 hover:from-red-400 hover:to-red-600 shadow-lg' 
                            : 'bg-gradient-to-b from-gray-600 to-gray-800 hover:from-gray-500 hover:to-gray-700'
                          }
                          border-2 border-gray-500 shadow-md
                        `}
                        title={assignment ? assignment.title : `Key ${key} - No Assignment`}
                      >
                        {key}
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
                    Windows: {activeWindows.filter(w => !w.isMinimized).length} | Min: {activeWindows.filter(w => w.isMinimized).length}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Center Column - Management Interface */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-600">
              <h3 className="text-green-400 font-semibold text-xl mb-6">Key Assignment Management</h3>
              
              {/* Current Assignments */}
              <div className="mb-8">
                <h4 className="text-white font-medium mb-4">Current Key Assignments</h4>
                <div className="bg-gray-700 rounded-lg p-4">
                  {[1, 2, 3, 4, 5].map((key) => {
                    const assignment = getKeyAssignment(key.toString());
                    return (
                      <div key={key} className="flex items-center justify-between py-2 border-b border-gray-600 last:border-b-0">
                        <div className="flex items-center gap-4">
                          <span className="text-green-400 font-bold w-12">Key {key}</span>
                          <div className="flex-1">
                            {assignment ? (
                              <div>
                                <div className="text-white font-medium">{assignment.title}</div>
                                <div className="text-gray-400 text-sm">{assignment.media_type}</div>
                              </div>
                            ) : (
                              <div className="text-gray-500 italic">No assignment</div>
                            )}
                          </div>
                        </div>
                        {assignment && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleKeyClick(key.toString())}
                              className="text-green-400 hover:text-green-300 px-2 py-1 text-sm"
                            >
                              Play
                            </button>
                            <button
                              onClick={() => deleteAssignment(assignment.id)}
                              className="text-red-400 hover:text-red-300 px-2 py-1 text-sm"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Upload & Assignment Form */}
              <div className="bg-gray-700 rounded-lg p-6">
                <h4 className="text-green-400 font-medium mb-4">Upload & Assign Media</h4>
                
                {/* File Upload */}
                <div className="mb-4">
                  <label className="block text-white font-medium mb-2">Media File</label>
                  <div
                    onClick={triggerFileInput}
                    className="border-2 border-dashed border-gray-500 rounded-lg p-6 text-center cursor-pointer hover:border-green-400 transition-colors"
                  >
                    <div className="text-4xl mb-2">📁</div>
                    <div className="text-white mb-1">Click to select file or drag & drop here</div>
                    <div className="text-gray-400 text-sm">Supports video, audio, images, and documents</div>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileSelect}
                    className="hidden"
                    accept="video/*,audio/*,image/*,.pdf,.doc,.docx,.txt"
                  />
                  {formData.mediaFile && (
                    <div className="mt-2 text-green-400 text-sm">
                      Selected: {formData.mediaFile.name}
                    </div>
                  )}
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-white font-medium mb-2">Title *</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white focus:border-green-400 focus:outline-none"
                      placeholder="Enter media title"
                      maxLength={100}
                    />
                    <div className="text-right text-gray-400 text-xs mt-1">
                      {formData.title.length}/100
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-white font-medium mb-2">Submitted By</label>
                    <input
                      type="text"
                      value={formData.submittedBy}
                      onChange={(e) => handleInputChange('submittedBy', e.target.value)}
                      className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white focus:border-green-400 focus:outline-none"
                      placeholder="Your name"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-white font-medium mb-2">Description (300 words max)</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white focus:border-green-400 focus:outline-none h-24 resize-vertical"
                    placeholder="Enter detailed description of the media content"
                    maxLength={2000}
                  />
                  <div className="text-right text-gray-400 text-xs mt-1">
                    {formData.description.length}/2000 characters
                  </div>
                </div>

                {/* Key Selection */}
                <div className="mb-6">
                  <label className="block text-white font-medium mb-2">Assign to Key *</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((key) => (
                      <button
                        key={key}
                        onClick={() => handleInputChange('keySlot', key.toString())}
                        className={`
                          w-12 h-12 rounded font-bold text-white transition-all
                          ${formData.keySlot === key.toString()
                            ? 'bg-green-600 border-2 border-green-400'
                            : 'bg-gray-600 hover:bg-gray-500 border-2 border-gray-500'
                          }
                        `}
                      >
                        {key}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <button
                    onClick={handleUpload}
                    disabled={isUploading || !formData.mediaFile || !formData.title || !formData.keySlot}
                    className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded transition-colors"
                  >
                    {isUploading ? 'Uploading...' : 'Upload & Assign Media'}
                  </button>
                  <button
                    onClick={clearForm}
                    disabled={isUploading}
                    className="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-800 text-white font-bold py-3 px-6 rounded transition-colors"
                  >
                    Clear Form
                  </button>
                </div>

                {/* Upload Progress */}
                {isUploading && (
                  <div className="mt-4">
                    <div className="bg-gray-600 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Status Message */}
                {uploadStatus && (
                  <div className="mt-4 p-3 rounded bg-gray-600 text-white text-sm">
                    {uploadStatus}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Windows */}
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

