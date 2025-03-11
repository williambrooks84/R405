import * as THREE from 'three';

export default class Bullet extends THREE.Group{
    constructor(){
        super();
        this.bullet = new THREE.Mesh(
            new THREE.SphereGeometry(0.2),
            new THREE.MeshLambertMaterial({color: 0xff0000})
        );
        this.bullet.castShadow = true;
        this.add(this.bullet);
        this.visible=false;
        this.bullet.position.y += 1.5;
    }
    fire(robot){
        //Non: va pointer sur la position du robot en mémoire
        //this.bullet.position = robot.position;

        //Oui: crée une nouvelle zone mémoire
        if (this.visible) return;
        this.bullet.position.copy(robot.position);
        this.bullet.rotation.y = robot.rotation.y;
        this.visible = true;        
    }

    update() {
        if (!this.visible) return;
        this.bullet.position.x += Math.sin(this.bullet.rotation.y);
        this.bullet.position.z += Math.sin(this.bullet.rotation.y);
        if (this.bullet.position.distanceTo(new THREE.Vector3(0, 0, 0) > 100)) {
            this.visible = false;
        }
    }
}