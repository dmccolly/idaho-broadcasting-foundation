import { useState, useEffect } from 'react'
import { eventUtils } from '../data/eventsData'

const getCurrentEvent = () => {
  return eventUtils.getCurrentEvent()
}
  
  return null // No current event to display
}

const HomeEventBanner = ({ onEventClick }) => {
  const [currentEvent, setCurrentEvent] = useState(null)

  useEffect(() => {
    const event = getCurrentEvent()
    setCurrentEvent(event)
  }, [])

  // Don't render anything if no current event
  if (!currentEvent) {
    return null
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

  const getEventTypeStyles = (type) => {
    switch (type) {
      case 'memorial':
        return {
          background: 'bg-gradient-to-r from-slate-600 to-slate-700',
          accent: 'bg-blue-400',
          text: 'text-white'
        }
      case 'celebration':
        return {
          background: 'bg-gradient-to-r from-blue-600 to-blue-700',
          accent: 'bg-yellow-400',
          text: 'text-white'
        }
      default:
        return {
          background: 'bg-gradient-to-r from-gray-600 to-gray-700',
          accent: 'bg-green-400',
          text: 'text-white'
        }
    }
  }

  const styles = getEventTypeStyles(currentEvent.type)

  return (
    <div className="mb-6">
      <div className={`${styles.background} ${styles.text} rounded-lg shadow-lg overflow-hidden`}>
        <div className="p-4">
          <div className="flex items-start space-x-3">
            {/* Event Type Indicator */}
            <div className={`w-1 h-16 ${styles.accent} rounded flex-shrink-0 mt-1`}></div>
            
            <div className="flex-1 min-w-0">
              {/* Event Header */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="text-lg font-semibold">{currentEvent.title}</h3>
                    {currentEvent.rsvpRequired && (
                      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">RSVP Required</span>
                    )}
                  </div>
                  <p className="text-blue-200 font-medium">{currentEvent.subtitle}</p>
                </div>
                
                {/* Event Date */}
                <div className="text-right text-sm">
                  <div className="bg-white bg-opacity-20 rounded px-2 py-1">
                    <div className="font-medium">{formatEventDate(currentEvent.date)}</div>
                    <div className="text-blue-200">{currentEvent.time}</div>
                  </div>
                </div>
              </div>

              {/* Event Description */}
              <p className="text-gray-200 text-sm mt-2 line-clamp-2">
                {currentEvent.description}
              </p>

              {/* Action Buttons */}
              <div className="flex items-center space-x-3 mt-3">
                <button
                  onClick={() => onEventClick && onEventClick(currentEvent)}
                  className="bg-white text-gray-800 px-4 py-2 rounded text-sm font-medium hover:bg-gray-100 transition-colors"
                >
                  Learn More & RSVP
                </button>
                <a 
                  href="tel:208-853-7756" 
                  className="text-blue-200 hover:text-white text-sm underline"
                >
                  Call to RSVP: 208-853-7756
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomeEventBanner
