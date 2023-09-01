import React, { useState } from "react";
import Form from "react-bootstrap/Form";

function ImageSearchInput({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = () => {
    onSearch(searchTerm);
  };

  return (
    <div>
      <h2>Image Search</h2>
      <input
        type="text"
        placeholder="Search by title or Keyword"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <button onClick={handleSearch}>Search</button>
    </div>
  );
}

export default ImageSearchInput;
