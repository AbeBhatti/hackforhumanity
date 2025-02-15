// src/pages/Map.js
import React from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { useNavigate } from "react-router-dom";
import './Map.css'; 

const usGeoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";
const topPlaces = [
  { name: "Butte County", description: "Severe fire risk due to dry conditions and strong winds." },
  { name: "Lake County", description: "High fire risk from drought and low humidity." },
  { name: "Shasta County", description: "Moderate fire risk from recent heatwaves and dry brush." }
];

function Map() {
  const navigate = useNavigate();
  const handleStateClick = (stateName) => alert(`You clicked on ${stateName}`);

  return (
    <div className="map-leaderboard-split">
      <header className="main-title">
        <h1>Ember Explorer</h1>
      </header>

      <div className="split-container">
        {/* Left: Interactive U.S. Map */}
        <div className="map-section">
          <ComposableMap projection="geoAlbersUsa" projectionConfig={{ scale: 1000 }}>
            <Geographies geography={usGeoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onClick={() => handleStateClick(geo.properties.name || "Unknown State")}
                    style={{
                      default: { fill: "#D6D6DA", outline: "none" },
                      hover: { fill: "#F53", outline: "none", cursor: "pointer" },
                      pressed: { fill: "#E42", outline: "none" }
                    }}
                  />
                ))
              }
            </Geographies>
          </ComposableMap>
          <div className="info-text">
            <h2>U.S. Map</h2>
            <p>Click on a state to view details.</p>
          </div>
        </div>

        {/* Right: Leaderboard Section */}
        <div className="leaderboard-section">
          <h1>🔥 Top 3 Places in Danger of Fire</h1>
          <ul>
            {topPlaces.map((place, index) => (
              <li key={index} className="place-card">
                <h2>{place.name}</h2>
                <p>{place.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Map;