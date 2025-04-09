import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const Map = () => {
  const [position, setPosition] = useState<[number, number] | null>(null);

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
        },
        (error) => {
          console.error("Error getting location:", error);
          // Fallback to a default position if location access is denied
          setPosition([51.505, -0.09]); // Default to London
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      setPosition([51.505, -0.09]); // Default to London
    }
  }, []);

  return (
    <div className="h-screen w-screen">
      {position ? (
        <MapContainer
          center={position}
          zoom={13}
          scrollWheelZoom={false}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={position}>
            <Popup>
              You are here! <br /> Latitude: {position[0]}, Longitude:{" "}
              {position[1]}.
            </Popup>
          </Marker>
        </MapContainer>
      ) : (
        <div className="flex items-center justify-center h-screen w-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
        </div>
      )}
    </div>
  );
};

export default Map;
