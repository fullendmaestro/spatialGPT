// Nominatim is OpenStreetMap's open-source geocoding service
// Documentation: https://nominatim.org/release-docs/latest/api/Search/

export interface PlaceResult {
  place_id: number;
  licence: string;
  osm_type: string;
  osm_id: number;
  boundingbox: string[];
  lat: string;
  lon: string;
  display_name: string;
  class: string;
  type: string;
  importance: number;
  icon?: string;
  address?: {
    city?: string;
    state?: string;
    country?: string;
    country_code?: string;
  };
}

export async function searchPlaces(query: string): Promise<PlaceResult[]> {
  if (!query || query.trim().length < 2) return [];

  try {
    // Using Nominatim API with format=json and limit=5 for reasonable results
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
        query
      )}&format=json&addressdetails=1&limit=5`,
      {
        headers: {
          // Adding a User-Agent is recommended by Nominatim's usage policy
          "User-Agent": "SpatialGPT-App",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Search request failed: ${response.status}`);
    }

    const data: PlaceResult[] = await response.json();
    return data;
  } catch (error) {
    console.error("Error searching places:", error);
    return [];
  }
}

export async function getPlaceDetails(
  placeId: number
): Promise<PlaceResult | null> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/details?place_id=${placeId}&format=json`,
      {
        headers: {
          "User-Agent": "SpatialGPT-App",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Details request failed: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching place details:", error);
    return null;
  }
}

// Get reverse geocoding (address from coordinates)
export async function reverseGeocode(
  lat: number,
  lon: number
): Promise<PlaceResult | null> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&addressdetails=1`,
      {
        headers: {
          "User-Agent": "SpatialGPT-App",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Reverse geocoding request failed: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error with reverse geocoding:", error);
    return null;
  }
}
