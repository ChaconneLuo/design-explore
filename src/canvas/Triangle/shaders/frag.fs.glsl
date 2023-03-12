precision mediump float;
varying vec4 v_Color;
void main() {
    gl_FragColor = v_Color / vec4(255, 255, 255, 1);
}
