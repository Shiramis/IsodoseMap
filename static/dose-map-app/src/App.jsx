import React, { useState, useRef, useEffect } from 'react';
import { drawTShape } from './Tshape'; // ✅ This must match path


const App = () => {
  const [rows, setRows] = useState([{ angle: '', distance: '', dose: '' }]);
  const [imageSrc, setImageSrc] = useState(null);
  const [center, setCenter] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);

  const svgRef = useRef();
  const sliderRef = useRef();

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
      const response = await fetch('/generate_map', {
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
    <>
      <div className="header-row">
        <h2>Isodose Map Input</h2>
        <div className="button-group">
          <button onClick={addRow}>+</button>
          <button onClick={removeRow}>-</button>
          <button onClick={generateMap}>Generate Map</button>
        </div>
      </div>

      <div className="container" style={{ display: 'flex', alignItems: 'flex-start' }}>
        <div className="data-panel" style={{ minWidth: 320 }}>
          <table id="dataTable">
            <thead>
              <tr>
                <th>Angle (°)</th>
                <th>Distance (m)</th>
                <th>Dose (μSv/hr)</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i}>
                  <td>
                    <input
                      type="number"
                      step="5"
                      min="0"
                      max="360"
                      value={row.angle}
                      onChange={(e) => handleInputChange(i, 'angle', e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      step="1"
                      min="0"
                      max="4.5"
                      value={row.distance}
                      onChange={(e) => handleInputChange(i, 'distance', e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      step="0.1"
                      value={row.dose}
                      onChange={(e) => handleInputChange(i, 'dose', e.target.value)}
                    />
                  </td>
                  <td>
                    <button
                      type="button"
                      onClick={() => removeRowAt(i)}
                      style={{
                        color: 'red',
                        fontSize: '0.85em',
                        padding: '2px 6px',
                        lineHeight: 1,
                        border: 'none',
                        background: 'none',
                        cursor: 'pointer'
                      }}
                      title="Remove row"
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ marginLeft: 0, marginTop: 10 }}>
            <label htmlFor="rotateSlider">Rotate Tube:</label>
            <input
              ref={sliderRef}
              type="range"
              id="rotateSlider"
              min="0"
              max="360"
              value={rotation}
              onChange={(e) => setRotation(e.target.value)}
            />
          </div>
        </div>
        <div className="plot-panel" style={{ marginLeft: 32, position: 'relative', display: 'inline-block' }}>
          <img
            id="doseMap"
            width="700"
            height="590"
            src={imageSrc || ''}
            alt=""
          />
          <svg
            ref={svgRef}
            id="tShape"
            width="700"
            height="590"
            style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}
          >
            <g
              transform={`translate(${center.x}, ${center.y}) rotate(${rotation}, 0, 0)`}
              id="tGroup"
            >
              {/* Horizontal bar */}
              <rect
                x={-50}
                y={-15}
                width={100}
                height={30}
                fill="none"
                stroke="black"
                strokeWidth="1.5"
                strokeOpacity="0.5"
              />
              {/* Vertical bar */}
              <rect
                x={-15}
                y={-15}
                width={30}
                height={120}
                fill="none"
                stroke="black"
                strokeWidth="1.5"
                strokeOpacity="0.5"
              />
              {/* Anode label */}
              <text x={-70} y={-25} fill="red" fontSize="12">
                Anode
              </text>
              {/* Cathode label */}
              <text x={35} y={-25} fill="blue" fontSize="12">
                Cathode
              </text>
            </g>
          </svg>
        </div>
      </div>
    </>
  );
};

export default App;
