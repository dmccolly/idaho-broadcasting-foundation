import { useState, useEffect } from 'react'

const NewsSocialFeed = () => {
  const [posts, setPosts] = useState([])
  const [newPost, setNewPost] = useState('')
  const [author, setAuthor] = useState('')

  useEffect(() => {
    // Load initial posts
    const initialPosts = [
      {
        id: 1,
        content: "Foundation News Update: Latest developments in Idaho broadcasting preservation",
        author: "Foundation Admin",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        type: "news"
      },
      {
        id: 2,
        content: "Community Spotlight: Featuring local broadcasting professionals and their contributions to Idaho's media landscape",
        author: "Community Manager",
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        type: "community"
      },
      {
        id: 3,
        content: "Historical Discovery: Rare broadcasting equipment donated to foundation archives",
        author: "Archivist",
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        type: "historical"
      },
      {
        id: 4,
        content: "Upcoming Event: Annual Broadcasting Heritage Dinner - Save the date for our celebration of Idaho broadcasting pioneers",
        author: "Events Coordinator",
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        type: "event"
      },
      {
        id: 5,
        content: "Technical Update: VoxPro enterprise system now fully integrated with enhanced media management capabilities",
        author: "Technical Team",
        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
        type: "technical"
      }
    ]
    setPosts(initialPosts)
  }, [])

  const handleSubmitPost = () => {
    if (!newPost.trim() || !author.trim()) {
      alert('Please enter both content and author name')
      return
    }

    const post = {
      id: Date.now(),
      content: newPost,
      author: author,
      timestamp: new Date(),
      type: "user"
    }

    setPosts([post, ...posts])
    setNewPost('')
    setAuthor('')
  }

  const formatTimestamp = (timestamp) => {
    const now = new Date()
    const diff = now - timestamp
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (minutes < 60) {
      return `${minutes} minutes ago`
    } else if (hours < 24) {
      return `${hours} hours ago`
    } else {
      return `${days} days ago`
    }
  }

  const getPostTypeColor = (type) => {
    switch (type) {
      case 'news': return 'border-blue-500'
      case 'community': return 'border-green-500'
      case 'historical': return 'border-purple-500'
      case 'event': return 'border-orange-500'
      case 'technical': return 'border-red-500'
      case 'user': return 'border-gray-500'
      default: return 'border-gray-500'
    }
  }

  const getPostTypeLabel = (type) => {
    switch (type) {
      case 'news': return 'News'
      case 'community': return 'Community'
      case 'historical': return 'Historical'
      case 'event': return 'Event'
      case 'technical': return 'Technical'
      case 'user': return 'User Post'
      default: return 'Post'
    }
  }

  return (
    <div className="space-y-3">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">News & Social Feed</h2>
      
      {/* Industry News - Moved to top */}
      <div className="grid lg:grid-cols-3 gap-3">
        {/* Industry News Section */}
        <div className="lg:col-span-2">
          <div className="bg-white p-3 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-3 text-indigo-700">Industry News</h3>
            <div className="space-y-2">
              <div className="border-l-4 border-indigo-500 pl-3 py-1.5 hover:bg-gray-50 transition-colors">
                <h4 className="font-medium text-gray-800 text-sm">Broadcasting Industry Update</h4>
                <p className="text-gray-600 text-xs">Latest developments in radio and television technology</p>
                <span className="text-xs text-gray-400">Broadcasting Magazine - 4 hours ago</span>
              </div>
              <div className="border-l-4 border-indigo-500 pl-3 py-1.5 hover:bg-gray-50 transition-colors">
                <h4 className="font-medium text-gray-800 text-sm">FCC Regulatory Changes</h4>
                <p className="text-gray-600 text-xs">New regulations affecting local broadcasting stations</p>
                <span className="text-xs text-gray-400">Radio World - 1 day ago</span>
              </div>
              <div className="border-l-4 border-indigo-500 pl-3 py-1.5 hover:bg-gray-50 transition-colors">
                <h4 className="font-medium text-gray-800 text-sm">Digital Broadcasting Trends</h4>
                <p className="text-gray-600 text-xs">How streaming is changing traditional broadcasting</p>
                <span className="text-xs text-gray-400">TV Technology - 2 days ago</span>
              </div>
            </div>
          </div>
        </div>

        {/* Post Creation - Compact sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white p-3 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-3 text-blue-700">Share Update</h3>
            <div className="space-y-2">
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Your name"
                className="w-full p-2 border rounded text-sm"
              />
              <textarea
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder="What's happening?"
                className="w-full p-2 border rounded text-sm"
                rows="3"
              />
              <button
                onClick={handleSubmitPost}
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                Post Update
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Posts Display - Compact cards */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-gray-800">Community Updates</h3>
        {posts.map((post) => (
          <div
            key={post.id}
            className={`bg-white p-3 rounded-lg shadow-sm border-l-4 hover:shadow-md transition-shadow ${getPostTypeColor(post.type)}`}
          >
            <div className="flex justify-between items-start mb-2">
              <span className={`inline-block px-2 py-1 text-xs rounded text-white font-medium ${
                post.type === 'news' ? 'bg-blue-500' :
                post.type === 'community' ? 'bg-green-500' :
                post.type === 'historical' ? 'bg-purple-500' :
                post.type === 'event' ? 'bg-orange-500' :
                post.type === 'technical' ? 'bg-red-500' :
                'bg-gray-500'
              }`}>
                {getPostTypeLabel(post.type)}
              </span>
              <span className="text-xs text-gray-500">{formatTimestamp(post.timestamp)}</span>
            </div>
            <p className="text-gray-800 text-sm mb-2 leading-relaxed">{post.content}</p>
            <p className="text-xs text-gray-600 font-medium">— {post.author}</p>
          </div>
        ))}
      </div>

      {/* Social Media Integration - Compact */}
      <div className="bg-white p-3 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-3 text-gray-800">Social Connect</h3>
        <div className="grid md:grid-cols-2 gap-3">
          <div className="bg-blue-50 p-3 rounded-lg">
            <h4 className="font-medium mb-1 text-blue-800 text-sm">Twitter/X Feed</h4>
            <p className="text-blue-600 text-xs mb-2">Connect for live broadcasting tweets</p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white text-xs py-1.5 px-3 rounded transition-colors">
              Connect
            </button>
          </div>
          <div className="bg-blue-50 p-3 rounded-lg">
            <h4 className="font-medium mb-1 text-blue-800 text-sm">Facebook Updates</h4>
            <p className="text-blue-600 text-xs mb-2">Display org updates</p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white text-xs py-1.5 px-3 rounded transition-colors">
              Connect
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NewsSocialFeed
