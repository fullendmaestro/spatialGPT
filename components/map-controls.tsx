"use client";

import { useState, useRef, useEffect } from "react";
import {
  Search,
  Layers,
  ZoomIn,
  ZoomOut,
  Home,
  ChevronDown,
  MapPin,
  X,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMap } from "react-leaflet";
import { useMapStore } from "@/lib/store";
import { useOnClickOutside } from "@/hooks/use-click-outside";
import { usePlacesSearch, type PlaceResult } from "@/hooks/use-places-search";
import { usePOISearch, poiCategories } from "@/hooks/use-poi-search";
import L from "leaflet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";

interface MapControlsProps {
  setMapType: (type: "street" | "satellite" | "terrain") => void;
  mapType: "street" | "satellite" | "terrain";
}

const tabs = ["Places", "Points of Interest"];

export function MapControls({ setMapType, mapType }: MapControlsProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchTab, setSearchTab] = useState<"places" | "poi">("places");
  const [poiCategory, setPoiCategory] = useState<string>("restaurant");
  const [poiRadius, setPoiRadius] = useState<number>(500); // Default 500m radius
  const [poiSearchEnabled, setPoiSearchEnabled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const map = useMap();
  const { coordinate, setCoordinate } = useMapStore();
  const poiMarkersRef = useRef<L.Marker[]>([]);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoverStyle, setHoverStyle] = useState({});
  const [activeStyle, setActiveStyle] = useState({ left: "0px", width: "0px" });
  const tabRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (hoveredIndex !== null) {
      const hoveredElement = tabRefs.current[hoveredIndex];
      if (hoveredElement) {
        const { offsetLeft, offsetWidth } = hoveredElement;
        setHoverStyle({
          left: `${offsetLeft}px`,
          width: `${offsetWidth}px`,
        });
      }
    }
  }, [hoveredIndex]);

  useEffect(() => {
    const activeElement = tabRefs.current[activeIndex];
    if (activeElement) {
      const { offsetLeft, offsetWidth } = activeElement;
      setActiveStyle({
        left: `${offsetLeft}px`,
        width: `${offsetWidth}px`,
      });
    }
  }, [activeIndex]);

  useEffect(() => {
    requestAnimationFrame(() => {
      const initialElement = tabRefs.current[0];
      if (initialElement) {
        const { offsetLeft, offsetWidth } = initialElement;
        setActiveStyle({
          left: `${offsetLeft}px`,
          width: `${offsetWidth}px`,
        });
      }
    });
  }, []);

  // Places search with React Query
  const {
    data: placesResults = [],
    isLoading: isPlacesLoading,
    isError: isPlacesError,
  } = usePlacesSearch(searchQuery);

  // POI search with React Query
  const {
    data: poiResults = [],
    isLoading: isPoiLoading,
    isError: isPoiError,
  } = usePOISearch(
    poiCategory,
    poiRadius,
    coordinate.latitude,
    coordinate.longitude,
    poiSearchEnabled
  );

  useOnClickOutside(dropdownRef, () => setIsDropdownOpen(false));

  // Clear POI markers when component unmounts
  useEffect(() => {
    return () => {
      poiMarkersRef.current.forEach((marker) => {
        if (map.hasLayer(marker)) {
          map.removeLayer(marker);
        }
      });
    };
  }, [map]);

  // Update POI markers when results change
  useEffect(() => {
    // Clear existing markers
    poiMarkersRef.current.forEach((marker) => {
      if (map.hasLayer(marker)) {
        map.removeLayer(marker);
      }
    });

    // Create new markers for POI results
    const newMarkers = poiResults.map((poi) => {
      const lat = Number.parseFloat(poi.lat);
      const lon = Number.parseFloat(poi.lon);

      // Find the corresponding emoji for the category
      const categoryObj = poiCategories.find(
        (cat) => cat.name === poi.category
      );
      const emoji = categoryObj?.char || "📍";

      // Create custom icon with emoji
      const poiIcon = L.divIcon({
        className: "poi-marker",
        html: `<div class="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold border-2 border-white">${emoji}</div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      const marker = L.marker([lat, lon], { icon: poiIcon }).addTo(map)
        .bindPopup(`
          <div>
            <strong>${emoji} ${poi.display_name}</strong>
            <p>${poi.category}</p>
            ${poi.distance ? `<p>${poi.distance}m away</p>` : ""}
          </div>
        `);

      return marker;
    });

    // Update the ref with new markers
    poiMarkersRef.current = newMarkers;
  }, [poiResults, map]);

  // Handle selecting a search result
  const handleSelectLocation = (result: PlaceResult) => {
    const lat = Number.parseFloat(result.lat);
    const lon = Number.parseFloat(result.lon);

    // Fly to the location
    map.flyTo([lat, lon], 14);

    // Update the coordinate in the store
    setCoordinate({ latitude: lat, longitude: lon });

    // Add a temporary marker
    const marker = L.marker([lat, lon])
      .addTo(map)
      .bindPopup(result.display_name)
      .openPopup();

    // Remove the marker after 5 seconds
    setTimeout(() => {
      if (map.hasLayer(marker)) {
        map.removeLayer(marker);
      }
    }, 5000);

    // Clear search
    setSearchQuery("");
  };

  // Handle POI search
  const handlePOISearch = () => {
    setPoiSearchEnabled(true);
  };

  // Handle zoom controls
  const handleZoomIn = () => map.zoomIn();
  const handleZoomOut = () => map.zoomOut();
  const handleResetView = () => {
    // Get user's current location and zoom to it
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          map.flyTo([latitude, longitude], 13);
          setCoordinate({ latitude, longitude });
        },
        (error) => {
          console.error("Error getting location:", error);
          // Fallback to a default position
          map.setView([51.505, -0.09], 13);
        }
      );
    }
  };

  return (
    <div ref={dropdownRef} className="absolute top-2 right-2 z-[1000]">
      {/* Main dropdown button */}
      <Button
        variant="secondary"
        className="flex items-center gap-2 bg-white dark:bg-gray-800 shadow-md"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        Map Controls{" "}
        <ChevronDown
          className={`h-4 w-4 transition-transform ${
            isDropdownOpen ? "rotate-180" : ""
          }`}
        />
      </Button>

      {/* Dropdown menu */}
      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-md shadow-lg p-2 flex flex-col gap-2">
          {/* Search button */}
          <Button
            variant="outline"
            className="flex items-center justify-start gap-2"
            onClick={() => {
              setIsSearchOpen(!isSearchOpen);
              setIsDropdownOpen(false);
            }}
          >
            <Search className="h-4 w-4" /> Search places & POI
          </Button>

          {/* Zoom controls */}
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={handleZoomIn}>
              <ZoomIn className="h-4 w-4 mr-2" /> Zoom In
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleZoomOut}
            >
              <ZoomOut className="h-4 w-4 mr-2" /> Zoom Out
            </Button>
          </div>
          <Button variant="outline" onClick={handleResetView}>
            <Home className="h-4 w-4 mr-2" /> My Location
          </Button>

          {/* Layer selection */}
          <div className="border-t pt-2 mt-1">
            <div className="text-sm font-medium mb-2 flex items-center gap-2">
              <Layers className="h-4 w-4" /> Map Layers
            </div>
            <div className="grid grid-cols-3 gap-2">
              <Button
                size="sm"
                variant={mapType === "street" ? "default" : "outline"}
                className={`text-xs py-1 px-2 h-auto ${
                  mapType === "street" ? "bg-blue-500" : ""
                }`}
                onClick={() => setMapType("street")}
              >
                Street
              </Button>
              <Button
                size="sm"
                variant={mapType === "satellite" ? "default" : "outline"}
                className={`text-xs py-1 px-2 h-auto ${
                  mapType === "satellite" ? "bg-blue-500" : ""
                }`}
                onClick={() => setMapType("satellite")}
              >
                Satellite
              </Button>
              <Button
                size="sm"
                variant={mapType === "terrain" ? "default" : "outline"}
                className={`text-xs py-1 px-2 h-auto ${
                  mapType === "terrain" ? "bg-blue-500" : ""
                }`}
                onClick={() => setMapType("terrain")}
              >
                Terrain
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Search panel */}
      {isSearchOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-md shadow-lg p-3">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium">Search</h3>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={() => setIsSearchOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="relative">
            {/* Hover Highlight */}
            <div
              className="absolute h-[30px] transition-all duration-300 ease-out bg-[#0e0f1114] dark:bg-[#ffffff1a] rounded-[6px] flex items-center"
              style={{
                ...hoverStyle,
                opacity: hoveredIndex !== null ? 1 : 0,
              }}
            />

            {/* Active Indicator */}
            <div
              className="absolute bottom-[-6px] h-[2px] bg-[#0e0f11] dark:bg-white transition-all duration-300 ease-out"
              style={activeStyle}
            />

            {/* Tabs */}
            <div className="relative flex space-x-[6px] items-center mb-4">
              {tabs.map((tab, index) => (
                <div
                  key={index}
                  ref={(el) => {
                    tabRefs.current[index] = el; // Assign the element to the ref
                  }}
                  className={`px-3 py-2 cursor-pointer transition-colors duration-300 h-[30px] ${
                    index === activeIndex
                      ? "text-[#0e0e10] dark:text-white"
                      : "text-[#0e0f1199] dark:text-[#ffffff99]"
                  }`}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  onClick={() => setActiveIndex(index)}
                >
                  <div className="text-sm font-medium leading-5 whitespace-nowrap flex items-center justify-center h-full">
                    {tab}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {activeIndex === 0 && (
            <div>
              <div className="flex gap-2 mb-3">
                <Input
                  placeholder="Enter location name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1"
                />
              </div>

              {/* Places search results */}
              {isPlacesLoading && (
                <div className="flex justify-center py-4">
                  <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                </div>
              )}

              {isPlacesError && (
                <div className="text-sm text-red-500 text-center py-2">
                  Error loading results. Please try again.
                </div>
              )}

              {!isPlacesLoading && placesResults.length > 0 && (
                <div className="max-h-60 overflow-y-auto">
                  {placesResults.map((result, index) => (
                    <div
                      key={index}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md cursor-pointer flex items-start gap-2"
                      onClick={() => handleSelectLocation(result)}
                    >
                      <MapPin className="h-4 w-4 mt-1 flex-shrink-0 text-blue-500" />
                      <div>
                        <div className="text-sm font-medium">
                          {result.display_name.split(",")[0]}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {result.display_name}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {!isPlacesLoading &&
                searchQuery.length >= 2 &&
                placesResults.length === 0 && (
                  <div className="text-sm text-gray-500 dark:text-gray-400 text-center py-2">
                    No results found. Try a different search term.
                  </div>
                )}

              {!isPlacesLoading && searchQuery.length < 2 && (
                <div className="text-sm text-gray-500 dark:text-gray-400 text-center py-2">
                  Type at least 2 characters to search
                </div>
              )}
            </div>
          )}

          {activeIndex === 1 && (
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium">Category</label>
                <Select value={poiCategory} onValueChange={setPoiCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="z-[1001]">
                    {poiCategories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {`${category.char} ${category.name}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <div className="flex justify-between">
                  <label className="text-sm font-medium">
                    Radius: {poiRadius}m
                  </label>
                </div>
                <Slider
                  value={[poiRadius]}
                  min={100}
                  max={5000}
                  step={100}
                  onValueChange={(value) => setPoiRadius(value[0])}
                  className="my-2"
                />
              </div>

              <Button
                className="w-full"
                onClick={handlePOISearch}
                disabled={isPoiLoading}
              >
                {isPoiLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>Search Nearby</>
                )}
              </Button>

              {/* POI search results */}
              {isPoiError && (
                <div className="text-sm text-red-500 text-center py-2">
                  Error loading POIs. Please try again.
                </div>
              )}

              {!isPoiLoading && poiResults.length > 0 && (
                <div className="mt-2">
                  <div className="flex justify-between items-center mb-1">
                    <h4 className="text-sm font-medium">
                      Results ({poiResults.length})
                    </h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500"
                      onClick={() => {
                        // Clear all POI markers from the map
                        poiMarkersRef.current.forEach((marker) => {
                          if (map.hasLayer(marker)) {
                            map.removeLayer(marker);
                          }
                        });
                        // Reset the markers reference
                        poiMarkersRef.current = [];
                      }}
                    >
                      Clear Markers
                    </Button>
                  </div>
                  <div className="max-h-60 overflow-y-auto">
                    {poiResults.map((poi, index) => (
                      <div
                        key={index}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md cursor-pointer flex items-start gap-2"
                        onClick={() => {
                          const lat = Number.parseFloat(poi.lat);
                          const lon = Number.parseFloat(poi.lon);
                          map.flyTo([lat, lon], 16);

                          // Find and open the popup for this POI
                          poiMarkersRef.current[index]?.openPopup();
                        }}
                      >
                        <MapPin className="h-4 w-4 mt-1 flex-shrink-0 text-blue-500" />
                        <div>
                          <div className="text-sm font-medium">
                            {poi.display_name}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {poi.distance ? `${poi.distance}m away` : ""}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {!isPoiLoading && poiSearchEnabled && poiResults.length === 0 && (
                <div className="text-sm text-gray-500 dark:text-gray-400 text-center py-2">
                  No points of interest found in this area.
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
