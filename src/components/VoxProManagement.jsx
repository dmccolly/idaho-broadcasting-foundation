import { useState, useEffect } from 'react'
import { uploadAudio } from '../lib/uploadAudio';
import { supabase } from '../lib/supabase';

const VoxProManagement = () => {
  // Configuration
  const API_BASE_URL = 'https://j6h5i7c15mnp.manus.space/api'
  
  // State
  const [backendStatus, setBackendStatus] = useState('connecting')
  const [statusMessage, setStatusMessage] = useState('Connecting to Enterprise Backend...')
  const [mediaLibrary, setMediaLibrary] = useState([])
  const [storageStats, setStorageStats] = useState({})
  const [keyAssignments, setKeyAssignments] = useState({})
  const [debugData, setDebugData] = useState(null);
const [debugError, setDebugError] = useState(null);
  
  // Form state
  const [mediaTitle, setMediaTitle] = useState('')
  const [description, setDescription] = useState('')
  const [submittedBy, setSubmittedBy] = useState('')
  const [selectedKey, setSelectedKey] = useState('KEY 1')
  const [audioFile, setAudioFile] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  const keys = ['KEY 1', 'KEY 2', 'KEY 3', 'KEY 4', 'KEY 5', 'KEY A', 'KEY B', 'KEY C', 'KEY D']

  useEffect(() => {
    initializeManagement()
    
    const healthInterval = setInterval(checkBackendHealth, 30000)
    const statsInterval = setInterval(updateStorageStats, 60000)
    
    return () => {
      clearInterval(healthInterval)
      clearInterval(statsInterval)
    }
  
  useEffect(() => {
  supabase
    .from('assignments')
    .select('*')
    .then(({ data, error }) => {
      setDebugData(data);
      setDebugError(error);
    });
}, []);
}, [])

  const initializeManagement = async () => {
    await checkBackendHealth()
    await loadMediaLibrary()
    await updateStorageStats()
    await loadKeyAssignments()
  }

  const checkBackendHealth = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/health`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      
      const data = await response.json()
      
      if (data.success) {
        setBackendStatus('online')
        setStatusMessage('Enterprise Backend Connected')
        if (data.storage_stats) {
          setStorageStats(data.storage_stats)
        }
      } else {
        throw new Error(data.message || 'Backend unhealthy')
      }
    } catch (error) {
      console.error('Backend health check failed:', error)
      setBackendStatus('offline')
      setStatusMessage(`Backend Connection Error: ${error.message}`)
    }
  }

  const loadMediaLibrary = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/media`)
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setMediaLibrary(data.media || [])
        }
      }
    } catch (error) {
      console.error('Failed to load media library:', error)
    }
  }

  const loadKeyAssignments = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/assignments`)
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setKeyAssignments(data.assignments || {})
        }
      }
    } catch (error) {
      console.error('Failed to load key assignments:', error)
    }
  }

  const updateStorageStats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/storage/stats`)
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setStorageStats(data.stats || {})
        }
      }
    } catch (error) {
      console.error('Failed to update storage stats:', error)
    }
  }

  const handleUpload = async () => {
    if (!audioFile || !mediaTitle.trim()) {
      alert('Please select an audio file and enter a media title')
      return
    }

    if (!submittedBy.trim()) {
      alert('Please enter your name in the "Submitted By" field')
      return
    }

    setIsUploading(true)
    setUploadProgress(0)
    
    try {
      const formData = new FormData()
      formData.append('audio', audioFile)
      formData.append('title', mediaTitle)
      formData.append('description', description)
      formData.append('submittedBy', submittedBy)
      formData.append('assignedKey', selectedKey)

      // Simulate progress for user feedback
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 200)

      const response = await fetch(`${API_BASE_URL}/upload`, {
        method: 'POST',
        body: formData
      })

      clearInterval(progressInterval)
      setUploadProgress(100)

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()

      if (data.success) {
        alert('Media uploaded successfully!')
        setMediaTitle('')
        setDescription('')
        setSubmittedBy('')
        setAudioFile(null)
        setUploadProgress(0)
        
        // Refresh data
        await loadMediaLibrary()
        await updateStorageStats()
        await loadKeyAssignments()
      } else {
        throw new Error(data.message || 'Upload failed')
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert(`Upload failed: ${error.message}`)
      setUploadProgress(0)
    } finally {
      setIsUploading(false)
    }
  }

  const deleteMedia = async (mediaId) => {
    if (!confirm('Are you sure you want to delete this media?')) return
    
    try {
      const response = await fetch(`${API_BASE_URL}/media/${mediaId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          await loadMediaLibrary()
          await updateStorageStats()
          await loadKeyAssignments()
        }
      }
    } catch (error) {
      console.error('Delete media error:', error)
    }
  }

  const handleKeyPress = async (keyNumber) => {
    try {
      const response = await fetch(`${API_BASE_URL}/play`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key_number: keyNumber })
      })
    } catch (error) {
      console.error('Key press error:', error)
    }
  }

  const getKeyTitle = (keyName) => {
    const assignment = keyAssignments[keyName]
    return assignment ? assignment.title : 'No media assigned'
  }

  return (
    <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-lg p-6 border border-gray-600 shadow-2xl">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-green-400 mb-1">VoxPro Management System</h2>
        <p className="text-gray-400 text-sm">Professional Control System with Media Management</p>
        <div className="flex items-center justify-center space-x-2 mt-3">
          <div className={`w-3 h-3 rounded-full ${
            backendStatus === 'online' ? 'bg-green-500' : 
            backendStatus === 'connecting' ? 'bg-yellow-500' : 'bg-red-500'
          }`}></div>
          <span className="text-gray-400 text-sm">{statusMessage}</span>
        </div>
      </div>

      {/* Two Panel Layout */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left Panel - VoxPro Control Interface */}
        <div className="bg-gradient-to-b from-gray-700 to-gray-800 rounded-lg p-6 border border-gray-600">
          <h3 className="text-lg font-bold text-green-400 mb-4 text-center">VoxPro Control Interface</h3>
          
          <div className="text-center mb-4">
            <h4 className="text-white font-bold mb-1">VoxPro</h4>
            <p className="text-gray-400 text-sm">Professional Control System</p>
          </div>

          {/* Status Bar */}
          <div className="mb-4">
            <div className="bg-blue-600 text-white text-center py-2 rounded border border-blue-500 text-sm font-semibold">
              VoxPro Media Interface - Ready
            </div>
          </div>

          {/* START Keys */}
          <div className="grid grid-cols-5 gap-2 mb-4">
            {[1, 2, 3, 4, 5].map(num => (
              <button
                key={num}
                onClick={() => handleKeyPress(`START_${num}`)}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-2 rounded border border-red-500 transition-all duration-200 text-xs"
                title={getKeyTitle(`START_${num}`)}
              >
                START {num}
              </button>
            ))}
          </div>

          {/* Control Buttons */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            <button className="bg-gray-600 hover:bg-gray-500 text-white font-semibold py-2 px-2 rounded border border-gray-500 text-xs">A</button>
            <button className="bg-gray-600 hover:bg-gray-500 text-white font-semibold py-2 px-2 rounded border border-gray-500 text-xs">B</button>
            <button className="bg-gray-600 hover:bg-gray-500 text-white font-semibold py-2 px-2 rounded border border-gray-500 text-xs">DUP</button>
            <button className="bg-gray-600 hover:bg-gray-500 text-white font-semibold py-2 px-2 rounded border border-gray-500 text-xs">C</button>
            <button className="bg-gray-600 hover:bg-gray-500 text-white font-semibold py-2 px-2 rounded border border-gray-500 text-xs">D</button>
            <button className="bg-gray-600 hover:bg-gray-500 text-white font-semibold py-2 px-2 rounded border border-gray-500 text-xs">CUE</button>
            <button className="bg-gray-600 hover:bg-gray-500 text-white font-semibold py-2 px-2 rounded border border-gray-500 text-xs">E</button>
            <button className="bg-gray-600 hover:bg-gray-500 text-white font-semibold py-2 px-2 rounded border border-gray-500 text-xs">F</button>
            <button className="bg-gray-600 hover:bg-gray-500 text-white font-semibold py-2 px-2 rounded border border-gray-500 text-xs">REC</button>
            <button className="bg-gray-600 hover:bg-gray-500 text-white font-semibold py-2 px-2 rounded border border-gray-500 text-xs">G</button>
          </div>

          {/* VU Meter */}
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full border-4 border-green-500 bg-gray-800 flex items-center justify-center relative">
              <div className="w-1 h-6 bg-green-500 rounded"></div>
              <div className="absolute inset-0 rounded-full bg-green-500 opacity-20 animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Right Panel - Media Management Interface */}
        <div className="bg-gradient-to-b from-gray-700 to-gray-800 rounded-lg p-6 border border-gray-600">
          <h3 className="text-lg font-bold text-green-400 mb-4 text-center">Media Management Interface</h3>
          
          {/* Current Key Assignments */}
          <div className="bg-gray-800 rounded p-4 mb-4 border border-gray-600">
            <h4 className="text-green-400 font-semibold mb-2 text-sm">Current Key Assignments</h4>
            <div className="text-xs text-gray-300 space-y-1 max-h-20 overflow-y-auto">
              {Object.entries(keyAssignments).length > 0 ? (
                Object.entries(keyAssignments).map(([key, assignment]) => (
                  <div key={key}>{key}: {assignment.title || 'Unassigned'}</div>
                ))
              ) : (
                <div className="text-gray-500">No assignments loaded</div>
              )}
            </div>
          </div>

          {/* Media Title */}
          <div className="mb-3">
            <label className="block text-green-400 text-sm font-semibold mb-1">
              Media Title (100 characters max)
            </label>
            <input
              type="text"
              value={mediaTitle}
              onChange={(e) => setMediaTitle(e.target.value.slice(0, 100))}
              placeholder="Enter media title..."
              className="w-full p-2 bg-gray-800 border border-gray-600 rounded text-white text-sm focus:border-green-500 focus:outline-none"
            />
            <div className="text-right text-xs text-gray-400 mt-1">
              {mediaTitle.length}/100
            </div>
          </div>

          {/* Description */}
          <div className="mb-3">
            <label className="block text-green-400 text-sm font-semibold mb-1">
              Description (300 characters max)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value.slice(0, 300))}
              placeholder="Enter description..."
              rows={3}
              className="w-full p-2 bg-gray-800 border border-gray-600 rounded text-white text-sm focus:border-green-500 focus:outline-none resize-none"
            />
            <div className="text-right text-xs text-gray-400 mt-1">
              {description.length}/300
            </div>
          </div>

          {/* Submitted By */}
          <div className="mb-3">
            <label className="block text-green-400 text-sm font-semibold mb-1">
              Submitted By
            </label>
            <input
              type="text"
              value={submittedBy}
              onChange={(e) => setSubmittedBy(e.target.value)}
              placeholder="Your name..."
              className="w-full p-2 bg-gray-800 border border-gray-600 rounded text-white text-sm focus:border-green-500 focus:outline-none"
            />
          </div>

          {/* File Selection */}
          <div className="mb-3">
            <label className="block text-green-400 text-sm font-semibold mb-1">
              Select Media File
            </label>
            <div className="border-2 border-dashed border-gray-600 rounded p-4 text-center bg-gray-800">
              <input
                type="file"
                accept="audio/*"
                onChange={(e) => setAudioFile(e.target.files[0])}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <div className="text-orange-400 text-sm">📁 Click to select file or drag & drop here</div>
                {audioFile && <div className="text-white text-xs mt-1">{audioFile.name}</div>}
              </label>
            </div>
          </div>

          {/* Upload Progress */}
          {isUploading && (
            <div className="mb-3">
              <div className="bg-gray-800 rounded p-2 border border-gray-600">
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          )}

          {/* Key Selection */}
          <div className="mb-4">
            <label className="block text-green-400 text-sm font-semibold mb-2">
              Select Key to Replace
            </label>
            <div className="grid grid-cols-5 gap-1">
              {keys.map(key => (
                <button
                  key={key}
                  onClick={() => setSelectedKey(key)}
                  className={`py-1 px-2 rounded text-xs font-bold transition-all duration-200 ${
                    selectedKey === key 
                      ? 'bg-red-600 text-white border border-red-500' 
                      : 'bg-gray-600 text-white border border-gray-500 hover:bg-gray-500'
                  }`}
                >
                  {key.replace('KEY ', '')}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleUpload}
              disabled={isUploading || backendStatus !== 'online'}
              className="bg-gray-600 hover:bg-gray-500 disabled:bg-gray-700 text-white font-semibold py-2 px-3 rounded border border-gray-500 transition-all duration-200 text-sm"
            >
              {isUploading ? 'Uploading...' : 'Upload & Assign Media'}
            </button>
            <button
              onClick={() => {
                setMediaTitle('')
                setDescription('')
                setSubmittedBy('')
                setAudioFile(null)
                setUploadProgress(0)
              }}
              className="bg-gray-600 hover:bg-gray-500 text-white font-semibold py-2 px-3 rounded border border-gray-500 transition-all duration-200 text-sm"
            >
              Clear Form
            </button>
          </div>
        </div>
      </div>

      {/* Storage Stats */}
      {storageStats.total_files && (
        <div className="mt-6 bg-gradient-to-b from-gray-700 to-gray-800 rounded-lg p-4 border border-gray-600">
          <h4 className="text-green-400 font-semibold mb-2">Storage Statistics</h4>
          <div className="grid grid-cols-3 gap-4 text-sm text-gray-300">
            <div>Total Files: {storageStats.total_files}</div>
            <div>Total Size: {storageStats.total_size_mb}MB</div>
            <div>Available: {storageStats.available_space_mb}MB</div>
          </div>
            {/* Debug Section */}
  <div className="debug bg-gray-100 p-4 mt-4">
    <h3 className="text-red-600 font-semibold mb-2">Debug – Supabase assignments</h3>
    <pre className="text-xs whitespace-pre-wrap">{JSON.stringify(debugData, null, 2)}</pre>
    {debugError && (
      <pre className="text-xs text-red-500 whitespace-pre-wrap">{JSON.stringify(debugError, null, 2)}</pre>
    )}
  </div>

        </div>
      )}
    </div>
  )
}

export default VoxProManagement

