import * as THREE from "three";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Scene
//1. Va contenir tous les objets (ici la sphère), les lumières et la caméra.
let scene = new THREE.Scene();

// Sphere
//2. Paramètres: rayon, subdivisions en longitude et latitude
//3. Wireframe: mode "fil de fer (true) ou plein (false)"
//5. Du plus rapide au plus lent dans l'ordre ci-dessous
// => important quon a plusieurs objets de lumières
// => en pratique on dépasse rarement 5 lumières

const geometry = new THREE.TorusGeometry(8, 3);
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
const material = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  roughness: 0.55,
  metalness: 0.95,
  //lights: true,
  transparent: true,
});

//Physical Material
/*const material = new THREE.MeshPhysicalMaterial({
  color: 0xffffff,
  roughness: 0.15,
  metalness: 0.15,
  reflectivity: 0.5,
  clearCoat: 0.95,
  clearCoatRoughness: 0.95,
  lights: true,
  flatShading: true,
});*/

const mesh = new THREE.Mesh(geometry, material);
mesh.rotateX(Math.PI / 2);
scene.add(mesh);

// Light
const light = new THREE.PointLight(0xffffff, 1, 100);
//const light = new THREE.DirectionalLight(0xffffff, 1);
//const light = new THREE.SpotLight(0xff0000, 1);
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

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
const loop = () => {
   controls.update();
   renderer.render(scene, camera);
   window.requestAnimationFrame(loop);
};

loop();

gsap.fromTo(mesh.material, {opacity: 0}, {opacity: 1, duration: 2});
gsap.fromTo(mesh.scale, {x: 0, y: 0, z: 0}, {x: 1, y: 1, z: 1, duration: 2, ease: "elastic"});

scene.add(new THREE.AxesHelper(10));
//scene.add(new THREE.PointLightHelper(light));
//scene.add(new THREE.DirectionalLightHelper(light));
scene.add(new THREE.PointLightHelper(light));
scene.add(new THREE.GridHelper(10, 10));

window.addEventListener("mousedown", (event) => {
  console.log("X: " + event.pageX + " / Y: " + event.pageY);
  gsap.to(mesh.material.color, {r: event.pageX / window.innerWidth, g: event.pageY / window.innerHeight, b: 0.5, duration: 1, ease: "elastic"});  
});

//console.log(scene);
