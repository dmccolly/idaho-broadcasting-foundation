import React from 'react';
import { Link } from 'react-router-dom';
import useEvents from '../hooks/useEvents';

const EventsPage = () => {
  const events = useEvents();

  const now = new Date();
  const upcomingEvents = events.filter((event) => {
    const dt = new Date(`${event.date}T${event.time || '00:00'}`);
    return dt >= now;
  });
  const pastEvents = events.filter((event) => {
    const dt = new Date(`${event.date}T${event.time || '00:00'}`);
    return dt < now;
  });

  const addToCalendar = (title, date, time) => {
    const startDate = new Date(`${date}T${time}`);
    const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000);

    const startFormatted =
      startDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const endFormatted =
      endDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

    const calendarUrl =
      `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
        title
      )}&dates=${startFormatted}/${endFormatted}`;
    window.open(calendarUrl, '_blank');
  };

  const openMap = (address) => {
    const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      address
    )}`;
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
            {upcomingEvents.length === 0 ? (
              <p className="text-center text-gray-500">No upcoming events.</p>
            ) : (
              upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className="bg-gray-50 border-l-4 border-red-500 rounded-r-lg p-6"
                >
                  <h2 className="text-xl font-bold text-gray-800 mb-3">
                    {event.title}
                  </h2>
                  <div className="text-lg text-red-500 font-medium mb-2">
                    {event.date} {event.time && `at ${event.time}`}
                  </div>
                  <div className="text-gray-600 mb-4">📍 {event.location}</div>
                  {event.description && (
                    <p className="text-gray-700 leading-relaxed mb-4">
                      {event.description}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() =>
                        addToCalendar(event.title, event.date, event.time)
                      }
                      className="px-4 py-2 bg-green-500 text-white rounded-md font-medium hover:bg-green-600 transition-colors duration-300"
                    >
                      Add to Calendar
                    </button>
                    {event.address && (
                      <button
                        onClick={() => openMap(event.address)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md font-medium hover:bg-blue-600 transition-colors duration-300"
                      >
                        View Map
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {pastEvents.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Past Events
              </h2>
              <ul className="space-y-2">
                {pastEvents.map((event) => (
                  <li key={event.id}>
                    <a href="#" className="text-blue-500 hover:underline">
                      {event.title}
                    </a>{' '}
                    <span className="text-sm text-gray-500">{event.date}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

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
