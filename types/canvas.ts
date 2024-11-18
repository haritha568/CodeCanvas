//Users/harithagampala/board-video/types/canvas.ts
export type Color = {
  r: number;
  g: number;
  b: number;
};

export type Camera = {
  x: number;
  y: number;
};

export enum LayerType {
  Rectangle,
  Ellipse,
  Path,
  Text,
  Note,
  Association,    // New arrow type
  Inheritance,    // New arrow type
  Dependency,     // New arrow type
  Implementation, // New arrow type
}

export type RectangleLayer = {
  type: LayerType.Rectangle;
  x: number;
  y: number;
  height: number;
  width: number;
  fill: Color;
  value?: string;
};

export type EllipseLayer = {
  type: LayerType.Ellipse;
  x: number;
  y: number;
  height: number;
  width: number;
  fill: Color;
  value?: string;
};

export type PathLayer = {
  type: LayerType.Path;
  x: number;
  y: number;
  height: number;
  width: number;
  fill: Color;
  points: number[][];
  value?: string;
};

export type TextLayer = {
  type: LayerType.Text;
  x: number;
  y: number;
  height: number;
  width: number;
  fill: Color;
  value?: string;
};

export type NoteLayer = {
  type: LayerType.Note;
  x: number;
  y: number;
  height: number;
  width: number;
  fill: Color;
  value?: string;
};

export type Point = {
  x: number;
  y: number;
};

export type XYWH = {
  x: number;
  y: number;
  height: number;
  width: number;
};

export enum Side {
  Top = 1,
  Bottom = 2,
  Left = 4,
  Right = 8,
}

export type CanvasState =
    | {
        mode: CanvasMode.None;
    }
    | {
        mode: CanvasMode.SelectionNet;
        origin: Point;
        current?: Point;
    }
    | {
        mode: CanvasMode.Translating;
        current: Point;
    }
    | {
        mode: CanvasMode.Inserting;
        layerType:
            | LayerType.Ellipse
            | LayerType.Rectangle
            | LayerType.Text
            | LayerType.Note
            | LayerType.Association
            | LayerType.Inheritance
            | LayerType.Dependency
            | LayerType.Implementation;
    }
    | {
        mode: CanvasMode.Pencil;
    }
    | {
        mode: CanvasMode.Pressing;
        origin: Point;
    }
    | {
        mode: CanvasMode.Resizing;
        initialBounds: XYWH;
        corner: Side;
    }
    | {
        mode: CanvasMode.Grid;
        backgroundTemplate?: string;
    }
    | {
        mode: CanvasMode.Grip;
        backgroundTemplate?: string;
    };



export enum CanvasMode {
    None,
    Pressing,
    SelectionNet,
    Translating,
    Inserting,
    Resizing,
    Pencil,
    Grid,
    Grip,
}

export type ArrowLayer = {
  type: LayerType.Association | LayerType.Inheritance | 
        LayerType.Dependency  | LayerType.Implementation;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  fill: Color;
  strokeWidth?: number;
  isDashed?: boolean;
  value?: string;
}; 

export type Layer =
  | RectangleLayer
  | EllipseLayer
  | PathLayer
  | TextLayer
  | NoteLayer
  | ArrowLayer;


