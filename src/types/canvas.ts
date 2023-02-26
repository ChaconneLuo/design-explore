export interface Point {
  x: number;
  y: number;
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
