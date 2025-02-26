import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import Stats from "three/addons/libs/stats.module.js";
import Figure from "./Figure.js";

const canvas = document.querySelector("[data-canvas]");
const scene = new THREE.Scene();

scene.background = new THREE.Color(0xffffff);
scene.fog = new THREE.Fog(0xffffff, 10, 15);

const degreesToRadians = (degrees) => degrees * (Math.PI / 180);

// Create and initialize the figure
const figure = new Figure(scene);
figure.init();

//Bullet
// let bullet = new Bullet();
// scene.add(bullet);
// document.addEventListener('click', (event) => {
//   bullet.fire(figure);
// });

// Set up renderer
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.shadowMap.enabled = true;
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Camera
const sizes = { width: window.innerWidth, height: window.innerHeight };
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000);
camera.position.z = 5;
scene.add(camera);

// Resize event
window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// Light
const light = new THREE.DirectionalLight(0xFFFFFF, 1.0);
const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.05);
scene.add(ambientLight);
light.position.set(50, 50, 10);
light.target.position.set(0, 0, 0);
light.castShadow = true; // Active les ombres portées
scene.add(light);
scene.add(new THREE.DirectionalLightHelper(light));

light.shadow.mapSize.width = 512; // Largeur de la shadow map
light.shadow.mapSize.height = 512; // Hauteur de la shadow map
light.shadow.camera.near = 0.5; // Distance minimale de la shadow camera
light.shadow.camera.far = 500; // Distance maximale de la shadow camera
light.shadow.bias = -0.001;
light.shadow.mapSize.width = 2048;
light.shadow.mapSize.height = 2048;
light.shadow.camera.near = 50;
light.shadow.camera.far = 150;
light.shadow.camera.left = 100;
light.shadow.camera.right = -100;
light.shadow.camera.top = 100;
light.shadow.camera.bottom = -100;

// ground
const ground = new THREE.PlaneGeometry(35, 35, 35, 35);
const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x696969, side: THREE.DoubleSide });
const groundMesh = new THREE.Mesh(ground, groundMaterial);
groundMesh.rotation.x = -Math.PI / 2;
groundMesh.receiveShadow = true; // Active la réception des ombres
scene.add(groundMesh);

//Mode idle
let idleTL = gsap.timeline();
idleTL.to(figure.params, {
  headRotation: Math.PI/3,
  repeat: -1,
  yoyo: true,
  delay: 2.5,
  duration: 0.75,
  ease: "back.out"
});

idleTL.to(figure.params, {
  leftEyeScale: 1.5,
  repeat: -1,
  yoyo: true,
  duration: 1,
  ease: "elastic.in"
  }, ">2.2"
);

//Timeline for jumping
let jumpTL = gsap.timeline();
document.addEventListener("keydown", (event) => {
  if (event.key == " " && !jumpTL.isActive()) {
    idleTL.pause(0);
    jumpTL.to(figure.params, {
      y: 3,
      armRotation: degreesToRadians(90),
      repeat: 1,
      yoyo: true,
      duration: 0.5,
      ease: "power1.out"
    });
  }
});

//Rotation Y
let rySpeed = 0;
document.addEventListener("keydown", (event) => {
  if (event.key == "ArrowLeft") {
    rySpeed +=0.15;
    idleTL.pause(0);
  } 
  else if (event.key == "ArrowRight") {
    rySpeed -=0.15;
    idleTL.pause(0);
  }
});

//Walk
let walkSpeed = 0;
let walkTL = gsap.timeline();
walkTL.to(figure.params, {
  walkRotation: degreesToRadians(45),
  repeat: 1,
  yoyo: true,
  duration: 0.25,
});
walkTL.to(figure.params, {
  walkRotation: degreesToRadians(-45),
  repeat: 1,
  yoyo: true,
  duration: 0.25,
}, ">");
walkTL.pause();

document.addEventListener("keydown", (event) => {
  if (event.key == "ArrowUp") {
    walkSpeed += 0.05;
    idleTL.pause(0);
  }
  if (event.key == "ArrowDown") {
    walkSpeed -= 0.05;
    idleTL.pause(0);
  }
  if (event.key == "ArrowUp" || event.key == "ArrowDown") {
    if (!walkTL.isActive() && (walkSpeed > 0.05)) {
      idleTL.pause();
      walkTL.restart();
    }
  }
});


gsap.set(figure.params, {
  y: 1.5
});

gsap.ticker.add(() => {
  figure.params.ry += rySpeed;
  rySpeed *= 0.93;
  walkSpeed *= 0.97;
  figure.params.x += walkSpeed * Math.sin(figure.params.ry);
  figure.params.z += walkSpeed * Math.cos(figure.params.ry);

  if (!walkTL.isActive() && (walkSpeed > 0.0041)) {
    idleTL.pause();
    walkTL.restart();
  }

  if (!jumpTL.isActive() && !idleTL.isActive() && (rySpeed < 0.01) && (walkSpeed < 0.01)) {
    idleTL.restart();
  }
  figure.bounce();
  //bullet.update();
  stats.update();
  renderer.render(scene, camera);
});

// Controls (Q1)
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

const stats = new Stats();
document.body.appendChild(stats.dom);

const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

const camHelper = new THREE.CameraHelper(camera);
scene.add(camHelper);

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
