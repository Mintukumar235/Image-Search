import React, { useState } from "react";
import { ChromePicker, SketchPicker } from "react-color";
import "./ColorPickerWithFilter.css"; // Import your CSS file

const ColorPickerWithFilter = ({ color, setColor }) => {
  const handleChange = (newColor) => {
    setColor(newColor.hex);
  };

  return (
    <div className="color-picker-container">
      <SketchPicker color={color} onChange={handleChange} />
    </div>
  );
};

export default ColorPickerWithFilter;
