import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const VoxProManagement = () => {
// State management
const [connectionStatus, setConnectionStatus] = useState('connecting');
const [statusMessage, setStatusMessage] = useState('Connecting to Supabase...');
const [assignments, setAssignments] = useState([]);

// Form state
const [formData, setFormData] = useState({
title: '',
description: '',
submittedBy: '',
keySlot: '',
mediaFile: null
});

const [isUploading, setIsUploading] = useState(false);
const [uploadProgress, setUploadProgress] = useState(0);

// Initialize Supabase connection
useEffect(() => {
const initializeConnection = async () => {
try {
// Test Supabase connection
const { data, error } = await supabase
.from('assignments')
.select('*')
.limit(1);

if (error) {
console.error('Supabase connection error:', error);
setConnectionStatus('disconnected');
setStatusMessage('Failed to connect to Supabase');
return;
}

// Connection successful
setConnectionStatus('connected');
setStatusMessage('Connected to Supabase');

// Load current assignments
loadAssignments();

} catch (error) {
console.error('Connection initialization error:', error);
setConnectionStatus('disconnected');
setStatusMessage('Connection failed');
}
};

initializeConnection();
}, []);

// Load assignments from Supabase
const loadAssignments = async () => {
try {
const { data, error } = await supabase
.from('assignments')
.select('*')
.order('created_at', { ascending: false });

if (error) {
console.error('Error loading assignments:', error);
return;
}

setAssignments(data || []);
} catch (error) {
console.error('Error in loadAssignments:', error);
}
};

// Handle form input changes
const handleInputChange = (field, value) => {
setFormData(prev => ({
...prev,
[field]: value
}));
};

// Handle file selection
const handleFileSelect = (event) => {
const file = event.target.files[0];
if (file) {
setFormData(prev => ({
...prev,
mediaFile: file
}));
}
};

// Handle key slot selection
const handleKeySlotSelect = (keySlot) => {
setFormData(prev => ({
...prev,
keySlot
}));
};

// Upload media file to Supabase Storage
const uploadMediaFile = async (file) => {
try {
const fileExt = file.name.split('.').pop();
const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
const filePath = `media/${fileName}`;

// Upload to Supabase Storage
const { data, error } = await supabase.storage
.from('media-files')
.upload(filePath, file, {
cacheControl: '3600',
upsert: false
});

if (error) {
throw error;
}

// Get public URL
const { data: { publicUrl } } = supabase.storage
.from('media-files')
.getPublicUrl(filePath);

return {
filePath,
publicUrl,
fileName: file.name,
fileSize: file.size,
fileType: file.type
};

} catch (error) {
console.error('File upload error:', error);
throw error;
}
};

// Submit assignment to Supabase
const handleSubmit = async () => {
if (!formData.title || !formData.keySlot) {
alert('Please fill in title and select a key slot');
return;
}

setIsUploading(true);
setUploadProgress(0);

try {
let mediaInfo = null;

// Upload file if provided (let Supabase handle the heavy lifting)
if (formData.mediaFile) {
setUploadProgress(25);
mediaInfo = await uploadMediaFile(formData.mediaFile);
setUploadProgress(50);
}

// Create assignment record in Supabase
const assignmentData = {
title: formData.title,
description: formData.description,
submitted_by: formData.submittedBy,
key_slot: formData.keySlot,
media_url: mediaInfo?.publicUrl || null,
media_file_path: mediaInfo?.filePath || null,
media_file_name: mediaInfo?.fileName || null,
media_file_size: mediaInfo?.fileSize || null,
media_file_type: mediaInfo?.fileType || null,
created_at: new Date().toISOString(),
updated_at: new Date().toISOString()
};

setUploadProgress(75);

// Insert into Supabase (this will trigger real-time updates to the Player)
const { data, error } = await supabase
.from('assignments')
.upsert(assignmentData, {
onConflict: 'key_slot',
ignoreDuplicates: false
})
.select();

if (error) {
throw error;
}

setUploadProgress(100);

// Success - clear form and reload assignments
clearForm();
loadAssignments();

alert('Media assigned successfully! The VoxPro Player will update automatically.');

} catch (error) {
console.error('Submit error:', error);
alert(`Error: ${error.message}`);
} finally {
setIsUploading(false);
setUploadProgress(0);
}
};

// Clear form
const clearForm = () => {
setFormData({
title: '',
description: '',
submittedBy: '',
keySlot: '',
mediaFile: null
});

// Clear file input
const fileInput = document.querySelector('input[type="file"]');
if (fileInput) {
fileInput.value = '';
}
};

// Get connection status color
const getStatusColor = () => {
switch (connectionStatus) {
case 'connected': return 'text-green-500';
case 'connecting': return 'text-yellow-500';
case 'disconnected': return 'text-red-500';
default: return 'text-gray-500';
}
};

// Get connection status indicator
const getStatusIndicator = () => {
switch (connectionStatus) {
case 'connected': return '🟢';
case 'connecting': return '🟡';
case 'disconnected': return '🔴';
default: return '⚪';
}
};

return (
<div className="w-full max-w-6xl mx-auto p-4">
{/* Header */}
<div className="bg-gray-800 text-white p-4 rounded-t-lg">
<h2 className="text-2xl font-bold text-center text-green-400">VoxPro Management Tool</h2>
<p className="text-center text-gray-300">Administrative access for media upload, assignment, and system management.</p>
</div>

{/* Main Interface */}
<div className="bg-gray-900 text-white p-6 rounded-b-lg">
{/* Status Header */}
<div className="text-center mb-6">
<h3 className="text-xl font-semibold text-green-400 mb-2">VoxPro Management System</h3>
<p className="text-gray-400">Professional Control System with Media Management</p>
<div className={`flex items-center justify-center gap-2 mt-2 ${getStatusColor()}`}>
<span>{getStatusIndicator()}</span>
<span>{statusMessage}</span>
</div>
</div>

<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
{/* VoxPro Control Interface (Read-only display) */}
<div className="bg-gray-800 p-4 rounded-lg">
<h4 className="text-lg font-semibold text-green-400 mb-4 text-center">VoxPro Control Interface</h4>

<div className="text-center mb-4">
<h5 className="text-white font-medium">VoxPro</h5>
<p className="text-gray-400 text-sm">Professional Control System</p>
</div>

<div className="bg-blue-600 text-white text-center py-2 px-4 rounded mb-4 font-medium">
VoxPro Media Interface - Ready
</div>

{/* START Keys (1-5) - Display only */}
<div className="grid grid-cols-5 gap-2 mb-4">
{[1, 2, 3, 4, 5].map(num => {
const assignment = assignments.find(a => a.key_slot === num.toString());
return (
<div
key={num}
className={`
h-12 rounded font-bold text-white border-2 flex items-center justify-center
${assignment
? 'bg-red-600 border-red-400'
: 'bg-red-800 border-red-600 opacity-50'
}
`}
title={assignment?.title || `START ${num}`}
>
{num}
</div>
);
})}
</div>

{/* Media Keys Display */}
<div className="grid grid-cols-3 gap-2 mb-2">
{['A', 'B', 'DUP'].map(key => {
const assignment = assignments.find(a => a.key_slot === key);
return (
<div
key={key}
className={`
h-12 rounded font-bold text-white border-2 flex items-center justify-center
${assignment
? 'bg-purple-600 border-purple-400'
: 'bg-purple-800 border-purple-600 opacity-50'
}
`}
title={assignment?.title || key}
>
{key}
</div>
);
})}
</div>

<div className="grid grid-cols-3 gap-2 mb-2">
{['C', 'D', 'CUE'].map(key => {
const assignment = assignments.find(a => a.key_slot === key);
const bgColor = key === 'C' ? 'teal' : key === 'D' ? 'red' : 'blue';
return (
<div
key={key}
className={`
h-12 rounded font-bold text-white border-2 flex items-center justify-center
${assignment
? `bg-${bgColor}-600 border-${bgColor}-400`
: `bg-${bgColor}-800 border-${bgColor}-600 opacity-50`
}
`}
title={assignment?.title || key}
>
{key}
</div>
);
})}
</div>

<div className="grid grid-cols-3 gap-2 mb-2">
{['E', 'F', 'REC'].map(key => {
const assignment = assignments.find(a => a.key_slot === key);
const bgColor = key === 'E' ? 'red' : key === 'F' ? 'green' : 'blue';
return (
<div
key={key}
className={`
h-12 rounded font-bold text-white border-2 flex items-center justify-center
${assignment
? `bg-${bgColor}-600 border-${bgColor}-400`
: `bg-${bgColor}-800 border-${bgColor}-600 opacity-50`
}
`}
title={assignment?.title || key}
>
{key}
</div>
);
})}
</div>

<div className="flex justify-center">
{(() => {
const assignment = assignments.find(a => a.key_slot === 'G');
return (
<div
className={`
h-12 w-20 rounded font-bold text-white border-2 flex items-center justify-center
${assignment
? 'bg-yellow-600 border-yellow-400'
: 'bg-yellow-800 border-yellow-600 opacity-50'
}
`}
title={assignment?.title || 'G'}
>
G
</div>
);
})()}
</div>

{/* Status Indicator */}
<div className="flex justify-center mt-4">
<div className="w-16 h-16 rounded-full border-4 border-green-500 flex items-center justify-center">
<div className="w-2 h-8 bg-green-500 rounded"></div>
</div>
</div>
</div>

{/* Media Management Interface */}
<div className="bg-gray-800 p-4 rounded-lg">
<h4 className="text-lg font-semibold text-green-400 mb-4 text-center">Media Management Interface</h4>

{/* Current Assignments Display */}
<div className="bg-gray-700 p-3 rounded mb-4">
<h5 className="text-green-400 font-medium mb-2">Current Key Assignments</h5>
<div className="text-sm text-gray-300 max-h-20 overflow-y-auto">
{assignments.length > 0 ? (
assignments.map(assignment => (
<div key={assignment.id} className="flex justify-between">
<span>{assignment.key_slot}:</span>
<span className="truncate ml-2">{assignment.title}</span>
</div>
))
) : (
<p className="text-gray-500">No assignments loaded</p>
)}
</div>
</div>

{/* Media Upload Form */}
<div className="space-y-4">
{/* Media Title */}
<div>
<label className="block text-green-400 font-medium mb-1">
Media Title (100 characters max)
</label>
<input
type="text"
value={formData.title}
onChange={(e) => handleInputChange('title', e.target.value)}
placeholder="Enter media title..."
maxLength={100}
className="w-full bg-gray-700 text-white p-2 rounded border border-gray-600 focus:border-green-400 focus:outline-none"
/>
<div className="text-xs text-gray-400 mt-1">
{formData.title.length}/100
</div>
</div>

{/* Description */}
<div>
<label className="block text-green-400 font-medium mb-1">
Description (300 characters max)
</label>
<textarea
value={formData.description}
onChange={(e) => handleInputChange('description', e.target.value)}
placeholder="Enter description..."
maxLength={300}
rows={3}
className="w-full bg-gray-700 text-white p-2 rounded border border-gray-600 focus:border-green-400 focus:outline-none resize-none"
/>
<div className="text-xs text-gray-400 mt-1">
{formData.description.length}/300
</div>
</div>

{/* Submitted By */}
<div>
<label className="block text-green-400 font-medium mb-1">
Submitted By
</label>
<input
type="text"
value={formData.submittedBy}
onChange={(e) => handleInputChange('submittedBy', e.target.value)}
placeholder="Your name..."
className="w-full bg-gray-700 text-white p-2 rounded border border-gray-600 focus:border-green-400 focus:outline-none"
/>
</div>

{/* File Upload */}
<div>
<label className="block text-green-400 font-medium mb-1">
Select Media File
</label>
<div className="border-2 border-dashed border-gray-600 rounded p-4 text-center hover:border-green-400 transition-colors">
<input
type="file"
onChange={handleFileSelect}
accept="audio/*,video/*"
className="hidden"
id="media-file-input"
/>
<label
htmlFor="media-file-input"
className="cursor-pointer text-blue-400 hover:text-blue-300"
>
📁 Click to select file or drag & drop here
</label>
{formData.mediaFile && (
<p className="text-green-400 mt-2 text-sm">
Selected: {formData.mediaFile.name}
</p>
)}
</div>
</div>

{/* Key Selection */}
<div>
<label className="block text-green-400 font-medium mb-2">
Select Key to Replace
</label>
<div className="grid grid-cols-5 gap-2 mb-2">
{[1, 2, 3, 4, 5].map(num => (
<button
key={num}
onClick={() => handleKeySlotSelect(num.toString())}
className={`
h-10 rounded font-bold text-white border-2
${formData.keySlot === num.toString()
? 'bg-green-600 border-green-400'
: 'bg-red-600 border-red-400 hover:bg-red-700'
}
`}
>
{num}
</button>
))}
</div>
<div className="grid grid-cols-4 gap-2">
{['A', 'B', 'C', 'D'].map(key => (
<button
key={key}
onClick={() => handleKeySlotSelect(key)}
className={`
h-10 rounded font-bold text-white border-2
${formData.keySlot === key
? 'bg-green-600 border-green-400'
: 'bg-purple-600 border-purple-400 hover:bg-purple-700'
}
`}
>
{key}
</button>
))}
</div>
</div>

{/* Upload Progress */}
{isUploading && (
<div className="bg-gray-700 p-3 rounded">
<div className="flex justify-between text-sm mb-1">
<span>Uploading...</span>
<span>{uploadProgress}%</span>
</div>
<div className="w-full bg-gray-600 rounded-full h-2">
<div
className="bg-green-500 h-2 rounded-full transition-all duration-300"
style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={handleSubmit}
                  disabled={isUploading || !formData.title || !formData.keySlot}
                  className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded transition-colors"
                >
                  {isUploading ? 'Uploading...' : 'Upload & Assign Media'}
                </button>
                <button
                  onClick={clearForm}
                  disabled={isUploading}
                  className="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-800 text-white font-bold py-2 px-4 rounded transition-colors"
                >
                  Clear Form
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Debug Section (can be removed in production) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-6 bg-gray-700 p-4 rounded">
            <h5 className="text-yellow-400 font-medium mb-2">Debug Info</h5>
            <div className="text-xs text-gray-300">
              <p>Connection Status: {connectionStatus}</p>
              <p>Assignments Loaded: {assignments.length}</p>
              <p>Selected Key: {formData.keySlot || 'None'}</p>
              <p>File Selected: {formData.mediaFile?.name || 'None'}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VoxProManagement;

