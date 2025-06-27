import { useState, useEffect, useRef } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { supabase } from '../lib/supabase';

const VoxProManagement = () => {
  const waveformRef = useRef(null);
  const wavesurferRef = useRef(null);
  const audioElementRef = useRef(null); // Reference to the existing audio element
  
  // State management
  const [assignments, setAssignments] = useState([]);
  const [selected, setSelected] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [error, setError] = useState(null);
  const [audioReady, setAudioReady] = useState(false);

  // Load assignments
  useEffect(() => {
    const load = async () => {
      try {
        const { data, error } = await supabase.from('assignments').select('*');
        if (error) throw error;
        setAssignments(data || []);
      } catch (error) {
        console.error('Failed to load assignments:', error);
        setError('Failed to load assignments: ' + error.message);
      }
    };
    load();
  }, []);

  // Initialize Wavesurfer when assignment is selected
  useEffect(() => {
    if (!selected?.media_url) {
      cleanupWavesurfer();
      return;
    }

    initializeWavesurfer();
    
    return () => {
      cleanupWavesurfer();
    };
  }, [selected?.media_url]);

  const cleanupWavesurfer = () => {
    if (wavesurferRef.current) {
      try {
        wavesurferRef.current.destroy();
      } catch (e) {
        console.warn('Error destroying wavesurfer:', e);
      }
      wavesurferRef.current = null;
    }
    setIsPlaying(false);
    setDuration(0);
    setCurrentTime(0);
    setError(null);
    setAudioReady(false);
  };

  const initializeWavesurfer = async () => {
    if (!waveformRef.current || !selected?.media_url) return;

    setIsLoading(true);
    setError(null);
    setAudioReady(false);

    try {
      // First, try to create a simple audio element to test the URL
      const testAudio = new Audio();
      testAudio.crossOrigin = 'anonymous';
      
      await new Promise((resolve, reject) => {
        testAudio.oncanplaythrough = resolve;
        testAudio.onerror = reject;
        testAudio.onloadeddata = resolve;
        testAudio.src = selected.media_url;
        testAudio.load();
      });

      console.log('✅ Audio URL is valid and loadable');

      // Clear the container
      waveformRef.current.innerHTML = '';

      // Create Wavesurfer with explicit settings for audio output
      const ws = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: '#4ade80',
        progressColor: '#059669',
        cursorColor: '#ffffff',
        height: 80,
        normalize: true,
        backend: 'WebAudio', // CRITICAL: This enables actual audio output
        mediaControls: false,
        interact: true,
        barWidth: 2,
        barGap: 1,
        barRadius: 3,
        responsive: true,
        hideScrollbar: true,
        fillParent: true,
        scrollParent: true
      });

      wavesurferRef.current = ws;

      // Event listeners
      ws.on('ready', () => {
        console.log('🎵 Wavesurfer ready - audio should work now');
        setIsLoading(false);
        setAudioReady(true);
        setDuration(ws.getDuration());
        
        // Set initial volume
        ws.setVolume(volume);
        
        // Test audio context state
        if (ws.backend && ws.backend.ac) {
          console.log('🔊 Audio Context State:', ws.backend.ac.state);
          if (ws.backend.ac.state === 'suspended') {
            console.log('⚠️ Audio context suspended - will resume on user interaction');
          }
        }
      });

      ws.on('play', () => {
        console.log('▶️ Wavesurfer started playing');
        setIsPlaying(true);
      });

      ws.on('pause', () => {
        console.log('⏸️ Wavesurfer paused');
        setIsPlaying(false);
      });

      ws.on('finish', () => {
        console.log('⏹️ Wavesurfer finished');
        setIsPlaying(false);
        setCurrentTime(0);
      });

      ws.on('audioprocess', () => {
        setCurrentTime(ws.getCurrentTime());
      });

      ws.on('seek', () => {
        setCurrentTime(ws.getCurrentTime());
      });

      ws.on('error', (error) => {
        console.error('❌ Wavesurfer error:', error);
        setError('Wavesurfer error: ' + error.message);
        setIsLoading(false);
      });

      ws.on('loading', (percent) => {
        console.log('📥 Loading progress:', percent + '%');
      });

      // Load the audio file
      console.log('📂 Loading audio file:', selected.media_url);
      await ws.load(selected.media_url);

    } catch (error) {
      console.error('❌ Failed to initialize audio:', error);
      setError('Failed to load audio: ' + error.message + ' (URL: ' + selected.media_url + ')');
      setIsLoading(false);
    }
  };

  // Play/pause with proper audio context handling
  const togglePlayPause = async () => {
    if (!wavesurferRef.current || !audioReady) {
      console.warn('⚠️ Wavesurfer not ready');
      return;
    }

    try {
      // Handle audio context suspension (browser autoplay policy)
      if (wavesurferRef.current.backend && wavesurferRef.current.backend.ac) {
        const audioContext = wavesurferRef.current.backend.ac;
        if (audioContext.state === 'suspended') {
          console.log('🔄 Resuming suspended audio context...');
          await audioContext.resume();
          console.log('✅ Audio context resumed, state:', audioContext.state);
        }
      }

      if (isPlaying) {
        wavesurferRef.current.pause();
      } else {
        await wavesurferRef.current.play();
        console.log('🎵 Audio should be playing now');
      }
    } catch (error) {
      console.error('❌ Playback error:', error);
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
      console.log('🔊 Volume set to:', Math.round(newVolume * 100) + '%');
    }
  };

  const handleSelectAssignment = (assignment) => {
    console.log('📋 Selected assignment:', assignment.title);
    setSelected(assignment);
  };

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-2xl font-bold text-white">VoxPro Management Tool</h2>
      
      {/* Status and Error Display */}
      {error && (
        <div className="bg-red-900 border border-red-700 text-red-200 p-4 rounded-lg">
          <strong>Error:</strong> {error}
        </div>
      )}
      
      {isLoading && (
        <div className="bg-blue-900 border border-blue-700 text-blue-200 p-4 rounded-lg">
          Loading audio file...
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Assignment List */}
        <div className="bg-gray-800 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-200 mb-4">Assignments</h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {assignments.length === 0 ? (
              <p className="text-gray-400">No assignments found</p>
            ) : (
              assignments.map((assignment) => (
                <div
                  key={assignment.id}
                  onClick={() => handleSelectAssignment(assignment)}
                  className={`p-3 rounded cursor-pointer transition-all ${
                    selected?.id === assignment.id
                      ? 'bg-green-600 text-white shadow-lg'
                      : 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                  }`}
                >
                  <div className="font-medium">{assignment.title}</div>
                  <div className="text-sm opacity-75">
                    {assignment.description || 'No description'}
                  </div>
                  {assignment.media_url && (
                    <div className="text-xs mt-1 opacity-60">
                      🎵 {assignment.media_url.split('/').pop()}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Audio Player */}
        <div className="bg-gray-800 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-200 mb-4">
            {selected ? `Now Playing: ${selected.title}` : 'Select an assignment to play'}
          </h3>
          
          {selected ? (
            <div className="space-y-4">
              {/* Waveform Visualization */}
              <div className="bg-gray-900 rounded-lg p-4">
                <div
                  ref={waveformRef}
                  className="w-full h-20 bg-gray-800 rounded"
                  style={{ minHeight: '80px' }}
                />
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between bg-gray-900 rounded-lg p-3">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={togglePlayPause}
                    disabled={!audioReady}
                    className="flex items-center justify-center w-12 h-12 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-full transition-colors"
                  >
                    {isPlaying ? '⏸️' : '▶️'}
                  </button>

                  <button
                    onClick={handleStop}
                    disabled={!audioReady}
                    className="flex items-center justify-center w-10 h-10 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-full transition-colors"
                  >
                    ⏹️
                  </button>

                  <div className="text-sm text-gray-300">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-400">🔊</span>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={volume}
                    onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                    className="w-20"
                  />
                  <span className="text-xs text-gray-400 w-8">
                    {Math.round(volume * 100)}%
                  </span>
                </div>
              </div>

              {/* Status Indicators */}
              <div className="text-xs text-gray-400 space-y-1 bg-gray-900 rounded p-3">
                <div>🎵 Audio Ready: {audioReady ? '✅ Yes' : '❌ No'}</div>
                <div>▶️ Playing: {isPlaying ? '✅ Yes' : '❌ No'}</div>
                <div>🔊 Volume: {Math.round(volume * 100)}%</div>
                <div>⏱️ Duration: {formatTime(duration)}</div>
                {wavesurferRef.current?.backend?.ac && (
                  <div>🎙️ Audio Context: {wavesurferRef.current.backend.ac.state}</div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-gray-900 rounded-lg p-8 text-center text-gray-400">
              <div className="text-4xl mb-4">🎵</div>
              <p>Select an assignment from the list to load the audio player</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VoxProManagement;
