import { createProgram } from '@/src/utils/webgl';
import React, { MouseEventHandler, useEffect, useRef } from 'react';
import vertShaderSource from './shaders/vert.vs.glsl?raw';
import fragShaderSource from './shaders/frag.fs.glsl?raw';
import { Point } from '@/src/types';
import { RequiredKeys } from '@/src/utils/type';

interface IProps {
    HEIGHT: number;
    WIDTH: number;
}

const getRandomColor = (): Point['color'] => {
	return {
		r: Math.random() * 255,
		g: Math.random() * 255,
		b: Math.random() * 255,
		a: Math.random() * 1,
	};
};
// WebGL Experiment
export default function Triangle({ HEIGHT = 600, WIDTH = 800 }: IProps) {
	const canvas = useRef<HTMLCanvasElement | null>(null);
	const context = useRef<WebGLRenderingContext | null>(null);
	const webglProgram = useRef<WebGLProgram | null>(null);
	const offset = useRef<Point>({ x: 0, y: 0 });
	const points = useRef<RequiredKeys<Point, 'color'>[]>([]);
	let gl: WebGLRenderingContext;
	let animationFrameId: number;

	const clearColor = () => {
		const gl = context.current!;
		if (!gl) return;
		gl.clearColor(1, 1, 1, 1.0);
		gl.clear(gl.COLOR_BUFFER_BIT);
	};

	const init = () => {
		if (!canvas.current) {
			return;
		}
		context.current = canvas.current!.getContext('webgl');
		gl = context.current!;
		if (!gl) {
			return;
		}
		const program = createProgram(gl, vertShaderSource, fragShaderSource);
		webglProgram.current = program;

		gl.useProgram(program);
		context.current = gl;
		clearColor();
		gl.drawArrays(gl.POINTS, 0, 1);
	};

	const getOffset = () => {
		const { left, top } = canvas.current!.getBoundingClientRect();
		offset.current = { x: left, y: top };
	};

	const handleClick: MouseEventHandler<HTMLCanvasElement> = (e) => {
		const { pageX, pageY } = e;
		const x = pageX - offset.current.x;
		const y = pageY - offset.current.y;
		points.current.push({
			x,
			y,
			color: getRandomColor(),
		});
	};

	const draw = () => {
		const gl = context.current!;
		const program = webglProgram.current!;
		const a_Position = gl.getAttribLocation(program, 'a_Position');
		const u_Color = gl.getUniformLocation(program, 'u_Color');
		const a_Screen_Size = gl.getAttribLocation(program, 'a_Screen_Size');
		points.current.forEach((point: RequiredKeys<Point, 'color'>) => {
			const { x, y, color } = point;
			gl.vertexAttrib2f(a_Position, x, y);
			gl.vertexAttrib2f(a_Screen_Size, WIDTH, HEIGHT);
			gl.uniform4f(u_Color, color.r, color.g, color.b, color.a);
			gl.drawArrays(gl.POINTS, 0, 1);
		});
	};

	const startFrame = () => {
		animationFrameId = requestAnimationFrame(() => {
			draw();
			startFrame();
		});
	};

	const mounted = () => {
		init();
		getOffset();
		startFrame();
		return () => {
            canvas.current!.onclick = null;
            cancelAnimationFrame(animationFrameId);
		};
	};
	useEffect(mounted, []);
	return <>
		<canvas ref={canvas} width={WIDTH} height={HEIGHT} onClick={handleClick}></canvas>
	</>;
}
