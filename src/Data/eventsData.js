export const eventsData = {
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

export const eventUtils = {
  getCurrentEvent: () => {
    if (!eventsData.current) return null
    
    const eventDate = new Date(eventsData.current.date)
    const today = new Date()
    
    eventDate.setHours(0, 0, 0, 0)
    today.setHours(0, 0, 0, 0)
    
    return eventDate >= today ? eventsData.current : null
  },

  shouldShowHomeBanner: () => {
    const currentEvent = eventUtils.getCurrentEvent()
    return currentEvent !== null
  },

  formatDate: (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }
}

export default eventsData
