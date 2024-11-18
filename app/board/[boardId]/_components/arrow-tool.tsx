import { useEffect } from "react";
import { ToolButton } from "./tool-button";
import { 
  ArrowRight,
  ArrowRightToLine,
  ChevronRight,
  ChevronsRight,
  Circle
} from "lucide-react";
import { CanvasMode, CanvasState, LayerType } from "@/types/canvas";

interface ArrowToolsProps {
  canvasState: CanvasState;
  setCanvasState: (newState: CanvasState) => void;
}

export const ArrowTools = ({ canvasState, setCanvasState }: ArrowToolsProps) => {
  const isActiveArrowType = (layerType: LayerType) => 
    canvasState.mode === CanvasMode.Inserting && 
    canvasState.layerType === layerType;

  return (
    <div className="bg-white rounded-md p-1.5 flex flex-col items-center shadow-md">
      <div className="border-b border-gray-200 pb-2 mb-2">
        <h3 className="text-xs text-gray-500 font-medium px-1 mb-2">Arrows</h3>
        <ToolButton
          label="Arrow"
          icon={ArrowRight}
          onClick={() => setCanvasState({
            mode: CanvasMode.Inserting,
            layerType: LayerType.Association,
          })}
          isActive={isActiveArrowType(LayerType.Association)}
        />
      </div>

      <div className="border-b border-gray-200 pb-2 mb-2">
        <h3 className="text-xs text-gray-500 font-medium px-1 mb-2">Lines</h3>
        <ToolButton
          label="Line"
          icon={ArrowRightToLine}
          onClick={() => setCanvasState({
            mode: CanvasMode.Inserting,
            layerType: LayerType.Dependency,
          })}
          isActive={isActiveArrowType(LayerType.Dependency)}
        />
      </div>

      <div>
        <h3 className="text-xs text-gray-500 font-medium px-1 mb-2">Dashed Lines</h3>
        <ToolButton
          label="Dashed Line"
          icon={ChevronRight} // You can change this icon to a dashed-line icon if available
          onClick={() => setCanvasState({
            mode: CanvasMode.Inserting,
            layerType: LayerType.Inheritance,
          })}
          isActive={isActiveArrowType(LayerType.Inheritance)}
        />
        <ToolButton
          label="Dotted Line"
          icon={ChevronsRight} // Replace with a suitable icon for dotted lines
          onClick={() => setCanvasState({
            mode: CanvasMode.Inserting,
            layerType: LayerType.Implementation,
          })}
          isActive={isActiveArrowType(LayerType.Implementation)}
        />
      </div>
    </div>
  );
};

export default ArrowTools;
