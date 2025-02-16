// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Importing your CSS
import App from './App'; // Importing the App component
import reportWebVitals from './reportWebVitals';

// Get the root element
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the App component
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Measure performance (optional)
reportWebVitals(console.log);
