import { useState, useEffect } from 'react'
import useAssignments from '../hooks/useAssignments';

const VoxProPlayer = () => {
  // Configuration
  const API_BASE_URL = 'https://j6h5i7c15mnp.manus.space/api'
  
  // State
  const [backendStatus, setBackendStatus] = useState('connecting')
  const [statusMessage, setStatusMessage] = useState('Connecting to Enterprise Backend...')
  const [keyAssignments, setKeyAssignments] = useState({})
    const assignments = useAssignments();

  useEffect(() => {
    initializePlayer()
    
    const healthInterval = setInterval(checkBackendHealth, 30000)
    
    return () => {
      clearInterval(healthInterval)
    }
  }, [])

  const initializePlayer = async () => {
    await checkBackendHealth()
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
        setStatusMessage('Media Server: Online')
      } else {
        throw new Error(data.message || 'Backend unhealthy')
      }
    } catch (error) {
      console.error('Backend health check failed:', error)
      setBackendStatus('offline')
      setStatusMessage('Media Server: Offline')
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
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-green-400 mb-2">VoxPro Media Player</h2>
        <p className="text-gray-600">Compact professional media player for broadcasting operations.</p>
      </div>

      {/* Player Interface */}
      <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-lg p-8 border border-gray-600 shadow-2xl">
        {/* Header */}
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-green-400 mb-1">VoxPro Media Interface</h3>
          <p className="text-gray-400 text-sm">Professional Control System</p>
          <div className="flex items-center justify-center space-x-2 mt-3">
            <div className={`w-3 h-3 rounded-full ${
              backendStatus === 'online' ? 'bg-green-500' : 
              backendStatus === 'connecting' ? 'bg-yellow-500' : 'bg-red-500'
            }`}></div>
            <span className="text-gray-400 text-sm">{statusMessage}</span>
          </div>
        </div>

        {/* Two Panel Layout */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Panel - Control Interface */}
          <div className="bg-gradient-to-b from-gray-700 to-gray-800 rounded-lg p-6 border border-gray-600">
            <h4 className="text-lg font-bold text-green-400 mb-4 text-center">Control Interface</h4>
            
            <div className="text-center mb-4">
              <h5 className="text-white font-bold mb-1">VoxPro</h5>
              <p className="text-gray-400 text-sm">Media Control System</p>
            </div>

            {/* Status Bar */}
            <div className="mb-6">
              <div className="bg-blue-600 text-white text-center py-3 rounded border border-blue-500 text-sm font-semibold">
                Ready - Select Media to Play
              </div>
            </div>

            {/* START Keys */}
            <div className="grid grid-cols-5 gap-2 mb-6">
              {[1, 2, 3, 4, 5].map(num => (
                <button
                  key={num}
                  onClick={() => handleKeyPress(`START_${num}`)}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-2 rounded border border-red-500 transition-all duration-200 text-sm"
                  title={getKeyTitle(`START_${num}`)}
                >
                  {num}
                </button>
              ))}
            </div>

            {/* Control Buttons */}
            <div className="grid grid-cols-3 gap-2 mb-6">
              <button 
                onClick={() => handleKeyPress('A')}
                className="bg-gray-600 hover:bg-gray-500 text-white font-semibold py-3 px-2 rounded border border-gray-500 text-sm"
                title={getKeyTitle('A')}
              >
                A
              </button>
              <button 
                onClick={() => handleKeyPress('B')}
                className="bg-gray-600 hover:bg-gray-500 text-white font-semibold py-3 px-2 rounded border border-gray-500 text-sm"
                title={getKeyTitle('B')}
              >
                B
              </button>
              <button 
                onClick={() => handleKeyPress('DUP')}
                className="bg-gray-600 hover:bg-gray-500 text-white font-semibold py-3 px-2 rounded border border-gray-500 text-sm"
              >
                DUP
              </button>
              
              <button 
                onClick={() => handleKeyPress('C')}
                className="bg-gray-600 hover:bg-gray-500 text-white font-semibold py-3 px-2 rounded border border-gray-500 text-sm"
                title={getKeyTitle('C')}
              >
                C
              </button>
              <button 
                onClick={() => handleKeyPress('D')}
                className="bg-gray-600 hover:bg-gray-500 text-white font-semibold py-3 px-2 rounded border border-gray-500 text-sm"
                title={getKeyTitle('D')}
              >
                D
              </button>
              <button 
                onClick={() => handleKeyPress('CUE')}
                className="bg-gray-600 hover:bg-gray-500 text-white font-semibold py-3 px-2 rounded border border-gray-500 text-sm"
              >
                CUE
              </button>
              
              <button 
                onClick={() => handleKeyPress('E')}
                className="bg-gray-600 hover:bg-gray-500 text-white font-semibold py-3 px-2 rounded border border-gray-500 text-sm"
                title={getKeyTitle('E')}
              >
                E
              </button>
              <button 
                onClick={() => handleKeyPress('F')}
                className="bg-gray-600 hover:bg-gray-500 text-white font-semibold py-3 px-2 rounded border border-gray-500 text-sm"
                title={getKeyTitle('F')}
              >
                F
              </button>
              <button 
                onClick={() => handleKeyPress('REC')}
                className="bg-gray-600 hover:bg-gray-500 text-white font-semibold py-3 px-2 rounded border border-gray-500 text-sm"
              >
                REC
              </button>
              
              <button 
                onClick={() => handleKeyPress('G')}
                className="bg-gray-600 hover:bg-gray-500 text-white font-semibold py-3 px-2 rounded border border-gray-500 text-sm col-start-2"
                title={getKeyTitle('G')}
              >
                G
              </button>
            </div>

            {/* VU Meter */}
            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-full border-4 border-green-500 bg-gray-800 flex items-center justify-center relative">
                <div className="w-1 h-8 bg-green-500 rounded"></div>
                <div className="absolute inset-0 rounded-full bg-green-500 opacity-20 animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Right Panel - Current Media */}
          <div className="bg-gradient-to-b from-gray-700 to-gray-800 rounded-lg p-6 border border-gray-600">
            <h4 className="text-lg font-bold text-green-400 mb-4 text-center">Current Media</h4>
            
            {/* Media Display */}
            <div className="bg-black rounded p-4 mb-4 border border-gray-600 h-32 flex items-center justify-center">
              <div className="text-center">
                <div className="text-gray-500 text-sm mb-2">No Media Selected</div>
                <div className="text-gray-600 text-xs">Select a key to load media</div>
              </div>
            </div>

            {/* Status Indicators */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Media Server:</span>
                <span className={`${
                  backendStatus === 'online' ? 'text-green-400' : 
                  backendStatus === 'connecting' ? 'text-yellow-400' : 'text-red-400'
                }`}>
                  {backendStatus === 'online' ? 'Online' : 
                   backendStatus === 'connecting' ? 'Connecting...' : 'Offline'}
                </span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Player Status:</span>
                <span className="text-blue-400">Ready</span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Audio Level:</span>
                <span className="text-green-400">Normal</span>
              </div>
            </div>

            {/* Key Assignments Preview */}
            <div className="mt-6">
              <h5 className="text-green-400 font-semibold mb-2 text-sm">Quick Reference</h5>
              <div className="text-xs text-gray-400 space-y-1 max-h-24 overflow-y-auto">
                <div>1-5: START Keys</div>
                <div>A-G: Media Keys</div>
                <div>DUP: Duplicate</div>
                <div>CUE: Cue Point</div>
                <div>REC: Record</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VoxProPlayer

