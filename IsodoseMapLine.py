import numpy as np
import matplotlib.pyplot as plt

# Dose measurements
angles_deg = np.array([0, 45, 90, 135, 180, 225, 270, 315])
dose_1m = np.array([0, 1170, 907, 905, 881, 1110, 1390, 1440])
dose_2m = np.array([103, 259, 182, 280, 269, 403, 316, 226])

# Close the loop by repeating the first point
angles_deg = np.append(angles_deg, angles_deg[0])
dose_1m = np.append(dose_1m, dose_1m[0])
dose_2m = np.append(dose_2m, dose_2m[0])

# Convert degrees to radians
angles_rad = np.deg2rad(angles_deg)

# Plot
plt.figure(figsize=(8, 8))
plt.polar(angles_rad, dose_1m, label='1 m', color='blue', linewidth=2)
plt.polar(angles_rad, dose_2m, label='2 m', color='green', linewidth=2)

# Optional: Mark points
plt.polar(angles_rad, dose_1m, 'bo')
plt.polar(angles_rad, dose_2m, 'go')

# Styling
plt.title('Dose Rate (μSv/hr)')
plt.legend(loc='upper right')
plt.grid(True)
plt.show()
