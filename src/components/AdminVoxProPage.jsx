import { useState, useEffect } from 'react';
import VoxProManagement from './VoxProManagement.jsx';
import VoxProPlayerWidget from './VoxProPlayerWidget.jsx';
import UniversalMediaPlayer from './voxpro/UniversalMediaPlayer.jsx';
import KeyAssignmentsWidget from './voxpro/KeyAssignmentsWidget.jsx';
import { supabase } from '../lib/supabase';

const AdminVoxProPage = () => {
  const [assignments, setAssignments] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState('connecting');
  const [statusMessage, setStatusMessage] = useState('Connecting to Supabase...');
  const [currentPlayingKey, setCurrentPlayingKey] = useState(null);
  const [activeWindows, setActiveWindows] = useState([]);
  const [windowCounter, setWindowCounter] = useState(0);

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
        .order('key_slot');
      if (!error) setAssignments(data || []);
    } catch (err) {
      console.error('Error loading assignments:', err);
    }
  };

  const getKeyAssignment = (key) => assignments.find((a) => a.key_slot === key);

  const handleKeyClick = (key) => {
    const assignment = getKeyAssignment(key);
    if (!assignment) return;

    if (currentPlayingKey === key) {
      setCurrentPlayingKey(null);
      setActiveWindows((prev) => prev.filter((w) => w.assignment.key_slot !== key));
      return;
    }

    if (currentPlayingKey) {
      setActiveWindows((prev) => prev.filter((w) => w.assignment.key_slot !== currentPlayingKey));
    }

    setCurrentPlayingKey(key);
    const newWindow = { id: windowCounter, assignment, isMinimized: false };
    setActiveWindows([newWindow]);
    setWindowCounter((prev) => prev + 1);
  };

  const closeWindow = (windowId) => {
    const windowToClose = activeWindows.find((w) => w.id === windowId);
    if (windowToClose && windowToClose.assignment.key_slot === currentPlayingKey) {
      setCurrentPlayingKey(null);
    }
    setActiveWindows((prev) => prev.filter((w) => w.id !== windowId));
  };

  const minimizeWindow = (windowId, minimize) => {
    setActiveWindows((prev) =>
      prev.map((w) => (w.id === windowId ? { ...w, isMinimized: minimize } : w))
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto flex flex-wrap gap-6 items-start">
        <div className="w-72 flex flex-col gap-4">
          <VoxProPlayerWidget
            onKeyClick={handleKeyClick}
            currentPlayingKey={currentPlayingKey}
            assignments={assignments}
            connectionStatus={connectionStatus}
            statusMessage={statusMessage}
            setStatusMessage={setStatusMessage}
          />
          <KeyAssignmentsWidget assignments={assignments} currentPlayingKey={currentPlayingKey} />
        </div>
        <div className="bg-gray-900 rounded-lg p-4 shadow-xl border border-gray-700 flex-1 min-w-[18rem] max-w-md overflow-hidden">
          <VoxProManagement />
        </div>
      </div>

      {activeWindows.map((w) => (
        <UniversalMediaPlayer
          key={w.id}
          assignment={w.assignment}
          onClose={() => closeWindow(w.id)}
          onMinimize={(m) => minimizeWindow(w.id, m)}
          isMinimized={w.isMinimized}
          windowId={w.id}
        />
      ))}
    </div>
  );
};

export default AdminVoxProPage;
