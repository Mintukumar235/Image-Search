import React from "react";
import ImageSearch from "./components/ImageSection/ImageSearch";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";


function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<ImageSearch />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
