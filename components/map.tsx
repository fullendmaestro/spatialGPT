"use client";

import { useEffect, useState, useRef } from "react";
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

const Map = () => {
  const [position, setPosition] = useState<[number, number] | null>(null);
  const { coordinate, setCoordinate, isContextMenuOpen } = useMapStore();
  const mapRef = useRef<L.Map | null>(null);

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
          setPosition([latitude, longitude]);
          setCoordinate({ latitude, longitude });
        },
        (error) => {
          console.error("Error getting location:", error);
          // Fallback to a default position if location access is denied
          setPosition([coordinate.latitude, coordinate.longitude]);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      setPosition([coordinate.latitude, coordinate.longitude]);
    }
  }, [setCoordinate, coordinate.latitude, coordinate.longitude]);

  const markerPosition: [number, number] = position
    ? position
    : [coordinate.latitude, coordinate.longitude];

  return (
    <div className="h-full w-full relative">
      {position ? (
        <MapContainer
          center={markerPosition}
          zoom={13}
          scrollWheelZoom={true}
          style={{ height: "100%", width: "100%" }}
          ref={mapRef}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
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
    </div>
  );
};

export default Map;
