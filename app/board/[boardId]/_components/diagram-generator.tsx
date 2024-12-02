"use client";

import { useState } from 'react';
import { useMutation } from "@liveblocks/react/suspense";
import { CanvasMode, LayerType, Layer, CanvasState } from "@/types/canvas";
import { nanoid } from "nanoid";
import { LiveObject } from "@liveblocks/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Wand2 } from "lucide-react";
import { toast } from "sonner";

interface DiagramGeneratorProps {
  setCanvasState: (state: CanvasState) => void;
}

export const DiagramGenerator = ({ setCanvasState }: DiagramGeneratorProps) => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const insertGeneratedElements = useMutation(({ storage, setMyPresence }, elements) => {
    const liveLayers = storage.get("layers");
    const liveLayerIds = storage.get("layerIds");
    const newLayerIds: string[] = [];

    try {
      elements.forEach((element: any) => {
        const layerId = nanoid();
        const layerType = getLayerType(element.type);
        
        const baseLayer = {
          type: layerType,
          x: element.position.x,
          y: element.position.y,
          height: element.size.height,
          width: element.size.width,
          fill: element.style.color,
          value: element.text || '',
          stroke: `rgb(${element.style.color.r}, ${element.style.color.g}, ${element.style.color.b})`
        };

        const layer = new LiveObject(baseLayer as Layer);
        liveLayerIds.push(layerId);
        liveLayers.set(layerId, layer);
        newLayerIds.push(layerId);

        // Handle connections
        if (element.connections) {
          element.connections.forEach((connection: any) => {
            if (connection.to >= 0 && connection.to < elements.length) {
              const connectionId = nanoid();
              const targetElement = elements[connection.to];
              
              const connectionLayer = new LiveObject({
                type: connection.type === 'diamond' ? LayerType.Dependency : LayerType.Association,
                x: element.position.x + element.size.width,
                y: element.position.y + element.size.height / 2,
                height: 2,
                width: calculateDistance(
                  element.position,
                  targetElement.position
                ),
                fill: element.style.color,
                stroke: `rgb(${element.style.color.r}, ${element.style.color.g}, ${element.style.color.b})`
              } as Layer);

              liveLayerIds.push(connectionId);
              liveLayers.set(connectionId, connectionLayer);
              newLayerIds.push(connectionId);
            }
          });
        }
      });

      setMyPresence({ selection: newLayerIds });
      // Fixed canvas state setting
      setCanvasState({
        mode: CanvasMode.None
      } as CanvasState);
      
      toast.success("Diagram generated successfully!");
    } catch (error) {
      console.error('Error inserting elements:', error);
      toast.error("Failed to create diagram elements");
    }
  }, []);

  const generateDiagram = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate-diagram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });

      if (!response.ok) {
        throw new Error(`Failed to generate diagram: ${response.statusText}`);
      }

      const elements = await response.json();
      if (!elements || elements.length === 0) {
        throw new Error('No diagram elements generated');
      }

      insertGeneratedElements(elements);
      setPrompt('');
    } catch (error) {
      console.error('Error generating diagram:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to generate diagram');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white rounded-lg shadow-lg p-4">
      <div className="flex gap-2">
        <Input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe any diagram (e.g., 'Create a system architecture with 3 microservices')"
          className="w-[400px]"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              generateDiagram();
            }
          }}
        />
        <Button
          onClick={generateDiagram}
          disabled={isGenerating || !prompt.trim()}
          className="flex items-center gap-2"
        >
          <Wand2 className="w-4 h-4" />
          {isGenerating ? 'Generating...' : 'Generate'}
        </Button>
      </div>
    </div>
  );
};

// Helper functions
function getLayerType(type: string): LayerType {
  switch (type.toLowerCase()) {
    case 'rectangle':
      return LayerType.Rectangle;
    case 'ellipse':
      return LayerType.Ellipse;
    case 'text':
      return LayerType.Text;
    case 'note':
      return LayerType.Note;
    case 'arrow':
      return LayerType.Association;
    case 'diamond':
      return LayerType.Dependency;
    default:
      return LayerType.Rectangle;
  }
}

function calculateDistance(point1: { x: number; y: number }, point2: { x: number; y: number }): number {
  return Math.sqrt(
    Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2)
  );
}