import { useState } from 'react'
import VoxProManagement from './VoxProManagement.jsx'
import EventManagement from './EventManagement.jsx'

const AdminPage = () => {
  const [view, setView] = useState('home')

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {view === 'home' && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Admin Tools</h2>
          <div className="space-x-4">
            <button onClick={() => setView('voxpro')} className="bg-blue-600 text-white px-4 py-2 rounded">
              VoxPro Management
            </button>
            <button onClick={() => setView('events')} className="bg-blue-600 text-white px-4 py-2 rounded">
              Event Management
            </button>
          </div>
        </div>
      )}

      {view === 'voxpro' && (
        <div>
          <VoxProManagement />
          <button onClick={() => setView('home')} className="mt-4 text-blue-600">
            Back to Admin
          </button>
        </div>
      )}

      {view === 'events' && <EventManagement onBack={() => setView('home')} />}
    </div>
  )
}

export default AdminPage
