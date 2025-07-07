import { useState } from 'react'
import BroadcastingNewsFeed from './BroadcastingNewsFeed.jsx'

// Events data - this would typically come from your CMS or backend
const eventsData = {
  current: {
    id: 'larry-lomax-tribute-2025',
    title: 'Memorial Tribute Luncheon',
    subtitle: 'Honoring Larry Lomax',
    date: '2025-06-27',
    time: '12:00 PM',
    description: 'Our June 27th luncheon features a tribute to legendary Boise radio talent Larry Lomax, who passed only recently, May 19th of this year.',
    fullDescription: `Friends will recall his reign as "The Emperor" at KBBK, Magic 92 and his Christian radio career which stretched to the east and west coasts.`,
    type: 'memorial',
    rsvpRequired: true,
    status: 'upcoming',
    careerHighlights: [
      'Legendary radio personality known as "The Emperor"',
      'Notable career at KBBK and Magic 92 in Boise',
      'Christian radio ministry spanning coast to coast',
      'Beloved figure in Idaho broadcasting community'
    ],
    contactInfo: {
      phone: '208-853-7756',
      email: 'KIBF@Q.com',
      voicemail: '208-853-7756'
    }
  },
  archive: [
    {
      id: 'annual-dinner-2024',
      title: 'Annual Broadcasting Heritage Dinner',
      date: '2024-10-15',
      description: 'Celebration of Idaho broadcasting pioneers with special recognition ceremony.',
      type: 'celebration'
    },
    {
      id: 'kido-75th-2022',
      title: 'KIDO Radio 75th Anniversary',
      date: '2022-08-11',
      description: 'Commemorating 75 years of KIDO Radio and its impact on Idaho broadcasting.',
      type: 'anniversary'
    },
    {
      id: 'vintage-equipment-exhibit-2022',
      title: 'Vintage Broadcasting Equipment Exhibit',
      date: '2022-05-20',
      description: 'Display of rare broadcasting equipment donated to foundation archives.',
      type: 'exhibit'
    }
  ]
}

