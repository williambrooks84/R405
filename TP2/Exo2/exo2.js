import * as THREE from "three";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import Stats from 'three/addons/libs/stats.module.js';


const scene = new THREE.Scene();

// an array of objects whose rotation to update
const objects = [];

//Camera
const fov = 40;
const aspect = window.innerWidth / window.innerHeight;  // the canvas default
const near = 0.1;
const far = 1000;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.set(0, 50, 0);
camera.up.set(0, 0, 1);
camera.lookAt(0, 0, 0);


//Light
const color = 0xFFFFFF;
const intensity = 3;
const light = new THREE.PointLight(color, intensity);
scene.add(light);

//Solar system
const solarSystem = new THREE.Object3D();
scene.add(solarSystem);
objects.push(solarSystem);
 
// use just one sphere for everything
const radius = 1;
const widthSegments = 6;
const heightSegments = 6;
const sphereGeometry = new THREE.SphereGeometry(
    radius, widthSegments, heightSegments);

//Sun    
const sunMaterial = new THREE.MeshPhongMaterial({emissive: 0xFFFF00});
const sunMesh = new THREE.Mesh(sphereGeometry, sunMaterial);
sunMesh.scale.set(5, 5, 5);  // make the sun large
solarSystem.add(sunMesh);
scene.add(sunMesh); //Make the sun not rotate with the solar system
//objects.push(sunMesh);

//Earth
const earthOrbit = new THREE.Object3D();
earthOrbit.position.x = 10;
solarSystem.add(earthOrbit);
objects.push(earthOrbit);

const earthMaterial = new THREE.MeshPhongMaterial({color: 0x2233FF, emissive: 0x112244});
const earthMesh = new THREE.Mesh(sphereGeometry, earthMaterial);
earthOrbit.add(earthMesh);
objects.push(earthMesh);

//Moon
const moonOrbit = new THREE.Object3D();
moonOrbit.position.x = 2;
earthOrbit.add(moonOrbit);
 
const moonMaterial = new THREE.MeshPhongMaterial({color: 0x888888, emissive: 0x222222});
const moonMesh = new THREE.Mesh(sphereGeometry, moonMaterial);
moonMesh.scale.set(.5, .5, .5);
moonOrbit.add(moonMesh);
objects.push(moonMesh);

// Renderer
const canvas = document.querySelector(".webgl");
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(window.innerWidth, window.innerHeight);

//Controls (Q1)
const controls = new OrbitControls( camera, renderer.domElement );
controls.enableDamping = true;

//Q2
const size = 25;
const divisions = 20;
const gridHelper = new THREE.GridHelper(size, divisions);
scene.add(gridHelper);

//Q3 
const gui = new GUI();
const params = {
  soleil : true,
  terre: true,
  lune: true,
  grille: true,
  vitesse: 0.025
}

gui.add(params, "soleil");
gui.add(params, "terre");
gui.add(params, "lune");
gui.add(params, "grille");
gui.add(params, "vitesse", 0.01, 0.1);

const container = document.getElementById('container');
const stats = new Stats();
container.appendChild(stats.dom)

let time = 0;

//Loop
function loop() {
  sunMesh.visible = params.soleil;
  earthMesh.visible = params.terre;
  moonMesh.visible = params.lune;
  gridHelper.visible = params.grille;
  time += params.vitesse;  // convert to seconds
  objects.forEach((obj) => {
    obj.rotation.y = time;
  });
  controls.update();
  stats.update();
  renderer.render(scene, camera);
  requestAnimationFrame(loop);
}

// Start the animation loop
loop();

// add an AxesHelper to each node
/*objects.forEach((node) => {
  const axes = new THREE.AxesHelper();
  axes.material.depthTest = false;
  axes.renderOrder = 1;
  node.add(axes);
});*/