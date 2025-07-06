import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const EventsPage = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const loadEvents = async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true });
      if (!error) {
        setEvents(data || []);
      }
    };
    loadEvents();
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
            {events.map((event) => {
              const datetime = `${event.date}T${event.time}`;
              return (
                <div
                  key={event.id}
                  className="bg-gray-50 border-l-4 border-red-500 rounded-r-lg p-6"
                >
                  <h2 className="text-xl font-bold text-gray-800 mb-3">
                    {event.title}
                  </h2>
                  <div className="text-lg text-red-500 font-medium mb-2">
                    {new Date(datetime).toLocaleString()}
                  </div>
                  <div className="text-gray-600 mb-4">
                    {event.location}
                  </div>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    {event.description}
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => addToCalendar(event.title, datetime)}
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
              );
            })}
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
