import React, { useEffect, useState } from 'react';
import '../index.css';

const BroadcastingNewsFeed = () => {
  const [newsData, setNewsData] = useState(null);
  const [error, setError] = useState(false);
  const [showArchive, setShowArchive] = useState(false);

  const loadNews = async () => {
    try {
      const response = await fetch('/.netlify/functions/news-aggregator');
      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
      }
      const data = await response.json();
      setNewsData(data);
      setError(false);
    } catch (err) {
      console.error('Error loading news:', err);
      setError(true);
      setNewsData(null);
    }
  };

  useEffect(() => {
    loadNews();
    const interval = setInterval(loadNews, 3600000);
    return () => clearInterval(interval);
  }, []);

  const truncateText = (text, length) => {
    if (!text) return '';
    return text.length <= length ? text : text.substring(0, length) + '...';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffHours = (now - date) / (1000 * 60 * 60);
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${Math.floor(diffHours)}h ago`;
    if (diffHours < 48) return 'Yesterday';
    return date.toLocaleDateString();
  };

  const renderStories = (stories) => {
    return stories.map((story) => (
      <article key={story.link} className={`news-item ${story.type}`}>
        <div className="news-content">
          <h4><a href={story.link} target="_blank" rel="noopener noreferrer">{story.title}</a></h4>
          <p className="news-description">{truncateText(story.description, 150)}</p>
          <div className="news-meta">
            <span className="source">{story.source}</span>
            <span className="date">{formatDate(story.date)}</span>
            {story.type === 'reddit' && (
              <span className="reddit-score">↑{story.score}</span>
            )}
          </div>
        </div>
      </article>
    ));
  };

  if (error) {
    return (
      <div id="news-feed-container">
        <div className="error-message">
          <p>Unable to load news feed. Please try again later.</p>
        </div>
      </div>
    );
  }

  if (!newsData) {
    return (
      <div id="news-feed-container">
        <div className="loading">Loading broadcasting news...</div>
      </div>
    );
  }

  return (
    <div id="news-feed-container">
      <div className="news-feed">
        <div className="news-header">
          <h2>Broadcasting Industry News</h2>
          <p className="update-time">Last updated: {newsData.updateTime}</p>
        </div>
        <div className="current-stories">
          <h3>Latest Stories</h3>
          {renderStories(newsData.current)}
        </div>
        <div className="archive-section">
          <h3>Archive</h3>
          <div className="archive-toggle">
            <button onClick={() => setShowArchive(!showArchive)}>
              Show/Hide Archive ({newsData.archive.length} stories)
            </button>
          </div>
          {showArchive && (
            <div className="archive-stories">
              {renderStories(newsData.archive)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BroadcastingNewsFeed;
