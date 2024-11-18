// types/liveblocks.d.ts
import type { BaseHistoryVersion } from "@liveblocks/client";

declare module "@liveblocks/react" {
  interface HistoryVersion extends BaseHistoryVersion {
    id: string;
    createdAt: Date;
  }
}