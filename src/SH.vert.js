const vertex = /* glsl */ `
uniform float coeffMono[25];
varying vec3 vPosition;

#define PI (3.141592)
#define L (4)

void main() {
    vPosition = mat3(modelMatrix) * position;

    float x = -vPosition.x;
    float y = vPosition.z;
    float z = vPosition.y;
    float theta = atan(sqrt(x*x + y*y), z); // 0 to PI
    float phi = atan(y, x) + PI; // 0 to 2PI
    if (x == 0. && y == 0.) phi = 0.;

    float scale = 0.;
    int k = 0;
    for (int l = 0; l <= L; ++l) {
        for (int m = -l; m <= l; ++m) {
            float P = legendre(l,m,cos(theta));
            float e = (m >= 0) ? cos(float(m)*phi) : sin(float(m)*phi);
            scale += coeffMono[k++] * P * e;
        }
    }

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position + 0.05 * scale * normal, 1.0);
}
`
export default vertex