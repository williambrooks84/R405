import * as THREE from "three";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import Stats from 'three/addons/libs/stats.module.js';


const scene = new THREE.Scene();
scene.background = new THREE.CubeTextureLoader().setPath( 'HeartInTheSand/' )
.load( [
      'posx.jpg',
      'negx.jpg',
      'posy.jpg',
      'negy.jpg',
      'posz.jpg',
      'negz.jpg',
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
let light = new THREE.DirectionalLight(0xFFFFFF, 1.0);
light.position.set(50, 100, 10);
light.target.position.set(0, 0, 0);
scene.add(light);
scene.add(new THREE.DirectionalLightHelper(light));

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
  grille: true,
}

gui.add(params, "grille");

const container = document.getElementById('container');
const stats = new Stats();
container.appendChild(stats.dom)

//Loop
function loop() {
  gridHelper.visible = params.grille;
  controls.update();
  stats.update();
  renderer.render(scene, camera);
  requestAnimationFrame(loop);
}
// Start the animation loop
loop();
