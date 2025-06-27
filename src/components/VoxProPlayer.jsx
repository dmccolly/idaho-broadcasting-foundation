import { useState, useEffect, useRef } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { supabase } from '../lib/supabase';

const VoxProPlayer = ({ assignment }) => {
  const playerRef = useRef(null);
  const waveformRef = useRef(null);
  const wavesurferRef = useRef(null);
  
  // State management
  const [mediaType, setMediaType] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [error, setError] = useState(null);

  // Detect media type
  useEffect(() => {
    if (!assignment?.media_url) return;
    const ext = assignment.media_url.split('.').pop().toLowerCase();
    setMediaType(ext === 'mp4' ? 'video' : 'audio');
  }, [assignment]);

  // Initialize WaveSurfer with proper audio handling
  useEffect(() => {
    if (!assignment?.media_url || !waveformRef.current) return;

    setIsLoading(true);
    setError(null);

    try {
      // Destroy existing instance
      if (wavesurferRef.current) {
        wavesurferRef.current.destroy();
      }

      // Create new WaveSurfer instance
      const ws = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: '#4ade80',
        progressColor: '#059669',
        height: 80,
        normalize: true,
        backend: 'WebAudio', // This is crucial for audio output
        mediaControls: false,
        interact: true,
        cursorColor: '#ffffff',
        cursorWidth: 1,
        barWidth: 2,
        barRadius: 3,
        responsive: true,
        hideScrollbar: true
      });

      // Store reference
      wavesurferRef.current = ws;

      // Event listeners
      ws.on('ready', () => {
        setIsLoading(false);
        setDuration(ws.getDuration());
        ws.setVolume(volume);
        console.log('WaveSurfer ready, duration:', ws.getDuration());
      });

      ws.on('play', () => {
        setIsPlaying(true);
        console.log('WaveSurfer started playing');
      });

      ws.on('pause', () => {
        setIsPlaying(false);
        console.log('WaveSurfer paused');
      });

      ws.on('finish', () => {
        setIsPlaying(false);
        setCurrentTime(0);
        console.log('WaveSurfer finished playing');
      });

      ws.on('audioprocess', () => {
        setCurrentTime(ws.getCurrentTime());
      });

      ws.on('seek', () => {
        setCurrentTime(ws.getCurrentTime());
      });

      ws.on('error', (error) => {
        console.error('WaveSurfer error:', error);
        setError('Failed to load audio: ' + error.message);
        setIsLoading(false);
      });

      // Load the audio
      ws.load(assignment.media_url);

    } catch (error) {
      console.error('Failed to initialize WaveSurfer:', error);
      setError('Failed to initialize audio player');
      setIsLoading(false);
    }

    // Cleanup function
    return () => {
      if (wavesurferRef.current) {
        wavesurferRef.current.destroy();
        wavesurferRef.current = null;
      }
    };
  }, [assignment?.media_url, volume]);

  // Play/pause functionality
  const togglePlayPause = async () => {
    if (!wavesurferRef.current) return;

    try {
      // Handle browser autoplay policy
      if (wavesurferRef.current.backend && wavesurferRef.current.backend.ac) {
        const audioContext = wavesurferRef.current.backend.ac;
        if (audioContext.state === 'suspended') {
          await audioContext.resume();
          console.log('Audio context resumed');
        }
      }

      if (isPlaying) {
        wavesurferRef.current.pause();
      } else {
        wavesurferRef.current.play();
      }
    } catch (error) {
      console.error('Playback error:', error);
      setError('Playback failed: ' + error.message);
    }
  };

  const handleStop = () => {
    if (!wavesurferRef.current) return;
    wavesurferRef.current.stop();
    setCurrentTime(0);
  };

  const handleVolumeChange = (newVolume) => {
    setVolume(newVolume);
    if (wavesurferRef.current) {
      wavesurferRef.current.setVolume(newVolume);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!assignment) return null;

  return (
    <div className="w-full bg-gray-800 rounded-lg p-4">
      {/* Error display */}
      {error && (
        <div className="mb-4 p-3 bg-red-900 border border-red-700 rounded text-red-200 text-sm">
          {error}
        </div>
      )}

      {/* Loading indicator */}
      {isLoading && (
        <div className="mb-4 p-3 bg-blue-900 border border-blue-700 rounded text-blue-200 text-sm">
          Loading audio...
        </div>
      )}

      {/* Waveform container */}
      <div
        ref={waveformRef}
        className="w-full h-16 bg-gray-900 rounded mb-4"
      />

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {/* Play/Pause button */}
          <button
            onClick={togglePlayPause}
            disabled={isLoading || !wavesurferRef.current}
            className="flex items-center justify-center w-12 h-12 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-full transition-colors"
          >
            {isPlaying ? (
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
            )}
          </button>

          {/* Stop button */}
          <button
            onClick={handleStop}
            disabled={isLoading || !wavesurferRef.current}
            className="flex items-center justify-center w-10 h-10 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-full transition-colors"
          >
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
            </svg>
          </button>

          {/* Time display */}
          <div className="text-sm text-gray-300">
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>
        </div>

        {/* Volume control */}
        <div className="flex items-center space-x-2">
          <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.778l-4.146-3.319H2a1 1 0 01-1-1V7.5a1 1 0 011-1h2.237l4.146-3.318a1 1 0 011.617.778zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
          </svg>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
            className="w-20 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
          />
          <span className="text-xs text-gray-400 w-8">
            {Math.round(volume * 100)}%
          </span>
        </div>
      </div>

      {/* Debug info (remove in production) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-4 p-2 bg-gray-900 rounded text-xs text-gray-400">
          <div>Media Type: {mediaType}</div>
          <div>Playing: {isPlaying ? 'Yes' : 'No'}</div>
          <div>Duration: {formatTime(duration)}</div>
          <div>Current Time: {formatTime(currentTime)}</div>
          <div>Volume: {Math.round(volume * 100)}%</div>
          <div>Audio Context State: {wavesurferRef.current?.backend?.ac?.state || 'Unknown'}</div>
        </div>
      )}
    </div>
  );
};

export default VoxProPlayer;
