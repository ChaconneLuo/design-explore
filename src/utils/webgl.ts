export const createProgram = (
	gl: WebGLRenderingContext,
	vertShaderSource: string,
	fragShaderSource: string,
): WebGLProgram => {
	const vertShader = gl.createShader(gl.VERTEX_SHADER)!;
	gl.shaderSource(vertShader, vertShaderSource);
	gl.compileShader(vertShader);

	if (!gl.getShaderParameter(vertShader, gl.COMPILE_STATUS)) {
		throw `Vertex shader compile error: ${gl.getShaderInfoLog(vertShader)}`;
	}

	const fragShader = gl.createShader(gl.FRAGMENT_SHADER)!;
	gl.shaderSource(fragShader, fragShaderSource);
	gl.compileShader(fragShader);

	if (!gl.getShaderParameter(fragShader, gl.COMPILE_STATUS)) {
		throw `Fragment shader compile error: ${gl.getShaderInfoLog(fragShader)}`;
	}

	const program = gl.createProgram()!;
	gl.attachShader(program, vertShader);
	gl.attachShader(program, fragShader);
	gl.linkProgram(program);

	if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
		throw `Program link error: ${gl.getProgramInfoLog(program)}`;
	}

	return program;

};