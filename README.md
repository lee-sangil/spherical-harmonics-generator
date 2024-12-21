Spherical Harmonics are a set of mathematical functions that define the surface of a sphere in terms of angular coordinates (latitude and longitude). They are widely used in various fields, including quantum physics, chemistry, and, computer graphics, to represent data on spherical surfaces. Especially, it has been famous since it can be used in computer vision for rendering surface dependently with view direction. 

Mathematically, spherical harmonics are solutions to Laplace’s equation in spherical coordinates. Each spherical harmonic is indexed by two integers: the degree $l$ (representing the resolution or detail) and the order $m$ (representing angular variation). They are expressed as:

$$
Y_l^m (\theta, \phi) = C \cdot P_l^m (\cos \theta) \cdot e^{i m \phi},
$$
where $P_l^m (x)$ is associated Legendre polynomial of degree $m$, $\theta$ is polar angle (0 to $\pi$), $\phi$ is azimuthal angle (0 to $2\pi$), and $C$ is a factor normalizing
$$
\begin{align}
&\int {||Y_l^m (\theta, \phi)||^2} d\Omega \\\nonumber =& \int {||Y_l^m (\theta, \phi)||^2} \sin \theta d\theta\phi = 1
\end{align}
$$