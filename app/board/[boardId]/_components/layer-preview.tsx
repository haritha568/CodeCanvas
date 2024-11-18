"use client";

import { useStorage } from "@liveblocks/react/suspense";
import { LayerType } from "@/types/canvas";
import { memo } from "react";
import { Rectangle } from "./rectangle";
import { Ellipse } from "./ellipse";
import { Text } from "./text";
import { Note } from "./note";
import { Path } from "./path";
import  {ArrowTools} from "./arrow-tool";
import { ArrowRight, ChevronRight, ChevronsRight, ArrowLeftRight, LucideProps } from "lucide-react"; // icons for arrows
import { colorToCss } from "@/lib/utils";
import { MouseEventHandler } from "react";

interface LayerPreviewProps {
    id: string;
    onLayerPointerDown: (e: React.PointerEvent, layerId: string) => void;
    selectionColor?: string;
}
interface ArrowLayerProps {
    icon: React.ComponentType<LucideProps>;
    onLayerPointerDown: (e: React.PointerEvent<HTMLDivElement>, id: string) => void;
    id: string;
    selectionColor?: string;
}

export const LayerPreview = memo(
    ({ id, onLayerPointerDown, selectionColor }: LayerPreviewProps) => {
        const layer = useStorage((root) => root.layers.get(id));
        if (!layer) return null;

        const ArrowLayer = ({ icon: Icon, onLayerPointerDown, id, selectionColor }: ArrowLayerProps) => (
            <div onPointerDown={(e) => onLayerPointerDown(e, id)}>
                <Icon size={24} color={selectionColor || "#000"} />
            </div>
        );

        switch (layer.type) {
            case LayerType.Path:
                return (
                    <Path
                        points={layer.points}
                        onPointerDown={(e) => onLayerPointerDown(e, id)}
                        x={layer.x}
                        y={layer.y}
                        fill={layer.fill ? colorToCss(layer.fill) : "#000"}
                        stroke={selectionColor}
                    />
                );
            case LayerType.Note:
                return (
                    <Note
                        id={id}
                        layer={layer}
                        onPointerDown={onLayerPointerDown}
                        selectionColor={selectionColor}
                    />
                );
            case LayerType.Text:
                return (
                    <Text
                        id={id}
                        layer={layer}
                        onPointerDown={onLayerPointerDown}
                        selectionColor={selectionColor}
                    />
                );
            case LayerType.Ellipse:
                return (
                    <Ellipse
                        id={id}
                        layer={layer}
                        onPointerDown={onLayerPointerDown}
                        selectionColor={selectionColor}
                    />
                );
            case LayerType.Rectangle:
                return (
                    <Rectangle
                        id={id}
                        layer={layer}
                        onPointerDown={onLayerPointerDown}
                        selectionColor={selectionColor}
                    />
                );
                case LayerType.Association: // Solid Arrow Layer
                return <ArrowLayer icon={ArrowRight} onLayerPointerDown={onLayerPointerDown} id={id} selectionColor={selectionColor} />;
            case LayerType.Inheritance: // Dashed Arrow Layer
                return <ArrowLayer icon={ChevronRight} onLayerPointerDown={onLayerPointerDown} id={id} selectionColor={selectionColor} />;
            case LayerType.Dependency: // Dotted Arrow Layer
                return <ArrowLayer icon={ChevronsRight} onLayerPointerDown={onLayerPointerDown} id={id} selectionColor={selectionColor} />;
            case LayerType.Implementation: // Double Arrow for Implementation
                return <ArrowLayer icon={ArrowLeftRight} onLayerPointerDown={onLayerPointerDown} id={id} selectionColor={selectionColor} />;
            default:
                console.warn(`Unsupported layer type`);
                return null;
        }
    }
);

LayerPreview.displayName = "LayerPreview";