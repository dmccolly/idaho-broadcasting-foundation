'use client'

import { Calendar, MapPin, Clock, Users } from 'lucide-react'
import { Event } from '@/lib/supabase'

interface EventCardProps {
  event: Event
  className?: string
}

export default function EventCard({ event, className = '' }: EventCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  const handleAddToCalendar = () => {
    if (event.calendar_url) {
      window.open(event.calendar_url, '_blank')
    } else {
      // Generate Google Calendar URL
      const startDate = new Date(`${event.date}T${event.time}`)
      const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000) // 2 hours later
      
      const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${startDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z/${endDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location)}`
      
      window.open(googleCalendarUrl, '_blank')
    }
  }

  const handleViewMap = () => {
    if (event.map_url) {
      window.open(event.map_url, '_blank')
    } else {
      // Generate Google Maps URL
      const mapsUrl = `https://maps.google.com/maps?q=${encodeURIComponent(event.location)}`
      window.open(mapsUrl, '_blank')
    }
  }

  return (
    <div className={`bg-white rounded-lg shadow-lg border-l-4 border-red-500 overflow-hidden ${className}`}>
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-3">{event.title}</h3>
        
        <div className="space-y-3 mb-4">
          <div className="flex items-center text-red-600">
            <Calendar className="w-4 h-4 mr-2" />
            <span className="font-medium">{formatDate(event.date)}</span>
          </div>
          
          <div className="flex items-center text-gray-600">
            <Clock className="w-4 h-4 mr-2" />
            <span>{formatTime(event.time)}</span>
          </div>
          
          <div className="flex items-center text-gray-600">
            <MapPin className="w-4 h-4 mr-2" />
            <span>{event.location}</span>
          </div>
        </div>
        
        <p className="text-gray-700 mb-6 leading-relaxed">{event.description}</p>
        
        <div className="flex space-x-3">
          <button
            onClick={handleAddToCalendar}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
          >
            <Calendar className="w-4 h-4" />
            <span>Add to Calendar</span>
          </button>
          
          <button
            onClick={handleViewMap}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
          >
            <MapPin className="w-4 h-4" />
            <span>View Map</span>
          </button>
        </div>
      </div>
    </div>
  )
}

