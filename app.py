from flask import Flask, render_template, request, jsonify
import numpy as np
import matplotlib
matplotlib.use('Agg')  # Use a non-GUI backend
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
    if not data:
        return jsonify({"error": "No data provided"}), 400
    # Extract angles, distances, and doses from the JSON data
    if not all(key in data[0] for key in ['angle', 'distance', 'dose']):
        return jsonify({"error": "Invalid data format"}), 400
    # Convert data to numpy arrays
    angles = np.array([float(item['angle']) for item in data])
    distances = np.array([float(item['distance']) for item in data])
    doses = np.array([float(item['dose']) for item in data])

    # Convert polar coordinates to Cartesian coordinates
    angles_rad = np.deg2rad(angles)
    x = distances * np.cos(angles_rad)
    y = distances * np.sin(angles_rad)

    # Normalize doses to the range [0, 1]
    normalized_dose = doses / np.nanmax(doses)
    grid_x, grid_y = np.mgrid[-4:4:300j, -4:4:300j]
    grid_dose = griddata((x, y), normalized_dose, (grid_x, grid_y), method='cubic')
    
    # Create a contour plot
    fig, ax = plt.subplots(figsize=(7, 5.9), dpi=100)
    contour = ax.contourf(grid_x, grid_y, grid_dose, levels=np.linspace(0, 1, 100), cmap=cm.inferno)
   
    # Add colorbar next to the plot to represent dose levels
    cbar = fig.colorbar(contour, ax=ax, fraction=0.05, pad=0.03)
    cbar.set_label("Normalized Dose")
    # Add a title and labels
    ax.set_title("Isodose Map")
    ax.set_xlabel("x (m)")
    ax.set_ylabel("y (m)")
    ax.axis("equal")
    ax.grid(True)
    fig.canvas.draw()
    # Get figure size in pixels
    width, height = fig.get_size_inches() * fig.dpi
    # Transform (0,0) data coordinate into pixel coordinate
    x0_data_px, y0_data_px = ax.transData.transform((0, 0))
    zero_x_fig, zero_y_fig = fig.transFigure.inverted().transform((x0_data_px, y0_data_px))
    # Flip y-axis to match top-left HTML origin
    x0_px = width - x0_data_px
    y0_px = height - y0_data_px
    polar_size = 0.6
    # Define left, bottom so that center aligns with (0,0)
    polar_left = zero_x_fig - polar_size / 2
    polar_bottom = zero_y_fig - polar_size / 2
    # Add polar plot with tight frame and no background
    axp = fig.add_axes([polar_left, polar_bottom, polar_size, polar_size], polar=True, frameon=False)
    axp.set_rlim(0, 4)
    axp.set_yticks([0, 2, 4])
    axp.set_yticklabels([])
    axp.grid(True, linestyle='--', alpha=0.7)
    # Convert figure to PNG
    buf = io.BytesIO() # Create a buffer to save the image
    fig.savefig(buf, format="png", dpi=100)
    plt.close(fig)
    buf.seek(0) # Rewind the buffer to the beginning
    img_base64 = base64.b64encode(buf.read()).decode("utf-8") # Encode the image to base64

    return jsonify({"image": img_base64, "x0_px": x0_px, "y0_px": y0_px})

if __name__ == '__main__':
    app.run(debug=True)
