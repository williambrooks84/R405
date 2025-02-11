import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import Stats from "three/addons/libs/stats.module.js";

//go clavier
let go = false;

const scene = new THREE.Scene();
scene.background = new THREE.CubeTextureLoader()
  .setPath("HeartInTheSand/")
  .load([
    "posx.jpg",
    "negx.jpg",
    "posy.jpg",
    "negy.jpg",
    "posz.jpg",
    "negz.jpg",
  ]);

// an array of objects whose rotation to update
//Camera
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight
);
camera.position.set(10, 20, 80); //x, y, z
scene.add(camera);

//Light
let light = new THREE.DirectionalLight(0xffffff, 1.0);
light.position.set(50, 100, 10); //x, y, z
light.target.position.set(0, 0, 0);
scene.add(light);
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
const camHelper = new THREE.CameraHelper(light.shadow.camera);
scene.add(camHelper);
const axesHelper = new THREE.AxesHelper( 5 );
scene.add( axesHelper );

//Ground
const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(100, 100, 10, 10),
  new THREE.MeshPhongMaterial({
    color: 0xffffff,
  })
);
plane.rotation.x = -Math.PI / 2;
plane.receiveShadow = true;
plane.castShadow = false;
scene.add(plane);

//Backface culling

//Main group
let mainGroup = new THREE.Object3D();
mainGroup.position.y = 30;
scene.add(mainGroup);

//Horizontal bar
let cylGeometry = new THREE.CylinderGeometry(1, 1, 1, 100, 100);
let mat = new THREE.MeshPhongMaterial({ color: 0x808080 });
let barre = new THREE.Mesh(cylGeometry, mat);
barre.scale.set(3, 100, 3);
barre.rotateZ(Math.PI/2);
barre.castShadow = true;
mainGroup.add(barre);

let sphGeometry = new THREE.SphereGeometry(4, 32, 32);

//All vertical bars
let sensRotation = [];
let groups = [];

let hauteur = 15;
let vitesse = 3;

for (let x = -40; x <= 40; x += 10) {
  //Vertical bar
  let groupe0 = new THREE.Object3D();
  let cVertical = new THREE.Mesh(cylGeometry, mat);
  cVertical.scale.set(0.5, 15, 0.5);
  cVertical.position.y = -15/2;
  cVertical.castShadow = true;
  groupe0.add(cVertical);
  let sph = new THREE.Mesh(sphGeometry, mat);
  sph.position.y = -15;
  sph.castShadow = true;
  groupe0.add(sph);
  groupe0.rotation.x = -Math.PI/3;
  groupe0.position.x = x;
  mainGroup.add(groupe0);
  groups.push(groupe0);
  sensRotation.push(vitesse);
  hauteur =+ 1.4;
  vitesse -=0.25;
  //let sensRotation = 1;
}

// Renderer
const canvas = document.querySelector(".webgl");
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true }); //Antialias: effet marches d'escalier
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap
renderer.render(scene, camera);

//Controls (Q1)
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

//Stats
const stats = new Stats();
document.body.appendChild(stats.dom);

//GUI
const gui = new GUI();
const params = {
  camHelper: true,
  axesHelper: true,
};

gui.add(params, "camHelper").onChange((value) => {
  camHelper.visible = value;
});

gui.add(params, "axesHelper").onChange((value) => {
  axesHelper.visible = value;
});

//Resize
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
  stats.update();
}

animate();

// Update camera
camera.aspect = window.innerWidth / window.innerHeight;
camera.updateProjectionMatrix();
// Update renderer
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.render(scene, camera);

function loop() {
  axesHelper.visible = params.axesHelper;

  if (go){
    for (let i=0; i<groups.length; i++) {
      let groupe0=groups[i];
      groupe0.rotation.x += sensRotation[i]*0.025;
      if (groupe0.rotation.x > Math.PI / 3) {
        groupe0.rotation.x = Math.PI / 3;
        sensRotation[i] = -1;
      }
      if (groupe0.rotation.x < -Math.PI / 3){
        sensRotation[i] = 1;
        groupe0.rotation.x = -Math.PI / 3;
      }
    }
  }

  controls.update();
  stats.update();
  renderer.render(scene, camera);
  requestAnimationFrame(loop);
}

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

loop();

window.addEventListener('keydown', (event) => {
   go = true; 
});