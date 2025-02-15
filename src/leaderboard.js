import React from "react";

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

function Index() {
  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <h1 className="text-3xl font-bold text-center mb-6">🔥 Top 3 Places in Danger of Fire</h1>
      <div className="flex flex-col md:flex-row justify-center gap-6">
        {topPlaces.map((place, index) => (
          <PlaceCard key={index} place={place} />
        ))}
      </div>
    </div>
  );
}

function PlaceCard({ place }) {
  return (
    <div className="relative group cursor-pointer border border-gray-300 rounded-lg p-4 bg-white shadow-lg transition-transform transform hover:scale-105">
      {/* Place Name (Visible) */}
      <h2 className="text-xl font-bold text-gray-800">{place.name}</h2>

      {/* Hover Info (Hidden until hover) */}
      <div className="absolute inset-0 bg-black bg-opacity-80 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <h3 className="text-lg font-bold">{place.name}</h3>
        <p className="text-sm px-2 text-center">{place.description}</p>
      </div>
    </div>
  );
}

export default Index;
