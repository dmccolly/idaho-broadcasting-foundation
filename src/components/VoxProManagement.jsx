import { useState, useEffect, useRef } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { supabase } from '../lib/supabase';

const VoxProManagement = () => {
  const playerRef   = useRef(null);
  const waveformRef = useRef(null);

  const [assignments, setAssignments] = useState([]);
  const [selected, setSelected] = useState(null);

  // Load assignments (kept from original code)
  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase.from('assignments').select('*');
      if (!error) setAssignments(data);
    };
    load();
  }, []);

  // WaveSurfer for the selected assignment
  useEffect(() => {
    if (!selected?.media_url) return;

    const ws = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: '#4ade80',
      progressColor: '#059669',
      height: 80,
    });

    ws.load(selected.media_url);
    return () => ws.destroy();
  }, [selected?.media_url]);

  return (
    <div className="p-4">
      {/* List of assignments, click to setSelected */}
      <ul className="mb-4">
        {assignments.map((a) => (
          <li
            key={a.id}
            onClick={() => setSelected(a)}
            className="cursor-pointer hover:text-green-400"
          >
            {a.title}
          </li>
        ))}
      </ul>

      {/* Waveform player */}
      {selected && (
        <div
          ref={waveformRef}
          className="w-full h-16 bg-gray-900 rounded"
        />
      )}
    </div>
  );
};

export default VoxProManagement;
