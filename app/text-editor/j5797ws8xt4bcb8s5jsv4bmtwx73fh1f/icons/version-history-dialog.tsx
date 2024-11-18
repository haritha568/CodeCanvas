import * as Dialog from "@radix-ui/react-dialog";
import { Suspense, useCallback, useMemo, useState, useEffect } from "react";
import {
  HistoryVersionSummaryList,
  HistoryVersionSummary,
} from "@liveblocks/react-ui";
import { HistoryVersionPreview } from "@liveblocks/react-lexical";
import { useHistoryVersions } from "@liveblocks/react";
import { History, X } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { HistoryVersion } from "@liveblocks/client";
import Loading from "../loading";

export default function VersionHistoryDialog() {
  const [isOpen, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onVersionRestore = useCallback(() => {
    setOpen(false);
  }, []);

  return (
    <Dialog.Root open={isOpen} onOpenChange={setOpen}>
      <Dialog.Trigger className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 h-8 w-8">
        <History className="h-5 w-5" />
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-all duration-100 data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=open]:fade-in" />
        
        <Dialog.Content className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-5xl translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] rounded-lg">
          <div className="flex items-center justify-between">
            <Dialog.Title className="text-lg font-semibold">Version History</Dialog.Title>
            <Dialog.Close className="rounded-full opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Dialog.Close>
          </div>

          {error && (
            <div className="p-4 text-red-500 bg-red-50 rounded-md">
              Error: {error} {/* Render the error message */}
            </div>
          )}

          <div className="h-[600px] overflow-hidden rounded-md border">
            <Suspense fallback={<Loading />}>
              <Versions onVersionRestore={onVersionRestore} setError={setError} />
            </Suspense>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

interface VersionsProps {
  onVersionRestore: () => void;
  setError: (error: string | null) => void;
}

function Versions({ onVersionRestore, setError }: VersionsProps) {
  const [selectedVersionId, setSelectedVersionId] = useState<string | null>(null);
  const { versions, isLoading, error } = useHistoryVersions();

  useEffect(() => {
    console.log("Fetched versions:", versions);
    console.log("Is loading:", isLoading);
    console.log("Error:", error);

    if (error) { console.error("Error details:", error); setError(error.message || "An unknown error occurred"); } else { setError(null); }
  }, [versions, isLoading, error, setError]);

  const selectedVersion = useMemo(
    () => versions?.find((version) => version.id === selectedVersionId),
    [selectedVersionId, versions]
  );

  const formatTimeAgo = (date: Date) => {
    return formatDistanceToNow(date, { addSuffix: true });
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <Loading />
      </div>
    );
  }

  if (!versions?.length) { return ( <div className="flex h-full items-center justify-center p-6 text-muted-foreground"> <div className="text-center"> <History className="mx-auto h-12 w-12 opacity-50" /> <p className="mt-2">No versions available yet. Please check back later.</p> <p className="text-sm text-muted-foreground"> Changes will be saved automatically as you edit. </p> </div> </div> ); }

  return (
    <div className="flex h-full divide-x">
      <div className="flex-1 min-w-0 h-full">
        {selectedVersion ? (
          <HistoryVersionPreview
            version={selectedVersion}
            className="w-full h-full p-4"
            onVersionRestore={onVersionRestore}
          />
        ) : (
          <div className="flex h-full items-center justify-center p-6 text-muted-foreground">
            <div className="text-center">
              <History className="mx-auto h-12 w-12 opacity-50" />
              <p className="mt-2">Select a version to preview</p>
            </div>
          </div>
        )}
      </div>

      <div className="w-80 h-full overflow-auto border-l">
        <div className="p-4 border-b">
          <h3 className="font-medium">Version History</h3>
          <p className="text-sm text-muted-foreground">
            {versions.length} version{versions.length !== 1 ? 's' : ''}
          </p>
        </div>

        <HistoryVersionSummaryList>
          {versions.map((version: HistoryVersion) => (
            <HistoryVersionSummary
              key={version.id}
              version={version}
              selected={version.id === selectedVersionId}
              onClick={() => {
                setSelectedVersionId(version.id);
              }}
              className={`p-4 cursor-pointer hover:bg-muted transition-colors ${
                version.id === selectedVersionId ? 'bg-accent' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <p className="font-medium">
                    Version {version.id.slice(0, 8)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {formatTimeAgo(version.createdAt)}
                  </p>
                </div>
              </div>
            </HistoryVersionSummary>
          ))}
        </HistoryVersionSummaryList>
      </div>
    </div>
  );
}
