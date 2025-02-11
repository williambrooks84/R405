import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import Stats from "three/addons/libs/stats.module.js";

const canvas = document.querySelector('[data-canvas]')

const degreesToRadians = (degrees) => {
	return degrees * (Math.PI / 180)
}

// Scene
const scene = new THREE.Scene()

// Camera
const camera = new THREE.PerspectiveCamera(45,window.innerWidth / window.innerHeight);
camera.position.z = 5
scene.add(camera)

//Material
const material = new THREE.MeshLambertMaterial({ color: 0xffffff })

class Figure {
	constructor(params) {
    this.params = {
      x: 0,
      y: 1.4,
      z: 0,
      ry: 0,
      armRotation: 0
  };

		
		this.group = new THREE.Group()
		scene.add(this.group)
	}

  createBody() {
    const geometry = new THREE.BoxGeometry(1, 1.5, 1)
    const body = new THREE.Mesh(geometry, material)
    this.group.add(body)
  }
	
  createHead() {
    // Create a new group for the head
    this.head = new THREE.Group()
    
    // Create the main cube of the head and add to the group
    const geometry = new THREE.BoxGeometry(1.4, 1.4, 1.4)
    const headMain = new THREE.Mesh(geometry, material)
    this.head.add(headMain)
    
    // Add the head group to the figure
    this.group.add(this.head)
    
    // Position the head group
    this.head.position.y = 1.65
    
    // Add the eyes by calling the function we already made
    this.createEyes()
  }

  createArms() {
    const geometry = new THREE.BoxGeometry(0.25, 1, 0.25)
    
    for(let i = 0; i < 2; i++) {
      const arm = new THREE.Mesh(geometry, material)
      const m = i % 2 === 0 ? 1 : -1
      
      // Create group for each arm
      const armGroup = new THREE.Group()
      
      // Add the arm to the group
      armGroup.add(arm)
      
      // Add the arm group to the figure
      this.group.add(armGroup)
      
      // Position the arm group
      armGroup.position.x = m * 0.8
      armGroup.position.y = 0.1
      armGroup.rotation.z = degreesToRadians(30 * m)

      // Helper
      const box = new THREE.BoxHelper(armGroup, 0xffff00)
      this.group.add(box)
    }
  }

  createEyes() {
    const eyes = new THREE.Group()
    const geometry = new THREE.SphereGeometry(0.15, 12, 8)
    
    // Define the eye material
    const material = new THREE.MeshLambertMaterial({ color: 0x44445c })
    
    for(let i = 0; i < 2; i++) {
      const eye = new THREE.Mesh(geometry, material)
      const m = i % 2 === 0 ? 1 : -1
      
      // Add the eye to the group
      eyes.add(eye)
      
      // Position the eye
      eye.position.x = 0.36 * m
    }
    this.head.add(eyes)
    eyes.position.z = 0.7
  }

  createLegs() {
    const legs = new THREE.Group()
    const geometry = new THREE.BoxGeometry(0.25, 0.4, 0.25)
    
    for(let i = 0; i < 2; i++) {
      const leg = new THREE.Mesh(geometry, material)
      const m = i % 2 === 0 ? 1 : -1
      
      legs.add(leg)
      leg.position.x = m * 0.22
    }
    
    this.group.add(legs)
    legs.position.y = -1.15
    
    // this.body.add(legs)
  }
  
  init() {
    this.createBody()
    this.createHead()
    this.createArms()
    this.createEyes()
    this.createLegs()
  }
}

const figure = new Figure()
figure.init()

// Cube
const geometry = new THREE.BoxGeometry(1, 1, 1)
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

//Rotate cube
mesh.rotation.x = degreesToRadians(30)
mesh.rotation.y = degreesToRadians(30)

//Light
const lightDirectional = new THREE.DirectionalLight(0xffffff, 1)
scene.add(lightDirectional)
// Move the light source towards us and off-center
lightDirectional.position.set(5, 5, 5)

//Ambient light
const lightAmbient = new THREE.AmbientLight(0x9eaeff, 0.2)
scene.add(lightAmbient)

// Renderer
const renderer = new THREE.WebGLRenderer({ canvas })

// Render
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.render(scene, camera)