import * as THREE from 'three';

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl');
if (!canvas) {
    console.error("Canvas element not found!");
}

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff); // Set the background color to white

/**
 * Lighting
 */
const ambientLight = new THREE.AmbientLight(0x404040, 1); // Ambient light
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1); // Directional light
directionalLight.position.set(5, 5, 5).normalize();
scene.add(directionalLight);

/**
 * Create Group to Contain All Objects
 */
const group = new THREE.Group();
scene.add(group);

/**
 * Create Pyramid Geometry (First Pyramid)
 */
const pyramidHeight1 = 5; // Height of the first pyramid
const pyramidRadius1 = 2; // Base radius of the first pyramid
const geometry1 = new THREE.ConeGeometry(pyramidRadius1, pyramidHeight1, 4);

const materials1 = new THREE.MeshStandardMaterial({ color: 0xdddddd, metalness: 0.8, roughness: 0.3 });
const pyramid1 = new THREE.Mesh(geometry1, materials1);
pyramid1.position.set(-4, pyramidHeight1 / 2, -4);
group.add(pyramid1);

/**
 * Create Pyramid Geometry (Second Pyramid)
 */
const pyramidHeight2 = 4;
const pyramidRadius2 = 1.5;
const geometry2 = new THREE.ConeGeometry(pyramidRadius2, pyramidHeight2, 4);

const materials2 = new THREE.MeshStandardMaterial({ color: 0xf0f8ff, metalness: 0.8, roughness: 0.4 });
const pyramid2 = new THREE.Mesh(geometry2, materials2);
pyramid2.position.set(4, pyramidHeight2 / 2, 4);
group.add(pyramid2);

/**
 * Create Pyramid Geometry (Third Pyramid - Slowest Rotation)
 */
const pyramidHeight3 = 3;
const pyramidRadius3 = 1;
const geometry3 = new THREE.ConeGeometry(pyramidRadius3, pyramidHeight3, 4);

const materials3 = new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 0.8, roughness: 0.3 });
const pyramid3 = new THREE.Mesh(geometry3, materials3);
pyramid3.position.set(0, pyramidHeight3 / 2, -8);
group.add(pyramid3);

// 4th pyramid 

/**
 * Create Floating Bubbles (Spheres) with Different Sizes and Colors
 */
const createFloatingBubble = (x, y, z, size, color) => {
    const geometry = new THREE.SphereGeometry(size, 32, 32);
    const material = new THREE.MeshStandardMaterial({
        color: color,
        opacity: 0.8,
        transparent: true,
        metalness: 0.5,
        roughness: 0.2
    });
    const sphere = new THREE.Mesh(geometry, material);
    sphere.position.set(x, y, z);

    // Storing original position for later use
    sphere.originalPosition = sphere.position.clone();

    // Adding velocity properties for interaction
    sphere.velocity = new THREE.Vector3(0, 0, 0); // Initialize velocity vector

    return sphere;
};

// Create and position floating bubbles
const bubble1 = createFloatingBubble(-3, 6, 0, 0.5, new THREE.Color(0x808080)); // Medium gray
const bubble2 = createFloatingBubble(2, 7, 3, 0.8, new THREE.Color(0x404040)); // Dark gray
const bubble3 = createFloatingBubble(-5, 6, -5, 0.4, new THREE.Color(0xb0b0b0)); // Light gray
const bubble4 = createFloatingBubble(4, 5, -3, 1, new THREE.Color(0x696969)); // Dim gray
const bubble5 = createFloatingBubble(0, 8, 5, 0.6, new THREE.Color(0x303030)); // Darker gray

group.add(bubble1);
group.add(bubble2);
group.add(bubble3);
group.add(bubble4);
group.add(bubble5);

/**
 * Create Grid Helper
 */
const gridHelper = new THREE.GridHelper(20, 20);  // Grid size and divisions
gridHelper.position.set(0, 0, 0);  // Positioning the grid in the scene
group.add(gridHelper);

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,  // Full screen width
    height: window.innerHeight // Full screen height
};

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.set(0, 5, 10);
camera.lookAt(0, 2, 0);
scene.add(camera);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
});
renderer.setSize(sizes.width, sizes.height);
document.body.appendChild(renderer.domElement); // Ensure the renderer is appended to the body

/**
 * Interaction Variables
 */
let isInteracting = false;
let previousMousePosition = { x: 0, y: 0 };
const moveSpeed = 0.01; // Speed of movement when interacting

/**
 * Event Listeners for Interaction
 */
canvas.addEventListener('mousedown', (event) => {
    isInteracting = true;
    previousMousePosition.x = event.clientX;
    previousMousePosition.y = event.clientY;
});

canvas.addEventListener('mouseup', () => {
    isInteracting = false;
});

canvas.addEventListener('mousemove', (event) => {
    if (!isInteracting) return;

    const deltaX = event.clientX - previousMousePosition.x;
    const deltaY = event.clientY - previousMousePosition.y;

    // Move the entire group based on mouse movement
    group.position.x += deltaX * moveSpeed;
    group.position.y -= deltaY * moveSpeed;

    previousMousePosition.x = event.clientX;
    previousMousePosition.y = event.clientY;
});

canvas.addEventListener('touchstart', (event) => {
    isInteracting = true;
    const touch = event.touches[0];
    previousMousePosition.x = touch.clientX;
    previousMousePosition.y = touch.clientY;
});

canvas.addEventListener('touchend', () => {
    isInteracting = false;
});

canvas.addEventListener('touchmove', (event) => {
    if (!isInteracting) return;

    const touch = event.touches[0];
    const deltaX = touch.clientX - previousMousePosition.x;
    const deltaY = touch.clientY - previousMousePosition.y;

    // Move the entire group based on touch movement
    group.position.x += deltaX * moveSpeed;
    group.position.y -= deltaY * moveSpeed;

    previousMousePosition.x = touch.clientX;
    previousMousePosition.y = touch.clientY;
});

/**
 * Update spheres to make them bounce and return to their original position
 */
const updateBubbles = () => {
    const bubbles = [bubble1, bubble2, bubble3, bubble4, bubble5];

    bubbles.forEach(bubble => {
        // Simulate slight random movement when interacted
        if (isInteracting) {
            bubble.velocity.y += Math.random() * 0.02 - 0.01;  // Slight random disturbance
            bubble.velocity.x += Math.random() * 0.02 - 0.01;
        }

        // Update the position of each bubble with their velocity
        bubble.position.add(bubble.velocity);

        // Simulate gravity for bubbles
        bubble.velocity.y -= 0.001; // Gravity

        // Return the bubble to its original position smoothly
        bubble.position.lerp(bubble.originalPosition, 0.05); // Lerp towards original position

        // Optional: Bounce off the ground (y = 0)
        if (bubble.position.y <= 0) {
            bubble.position.y = 0;
            bubble.velocity.y = -bubble.velocity.y * 0.3;  // Reduce bounce factor
        }
    });
};

/**
 * Animate
 */
const animate = () => {
    // Rotate pyramids individually
    pyramid1.rotation.y += 0.01; // Fast rotation
    pyramid2.rotation.y += 0.03; // Medium rotation
    pyramid3.rotation.y += 0.005; // Slow rotation

    // Update the positions of the bubbles to make them move smoothly
    updateBubbles();

    // Render the scene
    renderer.render(scene, camera);

    // Call the animate function again on the next frame
    window.requestAnimationFrame(animate);
};

animate();