"use client";
import { MapComponent } from "@/components/app-map";
import { Chat } from "@/components/chat";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";

export default function Home() {
  return (
    <>
      <main className="flex min-h-screen flex-col bg-gray-100">
        <ResizablePanelGroup
          className="flex h-full w-full border border-gray-300 shadow-lg rounded-lg overflow-hidden"
          direction="horizontal"
        >
          {/* Chat Panel */}
          <ResizablePanel
            className="flex-1 bg-white border-r border-gray-300 rounded-l-lg"
            minSize={20}
          >
            <Chat />
          </ResizablePanel>

          {/* Resizable Handle */}
          <ResizableHandle
            className="m-1 w-0.5 bg-gray-100 hover:bg-blue-700 cursor-col-resize flex items-center justify-center"
            withHandle
          />

          {/* Map Panel */}
          <ResizablePanel
            className="flex-1 bg-white border-l border-gray-300 rounded-r-lg"
            minSize={20}
          >
            <MapComponent />
          </ResizablePanel>
        </ResizablePanelGroup>
      </main>
    </>
  );
}
