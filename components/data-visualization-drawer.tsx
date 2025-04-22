"use client";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import {
  useDrawerStore,
  type DataVisualizationType,
} from "@/lib/store/drawer-store";
import { useReverseGeocode } from "@/hooks/use-reverse-geocode";
import { DataVisualizationTabs } from "./data-visualization-tabs";
import { DataVisualizationContent } from "./data-visualization-content";
import { DataVisualizationControls } from "./data-visualization-controls";
import { X } from "lucide-react";

export function DataVisualizationDrawer() {
  const { isOpen, setOpen, coordinate, visualizationType } = useDrawerStore();
  const { data: placeNameResult, isLoading: isLoadingPlaceName } =
    useReverseGeocode(coordinate.latitude, coordinate.longitude);

  // Get a friendly name for the visualization type
  const getVisualizationTypeName = (type: DataVisualizationType): string => {
    switch (type) {
      case "weather-forecast":
        return "Weather Forecast";
      case "weather-history":
        return "Historical Weather";
      case "air-quality":
        return "Air Quality";
      case "climate-change":
        return "Climate Change";
      case "marine":
        return "Marine Forecast";
      case "flood":
        return "Flood Data";
      case "solar-radiation":
        return "Solar Radiation";
      case "ensemble-models":
        return "Ensemble Models";
      default:
        return "Data Visualization";
    }
  };

  // Get place name or coordinates string
  const getLocationString = (): string => {
    if (isLoadingPlaceName) return "Loading location...";
    if (placeNameResult?.display_name) {
      return placeNameResult.display_name.split(",")[0];
    }
    return `${coordinate.latitude.toFixed(4)}, ${coordinate.longitude.toFixed(
      4
    )}`;
  };

  return (
    <Drawer open={isOpen} onOpenChange={setOpen}>
      <DrawerContent className="absolute top-0 right-0 h-[85vh] max-h-[85vh] z-[1002]">
        <DrawerHeader className="border-b pb-4">
          <div className="flex items-center justify-between">
            <div>
              <DrawerTitle className="text-xl font-bold">
                {getVisualizationTypeName(visualizationType)}
              </DrawerTitle>
              <DrawerDescription>
                {getLocationString()} • {coordinate.latitude.toFixed(4)},{" "}
                {coordinate.longitude.toFixed(4)}
              </DrawerDescription>
            </div>
            <DrawerClose asChild>
              <Button variant="ghost" size="icon">
                <X className="h-4 w-4" />
              </Button>
            </DrawerClose>
          </div>

          <DataVisualizationTabs />
        </DrawerHeader>

        <div className="flex flex-col md:flex-row h-full overflow-hidden">
          <div className="w-full md:w-3/4 p-4 overflow-y-auto">
            <DataVisualizationContent />
          </div>

          <div className="w-full md:w-1/4 border-l p-4 overflow-y-auto">
            <DataVisualizationControls />
          </div>
        </div>

        <DrawerFooter className="border-t pt-4">
          <div className="flex justify-between items-center text-xs text-muted-foreground">
            <span>Data provided by Open-Meteo.com</span>
            <span>Last updated: {new Date().toLocaleString()}</span>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
