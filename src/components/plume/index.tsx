import React, { useContext, useEffect, useRef } from 'react';
import { CanvasContext } from '@/src/stores/canvas';
import { Branch, Point } from '@/src/types';
const HEIGHT: number = 600;
const WIDTH: number = 600;

export default function usePlume() {
  const el = useContext(CanvasContext)?.canvasRef;
  const canvas = useRef<HTMLCanvasElement | null>(null);
  const context = useRef<CanvasRenderingContext2D | null>(null);
  let ctx: CanvasRenderingContext2D;
  const pendingTask: Function[] = [];
  const init = (width: number, height: number) => {
    canvas.current = el.current!;
    context.current = canvas.current!.getContext('2d');
    ctx = context.current!;
    canvas.current.width = width;
    canvas.current.height = height;
    if (!ctx) {
      return;
    }
  };
  const drawLine = (point1: Point, point2: Point, color: string) => {
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.moveTo(point1.x, point1.y);
    ctx.lineTo(point2.x, point2.y);
    ctx.stroke();
  };
  const draw = () => {
    pendingTask.push(() => {
      step(
        {
          start: { x: WIDTH / 2, y: HEIGHT },
          length: 20,
          theta: Math.PI / 2 + Math.random() * 0.5 - 0.25,
        },
        0
      );
    });
  };
  const drawBranch = (branch: Branch, color: string) => {
    drawLine(branch.start, getEndPoint(branch), color);
  };
  const getEndPoint = (branch: Branch): Point => {
    return {
      x: branch.start.x + branch.length * Math.cos(branch.theta),
      y: branch.start.y - branch.length * Math.sin(branch.theta),
    };
  };
  const step = (branch: Branch, depth) => {
    const end = getEndPoint(branch);
    drawBranch(branch, 'gary');
    if (depth < 4 || Math.random() < 0.4) {
      pendingTask.push(() =>
        step(
          {
            start: end,
            length: branch.length,
            theta: branch.theta + 0.25 * Math.random(),
          },
          depth + 1
        )
      );
    }
    if (depth < 4 || Math.random() < 0.4) {
      pendingTask.push(() =>
        step(
          {
            start: end,
            length: branch.length,
            theta: branch.theta - 0.25 * Math.random(),
          },
          depth + 1
        )
      );
    }
  };
  const frame = () => {
    const tasks = [...pendingTask];
    pendingTask.length = 0;
    tasks.forEach((fn) => fn());
  };
  let frameCount = 0;
  const startFrame = () => {
    requestAnimationFrame(() => {
      frameCount++;
      if (frameCount % 10 === 0) {
        frame();
      }
      startFrame();
    });
  };
  useEffect(() => {
    init(WIDTH, HEIGHT);
    draw();
    startFrame();
  }, []);
}
