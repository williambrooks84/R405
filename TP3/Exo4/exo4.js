import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import Stats from "three/addons/libs/stats.module.js";

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

//Boxes
let boxG = new THREE.BoxGeometry(1, 1, 1);
for (let x = -8; x < 9; x++) {
  for (let z = -8; z < 9; z++) {
    const h = Math.random() * 8.0 + 2.0;
    const box = new THREE.Mesh(
      boxG,
      new THREE.MeshPhongMaterial({ color: 0x808080 })
    );
    box.scale.set(2, h, 2);
    box.position.set(
      Math.random() * 3 + x * 5,
      h / 2 + 5,
      Math.random() * 5 + z * 5
    );
    box.castShadow = true;
    box.receiveShadow = true;
    scene.add(box);
  }
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
};
gui.add(params, "camHelper").onChange((value) => {
  camHelper.visible = value;
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
