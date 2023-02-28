import { CanvasContext } from '@/src/stores/canvas';
import { Point } from '@/src/types';
import React, { useContext, useEffect, useRef, useState } from 'react';
import kun from './assets/img/kun.png';

interface IProps {
  HEIGHT: number;
  WIDTH: number;
  color: string;
}

export default function useIkun({ HEIGHT = 600, WIDTH = 600, color = '#182562' }: IProps) {
  const canvasContext = useContext(CanvasContext);
  const el = canvasContext?.canvasRef;
  const canvas = useRef<HTMLCanvasElement | null>(null);
  const context = useRef<CanvasRenderingContext2D | null>(null);
  let ctx: CanvasRenderingContext2D;

  const imgContainer = useRef<HTMLDivElement | null>(null);
  let animationFrameId: number;

  const [dragToggle, setDragToggle] = useState<boolean>(false);
  let togglePoint: Point = { x: WIDTH / 2, y: HEIGHT / 2 };

  const offset = { x: 0, y: 0 };

  const updateOffset = () => {
    offset.x = canvas.current!.offsetLeft;
    offset.y = canvas.current!.offsetTop;
    togglePoint.x = offset.x + WIDTH / 2;
    togglePoint.y = offset.y + HEIGHT / 2;
  };

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

  const initKunImage = () => {
    const kunImage = new Image(197, 300);
    kunImage.src = kun;
    imgContainer.current = document.createElement('div');
    imgContainer.current.style.position = 'absolute';
    imgContainer.current.style.left = '50%';
    imgContainer.current.style.top = '50%';
    imgContainer.current.style.transform = `translate3d(-50%, -50% , 0)`;
    imgContainer.current.style.display = 'flex';
    kunImage.draggable = false;
    imgContainer.current.appendChild(kunImage);
    document.getElementById('root')!.appendChild(imgContainer.current);
  };

  const removeKunImage = () => {
    document.getElementById('root')!.removeChild(imgContainer.current!);
  };

  const drawLine = (point1: Point, point2: Point) => {
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 10;
    ctx.moveTo(point1.x, point1.y);
    ctx.quadraticCurveTo(WIDTH / 2, HEIGHT - 100, point2.x - offset.x, point2.y - offset.y);
    ctx.stroke();
  };
  const draw = () => {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    drawLine({ x: WIDTH / 2, y: HEIGHT }, togglePoint);
    console.log(togglePoint);
  };
  const dragEventFunc = (e: MouseEvent) => {
    e.preventDefault();
    togglePoint.x = e.pageX;
    togglePoint.y = e.pageY;
    setDragToggle(true);
  };
  const moveFunc = (e: MouseEvent) => {
    e.preventDefault();
    if (dragToggle) {
      togglePoint.x = e.pageX;
      togglePoint.y = e.pageY;
      imgContainer.current!.style.transform = `translate3d(${togglePoint.x - WIDTH}px, ${togglePoint.y - HEIGHT + 100}px, 0)`;
    }
  };
  const freeFunc = (e: MouseEvent) => {
    setDragToggle(false);
  };
  const initEvent = () => {
    imgContainer.current!.addEventListener('mousedown', dragEventFunc);
    document.getElementById('root')!.addEventListener('mousemove', moveFunc);
    document.getElementById('root')!.addEventListener('mouseup', freeFunc);
  };
  const cacelEvent = () => {};

  const frame = () => {
    draw();
  };

  const startFrame = () => {
    animationFrameId = requestAnimationFrame(() => {
      frame();
      startFrame();
    });
  };

  useEffect(() => {
    init(WIDTH, HEIGHT);
    initKunImage();
    updateOffset();
    initEvent();
    draw();
    startFrame();
    return () => {
      removeKunImage();
      cacelEvent();
      cancelAnimationFrame(animationFrameId);
      canvasContext.recover();
    };
  }, [dragToggle]);
}
