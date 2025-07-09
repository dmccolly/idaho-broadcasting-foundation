import { Link } from 'react-router-dom';

const HistoryLandingPage = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
    <div className="max-w-xl w-full bg-white rounded-lg shadow-sm p-8 space-y-6 text-center">
      <h1 className="text-3xl font-bold text-gray-800">Broadcasting History</h1>
      <p className="text-gray-600">Explore Idaho\'s rich radio and television heritage.</p>
      <div className="flex flex-col gap-4">
        <Link
          to="/history/radio"
          className="px-4 py-2 bg-blue-500 text-white rounded-md font-medium hover:bg-blue-600 transition"
        >
          Radio History
        </Link>
        <Link
          to="/history/television"
          className="px-4 py-2 bg-purple-500 text-white rounded-md font-medium hover:bg-purple-600 transition"
        >
          Television History
        </Link>
      </div>
      <Link to="/" className="text-blue-500 hover:underline block mt-4">
        ← Back to Home
      </Link>
    </div>
  </div>
);

export default HistoryLandingPage;
