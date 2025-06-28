import React, { useState, useEffect, useRef } from 'react';

// In your actual project, this would be: import { supabase } from '../lib/supabase';
// For this example, we use a mock object.
const supabase = {
  from: () => ({
    select: () => ({
      limit: () => Promise.resolve({ data: [], error: null }),
      order: () => Promise.resolve({ data: [
          {id: 1, key_slot: '1', title: 'Morning Drive Intro', description: 'Upbeat music for show start.', submitted_by: 'Admin', created_at: '2025-06-28T10:00:00Z', media_url: '#', media_type: 'audio/mp3'},
          {id: 2, key_slot: '2', title: 'Weather Jingle', description: 'Official station weather jingle.', submitted_by: 'Admin', created_at: '2025-06-28T10:05:00Z', media_url: '#', media_type: 'audio/mp3'},
          {id: 3, key_slot: '3', title: 'Station ID - Rock', description: 'High-energy station identification.', submitted_by: 'Admin', created_at: '2025-06-28T10:10:00Z', media_url: '#', media_type: 'audio/mp3'},
          {id: 4, key_slot: '4', title: 'Promo: Summer Concert', description: 'Promotional spot for the summer concert series.', submitted_by: 'Admin', created_at: '2025-06-28T10:15:00Z', media_url: '#', media_type: 'audio/mp3'},
      ], error: null }),
    })
  })
};

const UniversalMediaPlayer = ({ assignment, onClose, onMinimize, isMinimized, windowId }) => {
    // This is a placeholder for the pop-up media player.
    if (isMinimized) {
        return (
            <div className="fixed bottom-4 right-4 bg-gray-800 border border-gray-600 rounded-lg p-2 shadow-lg z-50 animate-pulse">
                <div className="flex items-center justify-between min-w-48">
                    <span className="text-white text-sm truncate">{assignment?.title || 'Media Player'}</span>
                    <div className="flex gap-1 ml-2 window-controls">
                        <button onClick={() => onMinimize(windowId, false)} className="text-gray-400 hover:text-white p-1" title="Restore">⬜</button>
                        <button onClick={() => onClose(windowId)} className="text-gray-400 hover:text-red-400 p-1" title="Close">✕</button>
                    </div>
                </div>
            </div>
        );
    }
    return null; 
};

