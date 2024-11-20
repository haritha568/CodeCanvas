"use client";
import { memo } from "react";
import { LayerType } from "@/types/canvas";
import { useStorage } from "@liveblocks/react";

interface LayerPreviewProps {
  id: string;
  onLayerPointerDown: (e: React.PointerEvent, layerId: string) => void;
  selectionColor?: string;
}

const Arrow = ({
  id,
  layer,
  onPointerDown,
}: {
  id: string;
  layer: any;
  onPointerDown: (e: React.PointerEvent, layerId: string) => void;
}) => {
  // Calculate start and end points for the arrow
  const startPoint = { x: layer.x, y: layer.y };
  const endPoint = { x: layer.x + layer.width, y: layer.y + layer.height };

  return (
    <g onPointerDown={(e) => onPointerDown(e, id)}>
      <defs>
        <marker
          id={`arrow-${id}`}
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill={layer.stroke || "#000"} />
        </marker>
      </defs>
      <line
        x1={startPoint.x}
        y1={startPoint.y}
        x2={endPoint.x}
        y2={endPoint.y}
        stroke={layer.stroke || "black"}
        strokeWidth="2"
        markerEnd={`url(#arrow-${id})`}
      />
    </g>
  );
};

const Diamond = ({
  id,
  layer,
  onPointerDown,
}: {
  id: string;
  layer: any;
  onPointerDown: (e: React.PointerEvent, layerId: string) => void;
}) => {
  // Calculate center point and size for the diamond
  const centerX = layer.x + layer.width / 2;
  const centerY = layer.y + layer.height / 2;
  const size = Math.min(layer.width, layer.height);

  // Calculate diamond points
  const points = [
    `${centerX},${centerY - size/2}`, // top
    `${centerX + size/2},${centerY}`, // right
    `${centerX},${centerY + size/2}`, // bottom
    `${centerX - size/2},${centerY}`  // left
  ].join(' ');

  return (
    <g onPointerDown={(e) => onPointerDown(e, id)}>
      <polygon
        points={points}
        fill={layer.fill ? `rgb(${layer.fill.r}, ${layer.fill.g}, ${layer.fill.b})` : 'white'}
        stroke={layer.stroke || 'black'}
        strokeWidth="2"
      />
    </g>
  );
};

export const LayerPreview = memo(
  ({ id, onLayerPointerDown }: LayerPreviewProps) => {
    const layer = useStorage((root) => root.layers.get(id));

    if (!layer) return null;

    if (layer.type === LayerType.Association) {
      return (
        <Arrow
          id={id}
          layer={layer}
          onPointerDown={onLayerPointerDown}
        />
      );
    }

    if (layer.type === LayerType.Dependency) {
      return (
        <Diamond
          id={id}
          layer={layer}
          onPointerDown={onLayerPointerDown}
        />
      );
    }

    return null;
  }
);

LayerPreview.displayName = "LayerPreview";