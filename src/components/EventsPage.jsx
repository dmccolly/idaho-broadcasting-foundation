import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const defaultEvents = [
    {
      id: 1,
      title: 'Idaho Broadcasting Conference 2025',
      date: 'Friday, August 15, 2025 at 09:00 AM',
      location: '📍 Boise Convention Center',
      address: 'Boise Convention Center, 850 W Front St, Boise, ID 83702',
      description: 'Annual conference bringing together broadcasting professionals from across Idaho. Join us for workshops, networking, and the latest industry insights.',
      datetime: '2025-08-15T09:00:00'
    },
    {
      id: 2,
      title: 'Radio Production Workshop',
      date: 'Saturday, September 21, 2025 at 02:00 PM',
      location: '📍 Idaho State University Media Center',
      address: 'Idaho State University Media Center, Pocatello, ID',
      description: 'Hands-on workshop covering modern radio production techniques, digital editing, and broadcast technology for both beginners and experienced professionals.',
      datetime: '2025-09-21T14:00:00'
    },
    {
      id: 3,
      title: 'Digital Broadcasting Seminar',
      date: 'Thursday, October 10, 2025 at 10:00 AM',
      location: '📍 University of Idaho',
      address: 'University of Idaho, Moscow, ID',
      description: 'Explore the future of digital broadcasting, streaming technologies, and emerging trends in the media landscape.',
      datetime: '2025-10-10T10:00:00'
    }
  ];

const EventsPage = () => {
  const [events, setEvents] = useState(defaultEvents);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('events') || 'null');
      if (Array.isArray(stored) && stored.length) {
        // Convert stored events to display format for date/time if needed
        setEvents(
          stored.map((e) => ({
            ...e,
            date: new Date(`${e.date}T${e.time}`).toLocaleString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            }),
            datetime: `${e.date}T${e.time}`,
            location: `📍 ${e.location}`,
            address: e.address
          }))
        );
      }
    } catch {
      // ignore parse errors
    }

    const handleStorage = () => {
      try {
        const updated = JSON.parse(localStorage.getItem('events') || 'null');
        if (Array.isArray(updated) && updated.length) {
          setEvents(
            updated.map((e) => ({
              ...e,
              date: new Date(`${e.date}T${e.time}`).toLocaleString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              }),
              datetime: `${e.date}T${e.time}`,
              location: `📍 ${e.location}`,
              address: e.address
            }))
          );
        }
      } catch {
        // ignore
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const addToCalendar = (title, datetime) => {
    const startDate = new Date(datetime);
    const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000); // 2 hours later
    
    const startFormatted = startDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const endFormatted = endDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    
    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${startFormatted}/${endFormatted}`;
    window.open(calendarUrl, '_blank');
  };

  const openMap = (address) => {
    const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
    window.open(mapUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-800 text-center mb-10">
            Upcoming Events
          </h1>
          
          <div className="space-y-6">
            {events.map((event) => (
              <div
                key={event.id}
                className="bg-gray-50 border-l-4 border-red-500 rounded-r-lg p-6"
              >
                <h2 className="text-xl font-bold text-gray-800 mb-3">
                  {event.title}
                </h2>
                <div className="text-lg text-red-500 font-medium mb-2">
                  {event.date}
                </div>
                <div className="text-gray-600 mb-4">
                  {event.location}
                </div>
                <p className="text-gray-700 leading-relaxed mb-4">
                  {event.description}
                </p>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => addToCalendar(event.title, event.datetime)}
                    className="px-4 py-2 bg-green-500 text-white rounded-md font-medium hover:bg-green-600 transition-colors duration-300"
                  >
                    Add to Calendar
                  </button>
                  <button
                    onClick={() => openMap(event.address)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md font-medium hover:bg-blue-600 transition-colors duration-300"
                  >
                    View Map
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-10">
            <Link
              to="/"
              className="text-blue-500 hover:text-blue-600 hover:underline"
            >
              ← Back to Main Site
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventsPage;
