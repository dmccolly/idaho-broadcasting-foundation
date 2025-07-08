import axios from 'axios';
import { parse } from 'node-html-parser';
import fs from 'fs';
import path from 'path';

const __dirname = path.dirname(new URL(import.meta.url).pathname);

// Configuration for news sources
const NEWS_SOURCES = {
  rss: [
    'https://www.broadcastingcable.com/feed',
    'https://www.tvtechnology.com/rss.xml',
    'https://radioink.com/feed/',
    'https://www.radioworld.com/rss/news',
    'https://www.rbr.com/feed/',
    'https://www.allaccess.com/rss/news'
  ],
  reddit: [
    'https://www.reddit.com/r/broadcasting/.json',
    'https://www.reddit.com/r/radio/.json',
    'https://www.reddit.com/r/television/.json',
    'https://www.reddit.com/r/Boise/.json?q=radio OR television'
  ],
  boise_specific: [
    'https://www.kivitv.com/rss',
    'https://www.ktvb.com/rss',
    'https://www.idahostatesman.com/latest-news/rss.xml'
  ]
};

// Keywords for filtering relevant content
const BROADCASTING_KEYWORDS = [
  'radio', 'television', 'broadcast', 'tv', 'fm', 'am', 'station',
  'ktvb', 'kivitv', 'kboi', 'kido', 'knix', 'mix106', 'fox9',
  'fcc', 'transmitter', 'antenna', 'programming', 'ratings',
  'boise radio', 'boise tv', 'idaho broadcasting'
];

export async function handler(event, context) {
  try {
    const allArticles = [];

    // Fetch RSS feeds
    const requestHeaders = {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (compatible; IdahoBroadcastingNewsBot/1.0; +https://idahobroadcasting.org)'
      },
      timeout: 10000
    };

    for (const rssUrl of [...NEWS_SOURCES.rss, ...NEWS_SOURCES.boise_specific]) {
      try {
        const response = await axios.get(rssUrl, requestHeaders);
        const articles = parseRSS(response.data, rssUrl);
        allArticles.push(...articles);
      } catch (error) {
        console.error(`Error fetching RSS from ${rssUrl}:`, error.message);
      }
    }

    // Fetch Reddit posts
    for (const redditUrl of NEWS_SOURCES.reddit) {
      try {
        const response = await axios.get(redditUrl, requestHeaders);
        const posts = parseReddit(response.data, redditUrl);
        allArticles.push(...posts);
      } catch (error) {
        console.error(`Error fetching Reddit from ${redditUrl}:`, error.message);
      }
    }

    // Filter and score articles
    let relevantArticles = allArticles
      .filter(article => isRelevantToBroadcasting(article))
      .map(article => ({
        ...article,
        relevanceScore: calculateRelevanceScore(article)
      }))
      .sort((a, b) => b.relevanceScore - a.relevanceScore || new Date(b.date) - new Date(a.date))
      .slice(0, 50);

    if (relevantArticles.length === 0) {
      try {
        const fallbackPath = path.join(__dirname, 'sample-news.json');
        const fallback = JSON.parse(fs.readFileSync(fallbackPath, 'utf8'));
        relevantArticles = fallback.map(item => ({
          ...item,
          relevanceScore: 0
        }));
      } catch (err) {
        console.error('Failed to load fallback news:', err);
      }
    }

    // Separate current (top 10) and archive
    const currentStories = relevantArticles.slice(0, 10);
    const archiveStories = relevantArticles.slice(10);

    // Return news data
    const newsData = {
      lastUpdated: new Date().toISOString(),
      current: currentStories,
      archive: archiveStories,
      updateTime: new Date().toLocaleString('en-US', {
        timeZone: 'America/Boise',
        hour12: true
      })
    };

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(newsData)
    };

  } catch (error) {
    console.error('Error in news aggregator:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to aggregate news' })
    };
  }
}

function parseRSS(xmlData, source) {
  const articles = [];
  try {
    const root = parse(xmlData);
    const items = root.querySelectorAll('item');

    items.forEach(item => {
      const title = item.querySelector('title')?.text || '';
      const description = item.querySelector('description')?.text || '';
      const link = item.querySelector('link')?.text || '';
      const pubDate = item.querySelector('pubDate')?.text || '';

      if (title && link) {
        articles.push({
          title: cleanText(title),
          description: cleanText(description),
          link,
          date: new Date(pubDate || Date.now()),
          source: extractSourceName(source),
          type: 'rss'
        });
      }
    });
  } catch (error) {
    console.error('Error parsing RSS:', error);
  }
  return articles;
}

function parseReddit(data, source) {
  const posts = [];
  try {
    if (data.data && data.data.children) {
      data.data.children.forEach(child => {
        const post = child.data;
        if (post.title) {
          posts.push({
            title: post.title,
            description: post.selftext || post.url,
            link: `https://reddit.com${post.permalink}`,
            date: new Date(post.created_utc * 1000),
            source: `Reddit ${post.subreddit}`,
            type: 'reddit',
            score: post.score || 0,
            comments: post.num_comments || 0
          });
        }
      });
    }
  } catch (error) {
    console.error('Error parsing Reddit:', error);
  }
  return posts;
}

function isRelevantToBroadcasting(article) {
  const text = `${article.title} ${article.description}`.toLowerCase();
  return BROADCASTING_KEYWORDS.some(keyword => text.includes(keyword.toLowerCase()));
}

function calculateRelevanceScore(article) {
  let score = 0;
  const text = `${article.title} ${article.description}`.toLowerCase();

  // Boise-specific content gets highest priority
  if (text.includes('boise') || text.includes('idaho')) {
    score += 50;
  }

  // Local station mentions
  const localStations = ['ktvb', 'kivitv', 'kboi', 'kido', 'mix106'];
  localStations.forEach(station => {
    if (text.includes(station)) score += 30;
  });

  // Broadcasting keywords
  BROADCASTING_KEYWORDS.forEach(keyword => {
    if (text.includes(keyword.toLowerCase())) score += 5;
  });

  // Recent content gets bonus
  const hoursOld = (Date.now() - new Date(article.date)) / (1000 * 60 * 60);
  if (hoursOld < 24) score += 20;
  else if (hoursOld < 72) score += 10;

  // Reddit-specific scoring
  if (article.type === 'reddit') {
    score += Math.min(article.score / 10, 15);
    score += Math.min(article.comments / 5, 10);
  }

  return score;
}

function cleanText(text) {
  if (!text) return '';
  return text.replace(/<[^>]*>/g, '').replace(/&[^;]+;/g, '').trim().substring(0, 500);
}

function extractSourceName(url) {
  try {
    const domain = new URL(url).hostname;
    return domain.replace('www.', '');
  } catch {
    return 'Unknown Source';
  }
}

