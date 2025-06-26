// eventsData.js - Centralized events data management
// This file manages all event data and provides functions to get current/archived events

export const eventsData = {
  // Current/upcoming events - only one should be active at a time for home page banner
  current: {
    id: 'larry-lomax-tribute-2025',
    title: 'Memorial Tribute Luncheon',
    subtitle: 'Honoring Larry Lomax',
    date: '2025-06-27', // YYYY-MM-DD format
    time: '12:00 PM',
    description: 'Our June 27th luncheon features a tribute to legendary Boise radio talent Larry Lomax, who passed only recently, May 19th of this year.',
    fullDescription: `Friends will recall his reign as "The Emperor" at KBBK, Magic 92 and his Christian radio career which stretched to the east and west coasts.`,
    type: 'memorial', // 'memorial', 'celebration', 'anniversary', 'exhibit', 'general'
    rsvpRequired: true,
    status: 'upcoming', // 'upcoming', 'today', 'past'
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
    },
    // Optional: Photo or image URL
    imageUrl: null,
    // Optional: Location details
    location: {
      venue: 'TBD',
      address: '',
      city: 'Boise',
      state: 'ID'
    }
  },

  // Archived events - these will show in the collapsible archive section
  archive: [
    {
      id: 'annual-dinner-2024',
      title: 'Annual Broadcasting Heritage Dinner',
      date: '2024-10-15',
      description: 'Celebration of Idaho broadcasting pioneers with special recognition ceremony.',
      type: 'celebration',
      attendees: 85,
      highlights: ['Pioneer awards ceremony', 'Historical presentations', 'Network dinner']
    },
    {
      id: 'kido-75th-2022', 
      title: 'KIDO Radio 75th Anniversary',
      date: '2022-08-11',
      description: 'Commemorating 75 years of KIDO Radio and its impact on Idaho broadcasting.',
      type: 'anniversary',
      attendees: 120,
      highlights: ['Historical timeline display', 'Former DJ reunion', 'Equipment showcase']
    },
    {
      id: 'vintage-equipment-exhibit-2022',
      title: 'Vintage Broadcasting Equipment Exhibit', 
      date: '2022-05-20',
      description: 'Display of rare broadcasting equipment donated to foundation archives.',
      type: 'exhibit',
      attendees: 65,
      highlights: ['Vintage microphones', 'Tube equipment displays', 'Interactive demonstrations']
    },
    {
      id: 'foundation-launch-2021',
      title: 'History of Idaho Broadcasting Foundation Launch',
      date: '2021-03-15', 
      description: 'Official launch event for the History of Idaho Broadcasting Foundation.',
      type: 'celebration',
      attendees: 45,
      highlights: ['Foundation mission presentation', 'Charter member recognition', 'Archive donation drive']
    }
  ]
}

// Utility functions for event management
export const eventUtils = {
  /**
   * Get current event if it's still relevant (today or future)
   * Returns null if no current event or if event has passed
   */
  getCurrentEvent: () => {
    if (!eventsData.current) return null
    
    const eventDate = new Date(eventsData.current.date)
    const today = new Date()
    
    // Reset time to compare just dates
    eventDate.setHours(0, 0, 0, 0)
    today.setHours(0, 0, 0, 0)
    
    // Return event if it's today or in the future
    return eventDate >= today ? eventsData.current : null
  },

  /**
   * Check if an event should show the home page banner
   * Can be customized with additional logic (e.g., only show X days before)
   */
  shouldShowHomeBanner: () => {
    const currentEvent = eventUtils.getCurrentEvent()
    if (!currentEvent) return false
    
    // Optional: Only show banner within X days of event
    // const eventDate = new Date(currentEvent.date)
    // const daysUntilEvent = Math.ceil((eventDate - new Date()) / (1000 * 60 * 60 * 24))
    // return daysUntilEvent <= 30 // Show only if within 30 days
    
    return true
  },

  /**
   * Move current event to archive (call this after event is over)
   */
  archiveCurrentEvent: () => {
    if (eventsData.current) {
      // Add to archive
      eventsData.archive.unshift({
        id: eventsData.current.id,
        title: eventsData.current.title,
        date: eventsData.current.date,
        description: eventsData.current.description,
        type: eventsData.current.type,
        // Add any archive-specific data
        attendees: null, // To be filled in after event
        highlights: [] // To be filled in after event
      })
      
      // Clear current event
      eventsData.current = null
    }
  },

  /**
   * Set a new current event
   */
  setCurrentEvent: (eventData) => {
    eventsData.current = eventData
  },

  /**
   * Format date for display
   */
  formatDate: (dateString, options = {}) => {
    const date = new Date(dateString)
    const defaultOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }
    
    return date.toLocaleDateString('en-US', { ...defaultOptions, ...options })
  },

  /**
   * Get events by type
   */
  getEventsByType: (type) => {
    return eventsData.archive.filter(event => event.type === type)
  },

  /**
   * Get events by year
   */
  getEventsByYear: (year) => {
    return eventsData.archive.filter(event => {
      const eventYear = new Date(event.date).getFullYear()
      return eventYear === year
    })
  }
}

// Example usage:
/*
// In your components:
import { eventsData, eventUtils } from './eventsData'

// Check if home banner should show
const showBanner = eventUtils.shouldShowHomeBanner()

// Get current event for events page
const currentEvent = eventUtils.getCurrentEvent()

// Get archived events
const archivedEvents = eventsData.archive

// After an event is over, move it to archive:
// eventUtils.archiveCurrentEvent()

// Set a new current event:
// eventUtils.setCurrentEvent(newEventData)
*/

export default eventsData
