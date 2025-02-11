import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import Stats from "three/addons/libs/stats.module.js";

const canvas = document.querySelector('[data-canvas]')

// Create the scene
const scene = new THREE.Scene()

// Create the camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000)
scene.add(camera)

// Create the renderer
const renderer = new THREE.WebGLRenderer({ canvas })

// Render the scene
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.render(scene, camera)