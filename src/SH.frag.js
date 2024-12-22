const fragment = /* glsl */ `
uniform float coeffRed[25];
uniform float coeffGreen[25];
uniform float coeffBlue[25];
uniform float coeffMono[25];
varying vec3 vPosition;

#define PI (3.141592)
#define L (4)

void main( void ) {
    float x = -vPosition.x;
    float y = vPosition.z;
    float z = vPosition.y;
    float theta = atan(sqrt(x*x + y*y), z); // 0 to PI
    float phi = atan(y, x) + PI; // 0 to 2PI

    vec3 color;
    int k = 0;
    for (int l = 0; l <= L; ++l) {
        for (int m = -l; m <= l; ++m) {
            float P = legendre(l,m,cos(theta));
            float e = (m >= 0) ? cos(float(m)*phi) : sin(float(m)*phi);
            color += vec3(coeffRed[k] * P * e, coeffGreen[k] * P * e, coeffBlue[k] * P * e);
            ++k;
        }
    }
    gl_FragColor = vec4(0.5 / sqrt(PI) * color, 1.);
}
`
export default fragment