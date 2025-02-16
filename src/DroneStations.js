import React from "react";
import { Marker } from "react-simple-maps";

// Sample drone stations data (You should update this with actual data if available)
const DroneStations = [
  { name: "Station A", coordinates: [-118.2437, 34.0522] }, // Example coordinates
  { name: "Station B", coordinates: [-122.4194, 37.7749] },
  { name: "Station C", coordinates: [-73.9352, 40.7306] },
  { name: "Station D", coordinates: [-75.1652, 39.9526] },
  { name: "Station E", coordinates: [-81.3792, 28.5383] },
];

function DroneStationsComponent({ handleStationClick }) {
  return (
    <>
      {DroneStations.map((station, index) => (
        <Marker
          key={index}
          coordinates={station.coordinates}
          onClick={() => handleStationClick(station.coordinates, 0)}
        >
          <circle
            r={5}
            fill="blue"
            className="drone-station-circle"
            stroke="black"
            strokeWidth={1}
          />
          <text
            textAnchor="middle"
            y={-10}
            style={{ fontSize: 8, fontWeight: "bold", fill: "blue" }}
          >
            {station.name}
          </text>
        </Marker>
      ))}
    </>
  );
}

export default DroneStationsComponent;
