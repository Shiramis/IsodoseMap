from flask import Flask, render_template, request, jsonify
import numpy as np
import matplotlib.pyplot as plt
from matplotlib import cm
from scipy.interpolate import griddata
import io
import base64

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/generate_map', methods=['POST'])
def generate_map():
    data = request.get_json()

    angles = np.array([float(item['angle']) for item in data])
    distances = np.array([float(item['distance']) for item in data])
    doses = np.array([float(item['dose']) for item in data])

    angles_rad = np.deg2rad(angles)
    x = distances * np.cos(angles_rad)
    y = distances * np.sin(angles_rad)

    normalized_dose = doses / np.nanmax(doses)
    grid_x, grid_y = np.mgrid[-4:4:300j, -4:4:300j]
    grid_dose = griddata((x, y), normalized_dose, (grid_x, grid_y), method='cubic')

    fig, ax = plt.subplots(figsize=(7, 5.9), dpi=100)
    contour = ax.contourf(grid_x, grid_y, grid_dose, levels=np.linspace(0, 1, 100), cmap=cm.inferno)

    # Add colorbar next to the plot to represent dose levels
    cbar = fig.colorbar(contour, ax=ax, fraction=0.05, pad=0.03)
    cbar.set_label("Normalized Dose")

    ax.set_title("2D Isodose Map")
    ax.set_xlabel("x (m)")
    ax.set_ylabel("y (m)")
    ax.axis("equal")
    ax.grid(True)
    # Draw to compute layout
    fig.canvas.draw()

    # Get figure size in pixels
    width, height = fig.canvas.get_width_height()
    # Transform (0,0) data coordinate into pixel coordinate
    x0_data_px, y0_data_px = ax.transData.transform((0, 0))
    # Flip y-axis to match top-left HTML origin
    x0_px = width - x0_data_px
    y0_px = height - y0_data_px

    buf = io.BytesIO()
    fig.savefig(buf, format="png", dpi=100)
    plt.close(fig)
    buf.seek(0)
    img_base64 = base64.b64encode(buf.read()).decode("utf-8")
    print(x0_px, y0_px)

    return jsonify({"image": img_base64, "x0_px": x0_px, "y0_px": y0_px})

if __name__ == '__main__':
    app.run(debug=True)
