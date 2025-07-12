'use client'

import { useState, useEffect } from 'react'
import { supabase, MediaFile, mockMediaFiles, isSupabaseAvailable } from '@/lib/supabase'
import { Download, FileText, Music, Video } from 'lucide-react'

interface KeyAssignmentsProps {
  className?: string
}

export default function KeyAssignments({ className = '' }: KeyAssignmentsProps) {
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadMediaFiles = async () => {
      if (isSupabaseAvailable) {
        try {
          const { data, error } = await supabase
            .from('media_files')
            .select('*')
            .order('key_assignment')
          
          if (error) {
            console.warn('Supabase error, using mock data:', error)
            setMediaFiles(mockMediaFiles)
          } else {
            setMediaFiles(data || mockMediaFiles)
          }
        } catch (error) {
          console.warn('Supabase connection failed, using mock data:', error)
          setMediaFiles(mockMediaFiles)
        }
      } else {
        setMediaFiles(mockMediaFiles)
      }
      setLoading(false)
    }

    loadMediaFiles()
  }, [])

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('audio') || fileType === 'mpeg') return <Music className="w-5 h-5 text-blue-400" />
    if (fileType.includes('video') || fileType === 'mp4') return <Video className="w-5 h-5 text-red-400" />
    if (fileType.includes('pdf')) return <FileText className="w-5 h-5 text-green-400" />
    return <FileText className="w-5 h-5 text-gray-400" />
  }

  const getKeyColor = (keyNum: number) => {
    const colors = {
      1: 'bg-green-500',
      2: 'bg-red-500', 
      3: 'bg-blue-500',
      4: 'bg-yellow-500',
      5: 'bg-purple-500'
    }
    return colors[keyNum as keyof typeof colors] || 'bg-gray-500'
  }

  if (loading) {
    return (
      <div className={`bg-slate-800 rounded-lg p-6 ${className}`}>
        <h3 className="text-xl font-semibold text-green-400 mb-4">Current Key Assignments</h3>
        <div className="text-gray-400">Loading...</div>
      </div>
    )
  }

  return (
    <div className={`bg-slate-800 rounded-lg p-6 ${className}`}>
      <h3 className="text-xl font-semibold text-green-400 mb-4">Current Key Assignments</h3>
      
      <div className="space-y-4">
        {mediaFiles.map((file) => (
          <div key={file.id} className="bg-slate-700 rounded-lg p-4 border border-slate-600">
            <div className="flex items-start gap-4">
              {/* Key Number */}
              <div className={`w-8 h-8 rounded ${getKeyColor(file.key_assignment)} flex items-center justify-center text-white font-bold text-sm`}>
                {file.key_assignment}
              </div>
              
              {/* File Icon */}
              <div className="flex-shrink-0 mt-1">
                {getFileIcon(file.file_type)}
              </div>
              
              {/* File Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs px-2 py-1 bg-slate-600 text-gray-300 rounded uppercase font-mono">
                    {file.file_type}
                  </span>
                </div>
                
                <h4 className="text-white font-medium mb-2 leading-tight">
                  {file.title}
                </h4>
                
                <p className="text-gray-300 text-sm mb-3 leading-relaxed">
                  {file.description}
                </p>
                
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>By {file.author}</span>
                  <span>{file.date}</span>
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex flex-col gap-2">
                <button className="p-2 bg-blue-600 hover:bg-blue-700 rounded text-white transition-colors">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {mediaFiles.length === 0 && (
        <div className="text-center text-gray-400 py-8">
          No media files assigned to keys
        </div>
      )}
    </div>
  )
}

