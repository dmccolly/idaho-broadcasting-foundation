import { useState } from 'react';

const TelevisionPage = () => {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-sm p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 text-center">Television History</h1>
        <p className="text-gray-700 mb-6 text-center">
          Detailed station histories will appear here as the archive is digitized.
        </p>
        <div className="text-center">
          <button
            onClick={() => setShowInfo(!showInfo)}
            className="px-4 py-2 bg-purple-500 text-white rounded-md font-medium hover:bg-purple-600 transition"
          >
            {showInfo ? 'Hide Preview' : 'Show Preview'}
          </button>
          {showInfo && (
            <p className="mt-4 text-gray-600">
              The television history section is under construction.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TelevisionPage;
