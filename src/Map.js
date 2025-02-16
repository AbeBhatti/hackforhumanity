import React, { useState, useEffect, useRef } from "react";
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from "react-simple-maps";
import './Map.css'; 

const usGeoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

const coordinatesData = [
  { name: "Napa Valley, CA", coordinates: [-122.286865, 38.297539], radius: 67 },
  { name: "Houston County, TX", coordinates: [-95.692641, 31.195278], radius: 21 },
  { name: "Colleton County, SC", coordinates: [-80.736189, 33.016452], radius: 33 },
  { name: "Leroy Township, IL", coordinates: [-88.799239, 42.476108], radius: 58 },
  { name: "Grover, WI", coordinates: [-90.59884, 45.184038], radius: 56 },
  { name: "Koochiching County, MN", coordinates: [-93.832638, 48.1005], radius: 29 },
  { name: "Juab County, UT", coordinates: [-112.593988, 39.581053], radius: 31},
  { name: "Douglas County, WA", coordinates: [-119.885493, 47.500516], radius: 21 },
  { name: "Esmeralda County, NV", coordinates: [-117.803653, 37.932794], radius: 42 },
  { name: "San Bernandino County, CA", coordinates: [-117.143732, 35.33682], radius: 46 },

];

const DroneStations = [
  { name: "Station A", coordinates: [-118.2437, 34.0522] },
  { name: "Station B", coordinates: [-87.902711, 43.028875] },
  { name: "Station C", coordinates: [-73.9352, 40.7306] },
  { name: "Station D", coordinates: [-123.705256, 39.40871] },
  { name: "Station E", coordinates: [-81.3792, 28.5383] },  
  { name: "Station F", coordinates: [-94.304944, 29.710274] },

];


