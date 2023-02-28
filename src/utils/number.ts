import { Point } from '../types';

export const getNumberBit = (num: number): number => {
  let count = 0;
  while (num > 0) {
    count++;
    num = Math.floor(num / 10);
  }
  return count;
};

export const getPointOnLine = (point1: Point, point2: Point, proportion: number) => {
  if (proportion > 1) {
    proportion = 1;
  }
  if (proportion < 0) {
    proportion = 0;
  }
  return { x: point1.x + (point2.x - point1.x) * proportion, y: point1.y + (point2.y - point1.y) * proportion };
};
