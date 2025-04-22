# 🌍 spatialGPT

SpatialGPT is an innovative map exploration application that seamlessly integrates weather data insights, and conversational AI. Whether you're planning your next adventure, analyzing climate patterns, or exploring new destinations, SpatialGPT empowers you to access and interpret complex space effortlessly. 🚀

## 🌟 Features

1. **🗺️ Map Exploration**: Effortlessly navigate and explore maps with advanced search capabilities.

   - Search for specific locations by name or category.
   - Discover Points of Interest (e.g., restaurants, cafes, hotels) with ease.

2. **🌦️ Weather Visualization**: Overlay weather data directly on maps for a richer user experience.

3. **🗺️ Diverse Map Options**: Tailor your experience with a variety of map types.

   - **Satellite View**: Access detailed imagery for a bird's-eye perspective.
   - **Terrain View**: Analyze topographical features for outdoor planning.
   - **Street View**: Navigate urban areas with precision and clarity.

4. **🤖 AI-Powered Assistant**: Interact with SpatialGPT using natural language to ask questions, and get insights.

## Use cases

1. **Travel Planning**: Use SpatialGPT to explore destinations, check weather forecasts, and find nearby points of interest like restaurants, hotels, and attractions. E.g: **_Show me the weather forecast for Paris this weekend and suggest nearby cafes._**

2. **Outdoor Activities**: Plan hikes, camping trips, or other outdoor adventures with terrain maps and real-time weather data.

3. **Emergency Preparedness**: Stay informed about severe weather alerts and air quality conditions to ensure safety during emergencies.

4. **Business Applications**: Optimize logistics, site selection, or event planning by integrating weather and location-based insights.

## Ai assistant context:

    - User location (if user allow access)
    - Attached loacations during prompt
    - Current date and time
    - Weather data access

## APIs Used

1. **Open-Meteo API**:
   - [Weather Forecasts API](https://open-meteo.com/en/docs): Provides accurate and up-to-date weather forecasts.
   - [Historical Weather Data API](https://open-meteo.com/en/docs/historical-weather-api): Access historical weather data for analysis.
   - [Climate Insights API](https://open-meteo.com/en/docs/climate-api): Offers climate projections and insights.
   - [Air Quality API](https://open-meteo.com/en/docs/air-quality-api): Supplies air quality data for various locations.
   - [Marine Weather API](https://open-meteo.com/en/docs/marine-weather-api): Delivers marine weather forecasts, including wave heights and wind conditions.
   - [Satellite Radiation API](https://open-meteo.com/en/docs/satellite-radiation-api): Provides satellite-based radiation data.
   - [Flood API](https://open-meteo.com/en/docs/flood-api): Supplies river discharge and flood-related data for emergency preparedness.
   - [Ensemble Models API](https://open-meteo.com/en/docs/ensemble-api): Offers climate projections using multiple climate models.
2. **OpenStreetMap API**:
   - [Overpass API](https://wiki.openstreetmap.org/wiki/Overpass_API): Enables querying and retrieving map data, including Points of Interest (POI) such as restaurants, hotels, and cafes.
   - [Nominatim API](https://nominatim.org/): Provides geocoding and reverse geocoding services for location-based queries.
   - [Tile Server API](https://wiki.openstreetmap.org/wiki/Tile_servers): Supplies map tiles for rendering OpenStreetMap data in applications.

## 🛠️ Running Locally

### Prerequisites

Node.js, pnpm or npm

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/fullendmaestro/spatialGPT
   cd spatialGPT
   ```

2. Update environment variables:

   Get your Google Gemini API Key here https://cloud.google.com/vertex-ai
   If you want to support file upload with the chat bot: https://vercel.com/docs/storage/vercel-blob

   ```bash
   GOOGLE_GENERATIVE_AI_API_KEY=------
   BLOB_READ_WRITE_TOKEN=-----
   ```

3. Install dependencies:

   ```bash
   pnpm install
   ```

4. Run the project:

   ```bash
   pnpm run dev
   ```

   This start and application server running on `http://localhost:3000/`.

**_You can now Access the application at `http://localhost:3000`. 🌐_**

## 📜 License

This project is protected under the [Apache License](http://www.apache.org/licenses/LICENSE-2.0/) License. For more details, refer to the [LICENSE](https://github.com/fullendmaestro/spatialGPT/blob/main/LICENSE) file.

## Discord

![Discord](https://img.shields.io/badge/Discord-%235865F2.svg?style=for-the-badge&logo=discord&logoColor=white) fullendmaestro

## [**_Demo_**](https://spatial-gpt.vercel.app/)

**_🌟 Start exploring the world with SpatialGPT today! 🌟_**
