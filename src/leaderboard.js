// Leaderboard.js
import React from "react";
import "./Leaderboard.css";

const topPlaces = [
  { 
    name: "Butte County", 
    description: "Severe fire risk due to dry conditions and strong winds." 
  },
  { 
    name: "Lake County", 
    description: "High fire risk from drought and low humidity." 
  },
  { 
    name: "Shasta County", 
    description: "Moderate fire risk from recent heatwaves and dry brush." 
  },
];

function Leaderboard() {
  return (
    <div className="leaderboard">
      <h1 className="leaderboard-title">🔥 Top 3 Places in Danger of Fire</h1>
      <div className="leaderboard-list">
        {topPlaces.map((place, index) => (
          <PlaceCard key={index} place={place} />
        ))}
      </div>
    </div>
  );
}

function PlaceCard({ place }) {
  return (
    <div className="place-card">
      <h2 className="place-name">{place.name}</h2>
      <div className="place-details">
        <h3>{place.name}</h3>
        <p>{place.description}</p>
      </div>
    </div>
  );
}

export default Leaderboard;
