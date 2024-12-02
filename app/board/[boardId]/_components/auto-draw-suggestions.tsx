import React, { useState, useEffect } from 'react';
import { 
    Circle, Square, Triangle, Star, Heart, 
    ArrowRight, Cloud, Sun, Moon, 
    Umbrella, Computer, Smartphone,
    Car, Bike, Trees, Home,
    Music, Camera
} from 'lucide-react';

interface ShapeDefinition {
    id: string;
    name: string;
    icon: React.ReactNode;
    path?: string; // For custom SVG paths
}

// Extended shape library
const shapeLibrary: ShapeDefinition[] = [
    { id: 'circle', name: 'Circle', icon: <Circle /> },
    { id: 'square', name: 'Square', icon: <Square /> },
    { id: 'triangle', name: 'Triangle', icon: <Triangle /> },
    { id: 'star', name: 'Star', icon: <Star /> },
    { id: 'heart', name: 'Heart', icon: <Heart /> },
    { id: 'arrow', name: 'Arrow', icon: <ArrowRight /> },
    { id: 'cloud', name: 'Cloud', icon: <Cloud /> },
    { id: 'sun', name: 'Sun', icon: <Sun /> },
    { id: 'moon', name: 'Moon', icon: <Moon /> },
    { id: 'computer', name: 'Computer', icon: <Computer /> },
    { id: 'phone', name: 'Phone', icon: <Smartphone /> },
    { id: 'car', name: 'Car', icon: <Car /> },
    { id: 'bike', name: 'Bicycle', icon: <Bike /> },
    { id: 'tree', name: 'Tree', icon: <Trees /> },
    { id: 'house', name: 'House', icon: <Home /> },
    { id: 'music', name: 'Music', icon: <Music /> },
    { id: 'camera', name: 'Camera', icon: <Camera /> },
    // Add more shapes as needed
];

interface AutoDrawSuggestionsProps {
    points: number[][];
    onSelectShape: (shapeType: string) => void;
    camera: { x: number; y: number };
    onKeepFreehand: () => void; // New prop for keeping freehand drawing
}

const AutoDrawSuggestions = ({ 
    points,
    onSelectShape,
    camera,
    onKeepFreehand
}: AutoDrawSuggestionsProps) => {
    const [suggestions, setSuggestions] = useState<Array<{ type: string; score: number }>>([]);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [showSuggestions, setShowSuggestions] = useState(false);

    useEffect(() => {
        if (points && points.length > 5) {
            // Calculate the center position of the drawing
            const sumX = points.reduce((acc, [x]) => acc + x, 0);
            const sumY = points.reduce((acc, [_, y]) => acc + y, 0);
            const avgX = sumX / points.length;
            const avgY = sumY / points.length;

            setPosition({
                x: avgX + camera.x,
                y: avgY + camera.y - 50
            });

            // Enhanced shape recognition logic
            const recognized = recognizeShape(points);
            setSuggestions(recognized);
            setShowSuggestions(true);
        }
    }, [points, camera]);

    // Enhanced shape recognition function
    const recognizeShape = (points: number[][]) => {
        // Your existing recognition logic, but enhanced with more shapes
        // This is a placeholder for more sophisticated recognition
        const results = [];
        
        // Calculate basic geometric properties
        const [minX, maxX, minY, maxY] = points.reduce(
            ([minX, maxX, minY, maxY], [x, y]) => [
                Math.min(minX, x),
                Math.max(maxX, x),
                Math.min(minY, y),
                Math.max(maxY, y),
            ],
            [Infinity, -Infinity, Infinity, -Infinity]
        );

        const width = maxX - minX;
        const height = maxY - minY;
        const aspectRatio = width / height;

        // Return more potential matches based on the drawing characteristics
        return shapeLibrary
            .map(shape => ({
                type: shape.id,
                score: calculateMatchScore(points, shape.id, aspectRatio)
            }))
            .filter(result => result.score > 0.5)
            .sort((a, b) => b.score - a.score)
            .slice(0, 6); // Show top 6 matches
    };

    const calculateMatchScore = (points: number[][], shapeType: string, aspectRatio: number) => {
        // This is where you'd implement more sophisticated shape matching
        // For now, using a simple scoring system
        let score = Math.random() * 0.5 + 0.5; // Placeholder for actual recognition
        
        // Add some basic geometric checks
        if (shapeType === 'circle' && Math.abs(aspectRatio - 1) < 0.2) {
            score += 0.3;
        }
        if (shapeType === 'square' && Math.abs(aspectRatio - 1) < 0.2) {
            score += 0.3;
        }
        // Add more shape-specific checks

        return Math.min(score, 1);
    };

    if (!showSuggestions) return null;

    return (
        <div 
            className="absolute bg-white rounded-lg shadow-lg p-2 z-50"
            style={{
                left: `${position.x}px`,
                top: `${position.y}px`,
                transform: 'translate(-50%, -100%)'
            }}
        >
            <div className="flex flex-col gap-2">
                <div className="text-sm font-medium text-gray-700 px-2">
                    Suggestions
                </div>
                <div className="flex flex-wrap gap-2 max-w-md">
                    {suggestions.map((shape, index) => {
                        const shapeInfo = shapeLibrary.find(s => s.id === shape.type);
                        return (
                            <button
                                key={index}
                                className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-md transition-colors"
                                onClick={() => onSelectShape(shape.type)}
                                title={shapeInfo?.name}
                            >
                                <div className="w-6 h-6">
                                    {shapeInfo?.icon}
                                </div>
                                <span className="text-xs text-gray-600">
                                    {Math.round(shape.score * 100)}%
                                </span>
                            </button>
                        );
                    })}
                </div>
                <div className="border-t border-gray-200 mt-2 pt-2">
                    <button
                        onClick={() => {
                            onKeepFreehand();
                            setShowSuggestions(false);
                        }}
                        className="w-full text-sm text-gray-600 hover:bg-gray-100 py-1 rounded"
                    >
                        Keep Freehand Drawing
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AutoDrawSuggestions;