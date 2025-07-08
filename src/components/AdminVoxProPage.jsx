import React from 'react';
import { Link } from 'react-router-dom';
import VoxProSystem from './VoxProSystem.jsx';

const AdminVoxProPage = () => (
  <div className="min-h-screen bg-gray-50 py-8 px-4">
    <div className="max-w-6xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-gray-800 text-center">VoxPro Administration</h1>
      <div className="text-center">
        <Link to="/admin/events" className="text-blue-800 hover:underline">
          Manage Events →
        </Link>
      </div>
      <VoxProSystem />
    </div>
  </div>
);

export default AdminVoxProPage;

