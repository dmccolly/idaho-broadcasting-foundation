import React, { useState } from 'react';

const BroadcastingNewsFeed = () => {
  const [currentFilter, setCurrentFilter] = useState('all');

  // News data extracted from the provided HTML file
  const newsData = [
    {
      id: 1,
      title: "KBOI-FM Changes Morning Show Format",
      excerpt: "Boise's 103.3 KBOI-FM announced significant changes to their morning programming, introducing a new talk format focusing on local community issues and entertainment.",
      source: "Local News",
      date: "2025-07-08",
      category: "local",
      url: "#"
    },
    {
      id: 2,
      title: "Idaho Broadcasting Revenue Up 12% in Q2",
      excerpt: "According to new industry reports, Idaho radio stations saw significant revenue growth this quarter, outpacing national averages.",
      source: "Radio Ink",
      date: "2025-07-07",
      category: "industry",
      url: "#"
    },
    {
      id: 3,
      title: "New FCC Rules Affect Local Radio Ownership",
      excerpt: "The Federal Communications Commission announced new ownership rules that could impact several Boise area radio stations.",
      source: "Broadcasting & Cable",
      date: "2025-07-06",
      category: "industry",
      url: "#"
    },
    {
      id: 4,
      title: "KTIK Sports Radio Expands Weekend Programming",
      excerpt: "93.1 KTIK announced expanded weekend sports coverage including high school football and basketball games throughout the Treasure Valley.",
      source: "Idaho Statesman",
      date: "2025-07-05",
      category: "local",
      url: "#"
    },
    {
      id: 5,
      title: "Radio Host Retirement Sparks Social Media Tribute",
      excerpt: "Long-time Boise radio personality announced retirement after 30 years, generating thousands of social media tributes from listeners.",
      source: "Facebook/Reddit",
      date: "2025-07-04",
      category: "social",
      url: "#"
    },
    {
      id: 6,
      title: "Podcast Advertising Revenue Reaches New High",
      excerpt: "Industry data shows podcast advertising revenue hit record levels, with local stations increasingly investing in podcast content.",
      source: "Inside Radio",
      date: "2025-07-03",
      category: "industry",
      url: "#"
    },
    {
      id: 7,
      title: "Emergency Alert System Test Scheduled",
      excerpt: "Idaho broadcasters will participate in a statewide Emergency Alert System test next week, coordinating with emergency management officials.",
      source: "Idaho EMS",
      date: "2025-07-02",
      category: "local",
      url: "#"
    },
    {
      id: 8,
      title: "Digital Radio Adoption Grows in Rural Idaho",
      excerpt: "New survey data shows increasing adoption of digital radio services in rural Idaho communities, changing listening habits.",
      source: "Radio Business Report",
      date: "2025-07-01",
      category: "industry",
      url: "#"
    },
    {
      id: 9,
      title: "Local Station Wins Regional Broadcasting Award",
      excerpt: "KQFC 97.9 received recognition at the Northwest Broadcasting Awards for their community service programming and local news coverage.",
      source: "Northwest Broadcasting",
      date: "2025-06-30",
      category: "local",
      url: "#"
    },
    {
      id: 10,
      title: "Radio Consolidation Trends Continue in 2025",
      excerpt: "Industry analysis reveals ongoing consolidation trends in radio ownership, with implications for local programming and employment.",
      source: "AllAccess.com",
      date: "2025-06-29",
      category: "industry",
      url: "#"
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

  const handleReadMore = (url) => {
    if (url !== '#') {
      window.open(url, '_blank');
    } else {
      alert('Full article would open here');
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Broadcasting News</h2>
        <p className="text-gray-600">Latest news and updates from the broadcasting industry with focus on Boise area stations</p>
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
          Local Boise
        </button>
        <button
          onClick={() => setCurrentFilter('industry')}
          className={`px-6 py-2 rounded-full font-medium transition-all duration-200 ${
            currentFilter === 'industry'
              ? 'bg-blue-600 text-white shadow-lg'
              : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          Industry
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
              <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
                {story.excerpt}
              </p>

              {/* Read More Button */}
              <button
                onClick={() => handleReadMore(story.url)}
                className="inline-flex items-center px-4 py-2 bg-gray-800 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors duration-200"
              >
                Read More
                <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
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

