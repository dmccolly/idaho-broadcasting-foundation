import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { loadEvents } from '../utils/eventsStorage';
import { sampleEvents } from '../data/sampleEvents';

const EventsPage = () => {
  const [upcoming, setUpcoming] = useState([]);
  const [past, setPast] = useState([]);

  useEffect(() => {
    const events = loadEvents();
    const all = events.length ? events : sampleEvents.map(e => ({
      ...e,
      datetime: `${e.date}T${e.time}`
    }));
    const now = new Date();
    const upcomingEvents = [];
    const pastEvents = [];
    all.forEach(ev => {
      const dt = new Date(ev.datetime);
      if (dt >= now) upcomingEvents.push(ev); else pastEvents.push(ev);
    });
    upcomingEvents.sort((a,b) => new Date(a.datetime) - new Date(b.datetime));
    pastEvents.sort((a,b) => new Date(b.datetime) - new Date(a.datetime));
    setUpcoming(upcomingEvents);
    setPast(pastEvents);
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

  const formatDisplayDate = (dt) => {
    const date = new Date(dt);
    return date.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-800 text-center mb-10">
            Upcoming Events
          </h1>
          
          <div className="space-y-6">
            {upcoming.map((event) => (
              <div
                key={event.id}
                className="bg-gray-50 border-l-4 border-red-500 rounded-r-lg p-6"
              >
                <h2 className="text-xl font-bold text-gray-800 mb-3">
                  {event.title}
                </h2>
                <div className="text-lg text-red-500 font-medium mb-2">
                  {formatDisplayDate(event.datetime)}
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

          {past.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Past Events</h2>
              <ul className="space-y-2">
                {past.map(ev => (
                  <li key={ev.id} className="flex justify-between border-b pb-1">
                    <a href="#" className="text-blue-800 hover:underline">{ev.title}</a>
                    <span className="text-sm text-gray-500">{new Date(ev.datetime).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="text-center mt-10">
            <Link
              to="/"
              className="text-blue-800 hover:text-blue-900 hover:underline"
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
