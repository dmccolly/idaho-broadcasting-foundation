import { useState, useEffect } from 'react'
import { eventsData } from '../data/eventsData'

const EventsPage = () => {
  const [events, setEvents] = useState([])
  const [expandedId, setExpandedId] = useState(null)

  useEffect(() => {
    const stored = localStorage.getItem('ibf_events')
    if (stored) {
      setEvents(JSON.parse(stored))
    } else {
      const initial = []
      if (eventsData.current) {
        initial.push({ ...eventsData.current, id: eventsData.current.id, archived: false })
      }
      eventsData.archive.forEach(ev => initial.push({ ...ev, id: ev.id, archived: true }))
      setEvents(initial)
    }
  }, [])

  const upcoming = events.filter(ev => !ev.archived)
  const archived = events.filter(ev => ev.archived)

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Foundation Events</h1>
      <div className="space-y-6">
        {upcoming.length === 0 && (
          <p className="text-gray-600">No upcoming events.</p>
        )}
        {upcoming.map(ev => (
          <div key={ev.id} className="bg-white shadow rounded overflow-hidden">
            {ev.image && (
              <img src={ev.image} alt={ev.title} className="w-full h-64 object-cover" />
            )}
            <div className="p-4">
              <h2 className="text-xl font-semibold text-gray-800">{ev.title}</h2>
              {ev.subtitle && <p className="text-gray-600">{ev.subtitle}</p>}
              <div className="text-sm text-gray-500 mb-2">{ev.date} {ev.time}</div>
              <p className="text-gray-700 mb-2">{ev.description}</p>
              {expandedId === ev.id && ev.details && (
                <p className="text-gray-700 whitespace-pre-line">{ev.details}</p>
              )}
              {ev.details && (
                <button
                  onClick={() => setExpandedId(expandedId === ev.id ? null : ev.id)}
                  className="mt-2 text-sm text-blue-600 hover:underline"
                >
                  {expandedId === ev.id ? 'Hide Details' : 'Read More'}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {archived.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Past Events</h2>
          <ul className="space-y-2">
            {archived.map(ev => (
              <li key={ev.id}>
                <a href={`#${ev.id}`} className="text-blue-600 underline">
                  {ev.title} - {ev.date}
                </a>
              </li>
            ))}
          </ul>
          <div className="space-y-6 mt-6">
            {archived.map(ev => (
              <div id={ev.id} key={`section-${ev.id}`} className="bg-gray-50 rounded shadow">
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800">{ev.title}</h3>
                  <div className="text-sm text-gray-500 mb-2">{ev.date}</div>
                  <p className="text-gray-700 mb-2">{ev.description}</p>
                  {ev.details && <p className="text-gray-700 whitespace-pre-line">{ev.details}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default EventsPage
