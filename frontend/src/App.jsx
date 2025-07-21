import React, { useState, useRef, useEffect } from 'react';
import { drawTShape } from './Tshape'; // ✅ This must match path
import Login from './auth/Login';
import LoadPopup from './auth/LoadPopup';


const App = () => {
  const [user, setUser] = useState(null);
  const [rows, setRows] = useState([{ angle: '', distance: '', dose: '' }]);
  const [imageSrc, setImageSrc] = useState(null);
  const [center, setCenter] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);

  const svgRef = useRef();
  const sliderRef = useRef();

  const handleSelectMap = (map) => {
    setRows(map.data.rows);
    setImageSrc(`data:image/png;base64,${map.imageBase64}`);
  };

  const addRow = () => {
    setRows([...rows, { angle: '', distance: '', dose: '' }]);
  };

  const removeRow = () => {
    if (rows.length > 1) setRows(rows.slice(0, -1));
    else alert("At least one data row must remain.");
  };

  const removeRowAt = (index) => {
    if (rows.length > 1) {
      setRows(rows.filter((_, i) => i !== index));
    } else {
      alert("At least one data row must remain.");
    }
  };

  const handleInputChange = (index, field, value) => {
    const updated = [...rows];
    updated[index][field] = value;
    setRows(updated);
  };
  // Function to generate the isodose map
  const generateMap = async () => {
    const yourData = rows
      .filter(r => r.angle && r.distance && r.dose)
      .map(r => ({
        angle: parseFloat(r.angle),
        distance: parseFloat(r.distance),
        dose: parseFloat(r.dose)
      }));
    
    try {
      const response = await fetch('/generate_map_image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(yourData),
      });

      const result = await response.json();

      if (result.image) {
        const img = document.getElementById("doseMap");
        const svg = document.getElementById("tShape"); 

        img.src = "data:image/png;base64," + result.image;
        img.style.display = "block";

        img.onload = () => {
          svg.setAttribute("width", img.width);
          svg.setAttribute("height", img.height);
          const x = img.width - result.x0_px;
          const y = result.y0_px;
          setCenter({ x, y });
          drawTShape(x, y);
        };
      } else {
        alert(result.error || "Error generating map.");
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  useEffect(() => {
    // Optional: reset rotation when new center is set
    setRotation(0);
  }, [center]);

  return (
    <IsodosePanel
      user={user}
      setUser={setUser}
      rows={rows}
      setRows={setRows}
      imageSrc={imageSrc}
      center={center}
      rotation={rotation}
      setRotation={setRotation}
      svgRef={svgRef}
      sliderRef={sliderRef}
      handleInputChange={handleInputChange}
      removeRowAt={removeRowAt}
      addRow={addRow}
      removeRow={removeRow}
      generateMap={generateMap}
      handleSelectMap={handleSelectMap}
    />
  );
};

export default App;
