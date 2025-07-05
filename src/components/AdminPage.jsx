import { useState } from 'react'
import VoxProManagement from './VoxProManagement.jsx'
import BackCornerPage from './BackCornerPage.jsx'
import EventsManager from './EventsManager.jsx'

const AdminPage = () => {
  const [tab, setTab] = useState('manage')

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex space-x-4 border-b mb-6">
        <button
          onClick={() => setTab('manage')}
          className={`pb-2 ${tab === 'manage' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
        >
          VoxPro Management
        </button>
        <button
          onClick={() => setTab('player')}
          className={`pb-2 ${tab === 'player' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
        >
          VoxPro Player
        </button>
        <button
          onClick={() => setTab('events')}
          className={`pb-2 ${tab === 'events' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
        >
          Events Manager
        </button>
      </div>
      {tab === 'manage' && (
        <VoxProManagement />
      )}
      {tab === 'player' && (
        <div className="mt-4">
          <BackCornerPage />
        </div>
      )}
      {tab === 'events' && (
        <EventsManager />
      )}
    </div>
  )
}

export default AdminPage
