"use client";
import { MapComponent } from "@/components/app-map";
import { Chat } from "@/components/chat";
import { Panel } from "@/components/panel";
import { CollapsedPanelList } from "@/components/panel-collapsed-list";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { useRef, useState } from "react";
import { ImperativePanelHandle } from "react-resizable-panels";

export default function Home() {
  const chatPanelRef = useRef<ImperativePanelHandle>(null);
  const mapPanelRef = useRef<ImperativePanelHandle>(null);

  const [collapsedPanels, setCollapsedPanels] = useState<
    { id: string; description: string; expand: () => void }[]
  >([]);

  const handleCollapse = (
    id: string,
    description: string,
    expand: () => void
  ) => {
    setCollapsedPanels((prev) => [...prev, { id, description, expand }]);
  };

  const handleExpand = (id: string) => {
    setCollapsedPanels((prev) => prev.filter((panel) => panel.id !== id));
  };

  return (
    <>
      <main className="flex flex-grow min-h-screen bg-gray-100">
        <CollapsedPanelList
          items={collapsedPanels.map((panel) => ({
            id: panel.id,
            description: panel.description,
          }))}
          onCollapse={(id) => {
            const panel = collapsedPanels.find((p) => p.id === id);
            if (panel) {
              panel.expand();
              handleExpand(id);
            }
          }}
        />
        <ResizablePanelGroup
          className="flex flex-grow h-full w-full border border-gray-300 shadow-lg rounded-lg overflow-hidden"
          direction="horizontal"
        >
          {/* Chat Panel */}
          <ResizablePanel
            ref={chatPanelRef}
            className="flex-1 bg-white border-r border-gray-300 rounded-l-lg"
            collapsible={true}
            collapsedSize={0}
            minSize={15}
            onCollapse={() => {
              handleCollapse("chat", "Chat Panel", () =>
                chatPanelRef.current?.expand()
              );
            }}
            onExpand={() => {
              handleExpand("chat");
            }}
          >
            <Panel
              description="Interact with SpatialGPT"
              collapse={() => chatPanelRef.current?.collapse()}
            >
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
            ref={mapPanelRef}
            className="flex-1 bg-white border-l border-gray-300 rounded-r-lg"
            collapsible={true}
            collapsedSize={0}
            minSize={20}
            onCollapse={() => {
              handleCollapse("map", "Map Panel", () =>
                mapPanelRef.current?.expand()
              );
            }}
            onExpand={() => {
              handleExpand("map");
            }}
          >
            <Panel
              description="Explore the Map"
              collapse={() => mapPanelRef.current?.collapse()}
            >
              <MapComponent />
            </Panel>
          </ResizablePanel>
        </ResizablePanelGroup>
      </main>
    </>
  );
}
