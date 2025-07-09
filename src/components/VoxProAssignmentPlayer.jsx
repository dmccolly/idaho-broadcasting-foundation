import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useSearchParams } from 'react-router-dom';

const detectType = (url) => {
  const ext = url.split('.').pop().toLowerCase();
  if (['mp4', 'webm', 'ogg', 'mov'].includes(ext)) return 'video';
  if (['mp3', 'wav', 'aac', 'm4a', 'oga'].includes(ext)) return 'audio';
  if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) return 'image';
  return 'other';
};

const VoxProAssignmentPlayer = () => {
  const [params] = useSearchParams();
  const key = params.get('key');
  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const { data, error } = await supabase
          .from('assignments')
          .select('*')
          .eq('key_slot', key)
          .single();
        if (error) throw error;
        setAssignment(data);
      } catch (err) {
        console.error('Failed to load assignment:', err);
        setError('Failed to load media');
      } finally {
        setLoading(false);
      }
    };
    if (key) load();
  }, [key]);

  if (loading) return <div className="p-4 text-gray-700">Loading...</div>;
  if (!assignment || error) return <div className="p-4 text-red-500">{error || 'No media assigned.'}</div>;

  const type = detectType(assignment.media_url);

  return (
    <div className="bg-gray-900 text-white p-4 rounded shadow-lg" style={{ width: 500, height: 500 }}>
      <h2 className="text-lg font-bold mb-3">{assignment.title}</h2>
      {type === 'video' && (
        <video src={assignment.media_url} controls className="w-full h-full object-contain" />
      )}
      {type === 'audio' && (
        <audio src={assignment.media_url} controls className="w-full" />
      )}
      {type === 'image' && (
        <img src={assignment.media_url} alt={assignment.title} className="max-w-full max-h-full object-contain" />
      )}
      {type === 'other' && (
        <a href={assignment.media_url} target="_blank" rel="noreferrer" className="underline">Download File</a>
      )}
    </div>
  );
};

export default VoxProAssignmentPlayer;
