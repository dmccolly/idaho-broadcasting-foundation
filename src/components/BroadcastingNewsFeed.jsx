import React, { useState } from 'react';

const BroadcastingNewsFeed = () => {
  const [currentFilter, setCurrentFilter] = useState('all');

  // Real broadcasting news stories - updated July 8, 2025
  const newsData = [
    {
      id: 1,
      title: "Opposition Emerges to 5G Broadcast Proposal for Low-Power TV Stations",
      excerpt: "Major broadcast industry players filed opposition to FCC proposal allowing low-power TV stations to switch to 5G datacasting services, citing interference and device compatibility concerns.",
      source: "NewscastStudio",
      date: "2025-07-08",
      category: "industry"
    },
    {
      id: 2,
      title: "Gray Media and E.W. Scripps Swap Stations in Five Markets",
      excerpt: "Two major TV station owners engineered station swaps in five markets to create new duopolies, with Gray acquiring stations in Lansing, MI and Lafayette, LA while Scripps gets stations in Colorado and Idaho.",
      source: "Deadline",
      date: "2025-07-07",
      category: "industry"
    },
    {
      id: 3,
      title: "NAB Leadership Foundation Announces 2025 Broadcast Leadership Training Graduates",
      excerpt: "The 25th anniversary class of the prestigious BLT program includes 17 broadcasting professionals, marking 432 total alumni in the program's history.",
      source: "Inside Radio",
      date: "2025-07-08",
      category: "industry"
    },
    {
      id: 4,
      title: "iHeartMedia's WKTU Brings 'War of the Roses' to Animated Series",
      excerpt: "Sean 'Hollywood' Hamilton's iconic radio segment debuts as an animated series on July 24, marking a first-of-its-kind evolution for the format.",
      source: "Inside Radio",
      date: "2025-07-08",
      category: "industry"
    },
    {
      id: 5,
      title: "Audacy and St. Louis Cardinals Extend Broadcast Partnership",
      excerpt: "Multi-year extension keeps Cardinals games on news/talk KMOX, which added an FM signal before the 2025 MLB season.",
      source: "Inside Radio",
      date: "2025-07-08",
      category: "industry"
    },
    {
      id: 6,
      title: "Don La Greca Moves from ESPN Radio to MSG Networks",
      excerpt: "After 19 seasons with ESPN Radio and NY Rangers, La Greca becomes broadcast voice of New Jersey Devils while continuing afternoon radio show.",
      source: "Inside Radio",
      date: "2025-07-08",
      category: "industry"
    },
    {
      id: 7,
      title: "Denver Sports 104.3 The Fan Becomes CSU Rams Football Flagship",
      excerpt: "Bonneville's KKFN named new flagship for Colorado State University football through partnership with CSU Athletics and Learfield.",
      source: "Inside Radio",
      date: "2025-07-08",
      category: "local"
    },
    {
      id: 8,
      title: "AM Radio for Every Vehicle Act Gains Congressional Momentum",
      excerpt: "With 242 House cosponsors and 61 Senators backing it, the bill mandating AM radio in new cars gains bipartisan support citing public safety.",
      source: "Inside Radio",
      date: "2025-07-08",
      category: "industry"
    },
    {
      id: 9,
      title: "Podcast Listening Grows 4% in Canada, YouTube Leads Platform Usage",
      excerpt: "Triton Digital reports monthly listenership at 39%, up from 27% in 2020, with YouTube becoming the top platform for podcast consumption.",
      source: "Inside Radio",
      date: "2025-07-08",
      category: "industry"
    },
    {
      id: 10,
      title: "Bruce Underwood, Longtime Alabama Radio Host, Dies at 87",
      excerpt: "Host of 'The Wake Up Show With Bruce' at Country 95.9 WTWX Guntersville, AL, began his broadcasting career in 1958 and spent nearly five decades on air.",
      source: "Inside Radio",
      date: "2025-07-08",
      category: "local"
    }
  ];

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'local':
        return 'border-red-400 bg-red-50';
      case 'industry':
        return 'border-blue-400 bg-blue-50';
      case 'social':
        return 'border-yellow-400 bg-yellow-50';
      default:
        return 'border-gray-400 bg-gray-50';
    }
  };

  const getCategoryBadgeColor = (category) => {
    switch (category) {
      case 'local':
        return 'bg-red-100 text-red-800';
      case 'industry':
        return 'bg-blue-100 text-blue-800';
      case 'social':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredNews = currentFilter === 'all' 
    ? newsData 
    : newsData.filter(item => item.category === currentFilter);

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Broadcasting News</h2>
        <p className="text-gray-600">Latest news and updates from the broadcasting industry</p>
        <p className="text-sm text-gray-500 mt-1">Updated automatically at 6am, noon, and 6pm daily</p>
      </div>

      {/* Filter Buttons */}
      <div className="flex justify-center gap-4 mb-8 flex-wrap">
        <button
          onClick={() => setCurrentFilter('all')}
          className={`px-6 py-2 rounded-full font-medium transition-all duration-200 ${
            currentFilter === 'all'
              ? 'bg-gray-800 text-white shadow-lg'
              : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          All News
        </button>
        <button
          onClick={() => setCurrentFilter('local')}
          className={`px-6 py-2 rounded-full font-medium transition-all duration-200 ${
            currentFilter === 'local'
              ? 'bg-red-600 text-white shadow-lg'
              : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          Local News
        </button>
        <button
          onClick={() => setCurrentFilter('industry')}
          className={`px-6 py-2 rounded-full font-medium transition-all duration-200 ${
            currentFilter === 'industry'
              ? 'bg-blue-600 text-white shadow-lg'
              : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          Industry News
        </button>
        <button
          onClick={() => setCurrentFilter('social')}
          className={`px-6 py-2 rounded-full font-medium transition-all duration-200 ${
            currentFilter === 'social'
              ? 'bg-yellow-600 text-white shadow-lg'
              : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          Social Media
        </button>
      </div>

      {/* News Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {filteredNews.map((story) => (
          <div
            key={story.id}
            className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border-l-4 ${getCategoryColor(story.category)}`}
          >
            <div className="p-6">
              {/* Header with source and date */}
              <div className="flex justify-between items-start mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryBadgeColor(story.category)}`}>
                  {story.source}
                </span>
                <span className="text-sm text-gray-500">
                  {formatDate(story.date)}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2 leading-tight">
                {story.title}
              </h3>

              {/* Excerpt */}
              <p className="text-gray-600 text-sm leading-relaxed">
                {story.excerpt}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Archive Section */}
      <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">News Archive</h3>
        <p className="text-gray-600 mb-6">
          Browse our complete archive of broadcasting news and industry updates
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
          <a
            href="/archive/monthly"
            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 font-medium"
          >
            Monthly Archive
          </a>
          <a
            href="/archive/by-source"
            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 font-medium"
          >
            By Source
          </a>
          <a
            href="/archive/local"
            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 font-medium"
          >
            Local Stories
          </a>
          <a
            href="/archive/search"
            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 font-medium"
          >
            Search Archive
          </a>
        </div>
      </div>
    </div>
  );
};

export default BroadcastingNewsFeed;

