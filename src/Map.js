import React from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { useNavigate } from "react-router-dom";

const geoUrl = "https://raw.githubusercontent.com/d3/d3-geo/master/examples/world-110m.json";

function Map() {
  const navigate = useNavigate();

  const handleCountryClick = (countryName) => {
    navigate(`/country/${countryName}`);
  };

  return (
    <div className="map-container">
      <ComposableMap projection="geoMercator" projectionConfig={{ scale: 150 }}>
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                onClick={() => handleCountryClick(geo.properties.name)} 
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
    </div>
  );
}

export default Map;
