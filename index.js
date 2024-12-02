// Create scene and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 10); // Place camera at the center, slightly back

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('container').appendChild(renderer.domElement);

// Add lighting
const sunlight = new THREE.PointLight(0xffffff, 2, 100); // Sunlight
sunlight.castShadow = true;
scene.add(sunlight);

// Create the Sun
const sunGeometry = new THREE.SphereGeometry(1.5, 32, 32);
const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffd700 });
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

// Create the Earth
const earthGeometry = new THREE.SphereGeometry(0.5, 32, 32);
const earthMaterial = new THREE.MeshStandardMaterial({ color: 0x0077be });
const earth = new THREE.Mesh(earthGeometry, earthMaterial);
earth.castShadow = true;
scene.add(earth);

// Create the Moon
const moonGeometry = new THREE.SphereGeometry(0.2, 32, 32);
const moonMaterial = new THREE.MeshStandardMaterial({ color: 0xaaaaaa });
const moon = new THREE.Mesh(moonGeometry, moonMaterial);
moon.castShadow = true;
scene.add(moon);

// Orbital Parameters
const earthOrbitRadius = 8; // Earth's orbit radius
const earthOrbitSpeed = 0.01; // Earth's orbital speed
let earthAngle = 0;

const moonOrbitRadius = 1.5; // Moon's orbit radius
const moonOrbitSpeed = 0.05; // Moon's orbital speed
let moonAngle = 0;

// Rotation Parameters (World Revolving Around Viewer)
const worldRotationSpeed = 0.005; // Speed of the entire world's rotation
let worldAngle = 0;

// Add OrbitControls for interaction
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.enableZoom = true;

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    // Rotate the entire world around the viewer (camera)
    worldAngle += worldRotationSpeed;

    scene.rotation.y = worldAngle; // Rotate the entire scene

    // Update Earth's orbit around the Sun
    earthAngle += earthOrbitSpeed;
    earth.position.x = earthOrbitRadius * Math.cos(earthAngle);
    earth.position.z = earthOrbitRadius * Math.sin(earthAngle);

    // Update Moon's orbit around the Earth
    moonAngle += moonOrbitSpeed;
    moon.position.x = earth.position.x + moonOrbitRadius * Math.cos(moonAngle);
    moon.position.z = earth.position.z + moonOrbitRadius * Math.sin(moonAngle);

    controls.update();
    renderer.render(scene, camera);
}
animate();

// Handle window resize
// Ensure the renderer and camera adjust on window resize
window.addEventListener('resize', () => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    // Update camera aspect ratio and projection matrix
    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    // Update renderer size
    renderer.setSize(width, height);

    // Optional: Match pixel ratio for sharper rendering on high-DPI devices
    renderer.setPixelRatio(window.devicePixelRatio);
});

