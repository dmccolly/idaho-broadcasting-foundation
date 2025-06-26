// Example HomePage.jsx - ADD THE IMPORTS AND BANNER TO YOUR EXISTING HOME PAGE

import { useState } from 'react'
// ADD THESE TWO IMPORTS TO YOUR EXISTING IMPORTS:
import HomeEventBanner from './HomeEventBanner'
import { eventUtils } from '../data/eventsData'

const HomePage = () => {
  // Your existing state and functions...

  const handleEventClick = () => {
    // Navigate to events page - adjust this based on your routing setup
    window.location.href = '/events'  // or use your router's navigate function
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Your existing header/navigation */}

      {/* ADD THIS EVENT BANNER - place it where you want it to appear */}
      <div className="max-w-6xl mx-auto px-4 py-4">
        {eventUtils.shouldShowHomeBanner() && (
          <HomeEventBanner onEventClick={handleEventClick} />
        )}
      </div>

      {/* Your existing home page content goes here */}
      
    </div>
  )
}

export default HomePage
