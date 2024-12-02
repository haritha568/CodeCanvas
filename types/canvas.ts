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
  Rectangle = "rectangle",
  Ellipse = "ellipse",
  Path = "path",
  Text = "text",
  Note = "note",
  Association = "association",
  Dependency = "dependency"
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
export type Coordinates = [x: number, y: number, pressure: number];

export type PencilDraft = Coordinates[];


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
export type InsertableLayerType =
  | LayerType.Rectangle
  | LayerType.Ellipse
  | LayerType.Text
  | LayerType.Note
  | LayerType.Association
  | LayerType.Dependency;

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
      layerType: InsertableLayerType;
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
  type: LayerType.Association;
  x: number;
  y: number;
  width: number;
  height: number;
  stroke: string;
  value?: string;
  fill: Color;
};

export type DiamondLayer = {
  type: LayerType.Dependency;
  x: number;
  y: number;
  width: number;
  height: number;
  stroke: string;
  value?: string;
  fill: Color;
};


export type Layer =
  | RectangleLayer
  | EllipseLayer
  | PathLayer
  | TextLayer
  | NoteLayer
  | ArrowLayer
  | DiamondLayer;


