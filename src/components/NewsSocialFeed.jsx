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
    <div className="space-y-4-y-6">
      <h2 className="text-3xl font-bold text-gray-800">News & Social Feed</h2>
           {/* RSS Feed Integration */}
      <div className="bg-white pp-46 rounded-lg shadow-md border">
        <h3 className="text-xl font-semibold mb-4">Industry News</h3>
        <div className="space-y-3">
          <div className="border-l-4 border-indigo-500 pl-4 py-2">
            <h4 className="font-semibold text-gray-800">Broadcasting Industry Update</h4>
            <p className="text-gray-600 text-sm">Latest developments in radio and television technology</p>
            <span className="text-xs text-gray-400">Broadcasting Magazine - 4 hours ago</span>
          </div>
          <div className="border-l-4 border-indigo-500 pl-4 py-2">
            <h4 className="font-semibold text-gray-800">FCC Regulatory Changes</h4>
            <p className="text-gray-600 text-sm">New regulations affecting local broadcasting stations</p>
            <span className="text-xs text-gray-400">Radio World - 1 day ago</span>
          </div>
          <div className="border-l-4 border-indigo-500 pl-4 py-2">
            <h4 className="font-semibold text-gray-800">Digital Broadcasting Trends</h4>
            <p className="text-gray-600 text-sm">How streaming is changing traditional broadcasting</p>
            <span className="text-xs text-gray-400">TV Technology - 2 days ago</span>
          </div>
        </div>
      </div>
    </div>
 
      
      {/* Post Creation */}
          <<div className="bg-white p-4 rounded-lg shadow-md border">
        <h3 className="text-xl font-semibold mb-4">Share an Update</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Name
            </label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Enter your name..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              What's happening in Idaho broadcasting?
            </label>
            <textarea
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder="Share news, updates, or thoughts about Idaho broadcasting..."
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={handleSubmitPost}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Post Update
          </button>
        </div>
      </div>

      {/* Feed */}
      <div className="bg-white pp-46 rounded-lg shadow-md border">
        <h3 className="text-xl font-semibold mb-4">Latest Updates</h3>
        <div className="space-y-4">
          {posts.map(post => (
            <div key={post.id} className={`border-l-4 ${getPostTypeColor(post.type)} pl-4 py-3 bg-gray-50 rounded-r-lg`}>
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center space-x-2">
                  <span className={`text-xs px-2 py-1 rounded-full bg-gray-200 text-gray-700`}>
                    {getPostTypeLabel(post.type)}
                  </span>
                  <span className="font-semibold text-gray-800">{post.author}</span>
                </div>
                <span className="text-xs text-gray-500">{formatTimestamp(post.timestamp)}</span>
              </div>
              <p className="text-gray-700">{post.content}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Social Media Integration Placeholder */}
      <div className="bg-white pp-4rounded-lg shadow-md border">
        <h3 className="text-xl font-semibold mb-4">Social Media Integration</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2 text-blue-800">Twitter/X Feed</h4>
            <p className="text-blue-600 text-sm">Connect your Twitter account to display tweets about Idaho broadcasting</p>
            <button className="mt-2 bg-blue-600 hover:bg-blue-700 text-white text-sm py-1 px-3 rounded">
              Connect Twitter
            </button>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2 text-blue-800">Facebook Updates</h4>
            <p className="text-blue-600 text-sm">Display Facebook posts from broadcasting organizations</p>
            <button className="mt-2 bg-blue-600 hover:bg-blue-700 text-white text-sm py-1 px-3 rounded">
              Connect Facebook
            </button>
          </div>
        </div>
      </div>

  )
}

export default NewsSocialFeed

