import { useState, useEffect, useRef } from 'react'

const VoxProSystem = ({ mode = 'admin' }) => {
  // Configuration
  const API_BASE_URL = 'https://dyh6i3cqmlzj.manus.space/api'
  
  // Global state
  const [mediaLibrary, setMediaLibrary] = useState([])
  const [keyAssignments, setKeyAssignments] = useState({})
  const [storageStats, setStorageStats] = useState({})
  const [backendStatus, setBackendStatus] = useState('connecting')
  const [statusMessage, setStatusMessage] = useState('Connecting to Enterprise Backend...')
  
  // Form state
  const [mediaTitle, setMediaTitle] = useState('')
  const [description, setDescription] = useState('')
  const [submittedBy, setSubmittedBy] = useState('')
  const [selectedKey, setSelectedKey] = useState('KEY 1')
  const [audioFile, setAudioFile] = useState(null)
  const [isUploading, setIsUploading] = useState(false)

  const keys = ['KEY 1', 'KEY 2', 'KEY 3', 'KEY 4', 'KEY 5', 'KEY A', 'KEY B', 'KEY C', 'KEY D']
  const healthCheckInterval = useRef(null)
  const statsUpdateInterval = useRef(null)

  // Initialize the application
  useEffect(() => {
    initializeApp()
    
    return () => {
      if (healthCheckInterval.current) clearInterval(healthCheckInterval.current)
      if (statsUpdateInterval.current) clearInterval(statsUpdateInterval.current)
    }
  }, [])

  const initializeApp = async () => {
    await checkBackendHealth()
    await loadMediaLibrary()
    await loadKeyAssignments()
    await updateStorageStats()
    
    // Set up periodic updates
    healthCheckInterval.current = setInterval(checkBackendHealth, 30000) // Check every 30 seconds
    statsUpdateInterval.current = setInterval(updateStorageStats, 60000) // Update stats every minute
  }

  const checkBackendHealth = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/health`)
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
      setBackendStatus('offline')
      setStatusMessage('Backend Connection Error')
      console.error('Backend health check failed:', error)
    }
  }

  const loadMediaLibrary = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/media`)
      const data = await response.json()
      
      if (data.success) {
        setMediaLibrary(data.media || [])
      }
    } catch (error) {
      console.error('Failed to load media library:', error)
    }
  }

  const loadKeyAssignments = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/assignments`)
      const data = await response.json()
      
      if (data.success) {
        setKeyAssignments(data.assignments || {})
      }
    } catch (error) {
      console.error('Failed to load key assignments:', error)
    }
  }

  const updateStorageStats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/storage/stats`)
      const data = await response.json()
      
      if (data.success) {
        setStorageStats(data.stats || {})
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

    setIsUploading(true)
    
    try {
      const formData = new FormData()
      formData.append('audio', audioFile)
      formData.append('title', mediaTitle)
      formData.append('description', description)
      formData.append('submittedBy', submittedBy)
      formData.append('assignedKey', selectedKey)

      const response = await fetch(`${API_BASE_URL}/upload`, {
        method: 'POST',
        body: formData
      })

      const data = await response.json()

      if (data.success) {
        alert('Media uploaded successfully!')
        setMediaTitle('')
        setDescription('')
        setSubmittedBy('')
        setAudioFile(null)
        
        // Refresh data
        await loadMediaLibrary()
        await loadKeyAssignments()
        await updateStorageStats()
      } else {
        alert(`Upload failed: ${data.message || 'Unknown error'}`)
      }
    } catch (error) {
      alert('Upload error. Please check your connection.')
      console.error('Upload error:', error)
    } finally {
      setIsUploading(false)
    }
  }

  const handleKeyPress = async (keyNumber) => {
    try {
      const response = await fetch(`${API_BASE_URL}/assign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          key_number: keyNumber,
          assigned_by: 'VoxPro User'
        })
      })

      const data = await response.json()
      if (data.success) {
        await loadKeyAssignments()
      }
    } catch (error) {
      console.error('Key press error:', error)
    }
  }

  const deleteMedia = async (mediaId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/media/${mediaId}`, {
        method: 'DELETE'
      })

      const data = await response.json()
      if (data.success) {
        await loadMediaLibrary()
        await loadKeyAssignments()
      }
    } catch (error) {
      console.error('Delete media error:', error)
    }
  }

  const getKeyTitle = (keyName) => {
    const assignment = keyAssignments[keyName]
    return assignment ? assignment.title : 'No media assigned'
  }

  return (
    <div className="bg-gray-900 text-white p-6 rounded-lg border border-gray-700">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">VoxPro Enterprise Media Management System</h3>
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${
              backendStatus === 'online' ? 'bg-green-500' : 
              backendStatus === 'connecting' ? 'bg-yellow-500' : 'bg-red-500'
            }`}></div>
            <span className="text-sm">{statusMessage}</span>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* VoxPro Control Interface */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h4 className="text-lg font-semibold mb-4 text-green-400">VoxPro Control Interface</h4>
          
          <div className="mb-4">
            <div className="bg-green-600 text-center py-2 rounded mb-4">
              VoxPro Enterprise Interface - Ready
            </div>
            <div className="bg-gray-700 text-center py-2 rounded mb-4">
              Storage: Enterprise Backend Connected
            </div>
          </div>

          {/* START Keys */}
          <div className="grid grid-cols-5 gap-2 mb-4">
            {[1, 2, 3, 4, 5].map(num => (
              <button
                key={num}
                onClick={() => handleKeyPress(`START_${num}`)}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-2 rounded text-sm transition-colors whitespace-nowrap w-20"
                title={getKeyTitle(`START_${num}`)}
              >
                START {num}
              </button>
            ))}
          </div>

          {/* Control Keys Row 1 */}
          <div className="grid grid-cols-4 gap-2 mb-2">
            <button
              onClick={() => handleKeyPress('A')}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded transition-colors whitespace-nowrap w-20"
              title={getKeyTitle('A')}
            >
              A
            </button>
            <button
              onClick={() => handleKeyPress('B')}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded transition-colors whitespace-nowrap w-20"
              title={getKeyTitle('B')}
            >
              B
            </button>
            <button
              onClick={() => handleKeyPress('DUP')}
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded transition-colors whitespace-nowrap w-20"
            >
              DUP
            </button>
            <button
              onClick={() => handleKeyPress('C')}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded transition-colors whitespace-nowrap w-20"
              title={getKeyTitle('C')}
            >
              C
            </button>
          </div>

          {/* Control Keys Row 2 */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            <button
              onClick={() => handleKeyPress('D')}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded transition-colors whitespace-nowrap w-20"
              title={getKeyTitle('D')}
            >
              D
            </button>
            <button
              onClick={() => handleKeyPress('CUE')}
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded transition-colors whitespace-nowrap w-20"
            >
              CUE
            </button>
          </div>

          <div className="bg-gray-700 p-3 rounded text-center text-sm">
            Hover over keys to see assigned media
          </div>

          <div className="mt-4 bg-gray-800 p-3 rounded">
            <h5 className="text-sm font-semibold mb-2 text-green-400">Key Definitions</h5>
            <ul className="text-xs space-y-1">
              <li><span className="font-bold">START 1-5:</span> Play assigned media</li>
              <li><span className="font-bold">A-D:</span> Trigger configured macros</li>
              <li><span className="font-bold">DUP:</span> Duplicate last action</li>
              <li><span className="font-bold">CUE:</span> Prepare next track</li>
            </ul>
          </div>

          {/* Storage Stats */}
          {storageStats.total_files && (
            <div className="mt-4 bg-gray-700 p-3 rounded">
              <h5 className="text-sm font-semibold mb-2">Storage Statistics</h5>
              <div className="text-xs space-y-1">
                <div>Total Files: {storageStats.total_files}</div>
                <div>Total Size: {storageStats.total_size_mb}MB</div>
                <div>Available Space: {storageStats.available_space_mb}MB</div>
              </div>
            </div>
          )}
        </div>

        {/* Media Management Interface */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h4 className="text-lg font-semibold mb-4 text-green-400">Media Management Interface</h4>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-green-400">
                Media Title (100 characters max)
              </label>
              <input
                type="text"
                value={mediaTitle}
                onChange={(e) => setMediaTitle(e.target.value.slice(0, 100))}
                placeholder="Enter media title..."
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400"
              />
              <div className="text-right text-xs text-gray-400 mt-1">
                {mediaTitle.length}/100
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-green-400">
                Description (300 characters max)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value.slice(0, 300))}
                placeholder="Enter description..."
                rows={3}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400"
              />
              <div className="text-right text-xs text-gray-400 mt-1">
                {description.length}/300
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-green-400">
                Submitted By
              </label>
              <input
                type="text"
                value={submittedBy}
                onChange={(e) => setSubmittedBy(e.target.value)}
                placeholder="Your name..."
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-green-400">
                Assign to Key
              </label>
              <select
                value={selectedKey}
                onChange={(e) => setSelectedKey(e.target.value)}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white"
              >
                {keys.map(key => (
                  <option key={key} value={key}>{key}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-green-400">
                Select Audio File
              </label>
              <input
                type="file"
                accept="audio/*"
                onChange={(e) => setAudioFile(e.target.files[0])}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-green-600 file:text-white hover:file:bg-green-700"
              />
            </div>

            <button
              onClick={handleUpload}
              disabled={isUploading || backendStatus !== 'online'}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white font-bold py-3 px-4 rounded transition-colors"
            >
              {isUploading ? 'Uploading...' : 'Upload & Assign Media'}
            </button>
          </div>

          {/* Media Library */}
          {mediaLibrary.length > 0 && (
            <div className="mt-6">
              <h5 className="text-sm font-semibold mb-2 text-green-400">Media Library</h5>
              <div className="max-h-40 overflow-y-auto space-y-2">
                {mediaLibrary.map(media => (
                  <div key={media.id} className="bg-gray-700 p-2 rounded text-xs">
                    <div className="font-semibold">{media.title}</div>
                    <div className="text-gray-400">{media.description}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default VoxProSystem

