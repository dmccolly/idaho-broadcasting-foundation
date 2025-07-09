import { useState, useEffect } from 'react';
import VoxProManagement from './VoxProManagement.jsx';
import VoxProPlayerWidget from './VoxProPlayerWidget.jsx';
import { supabase } from '../lib/supabase';

const AdminVoxProPage = () => {
  const [assignments, setAssignments] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState('connecting');
  const [statusMessage, setStatusMessage] = useState('Connecting to Supabase...');
  const [currentPlayingKey, setCurrentPlayingKey] = useState(null);

  const openPopup = () => {
    const top = window.innerHeight - 500;
    const features = `width=500,height=500,left=0,top=${top < 0 ? 0 : top}`;
    const key = currentPlayingKey || 1;
    window.open(`/voxpro-player?key=${key}`, 'voxproPlayer', features);
  };

  useEffect(() => {
    const initialize = async () => {
      try {
        const { error } = await supabase.from('assignments').select('*').limit(1);
        if (error) throw error;
        setConnectionStatus('connected');
        setStatusMessage('Connected to Supabase');
        loadAssignments();

        const subscription = supabase
          .channel('public:assignments')
          .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'assignments' },
            () => loadAssignments()
          )
          .subscribe();

        return () => supabase.removeChannel(subscription);
      } catch (err) {
        console.error('Supabase connection error:', err);
        setConnectionStatus('disconnected');
        setStatusMessage('Failed to connect to Supabase');
      }
    };

    initialize();
  }, []);

  const loadAssignments = async () => {
    try {
      const { data, error } = await supabase
        .from('assignments')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error) setAssignments(data || []);
    } catch (err) {
      console.error('Error loading assignments:', err);
    }
  };

  const handleKeyClick = (key) => {
    const top = window.innerHeight - 500;
    const features = `width=500,height=500,left=0,top=${top < 0 ? 0 : top}`;
    window.open(`/voxpro-player?key=${key}`, 'voxproPlayer', features);
    setCurrentPlayingKey(key);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto flex flex-wrap gap-6">
        <div className="bg-gray-900 rounded-lg p-4 shadow-xl border border-gray-700 w-72">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-green-400">VoxPro Player</h2>
            <button onClick={openPopup} className="text-xs text-blue-400 underline">
              Pop‑out Player
            </button>
          </div>
          <VoxProPlayerWidget
            onKeyClick={handleKeyClick}
            currentPlayingKey={currentPlayingKey}
            assignments={assignments}
            connectionStatus={connectionStatus}
            statusMessage={statusMessage}
            setStatusMessage={setStatusMessage}
          />
        </div>
        <div className="bg-gray-900 rounded-lg p-4 shadow-xl border border-gray-700 flex-1 min-w-[18rem]">
          <VoxProManagement />
        </div>
      </div>
    </div>
  );
};

export default AdminVoxProPage;
