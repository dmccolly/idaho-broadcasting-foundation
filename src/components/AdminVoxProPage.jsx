import React from 'react'
import { Link } from 'react-router-dom'
import VoxProSystem from './VoxProSystem.jsx'
import VoxProPlayer from './VoxProPlayer.jsx'

const AdminVoxProPage = () => (
  <div className="min-h-screen bg-gray-50 py-8 px-4">
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">VoxPro Management</h1>
        <Link to="/admin/events" className="text-blue-800 hover:underline">
          Manage Events →
        </Link>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded shadow p-4 overflow-auto">
          <VoxProPlayer />
        </div>
        <VoxProSystem />
      </div>
    </div>
  </div>
)

export default AdminVoxProPage
