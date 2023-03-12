import React, { MouseEventHandler, useEffect, useRef } from 'react';
import vertShaderSource from './shaders/vert.vs.glsl?raw';
import fragShaderSource from './shaders/frag.fs.glsl?raw';
import { createProgram } from '@/src/utils/webgl';
import { Point, PointColorRequired } from '@/src/types';


interface IProps {
	HEIGHT: number;
	WIDTH: number;
	size: number;
}

const getRandomColor = (): PointColorRequired['color'] => {
	return {
		r: Math.random() * 255,
		g: Math.random() * 255,
		b: Math.random() * 255,
		a: Math.random() * 1,
	};
};
// WebGL Buffer Experiment
export default function RotateTriangle({ HEIGHT = 500, WIDTH = 600, size = 30 }: IProps) {
	const canvas = useRef<HTMLCanvasElement | null>(null);
	const context = useRef<WebGLRenderingContext | null>(null);
	const webglProgram = useRef<WebGLProgram | null>(null);
	const points = useRef<PointColorRequired[]>([]);
	const offset = useRef<Point>({ x: 0, y: 0 });
	let animationFrameId: number;

	const clearColor = () => {
		const gl = context.current!;
		if (!gl) return;
		gl.clearColor(1, 1, 1, 1.0);
		gl.clear(gl.COLOR_BUFFER_BIT);
	};

	const getTriangle = (x: number, y: number, size: number): PointColorRequired[] => {
		const color: PointColorRequired['color'] = getRandomColor();
		const point1 = { x: x, y: y - Math.sqrt(3) / 3 * size, color };
		const point2 = { x: x - size / 2, y: y + Math.sqrt(3) / 6 * size, color };
		const point3 = { x: x + size / 2, y: y + Math.sqrt(3) / 6 * size, color };
		return [point1, point2, point3];
	};

	const init = () => {
		const gl = canvas.current?.getContext('webgl');
		if (!gl) {
			return;
		}
		context.current = gl;
		const program = createProgram(gl, vertShaderSource, fragShaderSource);
		if (!program) {
			return;
		}
		gl.useProgram(program);
		webglProgram.current = program;
		context.current = gl;
		clearColor();
	};

	const getOffset = () => {
		const { left, top } = canvas.current!.getBoundingClientRect();
		offset.current = { x: left, y: top };
	};

	const handClick: MouseEventHandler<HTMLCanvasElement> = (e) => {
		const { pageX, pageY } = e;
		const x = pageX - offset.current.x;
		const y = pageY - offset.current.y;
		points.current.push(...getTriangle(x, y, size));
	};

	const draw = () => {
		const gl = context.current!;
		const program = webglProgram.current!;
		if (!gl || !program) return;

		const a_Position = gl.getAttribLocation(program, 'a_Position');
		const a_Color = gl.getAttribLocation(program, 'a_Color');
		const a_Screen_Size = gl.getAttribLocation(program, 'a_Screen_Size');
		gl.vertexAttrib2f(a_Screen_Size, WIDTH, HEIGHT);

		const vertexs: number[] = points.current.reduce((pre: number[], curr: PointColorRequired) => { pre.push(curr.x, curr.y); return pre; }, []);
		const colors: number[] = points.current.reduce((pre: number[], curr: PointColorRequired) => { pre.push(curr.color.r, curr.color.g, curr.color.b, curr.color.a); return pre; }, []);
		const vertexBuffer = gl.createBuffer();
		const colorBuffer = gl.createBuffer();

		gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexs), gl.DYNAMIC_DRAW);
		gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(a_Position);

		gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.DYNAMIC_DRAW);
		gl.vertexAttribPointer(a_Color, 4, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(a_Color);

		gl.drawArrays(gl.TRIANGLES, 0, vertexs.length / 2);
		gl.disableVertexAttribArray(a_Position);
		gl.disableVertexAttribArray(a_Color);
	};

	const startFrame = () => {
		animationFrameId = requestAnimationFrame(() => {
			draw();
			startFrame();
		});
	};

	const eventListener = () => {
		window.addEventListener('resize', getOffset);
	};

	const cacelEventListener = () => {
		window.removeEventListener('resize', getOffset);
	};

	const mounted = () => {
		init();
		getOffset();
		draw();
		eventListener();
		startFrame();
		return () => {
			cancelAnimationFrame(animationFrameId);
			cacelEventListener();
		};
	};

	useEffect(mounted, []);
	return <>
		<canvas ref={canvas} height={HEIGHT} width={WIDTH} onClick={handClick}></canvas>
	</>;
}

