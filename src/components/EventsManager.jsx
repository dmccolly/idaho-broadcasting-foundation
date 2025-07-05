import { useState, useEffect } from 'react'

const defaultForm = { title: '', subtitle: '', date: '', time: '', description: '', details: '', image: '', archived: false }

const EventsManager = () => {
  const [events, setEvents] = useState([])
  const [form, setForm] = useState(defaultForm)

  useEffect(() => {
    const stored = localStorage.getItem('ibf_events')
    if (stored) {
      setEvents(JSON.parse(stored))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('ibf_events', JSON.stringify(events))
  }, [events])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleImage = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setForm(prev => ({ ...prev, image: reader.result }))
      }
      reader.readAsDataURL(file)
    }
  }

  const addEvent = (e) => {
    e.preventDefault()
    if (!form.title || !form.date) return
    setEvents(prev => [...prev, { ...form, id: Date.now().toString() }])
    setForm(defaultForm)
  }

  const toggleArchive = (id) => {
    setEvents(prev => prev.map(ev => ev.id === id ? { ...ev, archived: !ev.archived } : ev))
  }

  const removeEvent = (id) => {
    setEvents(prev => prev.filter(ev => ev.id !== id))
  }

  return (
    <div className="space-y-6">
      <form onSubmit={addEvent} className="bg-gray-100 p-4 rounded shadow space-y-3">
        <h3 className="text-lg font-semibold">Add Event</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <input name="title" value={form.title} onChange={handleChange} placeholder="Title" className="p-2 border rounded" required />
          <input name="subtitle" value={form.subtitle} onChange={handleChange} placeholder="Subtitle" className="p-2 border rounded" />
          <input type="date" name="date" value={form.date} onChange={handleChange} className="p-2 border rounded" required />
          <input name="time" value={form.time} onChange={handleChange} placeholder="Time" className="p-2 border rounded" />
        </div>
        <textarea name="description" value={form.description} onChange={handleChange} placeholder="Short description" className="w-full p-2 border rounded" />
        <textarea name="details" value={form.details} onChange={handleChange} placeholder="Full details" className="w-full p-2 border rounded" />
        <div className="flex items-center space-x-2">
          <input type="file" accept="image/*" onChange={handleImage} className="" />
          <label className="flex items-center space-x-2">
            <input type="checkbox" name="archived" checked={form.archived} onChange={handleChange} />
            <span>Archive?</span>
          </label>
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Save Event</button>
      </form>

      <div>
        <h3 className="text-lg font-semibold mb-2">Existing Events</h3>
        <div className="space-y-2">
          {events.map(ev => (
            <div key={ev.id} className="border p-2 rounded flex justify-between items-center">
              <div>
                <div className="font-medium">{ev.title}</div>
                <div className="text-sm text-gray-600">{ev.date} {ev.time}</div>
              </div>
              <div className="flex space-x-2">
                <button onClick={() => toggleArchive(ev.id)} className="text-sm text-blue-600 underline">
                  {ev.archived ? 'Unarchive' : 'Archive'}
                </button>
                <button onClick={() => removeEvent(ev.id)} className="text-sm text-red-600 underline">Delete</button>
              </div>
            </div>
          ))}
          {events.length === 0 && <p className="text-gray-600">No events added.</p>}
        </div>
      </div>
    </div>
  )
}

export default EventsManager
