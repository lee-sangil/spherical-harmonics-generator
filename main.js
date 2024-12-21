import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import fragment from './src/SH.frag.js';
import vertex from './src/SH.vert.js';

const canvas = document.createElement("canvas");
canvas.style.backgroundColor = 'black';
document.body.style.margin = '0';
document.body.appendChild(canvas);

const renderer = new THREE.WebGLRenderer({canvas: canvas, alpha: true, antialias: true});
renderer.setSize( window.innerWidth, window.innerHeight );

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0,0,3);

const geometry = new THREE.SphereGeometry(1, 64, 64);
const material = new THREE.ShaderMaterial({
	uniforms: {
        coeffSH: { value: new Array(16).fill(0) },
	},
    vertexShader: vertex,
	fragmentShader: fragment,
})
const sphere = new THREE.Mesh(geometry, material);

const scene = new THREE.Scene();
scene.add(sphere);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enablePan = false;

const coeff = {
    k00: 0,
    k1m1: 0,
    k10: 0,
    k1p1: 0,
    k2m2: 0,
    k2m1: 0,
    k20: 0,
    k2p1: 0,
    k2p2: 0,
    k3m3: 0,
    k3m2: 0,
    k3m1: 0,
    k30: 0,
    k3p1: 0,
    k3p2: 0,
    k3p3: 0,
};

const gui = new dat.GUI();
const l0 = gui.addFolder('l = 0');
l0.add(coeff, 'k00', 0, 1, 0.01).name("m = 0").onChange(updateCoeffSH);

const l1 = gui.addFolder('l = 1');
l1.add(coeff, 'k1m1', 0, 1, 0.01).name("m = -1").onChange(updateCoeffSH);
l1.add(coeff, 'k10', 0, 1, 0.01).name("m = 0").onChange(updateCoeffSH);
l1.add(coeff, 'k1p1', 0, 1, 0.01).name("m = 1").onChange(updateCoeffSH);

const l2 = gui.addFolder('l = 2');
l2.add(coeff, 'k2m2', 0, 1, 0.01).name("m = -2").onChange(updateCoeffSH);
l2.add(coeff, 'k2m1', 0, 1, 0.01).name("m = -1").onChange(updateCoeffSH);
l2.add(coeff, 'k20', 0, 1, 0.01).name("m = 0").onChange(updateCoeffSH);
l2.add(coeff, 'k2p1', 0, 1, 0.01).name("m = 1").onChange(updateCoeffSH);
l2.add(coeff, 'k2p2', 0, 1, 0.01).name("m = 2").onChange(updateCoeffSH);

const l3 = gui.addFolder('l = 3');
l3.add(coeff, 'k3m3', 0, 1, 0.01).name("m = -3").onChange(updateCoeffSH);
l3.add(coeff, 'k3m2', 0, 1, 0.01).name("m = -2").onChange(updateCoeffSH);
l3.add(coeff, 'k3m1', 0, 1, 0.01).name("m = -1").onChange(updateCoeffSH);
l3.add(coeff, 'k30', 0, 1, 0.01).name("m = 0").onChange(updateCoeffSH);
l3.add(coeff, 'k3p1', 0, 1, 0.01).name("m = 1").onChange(updateCoeffSH);
l3.add(coeff, 'k3p2', 0, 1, 0.01).name("m = 2").onChange(updateCoeffSH);
l3.add(coeff, 'k3p3', 0, 1, 0.01).name("m = 3").onChange(updateCoeffSH);

function updateCoeffSH () {
    const newValue = [
        coeff.k00,
        coeff.k1m1,
        coeff.k10,
        coeff.k1p1,
        coeff.k2m2,
        coeff.k2m1,
        coeff.k20,
        coeff.k2p1,
        coeff.k2p2,
        coeff.k3m3,
        coeff.k3m2,
        coeff.k3m1,
        coeff.k30,
        coeff.k3p1,
        coeff.k3p2,
        coeff.k3p3
    ]
    material.uniforms.coeffSH.value = newValue;
}

function animate (msec) {
    requestAnimationFrame(animate);

    controls.update();
	renderer.render(scene, camera);
}

animate();