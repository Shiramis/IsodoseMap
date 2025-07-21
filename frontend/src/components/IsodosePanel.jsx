import React from 'react';
import Login from '../auth/Login';
import LoadPopup from '../auth/LoadPopup';

const IsodosePanel = ({
  user,
  setUser,
  rows,
  setRows,
  imageSrc,
  center,
  rotation,
  setRotation,
  svgRef,
  sliderRef,
  handleInputChange,
  removeRowAt,
  addRow,
  removeRow,
  generateMap,
  handleSelectMap,
}) => {
  return (
    <>
      {!user ? (
        <Login setUser={setUser} />
      ) : (
        <>
          <div className="header-row">
            <h2>Isodose Map Input</h2>
            <div className="button-group">
              <button onClick={addRow}>+</button>
              <button onClick={removeRow}>-</button>
              <button onClick={generateMap}>Generate Map</button>
            </div>
          </div>

          <LoadPopup userId={user.id} onSelect={handleSelectMap} />

          <div className="user-info">
            <h3>Welcome, {user.name}</h3>
            <button onClick={() => setUser(null)}>Logout</button>
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
              <img id="doseMap" width="700" height="590" src={imageSrc || ''} alt="" />
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
                  <text x={-70} y={-25} fill="red" fontSize="12">Anode</text>
                  <text x={35} y={-25} fill="blue" fontSize="12">Cathode</text>
                </g>
              </svg>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default IsodosePanel;
