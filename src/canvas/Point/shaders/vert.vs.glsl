precision mediump float;

attribute vec2 a_Position;
attribute vec2 a_Screen_Size;

void main() {
    vec2 position = (a_Position / a_Screen_Size) * 2. - 1.;
    position = position * vec2(1., -1.);
    gl_Position = vec4(position, 0, 1);
    gl_PointSize = 10.;
}
