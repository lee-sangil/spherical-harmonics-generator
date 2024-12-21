const fragment = /* glsl */ `
uniform float coeffRed[16];
uniform float coeffGreen[16];
uniform float coeffBlue[16];
uniform float coeffMono[16];
uniform bool rgbMode;
varying vec3 vPosition;

#define PI (3.141592)
#define L (3)

float legendre(in int l, in int m, in float x) {
    if (l == 0) {
        return 1.0;
    } else if (l == 1) {
        if (m == 0) return sqrt(3.0) * x;
        else if (m == 1) return -sqrt(1.5) * pow(1.0 - x*x, 0.5);
        else if (m == -1) return sqrt(6.0) * 0.5 * pow(1.0 - x*x, 0.5);
    } else if (l == 2) {
        if (m == 0) return sqrt(5.0) * 0.5 * (3.0 * x * x - 1.0);
        else if (m == 1) return -sqrt(5.0/6.0) * 3.0 * x * pow(1.0 - x*x, 0.5);
        else if (m == 2) return sqrt(5.0/24.0) * 3.0 * (1.0 - x*x);
        else if (m == -1) return sqrt(30.0) * 0.5 * x * pow(1.0 - x*x, 0.5);
        else if (m == -2) return sqrt(120.0) * 0.125 * (1.0 - x*x);
    } else if (l == 3) {
        if (m == 0) return sqrt(7.0) * 0.5 * (5.0 * x * x * x - 3.0 * x);
        else if (m == 1) return sqrt(0.583333) * 1.5 * (1.0 - 5.0*x*x) * pow(1.0 - x*x, 0.5);
        else if (m == 2) return sqrt(0.0583333) * 15.0 * x * (1.0 - x*x);
        else if (m == 3) return -sqrt(0.009722) * 15.0 * pow(1.0 - x*x, 1.5);
        else if (m == -1) return -sqrt(84.0) * 0.125 * (1.0 - 5.0*x*x) * pow(1.0 - x*x, 0.5);
        else if (m == -2) return sqrt(840.0) * 0.125 * x * (1.0 - x*x);
        else if (m == -3) return sqrt(5040.0) * 1.0/48.0 * pow(1.0 - x*x, 1.5);
    }
}

void main( void ) {
    float x = -vPosition.x;
    float y = vPosition.z;
    float z = vPosition.y;
    float theta = atan(sqrt(x*x + y*y), z); // 0 to PI
    float phi = atan(y, x) + PI; // 0 to 2PI

    // render
    if (rgbMode) {
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
    } else {
        float color;
        int k = 0;
        for (int l = 0; l <= L; ++l) {
            for (int m = -l; m <= l; ++m) {
                float e = (m >= 0) ? cos(float(m)*phi) : sin(float(m)*phi);
                color += coeffMono[k++] * legendre(l,m,cos(theta)) * e;
            }
        }
        gl_FragColor = vec4(vec3(0.5 / sqrt(PI) * color), 1.);
    }
}
`
export default fragment