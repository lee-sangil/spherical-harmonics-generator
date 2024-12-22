const fragment = /* glsl */ `
uniform float coeffRed[25];
uniform float coeffGreen[25];
uniform float coeffBlue[25];
uniform float coeffMono[25];
uniform bool rgbMode;
varying vec3 vPosition;

#define PI (3.141592)
#define L (4)

float legendre(in int l, in int m, in float x) {
    if (l == 0) {
        return 1.0;
    } else if (l == 1) {
        if (m == 0) return 1.7321 * x;
        else if (m == 1) return -1.2247 * pow(1.0 - x*x, 0.5);
        else if (m == -1) return 1.2247 * pow(1.0 - x*x, 0.5);
    } else if (l == 2) {
        if (m == 0) return 1.118 * (3.0 * x * x - 1.0);
        else if (m == 1) return -2.7386 * x * pow(1.0 - x*x, 0.5);
        else if (m == 2) return 1.3693 * (1.0 - x*x);
        else if (m == -1) return 2.7386 * x * pow(1.0 - x*x, 0.5);
        else if (m == -2) return 1.3693 * (1.0 - x*x);
    } else if (l == 3) {
        if (m == 0) return 1.3228 * (5.0 * x * x * x - 3.0 * x);
        else if (m == 1) return 1.1456 * (1.0 - 5.0*x*x) * pow(1.0 - x*x, 0.5);
        else if (m == 2) return 3.6228 * x * (1.0 - x*x);
        else if (m == 3) return -1.479 * pow(1.0 - x*x, 1.5);
        else if (m == -1) return -1.1456 * (1.0 - 5.0*x*x) * pow(1.0 - x*x, 0.5);
        else if (m == -2) return 3.6228 * x * (1.0 - x*x);
        else if (m == -3) return 1.479 * pow(1.0 - x*x, 1.5);
    } else if (l == 4) {
        if (m == 0) return 9.0*x*x*(x*x - 1.0) + 1.125*pow(x*x - 1.0, 2.) + 3.0*x*x*x*x;
        else if (m == 1) return -1.0*pow(1.0 - 1.0*x*x, 0.5)*(5.0312*x*(x*x - 1.0) + 6.7082*x*x*x);
        else if (m == 2) return -(8.301*x*x - 1.1859)*(x*x - 1.0);
        else if (m == 3) return -4.4371*x*pow(1.0 - 1.0*x*x, 1.5);
        else if (m == 4) return 1.5687*pow(x*x - 1.0, 2.);
        else if (m == -1) return 0.0017469*pow(1.0 - 1.0*x*x, 0.5)*(2880.0*x*(x*x - 1.0) + 3840.0*x*x*x);
        else if (m == -2) return -0.14823*(20160.0*x*x - 2880.0)*(0.0027778*x*x - 0.0027778);
        else if (m == -3) return 4.4371*x*pow(1.0 - 1.0*x*x, 1.5);
        else if (m == -4) return 1.5687*pow(x*x - 1.0, 2.);
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