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
  const imgHeight = 300,
    imgWidth = 200;
  let animationFrameId: number;

  const [dragTrigger, setDragTrigger] = useState<boolean>(false);
  const [triggerOffset, setTriggerOffset] = useState<Point>({ x: 0, y: 0 });
  let triggerPoint: Point = { x: WIDTH / 2, y: HEIGHT / 2 };
  const offset = { x: 0, y: 0 };

  const updateOffset = () => {
    offset.x = canvas.current!.offsetLeft;
    offset.y = canvas.current!.offsetTop;
    triggerPoint.x = offset.x + WIDTH / 2;
    triggerPoint.y = offset.y + HEIGHT / 2;
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
    const kunImage = new Image(imgWidth, imgHeight);
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
    ctx.quadraticCurveTo(WIDTH / 2, HEIGHT - 100, point2.x - offset.x + triggerOffset.x, point2.y - offset.y + triggerOffset.y);
    ctx.stroke();
  };
  const draw = () => {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    drawLine({ x: WIDTH / 2, y: HEIGHT }, triggerPoint);
  };
  const dragEventFunc = (e: MouseEvent) => {
    e.preventDefault();
    triggerPoint.x = e.pageX;
    triggerPoint.y = e.pageY;
    setTriggerOffset({ x: WIDTH / 2 + offset.x - triggerPoint.x, y: HEIGHT / 2 + offset.y - triggerPoint.y });
    setDragTrigger(true);
  };
  const moveFunc = (e: MouseEvent) => {
    e.preventDefault();
    if (dragTrigger) {
      triggerPoint.x = e.pageX;
      triggerPoint.y = e.pageY;
      imgContainer.current!.style.transform = `translate3d(${triggerPoint.x - WIDTH / 2 - imgWidth / 2 - offset.x + triggerOffset.x}px, ${triggerPoint.y - HEIGHT / 2 - imgHeight / 2 - offset.y + triggerOffset.y}px, 0)`;
    }
  };
  const freeFunc = (e: MouseEvent) => {
    setDragTrigger(false);
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
  }, [dragTrigger, triggerOffset]);
}
