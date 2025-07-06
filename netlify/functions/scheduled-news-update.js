const { schedule } = require('@netlify/functions');

const handler = async (event, context) => {
  try {
    const aggregatorUrl = process.env.URL || 'https://cozy-starlight-8f02f9.netlify.app';
    const response = await fetch(`${aggregatorUrl}/.netlify/functions/news-aggregator`);
    const newsData = await response.json();

    console.log(`News updated at ${newsData.updateTime} with ${newsData.current.length} current stories`);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'News updated successfully',
        timestamp: newsData.updateTime,
        storiesCount: newsData.current.length
      })
    };
  } catch (error) {
    console.error('Scheduled update failed:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Update failed' })
    };
  }
};

exports.handler = schedule('0 13,21 * * *', handler);
