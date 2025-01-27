import * as THREE from 'three';


// Scene
//1. Va contenir tous les objets (ici la sphère), les lumières et la caméra.
let scene = new THREE.Scene();


// Sphere
//2. Paramètres: rayon, subdivisions en longitude et latitude
//3. Wireframe: mode "fil de fer (true) ou plein (false)"
const geometry = new THREE.SphereGeometry(3, 16, 16);
const material = new THREE.MeshBasicMaterial({
   color: 0xffffff,
   wireframe: true,
});
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);


// Light
const light = new THREE.PointLight(0xffffff, 1, 100);
light.position.set(0, 10, 10);
scene.add(light);
const aLight = new THREE.AmbientLight(0x151515);
scene.add(aLight);


// Camera
const camera = new THREE.PerspectiveCamera(45, 800 / 600);
camera.position.z = 20;
scene.add(camera);


// Renderer
const canvas = document.querySelector(".webgl");
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(800, 600);
renderer.render(scene, camera);

console.log(scene);