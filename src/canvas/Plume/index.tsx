import React, { useContext, useEffect, useLayoutEffect, useRef } from 'react';
import { CanvasContext } from '@/src/stores/canvas';
import { Branch, Point } from '@/src/types';
const MIN_DEPTH = 4;

interface IProps {
  HEIGHT: number;
  WIDTH: number;
  color: string;
}

export default function usePlume({ HEIGHT = 600, WIDTH = 700, color = '#bfbfbf' }: IProps) {
  const canvasContext = useContext(CanvasContext);
  const el = canvasContext?.canvasRef;
  const canvas = useRef<HTMLCanvasElement | null>(null);
  const context = useRef<CanvasRenderingContext2D | null>(null);
  let ctx: CanvasRenderingContext2D;
  const pendingTask: Function[] = [];
  let frameCount = 0;
  let animationFrameId: number;
  const init = (width: number, height: number) => {
    canvas.current = el.current!;
    context.current = canvas.current!.getContext('2d');
    ctx = context.current!;
    canvas.current.width = width;
    canvas.current.height = height;
    if (!ctx) {
      return;
    }
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
  };
  const drawLine = (point1: Point, point2: Point) => {
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
          length: 5,
          theta: Math.PI / 2 + Math.random() * 0.5 - 0.25,
        },
        0
      );
    });
  };
  const drawBranch = (branch: Branch) => {
    drawLine(branch.start, getEndPoint(branch));
  };
  const getEndPoint = (branch: Branch): Point => {
    return {
      x: branch.start.x + branch.length * Math.cos(branch.theta),
      y: branch.start.y - branch.length * Math.sin(branch.theta),
    };
  };
  const check = (point: Point) => {
    const { x, y } = point;
    if (x < 0 || x >= WIDTH || y < 0 || y >= HEIGHT) {
      return false;
    }
    return true;
  };
  const step = (branch: Branch, depth: number) => {
    const end = getEndPoint(branch);
    if (!check(end)) {
      return;
    }
    drawBranch(branch);
    if ((depth < MIN_DEPTH && Math.random() < 0.7) || Math.random() < 0.5) {
      pendingTask.push(() =>
        step(
          {
            start: end,
            length: branch.length,
            theta: branch.theta + 0.3 * Math.random(),
          },
          depth + 1
        )
      );
    }
    if ((depth < MIN_DEPTH && Math.random() < 0.9) || Math.random() < 0.5) {
      pendingTask.push(() =>
        step(
          {
            start: end,
            length: branch.length,
            theta: branch.theta - 0.3 * Math.random(),
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
  const startFrame = () => {
    animationFrameId = requestAnimationFrame(() => {
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
    return () => {
      cancelAnimationFrame(animationFrameId);
      canvasContext.recover();
    };
  }, []);
}
