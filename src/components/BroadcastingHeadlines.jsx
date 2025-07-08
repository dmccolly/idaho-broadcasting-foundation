import { useEffect, useState } from 'react'
import sampleNews from '../data/sample-news.json'

const truncateWords = (text, count) => {
  if (!text) return ''
  const words = text.split(/\s+/)
  return words.slice(0, count).join(' ') + (words.length > count ? '…' : '')
}

const BroadcastingHeadlines = () => {
  const [data, setData] = useState(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/.netlify/functions/news-aggregator')
        const json = await res.json()
        setData(json)
        setError(false)
      } catch (err) {
        console.error('Failed to fetch news', err)
        setData({ current: sampleNews })
        setError(false)
      }
    }
    load()
  }, [])

  if (error) {
    return null
  }

  if (!data) {
    return (
      <div className="bg-white p-4 rounded shadow">
        <p>Loading…</p>
      </div>
    )
  }

  if (!data.current?.length) {
    return (
      <div className="bg-white p-4 rounded shadow">
        <p>No stories found.</p>
      </div>
    )
  }

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-lg font-semibold mb-3 text-gray-800">Broadcasting News</h2>
      <ul className="space-y-2 text-sm">
        {data.current.slice(0, 10).map((story) => (
          <li key={story.link}>
            <a
              href={story.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-800 hover:underline"
            >
              {truncateWords(story.title, 15)}
            </a>
          </li>
        ))}
      </ul>
      <p className="text-xs text-gray-500 mt-3">Updated {data.updateTime}</p>
    </div>
  )
}

export default BroadcastingHeadlines
