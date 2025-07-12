export const metadata = {
  title: 'Upcoming Events - Idaho Broadcasting Foundation',
  description: 'Join our conferences, workshops, and seminars designed for broadcasting professionals.',
}

import EventCard from '@/components/events/event-card'
import { Event } from '@/lib/supabase'

// Sample events data (in a real app, this would come from Supabase)
const upcomingEvents: Event[] = [
  {
    id: 1,
    title: 'Idaho Broadcasting Conference 2025',
    description: 'Annual conference bringing together broadcasting professionals from across Idaho. Join us for workshops, networking, and the latest industry insights.',
    date: '2025-08-15',
    time: '09:00',
    location: 'Boise Convention Center',
    map_url: 'https://maps.google.com/maps?q=Boise+Convention+Center',
    calendar_url: ''
  },
  {
    id: 2,
    title: 'Radio Production Workshop',
    description: 'Hands-on workshop covering modern radio production techniques, digital editing, and broadcast technology for both beginners and experienced professionals.',
    date: '2025-09-21',
    time: '14:00',
    location: 'Idaho State University Media Center',
    map_url: 'https://maps.google.com/maps?q=Idaho+State+University+Media+Center',
    calendar_url: ''
  },
  {
    id: 3,
    title: 'Digital Broadcasting Seminar',
    description: 'Explore the future of digital broadcasting, streaming technologies, and emerging trends in the media landscape.',
    date: '2025-10-10',
    time: '10:00',
    location: 'University of Idaho',
    map_url: 'https://maps.google.com/maps?q=University+of+Idaho',
    calendar_url: ''
  }
]

export default function Events() {
  return (
    <>
      {/* Page Header */}
      <section className="bg-slate-900 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">Upcoming Events</h1>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              Join our conferences, workshops, and seminars designed for broadcasting professionals. 
              Connect with industry experts and enhance your skills.
            </p>
          </div>
        </div>
      </section>

      {/* Events List */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="space-y-8">
            {upcomingEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-blue-600 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Don't Miss Out on Future Events
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Stay updated with the latest broadcasting events and professional development opportunities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/newsletter"
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Subscribe to Newsletter
            </a>
            <a
              href="/contact"
              className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>

      {/* Back to Main Site Link */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <a
            href="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
          >
            ← Back to Main Site
          </a>
        </div>
      </section>
    </>
  )
}

