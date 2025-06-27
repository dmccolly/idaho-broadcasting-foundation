import { useState, useEffect, useRef } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { supabase } from '../lib/supabase';

const VoxProPlayer = ({ assignment }) => {
  const playerRef   = useRef(null);
  const waveformRef = useRef(null);

  // Detect media type (kept from original code)
  const [mediaType, setMediaType] = useState(null);
  useEffect(() => {
    if (!assignment?.media_url) return;
    const ext = assignment.media_url.split('.').pop().toLowerCase();
    setMediaType(ext === 'mp4' ? 'video' : 'audio');
  }, [assignment]);

  // WaveSurfer
  useEffect(() => {
    if (!assignment?.media_url) return;

    const ws = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: '#4ade80',
      progressColor: '#059669',
      height: 80,
    });

    ws.load(assignment.media_url);
    return () => ws.destroy();
  }, [assignment?.media_url]);

  if (!assignment) return null;

  return (
    <div className="w-full">
      <div
        ref={waveformRef}
        className="w-full h-16 bg-gray-900 rounded"
      />
      {/* Any existing play / pause buttons can remain unchanged */}
    </div>
  );
};

export default VoxProPlayer;
