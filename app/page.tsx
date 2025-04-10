import { MapComponent } from "@/components/app-map";
import { Chat } from "@/components/chat";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <ResizablePanelGroup
        className="flex h-full w-full"
        direction="horizontal"
      >
        {/* Chat Panel */}
        <ResizablePanel className="flex-1">
          <Chat />
        </ResizablePanel>

        {/* Resizable Handle */}
        <ResizableHandle withHandle />

        {/* Map Panel */}
        <ResizablePanel className="flex-1">
          <MapComponent />
        </ResizablePanel>
      </ResizablePanelGroup>
    </main>
  );
}
