import numpy as np
import json
from http.server import SimpleHTTPRequestHandler, HTTPServer

# Define constants
radius = 1.0
num_points = 50

# Generate sphere
def generate_sphere(radius, num_points):
    theta = np.linspace(0, np.pi, num_points)
    phi = np.linspace(0, 2 * np.pi, num_points)
    theta, phi = np.meshgrid(theta, phi)
    x = radius * np.sin(theta) * np.cos(phi)
    y = radius * np.sin(theta) * np.sin(phi)
    z = radius * np.cos(theta)
    return x.flatten().tolist(), y.flatten().tolist(), z.flatten().tolist()

# Rotate points
def rotation_matrix(axis, theta):
    axis = np.array(axis)
    axis = axis / np.linalg.norm(axis)
    a = np.cos(theta / 2)
    b, c, d = -axis * np.sin(theta / 2)
    return np.array([
        [a*a + b*b - c*c - d*d, 2 * (b*c - a*d), 2 * (b*d + a*c)],
        [2 * (b*c + a*d), a*a + c*c - b*b - d*d, 2 * (c*d - a*b)],
        [2 * (b*d - a*c), 2 * (c*d + a*b), a*a + d*d - b*b - c*c]
    ])

def rotate_points(x, y, z, axis, theta):
    rot_matrix = rotation_matrix(axis, theta)
    points = np.array([x, y, z])
    rotated = rot_matrix @ points
    return rotated[0].tolist(), rotated[1].tolist(), rotated[2].tolist()

# Calculate and save sphere data
x, y, z = generate_sphere(radius, num_points)
rotated_x, rotated_y, rotated_z = rotate_points(x, y, z, [0, 1, 0], np.radians(45))

sphere_data = {
    "original": {"x": x, "y": y, "z": z},
    "rotated": {"x": rotated_x, "y": rotated_y, "z": rotated_z},
}

with open("sphere_data.json", "w") as f:
    json.dump(sphere_data, f)

# Serve the project
port = 8000
print(f"Serving on http://localhost:{port}")
server = HTTPServer(('localhost', port), SimpleHTTPRequestHandler)
server.serve_forever()
