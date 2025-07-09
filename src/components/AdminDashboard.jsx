import React from 'react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const tools = [
    {
      id: 'events',
      title: 'Events Manager',
      description: 'Add, edit, and manage events for the website. Control what appears on the events page and schedule upcoming broadcasts.',
      icon: '📅',
      link: '/admin/events',
      color: 'red'
    },
    {
      id: 'voxpro',
      title: 'VoxPro Tools',
      description: 'Upload audio, assign keys and preview the VoxPro player.',
      icon: '🎛️',
      link: '/admin/voxpro',
      color: 'green'
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      red: {
        border: 'hover:border-red-500',
        button: 'bg-red-500 hover:bg-red-600',
        icon: 'text-red-500'
      },
      green: {
        border: 'hover:border-green-500',
        button: 'bg-green-500 hover:bg-green-600',
        icon: 'text-green-500'
      },
      blue: {
        border: 'hover:border-blue-500',
        button: 'bg-blue-500 hover:bg-blue-600',
        icon: 'text-blue-500'
      }
    };
    return colors[color];
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-800 text-center mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 text-center mb-10 text-lg">
            Idaho Broadcasting Foundation Management Tools
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {tools.map((tool) => {
              const colorClasses = getColorClasses(tool.color);
              return (
                <div
                  key={tool.id}
                  className={`bg-gray-50 border-2 border-gray-200 rounded-lg p-6 text-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${colorClasses.border}`}
                >
                  <div className={`text-5xl mb-4 ${colorClasses.icon}`}>
                    {tool.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">
                    {tool.title}
                  </h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {tool.description}
                  </p>
                  <Link
                    to={tool.link}
                    className={`inline-block px-5 py-2 text-white rounded-md font-medium transition-colors duration-300 ${colorClasses.button}`}
                  >
                    {tool.id === 'events' ? 'Manage Events' : 'Open VoxPro'}
                  </Link>
                </div>
              );
            })}
          </div>
          
          <div className="text-center pt-6 border-t border-gray-200">
            <p className="text-gray-500 mb-4">
              Idaho Broadcasting Foundation Admin Panel
            </p>
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

export default AdminDashboard;
