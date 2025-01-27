import * as THREE from "three";

// Scene
//1. Va contenir tous les objets (ici la sphère), les lumières et la caméra.
let scene = new THREE.Scene();

// Sphere
//2. Paramètres: rayon, subdivisions en longitude et latitude
//3. Wireframe: mode "fil de fer (true) ou plein (false)"
//5. Du plus rapide au plus lent dans l'ordre ci-dessous
// => important quon a plusieurs objets de lumières
// => en pratique on dépasse rarement 5 lumières

const geometry = new THREE.SphereGeometry(6, 32, 32);
/*const material = new THREE.MeshBasicMaterial({
   color: 0xffffff,
   wireframe: true,
});*/

//Lambert Material
/*const material = new THREE.MeshLambertMaterial({
  color: 0xffffff,
  emissive: 0x000000,
  emissiveIntensity: 1,
  lights: true,
});*/

//Phong Material
/*const material = new THREE.MeshPhongMaterial({
  color: 0xffffff,
  specular: 0xffffff,
  shininess: 30,
  lights: true,
});*/

//Standard Material
/*const material = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  roughness: 0.15,
  metalness: 0.5,
  lights: true,
});*/

//Physical Material
const material = new THREE.MeshPhysicalMaterial({
  color: 0xffffff,
  roughness: 0.15,
  metalness: 0.15,
  reflectivity: 0.5,
  clearCoat: 0.95,
  clearCoatRoughness: 0.95,
  lights: true,
  flatShading: true,
});

const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// Light
const light = new THREE.PointLight(0xffffff, 1, 100);
light.position.set(10, 10, 10); //X, Y, Z
scene.add(light);
const aLight = new THREE.AmbientLight(0x151515); //Lumière en-dessous de la sphère
scene.add(aLight);

// Camera
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight
);
camera.position.z = 20;
scene.add(camera);

// Renderer
const canvas = document.querySelector(".webgl");
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.render(scene, camera);

//Modifier la résolution selon la taille de la fenêtre
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.render(scene, camera);
});

let angleLight = 0;

const loop = () => {
  // Ajoutez ci-dessous le code pour faire tourner la sphère
  //mesh.rotateY(0.01);
  light.position.x = 10 * Math.cos(angleLight);
  light.position.z = 10 * Math.sin(angleLight);
  renderer.render(scene, camera);
  angleLight += 0.002;
  window.requestAnimationFrame(loop);
};
loop();

//console.log(scene);
