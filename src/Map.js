// src/pages/Map.js
import React, { useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from "react-simple-maps";
import './Map.css';

const usGeoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";
const places = [
  { name: "San Francisco", coordinates: [-122.4194, 37.7749] },
  { name: "Los Angeles", coordinates: [-118.2437, 34.0522] },
  { name: "Sacramento", coordinates: [-121.4944, 38.5816] }
];

function Map() {
  const [markers, setMarkers] = useState([]);
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");

  const handlePlaceClick = (placeName) => alert(`You clicked on ${placeName}`);
  const handleMapClick = (event) => {
    const coordinates = event.coordinates;
    setMarkers([...markers, { coordinates }]);
  };
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!lat || !lng) return;
    setMarkers([...markers, { coordinates: [parseFloat(lng), parseFloat(lat)] }]);
    setLat("");
    setLng("");
  };

  return (
    <Router>
      <div className="map-leaderboard-split">
        <header className="main-title">
          <h1>Interactive Place Map with Coordinate Inputs</h1>
        </header>

        <form className="coordinate-form" onSubmit={handleFormSubmit}>
          <input type="number" placeholder="Latitude" value={lat} onChange={(e) => setLat(e.target.value)} required />
          <input type="number" placeholder="Longitude" value={lng} onChange={(e) => setLng(e.target.value)} required />
          <button type="submit">Add Marker</button>
        </form>

        <div className="split-container">
          <div className="map-section">
            <ComposableMap projection="geoAlbersUsa" projectionConfig={{ scale: 1000 }}>
              <ZoomableGroup zoom={1} onClick={handleMapClick}>
                <Geographies geography={usGeoUrl}>
                  {({ geographies }) =>
                    geographies.map((geo) => (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        style={{
                          default: { fill: "#D6D6DA" },
                          hover: { fill: "#BADA55" },
                          pressed: { fill: "#E42" }
                        }}
                      />
                    ))
                  }
                </Geographies>
                {markers.map((marker, index) => (
                  <Marker key={index} coordinates={marker.coordinates}>
                    <circle r={5} fill="#F53" stroke="#fff" strokeWidth={2} />
                  </Marker>
                ))}
                {places.map(({ name, coordinates }, index) => (
                  <Marker key={index} coordinates={coordinates}>
                    <circle r={6} fill="#F53" stroke="#fff" strokeWidth={2} onClick={() => handlePlaceClick(name)} />
                    <text textAnchor="middle" y={-10} fontSize={10} fill="#333">{name}</text>
                  </Marker>
                ))}
              </ZoomableGroup>
            </ComposableMap>
          </div>

          <div className="leaderboard-section">
            <h1><span role="img" aria-label="fire emoji">🔥</span> Featured Places</h1>
            <ul>
              {places.map(({ name, coordinates }, index) => (
                <li key={index} className="place-card">
                  <h2>{name}</h2>
                  <p>Coordinates: {coordinates.join(", ")}</p>
                </li>
              ))}
              {markers.map((marker, index) => (
                <li key={index} className="place-card">
                  <h2>Custom Marker</h2>
                  <p>Coordinates: {marker.coordinates.join(", ")}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default Map;
