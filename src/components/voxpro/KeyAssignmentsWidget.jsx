// CONDENSED KEY ASSIGNMENTS WIDGET
const KeyAssignmentsWidget = ({ assignments, currentPlayingKey }) => {
  return (
    <div className="bg-gray-900 rounded-lg p-3 border border-gray-700 shadow-xl">
      <h3 className="text-green-400 font-semibold text-base mb-3 text-center">Current Key Assignments</h3>
      <div className="space-y-1.5">
        {assignments.map((assignment) => (
          <div key={assignment.id} className="bg-gray-800 rounded p-2 border border-gray-600">
            <div className="flex items-center justify-between">
              <span className={`text-xs font-bold ${
                currentPlayingKey === assignment.key_slot ? 'text-green-400' : 'text-red-400'
              }`}>
                Key {assignment.key_slot}
              </span>
              <span className="text-xs text-gray-400">{assignment.media_type}</span>
            </div>
            <h4 className="text-white font-medium text-xs truncate mt-1">{assignment.title}</h4>
            <p className="text-gray-400 text-xs truncate">{assignment.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KeyAssignmentsWidget;
