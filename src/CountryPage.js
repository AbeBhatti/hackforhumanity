import React from "react";
import { useParams } from "react-router-dom";

function CountryPage() {
  const { countryName } = useParams();  // Get the country name from the URL

  return (
    <div>
      <h1>Country: {countryName}</h1>
      <p>Here you can display fire data and other details about {countryName}.</p>
    </div>
  );
}

export default CountryPage;
