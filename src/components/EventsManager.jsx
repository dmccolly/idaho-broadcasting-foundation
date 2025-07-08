import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const EventsManager = () => {
  const [events, setEvents] = useState([
    {
      id: 1,
      title: 'Idaho Broadcasting Conference 2025',
      date: '2025-08-15',
      time: '09:00',
      location: 'Boise Convention Center',
      address: '850 W Front St, Boise, ID 83702',
      description: 'Annual conference bringing together broadcasting professionals from across Idaho.',
      type: 'Conference'
    },
    {
      id: 2,
      title: 'Radio Production Workshop',
      date: '2025-09-21',
      time: '14:00',
      location: 'Idaho State University Media Center',
      address: 'Pocatello, ID',
      description: 'Hands-on workshop covering modern radio production techniques.',
      type: 'Workshop'
    },
    {
      id: 3,
      title: 'Digital Broadcasting Seminar',
      date: '2025-10-10',
      time: '10:00',
      location: 'University of Idaho',
      address: 'Moscow, ID',
      description: 'Explore the future of digital broadcasting and streaming technologies.',
      type: 'Seminar'
    }
  ]);

  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    address: '',
    description: '',
    type: 'Conference'
  });

  const [showSuccess, setShowSuccess] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingId) {
      // Update existing event
      setEvents(prev => prev.map(event => 
        event.id === editingId 
          ? { ...formData, id: editingId }
          : event
      ));
      setEditingId(null);
    } else {
      // Add new event
      const newEvent = {
        ...formData,
        id: Date.now()
      };
      setEvents(prev => [...prev, newEvent]);
    }

    // Reset form
    setFormData({
      title: '',
      date: '',
      time: '',
      location: '',
      address: '',
      description: '',
      type: 'Conference'
    });

    // Show success message
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleEdit = (event) => {
    setFormData(event);
    setEditingId(event.id);
  };

  const handleDelete = (id) => {
    setEvents(prev => prev.filter(event => event.id !== id));
  };

  const handleClear = () => {
    setFormData({
      title: '',
      date: '',
      time: '',
      location: '',
      address: '',
      description: '',
      type: 'Conference'
    });
    setEditingId(null);
  };

  const formatEventDate = (date, time) => {
    const eventDate = new Date(`${date}T${time}`);
    return eventDate.toLocaleDateString('en-US', {
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
          <h1 className="text-3xl font-bold text-gray-800 text-center mb-2">
            📅 Events Manager
          </h1>
          <p className="text-gray-600 text-center mb-8">
            Manage events for the Idaho Broadcasting Foundation website
          </p>

          {showSuccess && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
              Event saved successfully!
            </div>
          )}

          <div className="md:grid md:grid-cols-2 md:gap-8">
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                {editingId ? 'Edit Event' : 'Add New Event'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Event Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Event Type
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Conference">Conference</option>
                    <option value="Workshop">Workshop</option>
                    <option value="Seminar">Seminar</option>
                    <option value="Meeting">Meeting</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date *
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Time *
                  </label>
                  <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location *
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-500 text-white rounded-md font-medium hover:bg-blue-600 transition-colors duration-300"
                >
                  {editingId ? 'Update Event' : 'Add Event'}
                </button>
                <button
                  type="button"
                  onClick={handleClear}
                  className="px-6 py-2 bg-gray-500 text-white rounded-md font-medium hover:bg-gray-600 transition-colors duration-300"
                >
                  Clear Form
                </button>
              </div>
            </form>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Current Events</h2>
              <div className="space-y-4">
                {events.map((event) => (
                  <div key={event.id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-gray-800">{event.title}</h3>
                        <p className="text-red-500 font-medium">
                          {formatEventDate(event.date, event.time)}
                        </p>
                        <p className="text-gray-600">📍 {event.location}</p>
                        {event.description && (
                          <p className="text-gray-700 mt-2">{event.description}</p>
                        )}
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => handleEdit(event)}
                          className="px-3 py-1 bg-yellow-500 text-white rounded text-sm hover:bg-yellow-600 transition-colors duration-300"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(event.id)}
                          className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition-colors duration-300"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Actions</h2>
            <div className="flex flex-wrap gap-3 mb-6">
              <Link
                to="/events"
                className="px-4 py-2 bg-green-500 text-white rounded-md font-medium hover:bg-green-600 transition-colors duration-300"
              >
                Preview Events Page
              </Link>
              <button
                onClick={() => alert('Events page updated successfully!')}
                className="px-4 py-2 bg-blue-500 text-white rounded-md font-medium hover:bg-blue-600 transition-colors duration-300"
              >
                Update Events Page
              </button>
            </div>
            <Link
              to="/admin"
              className="text-blue-500 hover:text-blue-600 hover:underline"
            >
              ← Back to Admin Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventsManager;

