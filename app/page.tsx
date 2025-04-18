"use client";
import { MapComponent } from "@/components/app-map";
import { Chat } from "@/components/chat";
import { Panel } from "@/components/panel";
import { PanelCollapsedHeader } from "@/components/panel-collapsed-header";
import { PanelCollapsedList } from "@/components/panel-collapsed-list";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { useRef, useState } from "react";
import { ImperativePanelHandle } from "react-resizable-panels";

export default function Home() {
  const chatpanelref = useRef<ImperativePanelHandle>(null);
  const collapse = () => {
    const panel = chatpanelref.current;
    if (panel) {
      panel.collapse();
    }
  };

  const items = [
    { id: "1", description: "It 1" },
    { id: "2", description: "Item 2" },
    { id: "3", description: "Item 3" },
  ];

  const handleCollapse = (id: string) => {
    console.log(`Collapsed item with id: ${id}`);
  };
  return (
    <>
      <main className="flex flex-grow min-h-screen bg-gray-100">
        <PanelCollapsedList items={items} onCollapse={handleCollapse} />
        <ResizablePanelGroup
          className="flex flex-grow h-full w-full border border-gray-300 shadow-lg rounded-lg overflow-hidden"
          direction="horizontal"
        >
          {/* Chat Panel */}
          <ResizablePanel
            ref={chatpanelref}
            className="flex-1 bg-white border-r border-gray-300 rounded-l-lg"
            collapsible={true}
            collapsedSize={0}
            minSize={15}
            onCollapse={() => {
              console.log("collapsed");
            }}
            onExpand={() => {
              console.log("expanded");
            }}
          >
            <Panel description="Interact with SpatialGPT" collapse={collapse}>
              <Chat />
            </Panel>
          </ResizablePanel>

          {/* Resizable Handle */}
          <ResizableHandle
            className="m-1 w-0.5 bg-gray-100 hover:bg-blue-700 cursor-col-resize flex items-center justify-center"
            withHandle
          />

          {/* Map Panel */}
          <ResizablePanel
            className="flex-1 bg-white border-l border-gray-300 rounded-r-lg"
            collapsible={true}
            collapsedSize={0}
            minSize={20}
          >
            <MapComponent />
          </ResizablePanel>
        </ResizablePanelGroup>
      </main>
    </>
  );
}
