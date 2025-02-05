import * as THREE from "three";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import Stats from 'three/addons/libs/stats.module.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';


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
camera.position.set(10, 20, 80); //x, y, z
scene.add(camera);

//Light
let light = new THREE.DirectionalLight(0xFFFFFF, 1.0);
light.position.set( 50, 100, 10 ); //x, y, z
light.target.position.set(0, 0, 0);
scene.add( light );
light.castShadow = true;
light.shadow.bias = -0.1;
light.shadow.mapSize.width = 1024; //Puissances de 2 
light.shadow.mapSize.height = 1024; //Puissances de 2
light.shadow.camera.near = 50;
light.shadow.camera.far = 150;
light.shadow.camera.left = 100;
light.shadow.camera.right = -100;
light.shadow.camera.top = 100;
light.shadow.camera.bottom = -100;
//Helper
const camHelper = new THREE.CameraHelper( light.shadow.camera );
scene.add( camHelper );


//Ground
const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(100, 100, 10, 10),
  new THREE.MeshPhongMaterial({
    color: 0xFFFFFF,
  }));
plane.rotation.x = -Math.PI / 2;
plane.receiveShadow = true;
plane.castShadow = false;
scene.add(plane);

//Backface culling

//Rocket ship
let model = null;
new GLTFLoader()
  .load(
  './ressources/Rocketship.glb',
  function (gltf) {
    model = gltf.scene;
    model.scale.set(2, 2, 2);
    model.position.y = 5;
    model.traverse(function (node){
      if (node.isMesh) node.castShadow = true;
    });
    scene.add(model);
  }, undefined, function (error) {
    console.error(error);
  }
);


// Renderer
const canvas = document.querySelector(".webgl");
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true }); //Antialias: effet marches d'escalier
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap
renderer.render(scene, camera);

//Resize
window.addEventListener('resize', () => {
  // Update camera
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  // Update renderer
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.render(scene, camera);
});

//Controls (Q1)
const controls = new OrbitControls( camera, renderer.domElement );
controls.enableDamping = true;

//Q3 
const gui = new GUI();
const params = {
  camHelper: true,
}

gui.add(params, "camHelper");

const container = document.getElementById('container');
const stats = new Stats();
container.appendChild(stats.dom)

//Loop
let flying = false;
function loop() {
  camHelper.visible = params.camHelper;
  if ((model!=null) && (flying)) {
    model.position.y += 0.025;
    if (model.position.y > 100) {
      model.position.y=5;
      flying = false;
    }
  }
  controls.update();
  stats.update();
  renderer.render(scene, camera);
  requestAnimationFrame(loop);
}
// Start the animation loop
loop();

//OnClick

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
window.addEventListener('click', (event) => {
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = - (event.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);
  const intersects = raycaster.intersectObjects(model.children);
  if ((intersects.length > 0) && (!flying)) {
    flying = true;
  }
});