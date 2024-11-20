import { ToolButton } from "./tool-button";
import { CanvasMode, CanvasState, LayerType } from "@/types/canvas";
import { Diamond } from "lucide-react"; // Assuming you're using Lucide icons.

interface DiamondToolProps {
  canvasState: CanvasState;
  setCanvasState: (newState: CanvasState) => void;
}

export const DiamondTool = ({ canvasState, setCanvasState }: DiamondToolProps) => {
  const isActiveDiamondType = (layerType: LayerType) =>
    canvasState.mode === CanvasMode.Inserting &&
    canvasState.layerType === layerType;

  return (
    <div className="bg-white rounded-md p-1.5 flex flex-col items-center shadow-md">
      <div className="border-b border-gray-200 pb-2 mb-2">
        <h3 className="text-xs text-gray-500 font-medium px-1 mb-2">Shapes</h3>
        <ToolButton
          label="Diamond"
          icon={Diamond}
          onClick={() =>
            setCanvasState({
              mode: CanvasMode.Inserting,
              layerType: LayerType.Dependency, // Assuming 'Dependency' is used for diamonds.
            })
          }
          isActive={isActiveDiamondType(LayerType.Dependency)}
        />
      </div>
    </div>
  );
};

export default DiamondTool;
