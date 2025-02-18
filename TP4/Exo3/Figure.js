import * as THREE from "three";

const degreesToRadians = (degrees) => degrees * (Math.PI / 180);
const random = (min, max, float = false) => (float ? Math.random() * (max - min) + min : Math.floor(Math.random() * (max - min) + min));

export default class Figure {
    constructor(scene) {
        this.scene = scene;
        this.params = {
            x: 0,
            y: 0,
            z: 0,
            ry: 0,
            armRotation: 0,
            headRotation: 0,
            leftEyeScale: 1,
            walkRotation: 0
        };

        this.group = new THREE.Group();
        this.scene.add(this.group);

        this.group.position.set(this.params.x, this.params.y, this.params.z);

        this.headHue = random(0, 360);
        this.bodyHue = random(0, 360);
        this.headLightness = random(40, 65);
        this.headMaterial = new THREE.MeshLambertMaterial({
            color: `hsl(${this.headHue}, 30%, ${this.headLightness}%)`,
        });
        this.bodyMaterial = new THREE.MeshLambertMaterial({
            color: `hsl(${this.bodyHue}, 85%, 50%)`,
        });

        this.arms = [];
        this.legs = [];
    }

    createBody() {
        this.body = new THREE.Group();
        const geometry = new THREE.BoxGeometry(1, 1.5, 1);
        const bodyMain = new THREE.Mesh(geometry, this.bodyMaterial);
        bodyMain.castShadow = true;
        bodyMain.receiveShadow = true;

        this.body.add(bodyMain);
        this.group.add(this.body);

        this.createLegs();
    }

    createHead() {
        this.head = new THREE.Group();
        const geometry = new THREE.SphereGeometry(0.9, 32, 32);
        const headMain = new THREE.Mesh(geometry, this.headMaterial);
        headMain.castShadow = true;
        headMain.receiveShadow = true;
        this.head.add(headMain);

        const antennaGeometry = new THREE.CylinderGeometry(0.03, 0.03, 0.8, 8);
        const a1 = new THREE.Mesh(antennaGeometry, this.headMaterial);
        a1.rotation.z = -Math.PI / 6;
        a1.position.set(0.6, 1, 0);
        this.head.add(a1);

        const a2 = new THREE.Mesh(antennaGeometry, this.headMaterial);
        a2.rotation.z = Math.PI / 6;
        a2.position.set(-0.6, 1, 0);
        this.head.add(a2);

        this.group.add(this.head);
        this.head.position.y = 1.65;
        this.createEyes();
    }

    createArms() {
        const height = 0.85;
        for (let i = 0; i < 2; i++) {
            const armGroup = new THREE.Group();
            const geometry = new THREE.BoxGeometry(0.25, height, 0.25);
            const arm = new THREE.Mesh(geometry, this.headMaterial);
            arm.castShadow = true;
            arm.receiveShadow = true;
            const m = i % 2 === 0 ? 1 : -1;

            armGroup.add(arm);
            this.body.add(armGroup);

            arm.position.y = height * -0.5;
            armGroup.position.set(m * 0.8, 0.6, 0);
            armGroup.rotation.z = degreesToRadians(30 * m);
            this.arms.push(armGroup);
        }
    }

    createEyes() {
        const eyes = new THREE.Group();
        const geometry = new THREE.SphereGeometry(0.15, 12, 8);
        const material = new THREE.MeshLambertMaterial({ color: 0x44445c });

        for (let i = 0; i < 2; i++) {
            const eye = new THREE.Mesh(geometry, material);
            eye.castShadow = true;
            eye.receiveShadow = true;
            const m = i % 2 === 0 ? 1 : -1;

            eyes.add(eye);
            eye.position.x = 0.36 * m;
        }

        this.head.add(eyes);
        eyes.position.set(0, -0.1, 0.7);
        this.leftEyeScale = eyes.children[0];
    }

    createLegs() {
        const legs = new THREE.Group();
        const geometry = new THREE.BoxGeometry(0.25, 0.4, 0.25);

        for (let i = 0; i < 2; i++) {
            const leg = new THREE.Mesh(geometry, this.headMaterial);
            leg.castShadow = true;
            leg.receiveShadow = true;
            const m = i % 2 === 0 ? 1 : -1;

            legs.add(leg);
            leg.position.x = m * 0.22;
            this.legs.push(leg);
        }

        this.group.add(legs);
        legs.position.y = -1.15;

        this.body.add(legs);
    }

    bounce() {
        this.group.rotation.y = this.params.ry;
        this.group.position.y = this.params.y;
        this.group.position.x = this.params.x;
        this.group.position.z = this.params.z;
        this.arms.forEach((arm, index) => {
            const m = index % 2 === 0 ? 1 : -1;
            arm.rotation.z = this.params.armRotation * m;
            arm.rotation.x = this.params.walkRotation * m;
        });
        this.legs.forEach((leg, index) => {
            const m = index % 2 === 0 ? 1 : -1;;
            leg.rotation.x = this.params.walkRotation * m;
        });

        this.head.rotation.z = this.params.headRotation;
        this.leftEyeScale.scale.set(this.params.leftEyeScale, this.params.leftEyeScale, this.params.leftEyeScale);
    }

    init() {
        this.createBody();
        this.createHead();
        this.createArms();
        this.createLegs();
    }
}
