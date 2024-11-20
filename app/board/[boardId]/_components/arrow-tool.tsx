//Users/harithagampala/board-video/app/board/[boardId]/_components/arrow-tool.tsx
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
    </div>
  );
};

export default ArrowTools;
