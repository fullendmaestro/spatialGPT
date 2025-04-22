"use client";

import { useEffect, useRef, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useMapStore } from "@/lib/store";
import { MapContextMenu } from "./map-context-menu";
import { MapControls } from "./map-controls";
import { DataVisualizationDrawer } from "./data-visualization-drawer";

// This component handles map events and updates the store
function MapEventHandler() {
  const { setCoordinate, openContextMenu } = useMapStore();

  useMapEvents({
    contextmenu: (e) => {
      const { lat, lng } = e.latlng;
      setCoordinate({ latitude: lat, longitude: lng });

      // Get pixel coordinate for the context menu
      const containerPoint = e.containerPoint;
      openContextMenu(containerPoint.x, containerPoint.y);

      // Prevent default context menu
      e.originalEvent.preventDefault();
    },
    click: () => {
      // Close context menu on map click
      useMapStore.getState().closeContextMenu();
    },
  });

  return null;
}

// This component handles map centering requests
function MapCenterHandler() {
  const map = useMap();
  const { centerRequest, clearCenterRequest } = useMapStore();

  useEffect(() => {
    if (centerRequest) {
      // Use flyTo for smooth animation to the requested coordinate
      map.flyTo(
        [centerRequest.latitude, centerRequest.longitude],
        14, // Zoom level
        {
          animate: true,
          duration: 1.5, // Animation duration in seconds
          easeLinearity: 0.25,
        }
      );

      // Clear the request after handling it
      clearCenterRequest();
    }
  }, [centerRequest, clearCenterRequest, map]);

  return null;
}

// This component renders the map controls
function MapControlsWrapper({
  mapType,
  setMapType,
}: {
  mapType: "street" | "satellite" | "terrain";
  setMapType: (type: "street" | "satellite" | "terrain") => void;
}) {
  return <MapControls mapType={mapType} setMapType={setMapType} />;
}

const Map = () => {
  const {
    userPosition,
    setUserPosition,
    coordinate,
    setCoordinate,
    isContextMenuOpen,
  } = useMapStore();
  const mapRef = useRef<L.Map | null>(null);
  const [mapType, setMapType] = useState<"street" | "satellite" | "terrain">(
    "street"
  );

  useEffect(() => {
    // Set default Leaflet marker icons
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
      shadowUrl:
        "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
    });

    // Get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (location) => {
          const { latitude, longitude } = location.coords;
          setUserPosition({ latitude, longitude }); // Update userPosition in the store
          setCoordinate({ latitude, longitude });
        },
        (error) => {
          console.error("Error getting location:", error);
          // Fallback to a default position if location access is denied
          setUserPosition({
            latitude: coordinate.latitude,
            longitude: coordinate.longitude,
          });
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      setUserPosition({
        latitude: coordinate.latitude,
        longitude: coordinate.longitude,
      });
    }
  }, [
    setUserPosition,
    setCoordinate,
    coordinate.latitude,
    coordinate.longitude,
  ]);

  const markerPosition: [number, number] = [
    coordinate.latitude,
    coordinate.longitude,
  ];

  // Get the appropriate tile layer URL based on the map type
  const getTileLayerUrl = () => {
    switch (mapType) {
      case "street":
        return "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
      case "satellite":
        return "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
      case "terrain":
        return "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png";
      default:
        return "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
    }
  };

  // Get the appropriate attribution based on the map type
  const getTileLayerAttribution = () => {
    switch (mapType) {
      case "street":
        return '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
      case "satellite":
        return "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community";
      case "terrain":
        return 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)';
      default:
        return '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
    }
  };

  return (
    <div className="h-full w-full relative">
      {userPosition ? (
        <MapContainer
          center={markerPosition}
          zoom={13}
          scrollWheelZoom={true}
          style={{ height: "100%", width: "100%" }}
          ref={mapRef}
        >
          <TileLayer
            attribution={getTileLayerAttribution()}
            url={getTileLayerUrl()}
          />

          <Marker position={markerPosition}>
            <Popup>
              Selected location <br />
              Latitude: {markerPosition[0].toFixed(4)}, Longitude:{" "}
              {markerPosition[1].toFixed(4)}
            </Popup>
          </Marker>

          <MapEventHandler />
          <MapCenterHandler />
          <MapControlsWrapper mapType={mapType} setMapType={setMapType} />
        </MapContainer>
      ) : (
        <div className="flex items-center justify-center h-full w-full">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
        </div>
      )}

      {isContextMenuOpen && (
        <MapContextMenu
          onClose={() => useMapStore.getState().closeContextMenu()}
        />
      )}

      {/* Data visualization drawer */}
      <DataVisualizationDrawer />
    </div>
  );
};

export default Map;
