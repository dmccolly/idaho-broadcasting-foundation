import React from 'react'
import { Link } from 'react-router-dom'

const AdminDashboard = () => (
  <div className="min-h-screen bg-gray-50 py-16 px-4">
    <div className="max-w-3xl mx-auto space-y-6 text-center">
      <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
      <p className="text-gray-600">Choose a management area below.</p>
      <div className="flex flex-col md:flex-row justify-center gap-6 mt-8">
        <Link
          to="/admin/voxpro"
          className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          VoxPro Management
        </Link>
        <Link
          to="/admin/events"
          className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          Events Manager
        </Link>
      </div>
    </div>
  </div>
)

export default AdminDashboard
