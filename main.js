import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import legendre from './src/legendre.js';
import fragment from './src/SH.frag.js';
import vertex from './src/SH.vert.js';

let fragment_shader = legendre + fragment;
let vertex_shader = legendre + vertex;

const canvas = document.createElement("canvas");
canvas.style.background = 'linear-gradient(#303438 0%, #000000 30%, #888480 100%)';
document.body.style.margin = '0';
document.body.appendChild(canvas);

const renderer = new THREE.WebGLRenderer({canvas: canvas, alpha: true, antialias: true});
renderer.setSize( window.innerWidth, window.innerHeight );

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0,0,3);

window.addEventListener('resize', resize);
function resize() {
    const width = document.body.clientWidth;
    const height = document.body.clientHeight;

    canvas.width = width * window.devicePixelRatio;
    canvas.height = height * window.devicePixelRatio;

    renderer.setSize(width, height);

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
}

const geometry = new THREE.SphereGeometry(1, 64, 64);
const material = new THREE.ShaderMaterial({
	uniforms: {
        coeffRed: { value: new Array(25).fill(0) },
        coeffGreen: { value: new Array(25).fill(0) },
        coeffBlue: { value: new Array(25).fill(0) },
        coeffMono: { value: new Array(25).fill(0) },
	},
    vertexShader: vertex_shader,
	fragmentShader: fragment_shader,
})
const sphere = new THREE.Mesh(geometry, material);

const scene = new THREE.Scene();
scene.add(sphere);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enablePan = false;

let coeffZero = { k00: 0, k1m1: 0, k10: 0, k1p1: 0, k2m2: 0, k2m1: 0, k20: 0, k2p1: 0, k2p2: 0, k3m3: 0, k3m2: 0, k3m1: 0, k30: 0, k3p1: 0, k3p2: 0, k3p3: 0, k4m4: 0, k4m3: 0, k4m2: 0, k4m1: 0, k40: 0, k4p1: 0, k4p2: 0, k4p3: 0, k4p4: 0 };
let coeffRed = { k00: 0, k1m1: 0, k10: 0, k1p1: 0, k2m2: 0, k2m1: 0, k20: 0, k2p1: 0, k2p2: 0, k3m3: 0, k3m2: 0, k3m1: 0, k30: 0, k3p1: 0, k3p2: 0, k3p3: 0, k4m4: 0, k4m3: 0, k4m2: 0, k4m1: 0, k40: 0, k4p1: 0, k4p2: 0, k4p3: 0, k4p4: 0 };
let coeffGreen = { k00: 0, k1m1: 0, k10: 0, k1p1: 0, k2m2: 0, k2m1: 0, k20: 0, k2p1: 0, k2p2: 0, k3m3: 0, k3m2: 0, k3m1: 0, k30: 0, k3p1: 0, k3p2: 0, k3p3: 0, k4m4: 0, k4m3: 0, k4m2: 0, k4m1: 0, k40: 0, k4p1: 0, k4p2: 0, k4p3: 0, k4p4: 0 };
let coeffBlue = { k00: 0, k1m1: 0, k10: 0, k1p1: 0, k2m2: 0, k2m1: 0, k20: 0, k2p1: 0, k2p2: 0, k3m3: 0, k3m2: 0, k3m1: 0, k30: 0, k3p1: 0, k3p2: 0, k3p3: 0, k4m4: 0, k4m3: 0, k4m2: 0, k4m1: 0, k40: 0, k4p1: 0, k4p2: 0, k4p3: 0, k4p4: 0 };
let coeffMono = { k00: 0, k1m1: 0, k10: 0, k1p1: 0, k2m2: 0, k2m1: 0, k20: 0, k2p1: 0, k2p2: 0, k3m3: 0, k3m2: 0, k3m1: 0, k30: 0, k3p1: 0, k3p2: 0, k3p3: 0, k4m4: 0, k4m3: 0, k4m2: 0, k4m1: 0, k40: 0, k4p1: 0, k4p2: 0, k4p3: 0, k4p4: 0 };

const setting = {
    mode: "red",
    reset: function(){ Object.assign(this, coeffZero); updateCoeffSH(); },
    k00: 0, k1m1: 0, k10: 0, k1p1: 0, k2m2: 0, k2m1: 0, k20: 0, k2p1: 0, k2p2: 0, k3m3: 0, k3m2: 0, k3m1: 0, k30: 0, k3p1: 0, k3p2: 0, k3p3: 0, k4m4: 0, k4m3: 0, k4m2: 0, k4m1: 0, k40: 0, k4p1: 0, k4p2: 0, k4p3: 0, k4p4: 0
};

const gui = new dat.GUI();
gui.domElement.style.marginRight = '0px';
gui.add(setting, 'mode', {'Red': 'red', 'Green': 'green', 'Blue': 'blue', 'Mono': 'mono'}).name('Mode').listen().onChange(updateMode);

gui.add(setting, 'reset').name('Reset');

const l0 = gui.addFolder('l = 0');
l0.add(setting, 'k00', -1, 1, 0.01).name("m = 0").listen().onChange(updateCoeffSH);

