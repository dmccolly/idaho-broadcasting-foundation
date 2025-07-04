import { useState } from 'react'
import eventsData, { eventUtils } from '../Data/eventsData'

const EventManagement = ({ onBack }) => {
  const [title, setTitle] = useState('')
  const [date, setDate] = useState('')
  const [description, setDescription] = useState('')
  const [makeCurrent, setMakeCurrent] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!title || !date) return
    const id = `${title.toLowerCase().replace(/\s+/g, '-')}-${date}`
    const newEvent = { id, title, date, description, type: 'event' }
    eventUtils.addEvent(newEvent, makeCurrent)
    setTitle('')
    setDate('')
    setDescription('')
    setMakeCurrent(false)
    alert('Event saved')
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Event Management</h2>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            className="w-full border p-2 rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Date</label>
          <input
            type="date"
            className="w-full border p-2 rounded"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            className="w-full border p-2 rounded"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-2">
          <input
            id="current"
            type="checkbox"
            checked={makeCurrent}
            onChange={(e) => setMakeCurrent(e.target.checked)}
          />
          <label htmlFor="current" className="text-sm">Set as current event</label>
        </div>
        <div className="flex space-x-4">
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            Save Event
          </button>
          {onBack && (
            <button type="button" className="text-blue-600" onClick={onBack}>
              Back
            </button>
          )}
        </div>
      </form>
    </div>
  )
}

export default EventManagement
