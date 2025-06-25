import { useState, useEffect, useMemo } from 'react';
import { supabase } from '../lib/supabase';

const VoxProPlayer = () => {
  // State management
  const [connectionStatus, setConnectionStatus] = useState('connecting');
  const [statusMessage, setStatusMessage] = useState('Connecting to Supabase...');
  const [assignments, setAssignments] = useState([]);
  const [currentMedia, setCurrentMedia] = useState(null);
  const [playerStatus, setPlayerStatus] = useState('Ready');
  const [audioLevel, setAudioLevel] = useState('Normal');

  // Key assignments mapping
  const keyAssignments = useMemo(() => {
    const map = {};
    assignments.forEach(assignment => {
      if (assignment.key_slot) {
        map[assignment.key_slot] = assignment;
      }
    });
    return map;
  }, [assignments]);

  // Initialize Supabase connection and real-time subscription
  useEffect(() => {
    const initializeConnection = async () => {
      try {
        // Test Supabase connection
        const { data, error } = await supabase
          .from('assignments')
          .select('*')
          .limit(1);
    console.log('Supabase response', { data, error });
        if (error) {
          console.error('Supabase connection error:', error);
          setConnectionStatus('disconnected');
          setStatusMessage('Failed to connect to Supabase');
          return;
        }

        // Connection successful
        setConnectionStatus('connected');
        setStatusMessage('Connected to Supabase');
        
        // Load initial assignments
        loadAssignments();

        // Set up real-time subscription
        const subscription = supabase
          .channel('assignments_changes')
          .on('postgres_changes', 
            { 
              event: '*', 
              schema: 'public', 
              table: 'assignments' 
            }, 
            (payload) => {
              console.log('Real-time update received:', payload);
              loadAssignments(); // Reload assignments when changes occur
            }
          )
          .subscribe();

        return () => {
          subscription.unsubscribe();
        };

      } catch (error) {
        console.error('Connection initialization error:', error);
        setConnectionStatus('disconnected');
        setStatusMessage('Connection failed');
      }
    };

    initializeConnection();
  }, []);

  // Load assignments from Supabase
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
    } catch (error) {
      console.error('Error in loadAssignments:', error);
    }
  };

  // Handle key press
  const handleKeyPress = (keySlot) => {
    const assignment = keyAssignments[keySlot];
    if (assignment) {
      setCurrentMedia(assignment);
      console.log('Playing media:', assignment);
    } else {
      console.log('No media assigned to key:', keySlot);
    }
  };

  // Get connection status color
  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return 'text-green-500';
      case 'connecting': return 'text-yellow-500';
      case 'disconnected': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  // Get connection status indicator
  const getStatusIndicator = () => {
    switch (connectionStatus) {
      case 'connected': return '🟢';
      case 'connecting': return '🟡';
      case 'disconnected': return '🔴';
      default: return '⚪';
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      {/* Header */}
      <div className="bg-gray-800 text-white p-4 rounded-t-lg">
        <h2 className="text-2xl font-bold text-center text-green-400">VoxPro Media Player</h2>
        <p className="text-center text-gray-300">Compact professional media player for broadcasting operations.</p>
      </div>

      {/* Main Interface */}
      <div className="bg-gray-900 text-white p-6 rounded-b-lg">
        {/* Status Header */}
        <div className="text-center mb-6">
          <h3 className="text-xl font-semibold text-green-400 mb-2">VoxPro Media Interface</h3>
          <p className="text-gray-400">Professional Control System</p>
          <div className={`flex items-center justify-center gap-2 mt-2 ${getStatusColor()}`}>
            <span>{getStatusIndicator()}</span>
            <span>{statusMessage}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Control Interface */}
          <div className="bg-gray-800 p-4 rounded-lg">
            <h4 className="text-lg font-semibold text-green-400 mb-4 text-center">Control Interface</h4>
            
            <div className="text-center mb-4">
              <h5 className="text-white font-medium">VoxPro</h5>
              <p className="text-gray-400 text-sm">Media Control System</p>
            </div>

            <div className="bg-blue-600 text-white text-center py-2 px-4 rounded mb-4 font-medium">
              Ready - Select Media to Play
            </div>

            {/* START Keys (1-5) */}
            <div className="grid grid-cols-5 gap-2 mb-4">
              {[1, 2, 3, 4, 5].map(num => (
                <button
                  key={num}
                  onClick={() => handleKeyPress(num.toString())}
                  className={`
                    h-12 rounded font-bold text-white border-2
                    ${keyAssignments[num.toString()] 
                      ? 'bg-red-600 border-red-400 hover:bg-red-700' 
                      : 'bg-red-800 border-red-600 opacity-50'
                    }
                  `}
                  title={keyAssignments[num.toString()]?.title || `START ${num}`}
                >
                  {num}
                </button>
              ))}
            </div>

            {/* Media Keys Row 1 (A, B, DUP) */}
            <div className="grid grid-cols-3 gap-2 mb-2">
              <button
                onClick={() => handleKeyPress('A')}
                className={`
                  h-12 rounded font-bold text-white border-2
                  ${keyAssignments['A'] 
                    ? 'bg-purple-600 border-purple-400 hover:bg-purple-700' 
                    : 'bg-purple-800 border-purple-600 opacity-50'
                  }
                `}
                title={keyAssignments['A']?.title || 'A'}
              >
                A
              </button>
              <button
                onClick={() => handleKeyPress('B')}
                className={`
                  h-12 rounded font-bold text-white border-2
                  ${keyAssignments['B'] 
                    ? 'bg-purple-600 border-purple-400 hover:bg-purple-700' 
                    : 'bg-purple-800 border-purple-600 opacity-50'
                  }
                `}
                title={keyAssignments['B']?.title || 'B'}
              >
                B
              </button>
              <button
                onClick={() => handleKeyPress('DUP')}
                className={`
                  h-12 rounded font-bold text-white border-2
                  ${keyAssignments['DUP'] 
                    ? 'bg-orange-600 border-orange-400 hover:bg-orange-700' 
                    : 'bg-orange-800 border-orange-600 opacity-50'
                  }
                `}
                title={keyAssignments['DUP']?.title || 'DUP'}
              >
                DUP
              </button>
            </div>

            {/* Media Keys Row 2 (C, D, CUE) */}
            <div className="grid grid-cols-3 gap-2 mb-2">
              <button
                onClick={() => handleKeyPress('C')}
                className={`
                  h-12 rounded font-bold text-white border-2
                  ${keyAssignments['C'] 
                    ? 'bg-teal-600 border-teal-400 hover:bg-teal-700' 
                    : 'bg-teal-800 border-teal-600 opacity-50'
                  }
                `}
                title={keyAssignments['C']?.title || 'C'}
              >
                C
              </button>
              <button
                onClick={() => handleKeyPress('D')}
                className={`
                  h-12 rounded font-bold text-white border-2
                  ${keyAssignments['D'] 
                    ? 'bg-red-600 border-red-400 hover:bg-red-700' 
                    : 'bg-red-800 border-red-600 opacity-50'
                  }
                `}
                title={keyAssignments['D']?.title || 'D'}
              >
                D
              </button>
              <button
                onClick={() => handleKeyPress('CUE')}
                className={`
                  h-12 rounded font-bold text-white border-2
                  ${keyAssignments['CUE'] 
                    ? 'bg-blue-600 border-blue-400 hover:bg-blue-700' 
                    : 'bg-blue-800 border-blue-600 opacity-50'
                  }
                `}
                title={keyAssignments['CUE']?.title || 'CUE'}
              >
                CUE
              </button>
            </div>

            {/* Media Keys Row 3 (E, F, REC) */}
            <div className="grid grid-cols-3 gap-2 mb-2">
              <button
                onClick={() => handleKeyPress('E')}
                className={`
                  h-12 rounded font-bold text-white border-2
                  ${keyAssignments['E'] 
                    ? 'bg-red-600 border-red-400 hover:bg-red-700' 
                    : 'bg-red-800 border-red-600 opacity-50'
                  }
                `}
                title={keyAssignments['E']?.title || 'E'}
              >
                E
              </button>
              <button
                onClick={() => handleKeyPress('F')}
                className={`
                  h-12 rounded font-bold text-white border-2
                  ${keyAssignments['F'] 
                    ? 'bg-green-600 border-green-400 hover:bg-green-700' 
                    : 'bg-green-800 border-green-600 opacity-50'
                  }
                `}
                title={keyAssignments['F']?.title || 'F'}
              >
                F
              </button>
              <button
                onClick={() => handleKeyPress('REC')}
                className={`
                  h-12 rounded font-bold text-white border-2
                  ${keyAssignments['REC'] 
                    ? 'bg-blue-600 border-blue-400 hover:bg-blue-700' 
                    : 'bg-blue-800 border-blue-600 opacity-50'
                  }
                `}
                title={keyAssignments['REC']?.title || 'REC'}
              >
                REC
              </button>
            </div>

            {/* G Key */}
            <div className="flex justify-center">
              <button
                onClick={() => handleKeyPress('G')}
                className={`
                  h-12 w-20 rounded font-bold text-white border-2
                  ${keyAssignments['G'] 
                    ? 'bg-yellow-600 border-yellow-400 hover:bg-yellow-700' 
                    : 'bg-yellow-800 border-yellow-600 opacity-50'
                  }
                `}
                title={keyAssignments['G']?.title || 'G'}
              >
                G
              </button>
            </div>

            {/* Play/Pause Indicator */}
            <div className="flex justify-center mt-4">
              <div className="w-16 h-16 rounded-full border-4 border-green-500 flex items-center justify-center">
                <div className="w-2 h-8 bg-green-500 rounded"></div>
              </div>
            </div>
          </div>

          {/* Current Media Display */}
          <div className="bg-gray-800 p-4 rounded-lg">
            <h4 className="text-lg font-semibold text-green-400 mb-4 text-center">Current Media</h4>
            
            <div className="bg-black p-4 rounded mb-4 h-32 flex items-center justify-center">
              {currentMedia ? (
                <div className="text-center">
                  <p className="text-green-400 font-medium">{currentMedia.title}</p>
                  <p className="text-gray-400 text-sm mt-1">{currentMedia.description}</p>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-gray-500">No Media Selected</p>
                  <p className="text-gray-600 text-sm">Select a key to load media</p>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Media Server:</span>
                <span className={connectionStatus === 'connected' ? 'text-green-400' : 'text-yellow-400'}>
                  {connectionStatus === 'connected' ? 'Connected' : 'Connecting...'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Player Status:</span>
                <span className="text-blue-400">{playerStatus}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Audio Level:</span>
                <span className="text-green-400">{audioLevel}</span>
              </div>
            </div>

            <div className="mt-6">
              <h5 className="text-green-400 font-medium mb-2">Quick Reference</h5>
              <div className="text-sm text-gray-400 space-y-1">
                <p>1-5: START Keys</p>
                <p>A-G: Media Keys</p>
                <p>DUP: Duplicate</p>
                <p>CUE: Cue Point</p>
                <p>REC: Record</p>
              </div>
            </div>
          </div>
        </div>

        {/* Debug Section (can be removed in production) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-6 bg-gray-700 p-4 rounded">
            <h5 className="text-yellow-400 font-medium mb-2">Debug Info</h5>
            <div className="text-xs text-gray-300">
              <p>Connection Status: {connectionStatus}</p>
              <p>Assignments Loaded: {assignments.length}</p>
              <p>Current Media: {currentMedia?.title || 'None'}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VoxProPlayer;

