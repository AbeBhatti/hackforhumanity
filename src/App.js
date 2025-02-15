import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Map from "./Map";  
import CountryPage from "./CountryPage";  // Country detail page

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Map />} />
        <Route path="/country/:countryName" element={<CountryPage />} />
      </Routes>
    </Router>
  );
}

export default App;
