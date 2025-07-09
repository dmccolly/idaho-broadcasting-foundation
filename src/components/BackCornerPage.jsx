import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import VoxProPlayerWidget from './VoxProPlayerWidget.jsx';

import UniversalMediaPlayer from "./voxpro/UniversalMediaPlayer.jsx";
import KeyAssignmentsWidget from "./voxpro/KeyAssignmentsWidget.jsx";

// MAIN BACK CORNER PAGE COMPONENT
const BackCornerPage = () => {
  // State management
  const [connectionStatus, setConnectionStatus] = useState('connecting');
  const [statusMessage, setStatusMessage] = useState('Connecting to Supabase...');
  const [assignments, setAssignments] = useState([]);
  const [activeWindows, setActiveWindows] = useState([]);
  const [windowCounter, setWindowCounter] = useState(0);
  const [currentPlayingKey, setCurrentPlayingKey] = useState(null);

  // Initialize Supabase connection
  useEffect(() => {
    const initializeConnection = async () => {
      try {
        const { error } = await supabase
          .from('assignments')
          .select('*')
          .limit(1);

        if (error) {
          throw error;
        }

        setConnectionStatus('connected');
        setStatusMessage('Connected to Supabase');
        loadAssignments();

        const subscription = supabase
          .channel('public:assignments')
          .on('postgres_changes', { event: '*', schema: 'public', table: 'assignments' }, payload => {
            console.log('Change received!', payload);
            loadAssignments();
          })
          .subscribe();
        
        return () => {
          supabase.removeChannel(subscription);
        };

      } catch (err) {
        console.error('Supabase connection error:', err);
        setConnectionStatus('disconnected');
        setStatusMessage('Failed to connect to Supabase');
      }
    };

    initializeConnection();
  }, []);

  const loadAssignments = async () => {
    try {
      const { data, error } = await supabase
        .from('assignments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading assignments:', error);
        return;
      }

      setAssignments(data || []);
    } catch (err) {
      console.error('Error in loadAssignments:', err);
    }
  };

  const getKeyAssignment = (keySlot) => {
    return assignments.find(a => a.key_slot === keySlot);
  };

  const handleKeyClick = async (keySlot) => {
    const assignment = getKeyAssignment(keySlot);

    if (!assignment) {
      console.log(`No assignment found for key ${keySlot}`);
      return;
    }

    // If this key is currently playing, stop it and close its window
    if (currentPlayingKey === keySlot) {
      setCurrentPlayingKey(null);
      setActiveWindows(prev => prev.filter(w => w.assignment.key_slot !== keySlot));
      return;
    }

    // Stop any other currently playing key and close its window
    if (currentPlayingKey) {
      setActiveWindows(prev => prev.filter(w => w.assignment.key_slot !== currentPlayingKey));
    }

    // Start playing this key
    setCurrentPlayingKey(keySlot);

    // Create a new window, replacing any existing ones
    const newWindow = {
      id: windowCounter,
      assignment,
      isMinimized: false
    };

    setActiveWindows([newWindow]);
    setWindowCounter(prev => prev + 1);
  };

  const closeWindow = (windowId) => {
    const windowToClose = activeWindows.find(w => w.id === windowId);
    if (windowToClose && windowToClose.assignment.key_slot === currentPlayingKey) {
      setCurrentPlayingKey(null);
    }
    setActiveWindows(prev => prev.filter(w => w.id !== windowId));
  };

  const minimizeWindow = (windowId, minimize) => {
    setActiveWindows(prev =>
      prev.map(w =>
        w.id === windowId
          ? { ...w, isMinimized: minimize }
          : w
      )
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex gap-6">
          
          {/* LEFT COLUMN - MAIN ARTICLE CONTENT */}
          <div className="flex-1">
            <div className="bg-white">
              
             <h1 className="text-3xl font-bold text-gray-800 mb-6">The Back Corner - Updated</h1>
              
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Welcome to The Back Corner, where we share behind-the-scenes stories, technical insights, 
                  and community highlights from our broadcasting studio. This is your normal article space 
                  where you can add any content - blog posts, news updates, photo galleries, or documentation.
                </p>

                <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Latest Stories</h2>
                
                <article className="mb-8 pb-6 border-b border-gray-200">
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Behind the Microphone: A Day in the Life</h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    Ever wondered what happens when the "ON AIR" light goes off? Join us for an exclusive look behind 
                    the scenes of our daily broadcasting operations, from early morning prep to late-night sign-off.
                  </p>
                  <div className="flex items-center text-sm text-gray-500">
                    <span>📅 June 28, 2025</span>
                    <span className="mx-2">•</span>
                    <span>👤 Radio Team</span>
                  </div>
                </article>

                <article className="mb-8 pb-6 border-b border-gray-200">
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Technical Spotlight: VoxPro Broadcasting System</h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    Our state-of-the-art VoxPro media control system enables seamless live broadcasting with 
                    professional-grade audio management. The compact interface you see on this page represents 
                    just a fraction of the system's capabilities.
                  </p>
                  <div className="flex items-center text-sm text-gray-500">
                    <span>📅 June 27, 2025</span>
                    <span className="mx-2">•</span>
                    <span>👤 Engineering Team</span>
                  </div>
                </article>

                <article>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Community Voices: Listener Stories</h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    From heartwarming thank-you messages to exciting contest wins, discover the amazing stories 
                    from our listening community. These are the moments that make broadcasting truly special.
                  </p>
                  <div className="flex items-center text-sm text-gray-500">
                    <span>📅 June 26, 2025</span>
                    <span className="mx-2">•</span>
                    <span>👤 Community Team</span>
                  </div>
                </article>

                <div className="bg-gray-50 rounded-lg p-6 mt-8">
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">📝 Add Your Content Here</h4>
                  <p className="text-gray-600">
                    This space functions like any other article page on your site. Replace this content 
                    with your actual articles, news, or any other containers you need.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN - VOXPRO WIDGETS STACKED */}
          <div className="w-72 flex flex-col gap-4">
            
            {/* VOXPRO PLAYER WIDGET (TOP) */}
            <VoxProPlayerWidget
              onKeyClick={handleKeyClick}
              currentPlayingKey={currentPlayingKey}
              assignments={assignments}
              connectionStatus={connectionStatus}
              statusMessage={statusMessage}
              setStatusMessage={setStatusMessage}
            />

            {/* KEY ASSIGNMENTS WIDGET (BOTTOM) */}
            <KeyAssignmentsWidget
              assignments={assignments}
              currentPlayingKey={currentPlayingKey}
            />
            
          </div>
        </div>
      </div>

      {/* Enhanced Floating Windows */}
      {activeWindows.map((window) => (
        <UniversalMediaPlayer
          key={window.id}
          assignment={window.assignment}
          onClose={() => closeWindow(window.id)}
          onMinimize={(minimize) => minimizeWindow(window.id, minimize)}
          isMinimized={window.isMinimized}
          windowId={window.id}
        />
      ))}
    </div>
  );
};

export default BackCornerPage;
