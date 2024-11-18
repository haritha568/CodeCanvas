// toolbar.tsx
import { Skeleton } from "@/components/ui/skeleton";
import { ToolButton } from "./tool-button";
import {
    Circle,
    MousePointer2,
    Pencil,
    Redo2,
    Square,
    StickyNote,
    TypeIcon,
    Undo2,
    Grid,
    Grip,
    ArrowRight,
    ArrowRightToLine,
    Diamond,
    ChevronRight,
    ArrowLeftRight,
    ChevronsRight
} from "lucide-react";
import { CanvasMode, CanvasState, LayerType } from "@/types/canvas";
import { useEffect } from "react";
import { useSelf } from "@liveblocks/react/suspense";

interface ToolbarProps {
    canvasState: CanvasState;
    setCanvasState: (newState: CanvasState) => void;
    undo: () => void;
    redo: () => void;
    canUndo: boolean;
    canRedo: boolean;
    toggleGrid: () => void;
    toggleDots: () => void;
}

const Toolbar = ({
    canvasState,
    setCanvasState,
    undo,
    redo,
    canUndo,
    canRedo,
    toggleGrid,
    toggleDots,
}: ToolbarProps) => {
    const selection = useSelf((me) => me.presence.selection);

    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (selection?.length > 0) return;
            
            if (e.ctrlKey) {
                switch (e.key.toLowerCase()) {
                    case "a":
                        setCanvasState({ mode: CanvasMode.None });
                        break;
                    case "t":
                        setCanvasState({
                            layerType: LayerType.Text,
                            mode: CanvasMode.Inserting,
                        });
                        break;
                    case "n":
                        setCanvasState({
                            mode: CanvasMode.Inserting,
                            layerType: LayerType.Note,
                        });
                        break;
                    case "r":
                        setCanvasState({
                            mode: CanvasMode.Inserting,
                            layerType: LayerType.Rectangle,
                        });
                        break;
                    case "e":
                        setCanvasState({
                            mode: CanvasMode.Inserting,
                            layerType: LayerType.Ellipse,
                        });
                        break;
                    // Arrow shortcuts
                    case "1":
                        setCanvasState({
                            mode: CanvasMode.Inserting,
                            layerType: LayerType.Association,
                        });
                        break;
                    case "2":
                        setCanvasState({
                            mode: CanvasMode.Inserting,
                            layerType: LayerType.Inheritance,
                        });
                        break;
                    case "3":
                        setCanvasState({
                            mode: CanvasMode.Inserting,
                            layerType: LayerType.Dependency, // Add the new shortcut for Dependency
                        });
                        break;
                }
            }
        };

        document.addEventListener("keydown", onKeyDown);
        return () => document.removeEventListener("keydown", onKeyDown);
    }, [selection, setCanvasState]);

    return (
        <div className="absolute top-[50%] -translate-y-[50%] left-2 flex flex-col gap-y-4">
            {/* Basic Tools */}
            <div className="bg-white rounded-md p-1.5 flex gap-1 flex-col items-center shadow-md">
                <ToolButton
                    label="Select (Ctrl+A)"
                    icon={MousePointer2}
                    onClick={() => setCanvasState({ mode: CanvasMode.None })}
                    isActive={canvasState.mode === CanvasMode.None || canvasState.mode === CanvasMode.Translating || canvasState.mode === CanvasMode.SelectionNet || canvasState.mode === CanvasMode.Pressing || canvasState.mode === CanvasMode.Resizing}
                />
                <ToolButton
                    label="Text (Ctrl+T)"
                    icon={TypeIcon}
                    onClick={() => setCanvasState({ layerType: LayerType.Text, mode: CanvasMode.Inserting })}
                    isActive={canvasState.mode === CanvasMode.Inserting && canvasState.layerType === LayerType.Text}
                />
                <ToolButton
                    label="Sticky Note (Ctrl+N)"
                    icon={StickyNote}
                    onClick={() => setCanvasState({ mode: CanvasMode.Inserting, layerType: LayerType.Note })}
                    isActive={canvasState.mode === CanvasMode.Inserting && canvasState.layerType === LayerType.Note}
                />
                <ToolButton
                    label="Rectangle (Ctrl+R)"
                    icon={Square}
                    onClick={() => setCanvasState({ mode: CanvasMode.Inserting, layerType: LayerType.Rectangle })}
                    isActive={canvasState.mode === CanvasMode.Inserting && canvasState.layerType === LayerType.Rectangle}
                />
                <ToolButton
                    label="Ellipse (Ctrl+E)"
                    icon={Circle}
                    onClick={() => setCanvasState({ mode: CanvasMode.Inserting, layerType: LayerType.Ellipse })}
                    isActive={canvasState.mode === CanvasMode.Inserting && canvasState.layerType === LayerType.Ellipse}
                />
                <ToolButton
                    label="Pen"
                    icon={Pencil}
                    onClick={() => setCanvasState({ mode: CanvasMode.Pencil })}
                    isActive={canvasState.mode === CanvasMode.Pencil}
                />
            </div>

            {/* Arrow Tools */}
            <div className="bg-white rounded-md p-1.5 flex gap-1 flex-col items-center shadow-md">
                <h3 className="text-xs text-gray-500 font-medium px-1 mb-1">Arrows</h3>
                <ToolButton
                    label="Arrow"
                    icon={ArrowRight}
                    onClick={() => setCanvasState({ mode: CanvasMode.Inserting, layerType: LayerType.Association })}
                    isActive={canvasState.mode === CanvasMode.Inserting && canvasState.layerType === LayerType.Association}
                />
                <ToolButton
                    label="Dashed Line"
                    icon={ChevronRight}
                    onClick={() => setCanvasState({ mode: CanvasMode.Inserting, layerType: LayerType.Inheritance })}
                    isActive={canvasState.mode === CanvasMode.Inserting && canvasState.layerType === LayerType.Inheritance}
                />
                <ToolButton
                    label="Dotted Line"
                    icon={ChevronsRight}
                    onClick={() => setCanvasState({ mode: CanvasMode.Inserting, layerType: LayerType.Implementation })}
                    isActive={canvasState.mode === CanvasMode.Inserting && canvasState.layerType === LayerType.Implementation}
                />
                <ToolButton
                    label="Dependency Line (Ctrl+3)"
                    icon={ArrowLeftRight} // You can change the icon as needed
                    onClick={() => setCanvasState({ mode: CanvasMode.Inserting, layerType: LayerType.Dependency })}
                    isActive={canvasState.mode === CanvasMode.Inserting && canvasState.layerType === LayerType.Dependency}
                />
            </div>

            {/* Utility Tools */}
            <div className="bg-white rounded-md p-1.5 flex flex-col items-center shadow-md">
                <ToolButton
                    label="Undo (Ctrl+Z)"
                    icon={Undo2}
                    onClick={undo}
                    isDisabled={!canUndo}
                />
                <ToolButton
                    label="Redo (Ctrl+Shift+Z)"
                    icon={Redo2}
                    onClick={redo}
                    isDisabled={!canRedo}
                />
                <ToolButton
                    label="Toggle Grid"
                    icon={Grid}
                    onClick={toggleGrid}
                />
                <ToolButton
                    label="Toggle dots"
                    icon={Grip}
                    onClick={toggleDots}
                />
            </div>
        </div>
    );
};

export const ToolbarSkeleton = () => {
    return (
        <div className="absolute top-[50%] -translate-y-[50%] left-2 flex flex-col gap-y-4 rounded-md animate-shimmer bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 bg-[length:200%_100%] h-[360px] w-[52px]">
            <Skeleton />
        </div>
    );
};

export default Toolbar;