const EventsPage = () => {
  const [rsvpFormData, setRsvpFormData] = useState({
    name: '',
    email: '',
    phone: '',
    attending: '',
    message: ''
  })
  const [showArchive, setShowArchive] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setRsvpFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleRSVP = () => {
    console.log('RSVP submitted:', rsvpFormData)
    alert('Thank you for your RSVP. We look forward to seeing you.')
  }

  const formatEventDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  const formatArchiveDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  const currentEvent = eventsData.current

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Foundation Events</h1>
          <p className="text-gray-600 mt-2">Celebrating and preserving Idaho's broadcasting heritage</p>
        </div>
      </div>

  <div className="max-w-6xl mx-auto px-4 py-8">
    <div className="lg:grid lg:grid-cols-3 lg:gap-8">
      <div className="lg:col-span-2">
        {/* Current/Upcoming Event */}
        {currentEvent && (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
            {/* Memorial Header */}
            <div className="bg-gradient-to-r from-slate-700 to-slate-800 text-white p-6">
              <div className="flex items-center space-x-4">
                <div className="w-2 h-16 bg-blue-400 rounded"></div>
                <div>
                  <h2 className="text-2xl font-bold">{currentEvent.title}</h2>
                  <p className="text-blue-200 text-lg">{currentEvent.subtitle}</p>
                  <p className="text-gray-300 text-sm">{formatEventDate(currentEvent.date)} • {currentEvent.time}</p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2">
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">In Remembrance</h3>
                    <div className="prose text-gray-700 leading-relaxed">
                      <p className="mb-4">{currentEvent.description}</p>
                      <p className="mb-4">{currentEvent.fullDescription}</p>
                      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
                        <p className="text-blue-800 italic">
                          "We celebrate, honor, and preserve the rich history of Idaho broadcasting. 
                          We strive to highlight how TV and radio stations have shaped Idaho's history 
                          and their ongoing contributions to the communities they serve."
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Career Highlights */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <h4 className="font-semibold text-gray-800 mb-3">Career Highlights</h4>
                    <div className="space-y-2 text-sm text-gray-700">
                      {currentEvent.careerHighlights.map((highlight, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span>{highlight}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* RSVP Section */}
                <div className="lg:col-span-1">
                  <div className="bg-slate-50 rounded-lg p-5 border">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">RSVP for the Tribute</h3>
                    
                    <div className="space-y-4 mb-6">
                      <input
                        type="text"
                        name="name"
                        placeholder="Your Name"
                        value={rsvpFormData.name}
                        onChange={handleInputChange}
                        className="w-full p-3 border rounded-lg text-sm"
                      />
                      <input
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        value={rsvpFormData.email}
                        onChange={handleInputChange}
                        className="w-full p-3 border rounded-lg text-sm"
                      />
                      <input
                        type="tel"
                        name="phone"
                        placeholder="Phone Number"
                        value={rsvpFormData.phone}
                        onChange={handleInputChange}
                        className="w-full p-3 border rounded-lg text-sm"
                      />
                      <select
                        name="attending"
                        value={rsvpFormData.attending}
                        onChange={handleInputChange}
                        className="w-full p-3 border rounded-lg text-sm"
                      >
                        <option value="">Will you attend?</option>
                        <option value="yes">Yes, I'll attend</option>
                        <option value="no">Unable to attend</option>
                      </select>
                      <textarea
                        name="message"
                        placeholder="Share a memory of Larry (optional)"
                        value={rsvpFormData.message}
                        onChange={handleInputChange}
                        rows="3"
                        className="w-full p-3 border rounded-lg text-sm"
                      />
                    </div>

                    <button
                      onClick={handleRSVP}
                      className="w-full bg-slate-700 text-white py-3 rounded-lg hover:bg-slate-800 transition-colors font-medium"
                    >
                      Submit RSVP
                    </button>

                    {/* Contact Information */}
                    <div className="mt-6 pt-4 border-t border-gray-200">
                      <h4 className="font-medium text-gray-800 mb-3">Alternative RSVP Methods</h4>
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center space-x-2">
                          <span className="w-4 h-4 bg-blue-100 rounded text-blue-600 text-xs flex items-center justify-center">📞</span>
                          <span>{currentEvent.contactInfo.phone} (Call or Text Art)</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="w-4 h-4 bg-blue-100 rounded text-blue-600 text-xs flex items-center justify-center">📧</span>
                          <span>{currentEvent.contactInfo.email}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="w-4 h-4 bg-blue-100 rounded text-blue-600 text-xs flex items-center justify-center">📱</span>
                          <span>Foundation voicemail: {currentEvent.contactInfo.voicemail}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Event Archive Section */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800">Event Archive</h2>
              <button
                onClick={() => setShowArchive(!showArchive)}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center space-x-1"
              >
                <span>{showArchive ? 'Hide' : 'View'} Past Events</span>
                <svg 
                  className={`w-4 h-4 transition-transform ${showArchive ? 'rotate-180' : ''}`} 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
            <p className="text-gray-600 text-sm mt-1">Browse our history of foundation events and celebrations</p>
          </div>

          {showArchive && (
            <div className="p-6">
              <div className="space-y-4">
                {eventsData.archive.map((event) => (
                  <div key={event.id} className="border-l-4 border-gray-300 pl-4 py-2 hover:border-blue-400 transition-colors">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium text-gray-800">{event.title}</h3>
                        <p className="text-gray-600 text-sm mt-1">{event.description}</p>
                      </div>
                      <div className="text-right text-sm text-gray-500 ml-4 flex-shrink-0">
                        <div>{formatArchiveDate(event.date)}</div>
                        <div className="text-xs bg-gray-100 px-2 py-1 rounded mt-1 capitalize">{event.type}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Mission Statement */}
        <div className="bg-white rounded-lg shadow-sm p-6 text-center mt-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-3">Our Mission</h3>
          <p className="text-gray-600 max-w-3xl mx-auto leading-relaxed">
            We celebrate, honor, and preserve the rich history of Idaho broadcasting. 
            We strive to highlight how TV and radio stations have shaped Idaho's history 
            and their ongoing contributions to the communities they serve.
          </p>
        </div>
      </div>
      <aside className="lg:col-span-1 mt-8 lg:mt-0">
        <BroadcastingNewsFeed />
      </aside>
      </div>
    </div>
  </div>
  )
}

export default EventsPage
