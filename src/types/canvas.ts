import { RequiredKeys } from '../utils/type';

export type Point = {
  x: number;
  y: number;
  z?: number;
  color?: {
    r: number;
    g: number;
    b: number;
    a: number;
  }
}

export interface Branch {
  start: Point;
  length: number;
  theta: number;
}

export interface PanelInfo {
  id: string;
  name: string;
}

export interface TagLinkInfo {
  no: string;
  path: string;
  name: string;
}
