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
            walkRotation: 0,
            bodyRotation: 0
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
        const geometry = new THREE.BoxGeometry(2, 1, 1);
        const bodyMain = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({ color: 0xe2d3a8 }));
        bodyMain.castShadow = true;
        bodyMain.receiveShadow = true;
        bodyMain.rotation.y = degreesToRadians(90);

        this.body.add(bodyMain);
        this.group.add(this.body);

        this.createLegs();
    }

    createHead() {
        this.head = new THREE.Group();
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const headMain = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({ color: 0xf0e3b6 })); 
        headMain.rotateY(degreesToRadians(90));
        headMain.castShadow = true;
        headMain.receiveShadow = true;
        this.head.add(headMain);

        const earGeometry = new THREE.BoxGeometry(0.25, 0.5, 0.25);
        const earMaterial = new THREE.MeshLambertMaterial({ color: 0x30211e }); 
        const e1 = new THREE.Mesh(earGeometry, earMaterial);
        e1.position.set(0.3, 0.6, 0.3);
        this.head.add(e1);

        const e2 = new THREE.Mesh(earGeometry, earMaterial);
        e2.position.set(-0.3, 0.6, 0.3);
        this.head.add(e2);

        const noseGeometry = new THREE.SphereGeometry(0.2, 5, 5);
        const noseMaterial = new THREE.MeshLambertMaterial({ color: 0x000000 });
        const nose = new THREE.Mesh(noseGeometry, noseMaterial);
        nose.position.set(0, -0.1, 0.6);
        this.head.add(nose);

        this.group.add(this.head);
        this.head.position.z = 0.5;
        this.head.position.y = 1;
        this.createEyes();
    }

    /*
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
    }*/

    createTail(){
        const tailGeometry = new THREE.BoxGeometry(0.15, 0.15, 1);
        const tailMaterial = new THREE.MeshLambertMaterial({ color: 0x7c5b4c });
        const tail = new THREE.Mesh(tailGeometry, tailMaterial);
        tail.castShadow = true;
        tail.receiveShadow = true;
        tail.position.set(0, 0.15, -1.4);
        tail.rotateX(degreesToRadians(-15));
        this.body.add(tail);
    }

    createEyes() {
        const eyes = new THREE.Group();
        const geometry = new THREE.SphereGeometry(0.15, 5, 5);
        const material = new THREE.MeshLambertMaterial({ color: 0xffffff });

        for (let i = 0; i < 2; i++) {
            const eye = new THREE.Mesh(geometry, material);
            eye.castShadow = true;
            eye.receiveShadow = true;
            const m = i % 2 === 0 ? 1 : -1;

            eyes.add(eye);
            eye.position.x = 0.25 * m;

            // Add small circle in each eye
            const smallCircleGeometry = new THREE.SphereGeometry(0.05, 5, 5);
            const smallCircleMaterial = new THREE.MeshLambertMaterial({ color: 0x000000 });
            const smallCircle = new THREE.Mesh(smallCircleGeometry, smallCircleMaterial);
            smallCircle.position.set(0, 0, 0.15);
            eye.add(smallCircle);
        }

        this.head.add(eyes);
        eyes.position.set(0, 0.3, 0.6);
        this.leftEyeScale = eyes.children[0];
    }

    createLegs() {
        const legs = new THREE.Group();
        const geometry = new THREE.BoxGeometry(0.25, 1.5, 0.25);

        for (let i = 0; i < 4; i++) {
            const leg = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({ color: 0x695e40 }));
            leg.castShadow = true;
            leg.receiveShadow = true;
            const m = i % 2 === 0 ? 1 : -1;
            const offset = i < 2 ? 0.75 : -0.5;

            legs.add(leg);
            leg.position.set(m * 0.22, 0, offset);
            this.legs.push(leg);
        }

        this.group.add(legs);
        legs.position.y = -0.75;

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
        //this.createArms();
        this.createTail();
        this.createLegs();
    }
}
