import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const VoxProManagement = () => {
  const [assignments, setAssignments] = useState([]);
  const [mediaFiles, setMediaFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState('');
  const [selectedKey, setSelectedKey] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadAssignments();
    loadMediaFiles();
  }, []);

  const loadAssignments = async () => {
    const { data, error } = await supabase
      .from('assignments')
      .select('*')
      .order('key_slot');
    if (error) {
      console.error('Error loading assignments:', error);
      setStatusMessage(`Error loading assignments: ${error.message}`);
    } else {
      setAssignments(data);
    }
  };

  const loadMediaFiles = async () => {
    const { data, error } = await supabase
      .storage
      .from('media')
      .list('voxpro', { limit: 100 });
    if (error) {
      console.error('Error loading media files:', error);
      setStatusMessage(`Error loading media files: ${error.message}`);
    } else {
      setMediaFiles(data);
    }
  };

  const handleAssign = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatusMessage('Assigning...');

    if (!selectedFile || !selectedKey || !title) {
      setStatusMessage('Please fill out all required fields.');
      setIsLoading(false);
      return;
    }

    const mediaUrl = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/media/voxpro/${selectedFile}`;
    const fileExtension = selectedFile.split('.').pop().toLowerCase();

    let mediaType;
    if (['mp4', 'webm', 'ogg', 'mov'].includes(fileExtension)) {
      mediaType = 'video';
    } else if (['mp3', 'wav', 'aac', 'm4a'].includes(fileExtension)) {
      mediaType = 'audio';
    } else if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(fileExtension)) {
      mediaType = 'image';
    } else if (['pdf'].includes(fileExtension)) {
      mediaType = 'document';
    } else {
      mediaType = 'unknown';
    }

    const { error } = await supabase
      .from('assignments')
      .upsert({
        key_slot: selectedKey,
        title,
        description,
        media_url: mediaUrl,
        media_type: mediaType,
        submitted_by: 'Admin', // Or get from auth user
      }, { onConflict: 'key_slot' });

    if (error) {
      console.error('Error assigning media:', error);
      setStatusMessage(`Error: ${error.message}`);
    } else {
      setStatusMessage(`Key ${selectedKey} assigned successfully!`);
      loadAssignments();
      // Reset form
      setSelectedFile('');
      setSelectedKey('');
      setTitle('');
      setDescription('');
    }
    setIsLoading(false);
  };

  const handleRemove = async (keySlot) => {
    setIsLoading(true);
    setStatusMessage(`Removing assignment from Key ${keySlot}...`);
    const { error } = await supabase
      .from('assignments')
      .delete()
      .match({ key_slot: keySlot });

    if (error) {
      console.error('Error removing assignment:', error);
      setStatusMessage(`Error: ${error.message}`);
    } else {
      setStatusMessage(`Assignment for Key ${keySlot} removed successfully.`);
      loadAssignments();
    }
    setIsLoading(false);
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
      <h2 className="text-2xl font-bold text-green-400 mb-4">VoxPro Management</h2>

      {/* Assignment Form */}
      <form onSubmit={handleAssign} className="mb-8 p-4 bg-gray-700 rounded-md">
        <h3 className="text-xl text-white mb-4">Assign Media to Key</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="media-file" className="block text-sm font-medium text-gray-300 mb-1">Select Media File</label>
            <select
              id="media-file"
              value={selectedFile}
              onChange={(e) => setSelectedFile(e.target.value)}
              className="w-full bg-gray-900 text-white p-2 rounded border border-gray-600 focus:ring-green-500 focus:border-green-500"
              required
            >
              <option value="">Choose a file...</option>
              {mediaFiles.map(file => (
                <option key={file.id} value={file.name}>{file.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="key-slot" className="block text-sm font-medium text-gray-300 mb-1">Select Key Slot</label>
            <select
              id="key-slot"
              value={selectedKey}
              onChange={(e) => setSelectedKey(e.target.value)}
              className="w-full bg-gray-900 text-white p-2 rounded border border-gray-600 focus:ring-green-500 focus:border-green-500"
              required
            >
              <option value="">Choose a key...</option>
              {[1, 2, 3, 4, 5].map(key => (
                <option key={key} value={key.toString()}>{`Key ${key}`}</option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2">
            <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">Title</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-gray-900 text-white p-2 rounded border border-gray-600 focus:ring-green-500 focus:border-green-500"
              placeholder="Enter title for the media"
              required
            />
          </div>
          <div className="md:col-span-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="3"
              className="w-full bg-gray-900 text-white p-2 rounded border border-gray-600 focus:ring-green-500 focus:border-green-500"
              placeholder="Enter a brief description"
            ></textarea>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <button
            type="submit"
            disabled={isLoading}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors disabled:bg-gray-500"
          >
            {isLoading ? 'Assigning...' : 'Assign/Update Key'}
          </button>
          {statusMessage && <p className="text-sm text-yellow-400">{statusMessage}</p>}
        </div>
      </form>

      {/* Current Assignments */}
      <div>
        <h3 className="text-xl text-white mb-4">Current Assignments</h3>
        <div className="space-y-3">
          {assignments.length > 0 ? assignments.map(assignment => (
            <div key={assignment.id} className="bg-gray-700 p-3 rounded-md flex items-center justify-between">
              <div>
                <p className="font-bold text-green-400">Key {assignment.key_slot}: <span className="text-white">{assignment.title}</span></p>
                <p className="text-xs text-gray-400 truncate max-w-md">{assignment.media_url}</p>
              </div>
              <button
                onClick={() => handleRemove(assignment.key_slot)}
                disabled={isLoading}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-sm transition-colors disabled:bg-gray-500"
              >
                Remove
              </button>
            </div>
          )) : (
            <p className="text-gray-400">No keys are currently assigned.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default VoxProManagement;
