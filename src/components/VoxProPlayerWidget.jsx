import React from 'react';

// Small VoxPro player widget used on the Back Corner page and Admin tools
const VoxProPlayerWidget = ({
  onKeyClick,
  currentPlayingKey,
  assignments,
  connectionStatus,
  statusMessage,
  setStatusMessage
}) => {
  const getKeyAssignment = (keySlot) => {
    return assignments.find((a) => a.key_slot === keySlot);
  };

  return (
    <div className="bg-gray-900 rounded-lg p-4 shadow-xl border border-gray-700">
      {/* VoxPro Header */}
      <div className="text-center mb-4">
        <h3 className="text-lg font-bold text-green-400 mb-1">VoxPro Media Player</h3>
        <p className="text-gray-400 text-xs">Professional Broadcasting Control</p>

        {/* Connection Status */}
        <div className="mt-2">
          <div
            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              connectionStatus === 'connected'
                ? 'bg-green-600 text-white'
                : 'bg-red-600 text-white'
            }`}
          >
            <div
              className={`w-1.5 h-1.5 rounded-full mr-2 ${
                connectionStatus === 'connected' ? 'bg-green-300' : 'bg-red-300'
              } ${connectionStatus === 'connected' ? 'animate-pulse' : ''}`}
            ></div>
            {statusMessage}
          </div>
        </div>
        <button
          onClick={() => {
            const top = Math.max(0, (window.innerHeight - 500) / 2);
            const features = `width=500,height=500,left=300,top=${top}`;
            const key = currentPlayingKey || 1;
            window.open(`/voxpro-player?key=${key}`, 'voxproPlayer', features);
          }}
          className="mt-3 text-xs text-blue-400 underline"
        >
          Pop‑out Player
        </button>
      </div>

      {/* START Keys */}
      <div className="grid grid-cols-5 gap-2">
        {[1, 2, 3, 4, 5].map((key) => {
          const assignment = getKeyAssignment(key.toString());
          const isPlaying = currentPlayingKey === key.toString();

          return (
            <button
              key={key}
              onClick={() => onKeyClick(key.toString())}
              onMouseEnter={() => {
                if (assignment) {
                  setStatusMessage(`Key ${key}: ${assignment.title}`);
                }
              }}
              onMouseLeave={() => {
                setStatusMessage(
                  connectionStatus === 'connected'
                    ? 'Connected to Supabase'
                    : 'Failed to connect to Supabase'
                );
              }}
              className={`
                w-14 h-14 rounded-lg font-bold text-white text-base
                transition-all duration-200 transform hover:scale-105
                flex items-center justify-center
                ${isPlaying
                  ? 'bg-gradient-to-b from-green-500 to-green-700 hover:from-green-400 hover:to-green-600 shadow-lg ring-2 ring-green-300'
                  : assignment
                  ? 'bg-gradient-to-b from-red-500 to-red-700 hover:from-red-400 hover:to-red-600 shadow-lg'
                  : 'bg-gradient-to-b from-gray-600 to-gray-800 hover:from-gray-500 hover:to-gray-700 cursor-not-allowed'}
                border-2 border-gray-500 shadow-md
              `}
              title={assignment ? assignment.title : `Key ${key} - No Assignment`}
              disabled={!assignment && !isPlaying}
            >
              {isPlaying ? 'STOP' : key}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default VoxProPlayerWidget;

