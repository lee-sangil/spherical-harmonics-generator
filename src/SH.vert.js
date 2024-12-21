const vertex = /* glsl */ `
varying vec3 vPosition;

void main() {
    vPosition = mat3(modelMatrix) * position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`
export default vertex