//Users/harithagampala/board-video/components/room.tsx
"use client";

import { ReactNode } from "react";
import {
  LiveblocksProvider,
  RoomProvider,
  ClientSideSuspense,
} from "@liveblocks/react/suspense";
import { LiveMap, LiveObject, LiveList } from "@liveblocks/client";
import { Layer } from "@/types/canvas";
import { CompilationState } from "@/app/editor/[editorId]/_components/CollaborativeEditor";
interface RoomProps {
    children: ReactNode;
    roomId: string;
    fallback: NonNullable<ReactNode> | null;
    type?: "whiteboard" | "code";
    history?: boolean;
}

export const Room = ({ children, roomId, fallback, type = "whiteboard", history = true }: RoomProps) => {
  console.log("[Room] Initializing with:", { roomId, type });
  const getInitialPresence = () => {
    const basePresence = {
      cursor: null,
      selection: [],
      pencilDraft: null,
      pencilColor: null,
    };

    return type === "code" 
      ? {
          ...basePresence,
          codeSelection: null,
          codeLanguage: "typescript",
        }
      : basePresence;
  };

  const getInitialStorage = () => {
    const baseStorage = {
      layers: new LiveMap<string, LiveObject<Layer>>(),
      layerIds: new LiveList<string>([]),
      //compilationState: new LiveObject<CompilationState>
    };

    return type === "code"
      ? {
          ...baseStorage,
          codeContent: new LiveObject({
            content: "",
            language: "typescript",
          }),
        }
      : baseStorage;
  };
    return (
        <LiveblocksProvider authEndpoint = "/api/liveblocks-auth">
        <RoomProvider 
        id={roomId} 
        initialPresence={{
            cursor: null,
            selection: [],pencilDraft: null, pencilColor: null,codeSelection: null,
            codeLanguage: "javascript",cursorAwareness: null}} initialStorage={{
                layers: new LiveMap<string, LiveObject<Layer>>(),
                layerIds: new LiveList<string>([]), 
                codeContent: new LiveObject<{ content: string; language: string }>({
                    content: "", 
                    language: "python3" 
                  }),
                  compilationState: new LiveObject<CompilationState>({
                    output: "",
                    compiledBy: "",
                    timestamp: Date.now(),
                  }),
            }} >
            <ClientSideSuspense fallback ={fallback}>
                {children}
            </ClientSideSuspense>

        </RoomProvider>
        </LiveblocksProvider>
    );
};