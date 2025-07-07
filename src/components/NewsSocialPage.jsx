import React from 'react';
import BroadcastingNewsFeed from './BroadcastingNewsFeed.jsx';

const NewsSocialPage = () => (
  <div className="min-h-screen bg-gray-50 py-8 px-4">
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6">Broadcasting News & Social</h1>
      <BroadcastingNewsFeed />
    </div>
  </div>
);

export default NewsSocialPage;
