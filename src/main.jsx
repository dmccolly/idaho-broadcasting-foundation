import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css'; // This line loads your Tailwind CSS styles

// This is the standard way to render a React app.
// All imports are at the top, and the render logic is clean.
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