const VoxProPlayer = () => {
    const [connectionStatus, setConnectionStatus] = useState('connecting');
    const [statusMessage, setStatusMessage] = useState('Connecting to Supabase...');
    const [assignments, setAssignments] = useState([]);
    const [activeWindows, setActiveWindows] = useState([]);
    const [windowCounter, setWindowCounter] = useState(0);
    const [currentPlayingKey, setCurrentPlayingKey] = useState(null);

    useEffect(() => {
        const initializeConnection = async () => {
            try {
                const { error } = await supabase.from('assignments').select('*').limit(1);
                if (error) throw error;
                setConnectionStatus('connected');
                setStatusMessage('Connected to Supabase');
                loadAssignments();
            } catch (err) {
                setConnectionStatus('error');
                setStatusMessage('Connection error');
            }
        };
        initializeConnection();
    }, []);

    const loadAssignments = async () => {
        const { data, error } = await supabase.from('assignments').select('*').order('created_at', { ascending: false });
        if (error) console.error('Error loading assignments:', error);
        else setAssignments(data || []);
    };

    const getKeyAssignment = (keySlot) => assignments.find(a => a.key_slot === keySlot);

    const handleKeyClick = async (keySlot) => {
        const assignment = getKeyAssignment(keySlot);
        if (!assignment) return;

        if (currentPlayingKey === keySlot) {
            setCurrentPlayingKey(null);
            setActiveWindows(prev => prev.filter(w => w.assignment.key_slot !== keySlot));
            return;
        }

        if (currentPlayingKey) {
            setActiveWindows(prev => prev.filter(w => w.assignment.key_slot !== currentPlayingKey));
        }

        setCurrentPlayingKey(keySlot);
        const newWindow = { id: windowCounter, assignment, isMinimized: false };
        setActiveWindows([newWindow]);
        setWindowCounter(prev => prev + 1);
    };

    const closeWindow = (windowId) => {
        const windowToClose = activeWindows.find(w => w.id === windowId);
        if (windowToClose && currentPlayingKey === windowToClose.assignment.key_slot) {
            setCurrentPlayingKey(null);
        }
        setActiveWindows(prev => prev.filter(w => w.id !== windowId));
    };

    const minimizeWindow = (windowId, minimize) => {
        setActiveWindows(prev => prev.map(w => w.id === windowId ? { ...w, isMinimized: minimize } : w));
    };

    return (
        <>
            <div className="bg-gray-900 text-white rounded-lg border border-gray-700 p-4 h-full flex flex-col space-y-4 shadow-2xl">
                
                {/* Control Panel */}
                <div className="bg-gray-800 rounded-lg p-4 shadow-xl border border-gray-600">
                    <div className="text-center mb-4">
                        <h3 className="text-xl font-bold text-green-400">VoxPro Media Player</h3>
                        <p className="text-gray-400 text-xs">Broadcasting Control System</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <div className="grid grid-cols-3 gap-2">
                                {[1, 2, 3].map((key) => {
                                    const assignment = getKeyAssignment(key.toString());
                                    const isPlaying = currentPlayingKey === key.toString();
                                    return <button key={key} onClick={() => handleKeyClick(key.toString())} className={`h-16 rounded-lg font-bold text-white text-lg transition-all transform hover:scale-105 ${isPlaying ? 'bg-gradient-to-b from-green-500 to-green-700' : assignment ? 'bg-gradient-to-b from-red-500 to-red-700' : 'bg-gradient-to-b from-gray-600 to-gray-800'} border-2 border-gray-500 shadow-md`} title={assignment ? assignment.title : `Key ${key} - No Assignment`}>{isPlaying ? 'STOP' : key}</button>;
                                })}
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                {[4, 5].map((key) => {
                                    const assignment = getKeyAssignment(key.toString());
                                    const isPlaying = currentPlayingKey === key.toString();
                                    return <button key={key} onClick={() => handleKeyClick(key.toString())} className={`h-16 rounded-lg font-bold text-white text-lg transition-all transform hover:scale-105 ${isPlaying ? 'bg-gradient-to-b from-green-500 to-green-700' : assignment ? 'bg-gradient-to-b from-red-500 to-red-700' : 'bg-gradient-to-b from-gray-600 to-gray-800'} border-2 border-gray-500 shadow-md`} title={assignment ? assignment.title : `Key ${key} - No Assignment`}>{isPlaying ? 'STOP' : key}</button>;
                                })}
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <button className="h-10 bg-gradient-to-b from-gray-600 to-gray-800 rounded border-2 border-gray-500 font-bold text-white text-sm">A</button>
                            <button className="h-10 bg-gradient-to-b from-gray-600 to-gray-800 rounded border-2 border-gray-500 font-bold text-white text-sm">B</button>
                            <button className="h-10 bg-gradient-to-b from-gray-600 to-gray-800 rounded border-2 border-gray-500 font-bold text-white text-sm">C</button>
                            <button className="h-10 bg-gradient-to-b from-gray-600 to-gray-800 rounded border-2 border-gray-500 font-bold text-white text-sm">D</button>
                            <button className="h-10 bg-gradient-to-b from-blue-600 to-blue-800 rounded border-2 border-gray-500 font-bold text-white text-xs">DUP</button>
                            <button className="h-10 bg-gradient-to-b from-yellow-600 to-yellow-800 rounded border-2 border-gray-500 font-bold text-white text-xs">CUE</button>
                            <button className="h-10 bg-gradient-to-b from-red-600 to-red-800 rounded border-2 border-gray-500 font-bold text-white text-xs">REC</button>
                            <div className="h-10 bg-gradient-to-b from-gray-700 to-gray-900 rounded border-2 border-gray-500 flex items-center justify-center"><div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"><div className="w-1.5 h-1.5 bg-white rounded-full"></div></div></div>
                        </div>
                    </div>
                     <div className="mt-4 text-center">
                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${connectionStatus === 'connected' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
                            <div className={`w-1.5 h-1.5 rounded-full mr-2 ${connectionStatus === 'connected' ? 'bg-green-300' : 'bg-red-300'} animate-pulse`}></div>{statusMessage}
                        </div>
                    </div>
                </div>
                
                {/* Key Assignments List */}
                <div className="bg-gray-800 rounded-lg p-4 flex-1 flex flex-col min-h-0 border border-gray-600">
                    <h3 className="text-green-400 font-semibold text-lg mb-3 flex-shrink-0">Current Key Assignments</h3>
                    <div className="overflow-y-auto flex-1">
                        <div className="grid grid-cols-1 gap-3">
                            {[...assignments]
                                .sort((a, b) => parseInt(a.key_slot) - parseInt(b.key_slot))
                                .map((assignment) => (
                                <div key={assignment.id} className="bg-gray-700 rounded p-3 border border-gray-600">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className={`text-sm font-bold ${currentPlayingKey === assignment.key_slot ? 'text-green-400' : 'text-red-400'}`}>
                                            Key {assignment.key_slot} {currentPlayingKey === assignment.key_slot ? '(Playing)' : ''}
                                        </span>
                                        <span className="text-xs text-gray-400">{assignment.media_type}</span>
                                    </div>
                                    <h4 className="text-white font-medium mb-1 text-sm">{assignment.title}</h4>
                                    <p className="text-gray-400 text-xs mb-2 line-clamp-2">{assignment.description}</p>
                                    <div className="text-xs text-gray-500">
                                        By: {assignment.submitted_by} | {new Date(assignment.created_at).toLocaleDateString()}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Floating Windows Area */}
            {activeWindows.map((window) => (
                <UniversalMediaPlayer
                    key={window.id}
                    assignment={window.assignment}
                    onClose={closeWindow}
                    onMinimize={minimizeWindow}
                    isMinimized={window.isMinimized}
                    windowId={window.id}
                />
            ))}
        </>
    );
};

export default VoxProPlayer;
