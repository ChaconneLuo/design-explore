precision mediump float;
uniform vec4 u_Color;
void main() {
    gl_FragColor = u_Color / vec4(255, 255, 255, 1);
}
