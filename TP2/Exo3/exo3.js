import * as THREE from "three";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import Stats from 'three/addons/libs/stats.module.js';


const scene = new THREE.Scene();
scene.background = new THREE.CubeTextureLoader().setPath( 'textures/cubeMaps/' )
.load( [
      'dark-s_px.jpg',
      'dark-s_nx.jpg',
      'dark-s_py.jpg',
      'dark-s_ny.jpg',
      'dark-s_pz.jpg',
      'dark-s_nz.jpg'
    ] );

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
const widthSegments = 32;
const heightSegments = 32;
const sphereGeometry = new THREE.SphereGeometry(
    radius, widthSegments, heightSegments);

//Sun    
const sunMaterial = new THREE.MeshPhongMaterial({
  emissive: 0xffff00,
  emissiveMap: new THREE.TextureLoader().load('./images/sun.jpg'),
  emissiveIntensity: 1
});

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

const earthColor = "./images/earthmap1k.jpg";
const earthBump = "./images/earthbump1k.jpg";
const earthSpec = "./images/earthspec1k.jpg";
const textureLoader = new THREE.TextureLoader();
const earthMaterial = new THREE.MeshPhongMaterial({
   map: textureLoader.load(earthColor),
   bumpMap: textureLoader.load(earthBump),
   specularMap: textureLoader.load(earthSpec),
   bumpScale: 0.25,
   shininess: 1
});

const earthMesh = new THREE.Mesh(sphereGeometry, earthMaterial);
earthOrbit.add(earthMesh);
objects.push(earthMesh);

//Moon
const moonOrbit = new THREE.Object3D();
moonOrbit.position.x = 2;
earthOrbit.add(moonOrbit);
 
const moonColor = "./images/moonmap1k.jpg";
const moonBump = "./images/moonbump1k.jpg";
const moonMaterial = new THREE.MeshPhongMaterial({
   map: textureLoader.load(moonColor),
   bumpMap: textureLoader.load(moonBump),
   bumpScale: 0.25,
   shininess: 1
});

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
  orbit: true,
  vitesse: 0.025
}

gui.add(params, "soleil");
gui.add(params, "terre");
gui.add(params, "lune");
gui.add(params, "grille");
gui.add(params, "orbit");
gui.add(params, "vitesse", 0, 0.1);

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
  orbitObject.visible = params.orbit;
  time += params.vitesse;  // convert to seconds
  objects.forEach((obj) => {
    obj.rotation.y = time;
  });
  controls.update();
  stats.update();
  renderer.render(scene, camera);
  requestAnimationFrame(loop);
}

// Tore
const orbitGeometry = new THREE .TorusGeometry(10, 0.1, 16, 100);
const orbitMaterial = new THREE.MeshBasicMaterial({ color: 0x6656d });
const orbitObject = new THREE.Mesh(orbitGeometry, orbitMaterial);
scene.add(orbitObject);
orbitObject.rotateX(Math.PI / 2);

// Start the animation loop
loop();

// add an AxesHelper to each node
/*objects.forEach((node) => {
  const axes = new THREE.AxesHelper();
  axes.material.depthTest = false;
  axes.renderOrder = 1;
  node.add(axes);
});*/