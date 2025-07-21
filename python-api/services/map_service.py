import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib import cm
from scipy.interpolate import griddata
import io
import base64

def generate_map_image(data):
    try:
        
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

        cbar = fig.colorbar(contour, ax=ax, fraction=0.05, pad=0.03)
        cbar.set_label("Normalized Dose")
        ax.set_title("Isodose Map")
        ax.set_xlabel("x (m)")
        ax.set_ylabel("y (m)")
        ax.axis("equal")
        ax.grid(True)
        fig.canvas.draw()

        width, height = fig.get_size_inches() * fig.dpi
        x0_data_px, y0_data_px = ax.transData.transform((0, 0))
        zero_x_fig, zero_y_fig = fig.transFigure.inverted().transform((x0_data_px, y0_data_px))

        x0_px = width - x0_data_px
        y0_px = height - y0_data_px

        polar_size = 0.6
        polar_left = zero_x_fig - polar_size / 2
        polar_bottom = zero_y_fig - polar_size / 2

        axp = fig.add_axes([polar_left, polar_bottom, polar_size, polar_size], polar=True, frameon=False)
        axp.set_rlim(0, 4)
        axp.set_yticks([0, 2, 4])
        axp.set_yticklabels([])
        axp.grid(True, linestyle='--', alpha=0.7)

        buf = io.BytesIO()
        fig.savefig(buf, format="png", dpi=100)
        plt.close(fig)
        buf.seek(0)
        img_base64 = base64.b64encode(buf.read()).decode("utf-8")

        return {"image": img_base64, "x0_px": x0_px, "y0_px": y0_px}
 
    except Exception as e:
        return {"error": str(e)}