function Map() {
  const [geoData, setGeoData] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [center, setCenter] = useState([-98.5795, 39.8283]);
  const [clickedCoordinate, setClickedCoordinate] = useState(null);
  const [closestDroneStation, setClosestDroneStation] = useState(null);
  const [showInfoBox, setShowInfoBox] = useState(false); 
  const [droneCount, setDroneCount] = useState(null);    // State for drone count

  const zoomableGroupRef = useRef();

  useEffect(() => {
    fetch(usGeoUrl)
      .then((response) => response.json())
      .then((data) => setGeoData(data))
      .catch((error) => console.error("Error loading map data:", error));
  }, []);

  const scaleRadius = (radius) => {
    const scaleFactor = 0.1;
    return radius * scaleFactor * 2.5;
  };

  const haversine = (coord1, coord2) => {
    const toRad = (x) => (x * Math.PI) / 180;
    const lat1 = coord1[1];
    const lon1 = coord1[0];
    const lat2 = coord2[1];
    const lon2 = coord2[0];

    const R = 6371; 
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; 
  };

  const handleCoordinateClick = (coordinates, radius) => {
    setCenter(coordinates);
    setZoom(5);
    setClickedCoordinate({ coordinates, radius });
  
    const area = Math.PI * Math.pow(radius, 2); 
    const numDrones = Math.round(area / 500); 
  
    let minDistance = Infinity;
    let closestStation = null;
  
    DroneStations.forEach((station) => {
      const distance = haversine(coordinates, station.coordinates);
      if (distance < minDistance) {
        minDistance = distance;
        closestStation = station;
      }
    });

    setClosestDroneStation(closestStation);
    setShowInfoBox(true); 
    setDroneCount(numDrones); 
  };
  

  const handleBackClick = () => {
    setZoom(1);
    setCenter([-98.5795, 39.8283]);
    setClickedCoordinate(null);
    setClosestDroneStation(null);
    setShowInfoBox(false); 
  };

  const zoomIn = () => {
    setZoom((prevZoom) => Math.min(prevZoom + 1, 10));
  };

  const zoomOut = () => {
    setZoom((prevZoom) => Math.max(prevZoom - 1, 1));
  };

  const handleCloseInfoBox = () => {
    setShowInfoBox(false); 
  };

  const sortedCoordinatesData = [...coordinatesData].sort((a, b) => b.radius - a.radius);

  return (
    <div className="map-leaderboard-split">
      <header className="main-title">
        <h1>Ember Alert</h1>
      </header>

      <div className="split-container">
        <div className="map-section">
          {geoData ? (
            <ComposableMap projection="geoAlbersUsa" projectionConfig={{ scale: 1000 }}>
              <ZoomableGroup ref={zoomableGroupRef} zoom={zoom} center={center}>
                <Geographies geography={geoData}>
                  {({ geographies }) =>
                    geographies.map((geo) => (
                      <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      style={{
                        default: {
                          fill: "#a1da8e", 
                          stroke: "#2c3e50",
                          strokeWidth: 0.5,
                          pointerEvents: "none", 
                          },
                        }}
                      />
                    ))
                  }
                </Geographies>

                {coordinatesData.map((data, index) => (
                  <Marker key={index} coordinates={data.coordinates}>
                    {/* Add radius circle */}
                    <circle
                      r={scaleRadius(data.radius)}
                      fill="red"
                      fillOpacity={0.3}
                      stroke="red"
                      strokeWidth={1}
                      className="radius-circle"
                      onClick={() => handleCoordinateClick(data.coordinates, data.radius)} 
                    />
                    {/* Add clickable small circle */}
                    <circle
                      r={scaleRadius(2)}
                      fill="red"
                      className="clickable-circle"
                      onClick={() => handleCoordinateClick(data.coordinates, data.radius)} // Same click handler as leaderboard
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

                {/* Drone Stations */}
                {DroneStations.map((station, index) => (
                  <Marker key={index} coordinates={station.coordinates}>
                    <circle
                      r={5}
                      fill="blue"
                      className="station-circle"
                      //onClick={() => handleCoordinateClick(station.coordinates, 0)} // Handling station click
                    />
                    <text
                      textAnchor="middle"
                      y={-10}
                      style={{ fontSize: 10, fontWeight: "bold", fill: "blue" }}
                    >
                      {station.name}
                    </text>
                  </Marker>
                ))}
              </ZoomableGroup>
            </ComposableMap>
          ) : (
            <p>Loading map...</p>
          )}
        </div>

        <div className="leaderboard-section">
          <h1 className="leaderboard-header"> Highest Risk of Wildfire - August 2020</h1>
          <ul>
            {sortedCoordinatesData.map((place, index) => (
              <li
                key={index}
                className="place-card"
                onClick={() => handleCoordinateClick(place.coordinates, place.radius)} // Same click handler as circles
              >
                <h2>{place.name}</h2>
                <p>Coordinates: {place.coordinates.join(", ")}</p>
                <p><strong>Radius:</strong> {place.radius} miles</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {showInfoBox && clickedCoordinate && closestDroneStation && (
        <div className="info-box">
          <button className="close-btn" onClick={handleCloseInfoBox}>X</button>
          <h3>Place Information</h3>
          <p><strong>Coordinates:</strong> {clickedCoordinate.coordinates.join(", ")}</p>
          <p><strong>Radius:</strong> {clickedCoordinate.radius} miles</p>
          <p><strong>Closest Drone Station:</strong> {closestDroneStation.name}</p>
          <p><strong>Drones to be sent:</strong> {droneCount} drones</p> {/* Added this line */}
        </div>
      )}


      {/* Always visible Back to U.S. Map button */}
        <div className="back-button">
          <button onClick={handleBackClick} className="btn-back">
            &#8592; Back to U.S. Map
          </button>
      </div>


      <div className="zoom-buttons">
        <button onClick={zoomIn} className="btn-zoom">+</button>
        <button onClick={zoomOut} className="btn-zoom">-</button>
      </div>
    </div>
  );
}

export default Map;