// src/pages/Map.js
import React, { useState, useEffect, useRef } from "react";
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from "react-simple-maps";
import './Map.css';

const usGeoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

// Sample data for coordinates and radius (10 samples)
const coordinatesData = [
  { name: "Butte County, CA", coordinates: [-121.635, 39.557], radius: 50 },
  { name: "Lake County, CA", coordinates: [-122.650, 39.000], radius: 30 },
  { name: "Shasta County, CA", coordinates: [-122.431, 40.589], radius: 40 },
  { name: "Miami-Dade County, FL", coordinates: [-80.1918, 25.7617], radius: 60 },
  { name: "Cook County, IL", coordinates: [-87.6298, 41.8781], radius: 45 },
  { name: "Harris County, TX", coordinates: [-95.3698, 29.7604], radius: 55 },
  { name: "King County, WA", coordinates: [-122.3321, 47.6062], radius: 35 },
  { name: "Maricopa County, AZ", coordinates: [-112.074, 33.4484], radius: 50 },
  { name: "Clark County, NV", coordinates: [-115.1398, 36.1699], radius: 65 },
  { name: "Allegheny County, PA", coordinates: [-80.032, 40.4406], radius: 40 },
];

function Map() {
  const [geoData, setGeoData] = useState(null);
  const [zoom, setZoom] = useState(1); // Start with a zoom level of 1
  const [center, setCenter] = useState([-98.5795, 39.8283]); // Default center of the US
  const [clickedCoordinate, setClickedCoordinate] = useState(null); // Track clicked coordinate for zoom

  const zoomableGroupRef = useRef(); // Ref to control zoom and center manually

  // Fetch geo data manually to handle errors
  useEffect(() => {
    fetch(usGeoUrl)
      .then((response) => response.json())
      .then((data) => setGeoData(data))
      .catch((error) => console.error("Error loading map data:", error));
  }, []);

  // Adjust radius based on zoom level
  const scaleRadius = (radius) => {
    const scaleFactor = 0.028; // Adjust this value for desired scale
    return radius * scaleFactor * zoom;
  };

  // Handle coordinate click to zoom and highlight radius
  const handleCoordinateClick = (coordinates, radius) => {
    setCenter(coordinates); // Set center to the clicked coordinate
    setZoom(5); // Set zoom high enough to focus on the radius area
    setClickedCoordinate({ coordinates, radius }); // Store the clicked coordinate and radius
  };

  // Handle back button click to return to the main map view
  const handleBackClick = () => {
    setZoom(1); // Reset zoom to default
    setCenter([-98.5795, 39.8283]); // Reset center to default (US)
    setClickedCoordinate(null); // Reset clicked coordinate
  };

  return (
    <div className="map-leaderboard-split">
      <header className="main-title">
        <h1>Ember Explorer</h1>
      </header>

      <div className="split-container">
        {/* Left: Interactive U.S. Map */}
        <div className="map-section">
          {geoData ? (
            <ComposableMap projection="geoAlbersUsa" projectionConfig={{ scale: 1000 }}>
              <ZoomableGroup
                ref={zoomableGroupRef}
                zoom={zoom}
                center={center}
              >
                <Geographies geography={geoData}>
                  {({ geographies }) =>
                    geographies.map((geo) => {
                      return (
                        <Geography
                          key={geo.rsmKey}
                          geography={geo}
                          style={{
                            default: { fill: "#D6D6DA", outline: "none" }, // Default color for states
                            hover: { fill: "#D6D6DA", outline: "none" }, // Remove hover effect
                            pressed: { fill: "#D6D6DA", outline: "none" } // Remove pressed effect
                          }}
                        />
                      );
                    })
                  }
                </Geographies>

                {/* Render coordinates as markers */}
                {coordinatesData.map((data, index) => (
                  <Marker key={index} coordinates={data.coordinates}>
                    <circle
                      r={scaleRadius(data.radius)} // Adjust the radius based on zoom level
                      fill="red"
                      fillOpacity={0.3}
                      stroke="red"
                      strokeWidth={1}
                    />
                    <circle
                      r={scaleRadius(2)} // Make the small dot clickable (scaled)
                      fill="red"
                      onClick={() => handleCoordinateClick(data.coordinates, data.radius)}
                    />
                    <text
                      textAnchor="middle"
                      y={-10}
                      style={{ fontSize: 10, fontWeight: "bold", fill: "red" }}
                    >
                      {data.name}
                    </text>
                  </Marker>
                ))}
              </ZoomableGroup>
            </ComposableMap>
          ) : (
            <p>Loading map...</p>
          )}
          <div className="info-text">
            <h2>U.S. Map</h2>
            <p>Click on a coordinate to zoom in and view the area.</p>
          </div>
        </div>

        {/* Right: Leaderboard Section */}
        <div className="leaderboard-section">
          <h1>🔥 Top 10 Places in Danger of Fire</h1>
          <ul>
            {coordinatesData.map((place, index) => (
              <li key={index} className="place-card" onClick={() => handleCoordinateClick(place.coordinates, place.radius)}>
                <h2>{place.name}</h2>
                <p>Coordinates: {place.coordinates.join(", ")}</p>
                <p>Radius: {place.radius} miles</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Back Button for Zoomed-In Area */}
      {clickedCoordinate && (
        <div className="back-button">
          <button onClick={handleBackClick} className="btn-back">
            &#8592; Back to U.S. Map
          </button>
        </div>
      )}
    </div>
  );
}

export default Map;
