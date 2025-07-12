'use client'

import { useState, useEffect } from 'react'
import { supabase, MediaFile, mockMediaFiles, isSupabaseAvailable } from '@/lib/supabase'
import { Play, Pause, Volume2, Download, FileText, Music, Video } from 'lucide-react'

interface VoxProPlayerProps {
  className?: string
}

export default function VoxProPlayer({ className = '' }: VoxProPlayerProps) {
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [selectedKey, setSelectedKey] = useState<number | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentFile, setCurrentFile] = useState<MediaFile | null>(null)

  useEffect(() => {
    // Load data - use mock data if Supabase is not available
    const loadData = async () => {
      if (isSupabaseAvailable) {
        try {
          const { data, error } = await supabase.from('media_files').select('*').order('key_assignment')
          
          if (data && !error) {
            setMediaFiles(data)
            setIsConnected(true)
            return
          }
        } catch (err) {
          console.warn('Supabase connection failed, using mock data')
        }
      }
      
      // Use mock data as fallback
      setMediaFiles(mockMediaFiles)
      setIsConnected(false)
    }

    loadData()
  }, [])

  const handleKeyClick = (keyNumber: number) => {
    setSelectedKey(keyNumber)
    const file = mediaFiles.find(f => f.key_assignment === keyNumber)
    if (file) {
      setCurrentFile(file)
    }
  }

  const togglePlayback = () => {
    setIsPlaying(!isPlaying)
  }

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('audio')) return <Music className="w-4 h-4" />
    if (fileType.includes('video')) return <Video className="w-4 h-4" />
    if (fileType.includes('pdf')) return <FileText className="w-4 h-4" />
    return <FileText className="w-4 h-4" />
  }

  const getKeyColor = (keyNumber: number) => {
    const colors = [
      'bg-green-500 hover:bg-green-600',
      'bg-red-500 hover:bg-red-600', 
      'bg-blue-500 hover:bg-blue-600',
      'bg-yellow-500 hover:bg-yellow-600',
      'bg-purple-500 hover:bg-purple-600'
    ]
    return colors[keyNumber - 1] || 'bg-gray-500 hover:bg-gray-600'
  }

  return (
    <div className={`bg-gray-900 rounded-lg p-6 text-white ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-green-400">VoxPro Media Player</h3>
          <p className="text-sm text-gray-400">Professional Broadcasting Control</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
          <span className="text-sm">
            {isConnected ? 'Connected to Supabase' : 'Demo Mode'}
          </span>
        </div>
      </div>

      {/* Key Buttons */}
      <div className="grid grid-cols-5 gap-3 mb-6">
        {[1, 2, 3, 4, 5].map((keyNumber) => (
          <button
            key={keyNumber}
            onClick={() => handleKeyClick(keyNumber)}
            className={`
              ${getKeyColor(keyNumber)}
              ${selectedKey === keyNumber ? 'ring-2 ring-white' : ''}
              text-white font-bold py-4 px-2 rounded-lg transition-all duration-200
              flex flex-col items-center justify-center min-h-[80px]
            `}
          >
            <span className="text-2xl mb-1">{keyNumber}</span>
            <span className="text-xs opacity-75">
              {keyNumber < 10 ? `0${keyNumber}` : keyNumber}
            </span>
          </button>
        ))}
      </div>

      {/* Current Selection Display */}
      {currentFile && (
        <div className="bg-gray-800 rounded-lg p-4 mb-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                {getFileIcon(currentFile.file_type)}
                <h4 className="font-semibold text-green-400">Key {currentFile.key_assignment}</h4>
                <span className="text-xs bg-gray-700 px-2 py-1 rounded">
                  {currentFile.file_type}
                </span>
              </div>
              <h5 className="font-medium mb-1">{currentFile.title}</h5>
              <p className="text-sm text-gray-400 mb-2">{currentFile.description}</p>
              <p className="text-xs text-gray-500">
                By {currentFile.author} • {currentFile.date}
              </p>
            </div>
            <div className="flex space-x-2 ml-4">
              {currentFile.file_type.includes('audio') || currentFile.file_type.includes('video') ? (
                <button
                  onClick={togglePlayback}
                  className="bg-green-600 hover:bg-green-700 p-2 rounded-lg transition-colors"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
              ) : null}
              <button className="bg-blue-600 hover:bg-blue-700 p-2 rounded-lg transition-colors">
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Media Player Controls */}
      {currentFile && (currentFile.file_type.includes('audio') || currentFile.file_type.includes('video')) && (
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={togglePlayback}
              className="bg-green-600 hover:bg-green-700 p-3 rounded-full transition-colors"
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </button>
            <div className="flex-1">
              <div className="bg-gray-700 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full w-1/3"></div>
              </div>
            </div>
            <Volume2 className="w-5 h-5 text-gray-400" />
            <div className="bg-gray-700 rounded-full h-2 w-20">
              <div className="bg-white h-2 rounded-full w-3/4"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

