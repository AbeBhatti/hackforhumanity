import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Map from "./Map"; // Importing Map component

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Map />} />  {/* Route for Map */}
      </Routes>
    </Router>
  );
}

export default App;
