"use client";

import { ReactNode} from "react";
import { ClientSideSuspense, LiveblocksProvider } from "@liveblocks/react/suspense";

import { RoomProvider } from "@liveblocks/react/suspense";
import { LiveMap, LiveList, LiveObject } from "@liveblocks/client";
import { Layer } from "@/types/canvas";

interface RoomProps  {
    children: ReactNode
    roomId: string;
    fallback: NonNullable <ReactNode> | null;
  }; 
  

export const Room = ({ 
    children, roomId, fallback} : RoomProps) => {
    return (
        <LiveblocksProvider authEndpoint = "/api/liveblocks-auth">
        <RoomProvider 
        id={roomId} 
        initialPresence={{
            cursor: null,
            selection: [],pencilDraft: null, pencilColor: null}} initialStorage={{
                layers: new LiveMap<string, LiveObject<Layer>>(),
                layerIds: new LiveList<string>([]),
            }}>
            <ClientSideSuspense fallback ={fallback}>
                {children}
            </ClientSideSuspense>

        </RoomProvider>
        </LiveblocksProvider>
    );
};