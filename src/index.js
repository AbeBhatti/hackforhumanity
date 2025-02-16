// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Map from './Map'; // Adjusted path to correct location for Map component
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Map />
  </React.StrictMode>
);

// Measure performance (optional)
reportWebVitals(console.log);