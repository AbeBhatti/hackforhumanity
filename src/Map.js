import React from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { useNavigate } from "react-router-dom";
import './Map.css'; 

const geoUrl = "./assets/california-geojson.json"; 

function Map() {
  const navigate = useNavigate();

  const handleCountyClick = (countyName) => {
    navigate(`/county/${countyName}`);
  };

  return (
    <div className="map-container">
      <ComposableMap 
        projection="geoMercator" 
        projectionConfig={{ scale: 1200 }}
        className="composable-map" 
      >
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                onClick={() => handleCountyClick(geo.properties.name)}
                style={{
                  default: {
                    fill: "#D6D6DA",
                    outline: "none",
                  },
                  hover: {
                    fill: "#F53",
                    outline: "none",
                  },
                  pressed: {
                    fill: "#E42",
                    outline: "none",
                  },
                }}
              />
            ))
          }
        </Geographies>
      </ComposableMap>

      <div className="info-text">
        <h2>California Counties Map</h2>
        <p>Click on any county to view more information.</p>
      </div>
    </div>
  );
}

export default Map;