const l1 = gui.addFolder('l = 1');
l1.add(setting, 'k1m1', -1, 1, 0.01).name("m = -1").listen().onChange(updateCoeffSH);
l1.add(setting, 'k10', -1, 1, 0.01).name("m = 0").listen().onChange(updateCoeffSH);
l1.add(setting, 'k1p1', -1, 1, 0.01).name("m = 1").listen().onChange(updateCoeffSH);

const l2 = gui.addFolder('l = 2');
l2.add(setting, 'k2m2', -1, 1, 0.01).name("m = -2").listen().onChange(updateCoeffSH);
l2.add(setting, 'k2m1', -1, 1, 0.01).name("m = -1").listen().onChange(updateCoeffSH);
l2.add(setting, 'k20', -1, 1, 0.01).name("m = 0").listen().onChange(updateCoeffSH);
l2.add(setting, 'k2p1', -1, 1, 0.01).name("m = 1").listen().onChange(updateCoeffSH);
l2.add(setting, 'k2p2', -1, 1, 0.01).name("m = 2").listen().onChange(updateCoeffSH);

const l3 = gui.addFolder('l = 3');
l3.add(setting, 'k3m3', -1, 1, 0.01).name("m = -3").listen().onChange(updateCoeffSH);
l3.add(setting, 'k3m2', -1, 1, 0.01).name("m = -2").listen().onChange(updateCoeffSH);
l3.add(setting, 'k3m1', -1, 1, 0.01).name("m = -1").listen().onChange(updateCoeffSH);
l3.add(setting, 'k30', -1, 1, 0.01).name("m = 0").listen().onChange(updateCoeffSH);
l3.add(setting, 'k3p1', -1, 1, 0.01).name("m = 1").listen().onChange(updateCoeffSH);
l3.add(setting, 'k3p2', -1, 1, 0.01).name("m = 2").listen().onChange(updateCoeffSH);
l3.add(setting, 'k3p3', -1, 1, 0.01).name("m = 3").listen().onChange(updateCoeffSH);

const l4 = gui.addFolder('l = 4');
l4.add(setting, 'k4m4', -1, 1, 0.01).name("m = -4").listen().onChange(updateCoeffSH);
l4.add(setting, 'k4m3', -1, 1, 0.01).name("m = -3").listen().onChange(updateCoeffSH);
l4.add(setting, 'k4m2', -1, 1, 0.01).name("m = -2").listen().onChange(updateCoeffSH);
l4.add(setting, 'k4m1', -1, 1, 0.01).name("m = -1").listen().onChange(updateCoeffSH);
l4.add(setting, 'k40', -1, 1, 0.01).name("m = 0").listen().onChange(updateCoeffSH);
l4.add(setting, 'k4p1', -1, 1, 0.01).name("m = 1").listen().onChange(updateCoeffSH);
l4.add(setting, 'k4p2', -1, 1, 0.01).name("m = 2").listen().onChange(updateCoeffSH);
l4.add(setting, 'k4p3', -1, 1, 0.01).name("m = 3").listen().onChange(updateCoeffSH);
l4.add(setting, 'k4p4', -1, 1, 0.01).name("m = 4").listen().onChange(updateCoeffSH);

function mergeExistingFields(target, source) {
    for (const key in source) {
      if (key in target) {
        target[key] = source[key];
      }
    }
    return target;
  }
  
function updateMode () {
    if (setting.mode == 'red') {
        Object.assign(setting, coeffRed);
    } else if (setting.mode == 'green') {
        Object.assign(setting, coeffGreen);
    } else if (setting.mode == 'blue') {
        Object.assign(setting, coeffBlue);
    } else if (setting.mode == 'mono') {
        Object.assign(setting, coeffMono);
    }
}

function updateCoeffSH () {
    const newValue = [
        setting.k00,
        setting.k1m1,
        setting.k10,
        setting.k1p1,
        setting.k2m2,
        setting.k2m1,
        setting.k20,
        setting.k2p1,
        setting.k2p2,
        setting.k3m3,
        setting.k3m2,
        setting.k3m1,
        setting.k30,
        setting.k3p1,
        setting.k3p2,
        setting.k3p3,
        setting.k4m4,
        setting.k4m3,
        setting.k4m2,
        setting.k4m1,
        setting.k40,
        setting.k4p1,
        setting.k4p2,
        setting.k4p3,
        setting.k4p4
    ];

    if (setting.mode == 'red') {
        mergeExistingFields(coeffRed, setting);
        material.uniforms.coeffRed.value = newValue;
    } else if (setting.mode == 'green') {
        mergeExistingFields(coeffGreen, setting);
        material.uniforms.coeffGreen.value = newValue;
    } else if (setting.mode == 'blue') {
        mergeExistingFields(coeffBlue, setting);
        material.uniforms.coeffBlue.value = newValue;
    } else if (setting.mode == 'mono') {
        mergeExistingFields(coeffMono, setting);
        material.uniforms.coeffMono.value = newValue;
    }
}

function animate (msec) {
    requestAnimationFrame(animate);

    controls.update();
	renderer.render(scene, camera);
}

animate();