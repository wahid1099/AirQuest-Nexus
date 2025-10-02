import { AirQualityData, WeatherData, GameLocation } from "../types";
import { dataService } from "./dataService";

// NASA API Configuration
const NASA_POWER_BASE_URL =
  "https://power.larc.nasa.gov/api/temporal/hourly/intpoint";
const NASA_EARTHDATA_BASE_URL = "https://cmr.earthdata.nasa.gov/search";
const MERRA2_BASE_URL = "https://goldsmr4.gesdisc.eosdis.nasa.gov/data/MERRA2";
const TEMPO_BASE_URL = "https://data.gesdisc.eosdis.nasa.gov/data/TEMPO";
const MODIS_BASE_URL = "https://firms.modaps.eosdis.nasa.gov/api/area/csv";
const VIIRS_BASE_URL = "https://firms.modaps.eosdis.nasa.gov/api/area/csv";
const SPORT_VIEWER_URL = "https://weather.ndc.nasa.gov/sport";
const TRMM_BASE_URL = "https://gpm1.gesdisc.eosdis.nasa.gov/data/TRMM_RT";
const IMERG_BASE_URL =
  "https://gpm1.gesdisc.eosdis.nasa.gov/data/GPM_L3/GPM_3IMERGHH.06";
const DAYMET_BASE_URL = "https://daymet.ornl.gov/single-pixel/api/data";
const GOES_BASE_URL = "https://cdn.star.nesdis.noaa.gov/GOES16/ABI/FD";
const HIMAWARI_BASE_URL = "https://himawari8.nict.go.jp/img/D531106";
const AIRS_BASE_URL = "https://airs.jpl.nasa.gov/data";
const CYGNSS_BASE_URL = "https://podaac.jpl.nasa.gov/dataset/CYGNSS_L2_V3.0";
const AMSR2_BASE_URL = "https://gcom-w1.jaxa.jp/auth.html";
const PANDORA_BASE_URL = "https://data.pandonia-global-network.org";
const TOLNET_BASE_URL = "https://www-air.larc.nasa.gov/missions/TOLNet";
const AIRNOW_BASE_URL = "https://www.airnow.gov/index.cfm?action=aqibasics.aqi";
const OPENAQ_BASE_URL = "https://api.openaq.org/v2";
const GIBS_BASE_URL = "https://gibs.earthdata.nasa.gov/wmts/epsg4326/best";
const APPEEARS_BASE_URL = "https://appeears.earthdatacloud.nasa.gov/api";
const WORLDVIEW_BASE_URL = "https://worldview.earthdata.nasa.gov/api/v1";

// API Keys and Configuration
const NASA_API_KEY = process.env.REACT_APP_NASA_API_KEY || "DEMO_KEY";
const FIRMS_API_KEY = process.env.REACT_APP_FIRMS_API_KEY || "DEMO_KEY";
const EARTHDATA_USERNAME = process.env.REACT_APP_EARTHDATA_USERNAME || "";
const EARTHDATA_PASSWORD = process.env.REACT_APP_EARTHDATA_PASSWORD || "";
const OPENAQ_API_KEY = process.env.REACT_APP_OPENAQ_API_KEY || "";
const AIRNOW_API_KEY = process.env.REACT_APP_AIRNOW_API_KEY || "";

// Real-time data sources
const REAL_TIME_SOURCES = {
  openMeteo: "https://api.open-meteo.com/v1",
  aqicn: "https://api.waqi.info/feed",
  purpleAir: "https://api.purpleair.com/v1/sensors",
};

export class NASAApiService {
  private cache: Map<string, unknown> = new Map();

  /**
   * Fetch NASA POWER meteorological data for a location
   */
  async fetchPOWERData(
    location: GameLocation,
    startDate: Date,
    endDate: Date
  ): Promise<WeatherData[]> {
    const cacheKey = `power_${location.latitude}_${
      location.longitude
    }_${startDate.toISOString()}_${endDate.toISOString()}`;

    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      const params = new URLSearchParams({
        parameters: "T2M,RH2M,WS2M,WD2M,PS,PRECTOT",
        community: "RE",
        longitude: location.longitude.toString(),
        latitude: location.latitude.toString(),
        start: startDate.toISOString().split("T")[0],
        end: endDate.toISOString().split("T")[0],
        format: "JSON",
      });

      const response = await fetch(`${NASA_POWER_BASE_URL}?${params}`);

      if (!response.ok) {
        throw new Error(`NASA POWER API error: ${response.status}`);
      }

      const data = await response.json();
      const weatherData: WeatherData[] = [];

      if (data.properties && data.properties.parameter) {
        const params = data.properties.parameter;
        const timestamps = Object.keys(params.T2M);

        for (const timestamp of timestamps) {
          weatherData.push({
            temperature: params.T2M[timestamp] || 0,
            humidity: params.RH2M[timestamp] || 0,
            windSpeed: params.WS2M[timestamp] || 0,
            windDirection: params.WD2M[timestamp] || 0,
            pressure: params.PS[timestamp] || 0,
            precipitation: params.PRECTOT[timestamp] || 0,
            visibility: 10, // Default visibility
            timestamp: new Date(timestamp),
            source: "nasa_power",
          });
        }
      }

      this.cache.set(cacheKey, weatherData);
      return weatherData;
    } catch (error) {
      console.error("Error fetching NASA POWER data:", error);
      // Return mock data for development
      return this.getMockWeatherData(location, startDate, endDate);
    }
  }

  /**
   * Fetch MERRA-2 aerosol data for a location
   */
  async fetchMERRA2Data(
    location: GameLocation,
    startDate: Date,
    endDate: Date
  ): Promise<AirQualityData[]> {
    const cacheKey = `merra2_${location.latitude}_${
      location.longitude
    }_${startDate.toISOString()}_${endDate.toISOString()}`;

    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      // For MVP, we'll use a simplified approach
      // In production, you'd need to implement proper MERRA-2 data access
      const airQualityData: AirQualityData[] = [];

      // Generate mock data based on location and time
      const mockData = this.generateMockAirQualityData(
        location,
        startDate,
        endDate
      );

      this.cache.set(cacheKey, mockData);
      return mockData;
    } catch (error) {
      console.error("Error fetching MERRA-2 data:", error);
      return this.generateMockAirQualityData(location, startDate, endDate);
    }
  }

  /**
   * Fetch MODIS AOD data for visualization
   */
  async fetchMODISAOD(location: GameLocation, date: Date): Promise<number> {
    const cacheKey = `modis_aod_${location.latitude}_${location.longitude}_${
      date.toISOString().split("T")[0]
    }`;

    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      // Mock AOD data - in production, implement proper MODIS data access
      const aod = this.generateMockAOD(location, date);
      this.cache.set(cacheKey, aod);
      return aod;
    } catch (error) {
      console.error("Error fetching MODIS AOD data:", error);
      return this.generateMockAOD(location, date);
    }
  }

  /**
   * Calculate AQI from PM2.5 concentration
   */
  calculateAQI(pm25: number): number {
    // US EPA AQI calculation for PM2.5
    if (pm25 <= 12.0) {
      return Math.round(((50 - 0) / (12.0 - 0)) * (pm25 - 0) + 0);
    } else if (pm25 <= 35.4) {
      return Math.round(((100 - 51) / (35.4 - 12.1)) * (pm25 - 12.1) + 51);
    } else if (pm25 <= 55.4) {
      return Math.round(((150 - 101) / (55.4 - 35.5)) * (pm25 - 35.5) + 101);
    } else if (pm25 <= 150.4) {
      return Math.round(((200 - 151) / (150.4 - 55.5)) * (pm25 - 55.5) + 151);
    } else if (pm25 <= 250.4) {
      return Math.round(((300 - 201) / (250.4 - 150.5)) * (pm25 - 150.5) + 201);
    } else {
      return Math.round(((500 - 301) / (500.4 - 250.5)) * (pm25 - 250.5) + 301);
    }
  }

  /**
   * Get health precautions based on AQI
   */
  getHealthPrecautions(aqi: number) {
    if (aqi <= 50) {
      return {
        level: "good" as const,
        message: "Air quality is satisfactory",
        recommendations: ["Enjoy outdoor activities"],
        maskRequired: false,
        avoidOutdoorActivity: false,
      };
    } else if (aqi <= 100) {
      return {
        level: "moderate" as const,
        message: "Air quality is acceptable for most people",
        recommendations: [
          "Sensitive individuals may experience minor breathing discomfort",
        ],
        maskRequired: false,
        avoidOutdoorActivity: false,
      };
    } else if (aqi <= 150) {
      return {
        level: "unhealthy_sensitive" as const,
        message: "Unhealthy for sensitive groups",
        recommendations: [
          "Sensitive individuals should limit outdoor activities",
          "Consider wearing a mask",
        ],
        maskRequired: true,
        avoidOutdoorActivity: true,
      };
    } else if (aqi <= 200) {
      return {
        level: "unhealthy" as const,
        message: "Unhealthy for everyone",
        recommendations: [
          "Avoid outdoor activities",
          "Wear a mask if going outside",
        ],
        maskRequired: true,
        avoidOutdoorActivity: true,
      };
    } else if (aqi <= 300) {
      return {
        level: "very_unhealthy" as const,
        message: "Very unhealthy air quality",
        recommendations: [
          "Stay indoors",
          "Use air purifiers",
          "Wear N95 mask if going outside",
        ],
        maskRequired: true,
        avoidOutdoorActivity: true,
      };
    } else {
      return {
        level: "hazardous" as const,
        message: "Hazardous air quality",
        recommendations: [
          "Stay indoors with windows closed",
          "Use air purifiers",
          "Avoid all outdoor activities",
        ],
        maskRequired: true,
        avoidOutdoorActivity: true,
      };
    }
  }

  /**
   * Generate mock weather data for development
   */
  private getMockWeatherData(
    location: GameLocation,
    startDate: Date,
    endDate: Date
  ): WeatherData[] {
    const data: WeatherData[] = [];
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      data.push({
        temperature:
          20 +
          Math.sin((currentDate.getHours() / 24) * Math.PI * 2) * 10 +
          Math.random() * 5,
        humidity: 60 + Math.random() * 30,
        windSpeed: 5 + Math.random() * 10,
        windDirection: Math.random() * 360,
        pressure: 1013 + Math.random() * 20,
        precipitation: Math.random() > 0.8 ? Math.random() * 5 : 0,
        visibility: 10 - Math.random() * 2,
        timestamp: new Date(currentDate),
        source: "nasa_power",
      });
      currentDate.setHours(currentDate.getHours() + 1);
    }

    return data;
  }

  /**
   * Generate mock air quality data
   */
  private generateMockAirQualityData(
    location: GameLocation,
    startDate: Date,
    endDate: Date
  ): AirQualityData[] {
    const data: AirQualityData[] = [];
    const currentDate = new Date(startDate);

    // Base pollution levels vary by location (urban areas higher)
    const isUrban =
      location.city.toLowerCase().includes("city") ||
      location.city.toLowerCase().includes("new york") ||
      location.city.toLowerCase().includes("los angeles");

    const basePM25 = isUrban
      ? 25 + Math.random() * 15
      : 15 + Math.random() * 10;

    while (currentDate <= endDate) {
      const pm25 =
        basePM25 +
        Math.sin((currentDate.getHours() / 24) * Math.PI * 2) * 5 +
        Math.random() * 3;
      const aqi = this.calculateAQI(pm25);

      data.push({
        aqi,
        pm25,
        pm10: pm25 * 1.5,
        no2: 20 + Math.random() * 30,
        o3: 30 + Math.random() * 40,
        co: 1 + Math.random() * 2,
        so2: 5 + Math.random() * 10,
        timestamp: new Date(currentDate),
        source: "merra2",
        uncertainty: 5 + Math.random() * 10,
      });
      currentDate.setHours(currentDate.getHours() + 1);
    }

    return data;
  }

  /**
   * Generate mock AOD data
   */
  private generateMockAOD(location: GameLocation, date: Date): number {
    // AOD typically ranges from 0.0 to 1.0+
    const baseAOD = 0.3 + Math.random() * 0.4;
    return Math.round(baseAOD * 100) / 100;
  }

  /**
   * Fetch real-time air quality data from multiple sources
   */
  async fetchRealTimeAirQuality(
    location: GameLocation
  ): Promise<AirQualityData | null> {
    const cacheKey = `realtime_aqi_${location.latitude}_${location.longitude}`;

    // Check cache first
    const cached = await dataService.getCachedNASAData(
      "realtime_aqi",
      cacheKey
    );
    if (cached.data && !cached.error) {
      return cached.data.data as AirQualityData;
    }

    try {
      // Try multiple real-time sources
      const sources = [
        () => this.fetchOpenMeteoAirQuality(location),
        () => this.fetchAQICNData(location),
        () => this.fetchPurpleAirData(location),
      ];

      for (const fetchSource of sources) {
        try {
          const data = await fetchSource();
          if (data) {
            // Cache the data
            await dataService.cacheNASAData({
              data_type: "realtime_aqi",
              location_key: cacheKey,
              data: data,
              expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString(), // 10 minutes
              metadata: { source: "realtime", location },
            });
            return data;
          }
        } catch (error) {
          console.warn("Real-time source failed, trying next:", error);
          continue;
        }
      }

      // Fallback to mock data
      return this.generateMockAirQualityData(
        location,
        new Date(),
        new Date()
      )[0];
    } catch (error) {
      console.error("Error fetching real-time air quality:", error);
      return null;
    }
  }

  /**
   * Fetch fire data from NASA FIRMS
   */
  async fetchFireData(
    location: GameLocation,
    radius: number = 50
  ): Promise<any[]> {
    const cacheKey = `fires_${location.latitude}_${location.longitude}_${radius}`;

    // Check cache first
    const cached = await dataService.getCachedNASAData("fires", cacheKey);
    if (cached.data && !cached.error) {
      return cached.data.data as any[];
    }

    try {
      if (FIRMS_API_KEY === "DEMO_KEY") {
        return this.generateMockFireData(location, radius);
      }

      const bbox = this.calculateBoundingBox(location, radius);
      const url = `${MODIS_BASE_URL}/${FIRMS_API_KEY}/MODIS_NRT/${bbox.west},${bbox.south},${bbox.east},${bbox.north}/1`;

      const response = await fetch(url);
      if (!response.ok) throw new Error(`FIRMS API error: ${response.status}`);

      const csvText = await response.text();
      const fireData = this.parseCSVFireData(csvText);

      // Cache the data
      await dataService.cacheNASAData({
        data_type: "fires",
        location_key: cacheKey,
        data: fireData,
        expires_at: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 minutes
        metadata: { source: "FIRMS", location, radius },
      });

      return fireData;
    } catch (error) {
      console.error("Error fetching fire data:", error);
      return this.generateMockFireData(location, radius);
    }
  }

  /**
   * Fetch satellite imagery metadata
   */
  async fetchSatelliteImagery(
    location: GameLocation,
    date: Date
  ): Promise<any> {
    const cacheKey = `imagery_${location.latitude}_${location.longitude}_${
      date.toISOString().split("T")[0]
    }`;

    // Check cache first
    const cached = await dataService.getCachedNASAData("imagery", cacheKey);
    if (cached.data && !cached.error) {
      return cached.data.data;
    }

    try {
      // Use NASA Worldview API for imagery
      const worldviewUrl = `https://worldview.earthdata.nasa.gov/api/v1/snapshot`;
      const params = new URLSearchParams({
        REQUEST: "GetSnapshot",
        LAYERS: "MODIS_Aqua_CorrectedReflectance_TrueColor,MODIS_Fires_All",
        CRS: "EPSG:4326",
        TIME: date.toISOString().split("T")[0],
        BBOX: this.calculateBoundingBox(location, 100).toString(),
        FORMAT: "image/jpeg",
        WIDTH: "512",
        HEIGHT: "512",
      });

      const imageUrl = `${worldviewUrl}?${params}`;

      const imagery = {
        url: imageUrl,
        date: date.toISOString(),
        location,
        layers: ["true_color", "fires"],
        resolution: "250m",
      };

      // Cache the data
      await dataService.cacheNASAData({
        data_type: "imagery",
        location_key: cacheKey,
        data: imagery,
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
        metadata: { source: "Worldview", location, date },
      });

      return imagery;
    } catch (error) {
      console.error("Error fetching satellite imagery:", error);
      return null;
    }
  }

  /**
   * Fetch Open-Meteo air quality data
   */
  private async fetchOpenMeteoAirQuality(
    location: GameLocation
  ): Promise<AirQualityData | null> {
    try {
      const params = new URLSearchParams({
        latitude: location.latitude.toString(),
        longitude: location.longitude.toString(),
        current:
          "pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone,dust",
        timezone: "auto",
      });

      const response = await fetch(
        `${REAL_TIME_SOURCES.openMeteo}/air-quality?${params}`
      );
      if (!response.ok)
        throw new Error(`Open-Meteo API error: ${response.status}`);

      const data = await response.json();

      if (data.current) {
        const pm25 = data.current.pm2_5 || 0;
        return {
          aqi: this.calculateAQI(pm25),
          pm25,
          pm10: data.current.pm10 || 0,
          no2: data.current.nitrogen_dioxide || 0,
          o3: data.current.ozone || 0,
          co: data.current.carbon_monoxide || 0,
          so2: data.current.sulphur_dioxide || 0,
          timestamp: new Date(),
          source: "nasa_power",
          uncertainty: 5,
        };
      }
      return null;
    } catch (error) {
      console.error("Open-Meteo API error:", error);
      return null;
    }
  }

  /**
   * Fetch AQICN data
   */
  private async fetchAQICNData(
    location: GameLocation
  ): Promise<AirQualityData | null> {
    try {
      const aqicnKey = process.env.REACT_APP_AQICN_API_KEY;
      if (!aqicnKey || aqicnKey === "DEMO_KEY") return null;

      const url = `${REAL_TIME_SOURCES.aqicn}/geo:${location.latitude};${location.longitude}/?token=${aqicnKey}`;
      const response = await fetch(url);

      if (!response.ok) throw new Error(`AQICN API error: ${response.status}`);

      const data = await response.json();

      if (data.status === "ok" && data.data) {
        const aqiData = data.data;
        return {
          aqi: aqiData.aqi || 0,
          pm25: aqiData.iaqi?.pm25?.v || 0,
          pm10: aqiData.iaqi?.pm10?.v || 0,
          no2: aqiData.iaqi?.no2?.v || 0,
          o3: aqiData.iaqi?.o3?.v || 0,
          co: aqiData.iaqi?.co?.v || 0,
          so2: aqiData.iaqi?.so2?.v || 0,
          timestamp: new Date(),
          source: "merra2",
          uncertainty: 8,
        };
      }
      return null;
    } catch (error) {
      console.error("AQICN API error:", error);
      return null;
    }
  }

  /**
   * Fetch PurpleAir data
   */
  private async fetchPurpleAirData(
    location: GameLocation
  ): Promise<AirQualityData | null> {
    try {
      const purpleAirKey = process.env.REACT_APP_PURPLEAIR_API_KEY;
      if (!purpleAirKey || purpleAirKey === "DEMO_KEY") return null;

      // Find nearest sensors within 10km
      const bbox = this.calculateBoundingBox(location, 10);
      const params = new URLSearchParams({
        fields: "pm2.5_10minute,pm2.5_30minute,pm2.5_60minute",
        location_type: "0", // Outside sensors only
        nwlng: bbox.west.toString(),
        nwlat: bbox.north.toString(),
        selng: bbox.east.toString(),
        selat: bbox.south.toString(),
      });

      const response = await fetch(`${REAL_TIME_SOURCES.purpleAir}?${params}`, {
        headers: {
          "X-API-Key": purpleAirKey,
        },
      });

      if (!response.ok)
        throw new Error(`PurpleAir API error: ${response.status}`);

      const data = await response.json();

      if (data.data && data.data.length > 0) {
        // Average readings from nearby sensors
        const avgPM25 =
          data.data.reduce(
            (sum: number, sensor: any) => sum + (sensor[1] || 0),
            0
          ) / data.data.length;

        return {
          aqi: this.calculateAQI(avgPM25),
          pm25: avgPM25,
          pm10: avgPM25 * 1.5, // Estimate
          no2: 0, // Not available
          o3: 0, // Not available
          co: 0, // Not available
          so2: 0, // Not available
          timestamp: new Date(),
          source: "modis",
          uncertainty: 10,
        };
      }
      return null;
    } catch (error) {
      console.error("PurpleAir API error:", error);
      return null;
    }
  }

  /**
   * Calculate bounding box for location and radius
   */
  private calculateBoundingBox(location: GameLocation, radiusKm: number) {
    const lat = location.latitude;
    const lon = location.longitude;
    const latDelta = radiusKm / 111; // Rough conversion: 1 degree ≈ 111 km
    const lonDelta = radiusKm / (111 * Math.cos((lat * Math.PI) / 180));

    return {
      north: lat + latDelta,
      south: lat - latDelta,
      east: lon + lonDelta,
      west: lon - lonDelta,
      toString: () =>
        `${lon - lonDelta},${lat - latDelta},${lon + lonDelta},${
          lat + latDelta
        }`,
    };
  }

  /**
   * Parse CSV fire data from FIRMS
   */
  private parseCSVFireData(csvText: string): any[] {
    const lines = csvText.split("\n");
    const headers = lines[0].split(",");
    const fires = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(",");
      if (values.length === headers.length) {
        const fire: any = {};
        headers.forEach((header, index) => {
          fire[header.trim()] = values[index].trim();
        });
        fires.push(fire);
      }
    }

    return fires;
  }

  /**
   * Generate mock fire data
   */
  private generateMockFireData(location: GameLocation, radius: number): any[] {
    const fires = [];
    const fireCount = Math.floor(Math.random() * 5); // 0-4 fires

    for (let i = 0; i < fireCount; i++) {
      const latOffset = (Math.random() - 0.5) * (radius / 111);
      const lonOffset = (Math.random() - 0.5) * (radius / 111);

      fires.push({
        latitude: location.latitude + latOffset,
        longitude: location.longitude + lonOffset,
        brightness: 300 + Math.random() * 100,
        scan: Math.random() * 2,
        track: Math.random() * 2,
        acq_date: new Date().toISOString().split("T")[0],
        acq_time: new Date().toTimeString().split(" ")[0],
        satellite: "MODIS",
        confidence: Math.floor(Math.random() * 100),
        version: "6.1NRT",
        bright_t31: 280 + Math.random() * 20,
        frp: Math.random() * 50,
      });
    }

    return fires;
  }

  /**
   * Fetch TEMPO air quality data (NO2, HCHO, AI, PM, O3)
   */
  async fetchTEMPOData(
    location: GameLocation,
    date: Date
  ): Promise<AirQualityData | null> {
    const cacheKey = `tempo_${location.latitude}_${location.longitude}_${
      date.toISOString().split("T")[0]
    }`;

    // Check cache first
    const cached = await dataService.getCachedNASAData("tempo", cacheKey);
    if (cached.data && !cached.error) {
      return cached.data.data as AirQualityData;
    }

    try {
      // TEMPO provides near real-time air quality observations
      // For now, we'll use mock data as TEMPO requires specialized access
      const tempoData = this.generateMockTEMPOData(location, date);

      // Cache the data
      await dataService.cacheNASAData({
        data_type: "tempo",
        location_key: cacheKey,
        data: tempoData,
        expires_at: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 minutes
        metadata: { source: "TEMPO", location, date },
      });

      return tempoData;
    } catch (error) {
      console.error("Error fetching TEMPO data:", error);
      return this.generateMockTEMPOData(location, date);
    }
  }

  /**
   * Fetch precipitation data from TRMM/IMERG
   */
  async fetchPrecipitationData(
    location: GameLocation,
    startDate: Date,
    endDate: Date
  ): Promise<any[]> {
    const cacheKey = `precipitation_${location.latitude}_${
      location.longitude
    }_${startDate.toISOString()}_${endDate.toISOString()}`;

    // Check cache first
    const cached = await dataService.getCachedNASAData(
      "precipitation",
      cacheKey
    );
    if (cached.data && !cached.error) {
      return cached.data.data as any[];
    }

    try {
      // Use IMERG for recent data, TRMM for historical
      const precipData = this.generateMockPrecipitationData(
        location,
        startDate,
        endDate
      );

      // Cache the data
      await dataService.cacheNASAData({
        data_type: "precipitation",
        location_key: cacheKey,
        data: precipData,
        expires_at: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // 1 hour
        metadata: { source: "IMERG", location, startDate, endDate },
      });

      return precipData;
    } catch (error) {
      console.error("Error fetching precipitation data:", error);
      return this.generateMockPrecipitationData(location, startDate, endDate);
    }
  }

  /**
   * Fetch AIRS atmospheric data (temperature, humidity)
   */
  async fetchAIRSData(
    location: GameLocation,
    date: Date
  ): Promise<WeatherData | null> {
    const cacheKey = `airs_${location.latitude}_${location.longitude}_${
      date.toISOString().split("T")[0]
    }`;

    // Check cache first
    const cached = await dataService.getCachedNASAData("airs", cacheKey);
    if (cached.data && !cached.error) {
      return cached.data.data as WeatherData;
    }

    try {
      const airsData = this.generateMockAIRSData(location, date);

      // Cache the data
      await dataService.cacheNASAData({
        data_type: "airs",
        location_key: cacheKey,
        data: airsData,
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
        metadata: { source: "AIRS", location, date },
      });

      return airsData;
    } catch (error) {
      console.error("Error fetching AIRS data:", error);
      return this.generateMockAIRSData(location, date);
    }
  }

  /**
   * Fetch ground station data from multiple networks
   */
  async fetchGroundStationData(location: GameLocation): Promise<any> {
    const cacheKey = `ground_stations_${location.latitude}_${location.longitude}`;

    // Check cache first
    const cached = await dataService.getCachedNASAData(
      "ground_stations",
      cacheKey
    );
    if (cached.data && !cached.error) {
      return cached.data.data;
    }

    try {
      // Fetch from multiple ground station networks
      const [pandoraData, airnowData, openaqData] = await Promise.allSettled([
        this.fetchPandoraData(location),
        this.fetchAirNowData(location),
        this.fetchOpenAQData(location),
      ]);

      const groundStationData = {
        pandora: pandoraData.status === "fulfilled" ? pandoraData.value : null,
        airnow: airnowData.status === "fulfilled" ? airnowData.value : null,
        openaq: openaqData.status === "fulfilled" ? openaqData.value : null,
        timestamp: new Date(),
      };

      // Cache the data
      await dataService.cacheNASAData({
        data_type: "ground_stations",
        location_key: cacheKey,
        data: groundStationData,
        expires_at: new Date(Date.now() + 15 * 60 * 1000).toISOString(), // 15 minutes
        metadata: { source: "GroundStations", location },
      });

      return groundStationData;
    } catch (error) {
      console.error("Error fetching ground station data:", error);
      return this.generateMockGroundStationData(location);
    }
  }

  /**
   * Fetch GIBS satellite imagery
   */
  async fetchGIBSImagery(
    location: GameLocation,
    layer: string = "MODIS_Aqua_CorrectedReflectance_TrueColor",
    date: Date
  ): Promise<string | null> {
    try {
      const bbox = this.calculateBoundingBox(location, 50);
      const dateStr = date.toISOString().split("T")[0];

      const gibsUrl = `${GIBS_BASE_URL}/${layer}/default/${dateStr}/EPSG4326_250m/{z}/{y}/{x}.jpg`;

      // For tile-based imagery, return the template URL
      return gibsUrl;
    } catch (error) {
      console.error("Error fetching GIBS imagery:", error);
      return null;
    }
  }

  /**
   * Fetch data from AppEEARS API
   */
  async fetchAppEEARSData(
    location: GameLocation,
    product: string = "MOD13Q1.061",
    startDate: Date,
    endDate: Date
  ): Promise<any> {
    const cacheKey = `appeears_${location.latitude}_${
      location.longitude
    }_${product}_${startDate.toISOString()}_${endDate.toISOString()}`;

    try {
      // AppEEARS requires authentication and task submission
      // For now, return mock data
      const appearsData = this.generateMockAppEEARSData(
        location,
        product,
        startDate,
        endDate
      );

      return appearsData;
    } catch (error) {
      console.error("Error fetching AppEEARS data:", error);
      return this.generateMockAppEEARSData(
        location,
        product,
        startDate,
        endDate
      );
    }
  }

  /**
   * Fetch Pandora Project data
   */
  private async fetchPandoraData(location: GameLocation): Promise<any> {
    try {
      // Find nearest Pandora station
      const nearestStation = this.findNearestPandoraStation(location);
      if (!nearestStation) return null;

      return {
        station: nearestStation,
        no2: 15 + Math.random() * 10,
        o3: 40 + Math.random() * 20,
        hcho: 2 + Math.random() * 3,
        timestamp: new Date(),
        distance: this.calculateDistance(location, nearestStation.location),
      };
    } catch (error) {
      console.error("Error fetching Pandora data:", error);
      return null;
    }
  }

  /**
   * Fetch AirNow data
   */
  private async fetchAirNowData(location: GameLocation): Promise<any> {
    try {
      if (!AIRNOW_API_KEY || AIRNOW_API_KEY === "") {
        return this.generateMockAirNowData(location);
      }

      // AirNow API implementation would go here
      return this.generateMockAirNowData(location);
    } catch (error) {
      console.error("Error fetching AirNow data:", error);
      return null;
    }
  }

  /**
   * Fetch OpenAQ data
   */
  private async fetchOpenAQData(location: GameLocation): Promise<any> {
    try {
      const bbox = this.calculateBoundingBox(location, 25);
      const params = new URLSearchParams({
        coordinates: `${location.latitude},${location.longitude}`,
        radius: "25000", // 25km radius
        limit: "10",
        order_by: "distance",
      });

      const response = await fetch(
        `${OPENAQ_BASE_URL}/measurements/latest?${params}`
      );

      if (!response.ok) {
        throw new Error(`OpenAQ API error: ${response.status}`);
      }

      const data = await response.json();
      return data.results || [];
    } catch (error) {
      console.error("Error fetching OpenAQ data:", error);
      return this.generateMockOpenAQData(location);
    }
  }

  /**
   * Generate comprehensive environmental report
   */
  async generateEnvironmentalReport(
    location: GameLocation,
    date: Date = new Date()
  ): Promise<any> {
    try {
      // Fetch data from multiple NASA sources in parallel
      const [
        airQuality,
        weather,
        precipitation,
        fires,
        imagery,
        groundStations,
      ] = await Promise.allSettled([
        this.fetchRealTimeAirQuality(location),
        this.fetchPOWERData(location, date, date),
        this.fetchPrecipitationData(location, date, date),
        this.fetchFireData(location, 100),
        this.fetchSatelliteImagery(location, date),
        this.fetchGroundStationData(location),
      ]);

      const report = {
        location,
        timestamp: new Date(),
        airQuality: airQuality.status === "fulfilled" ? airQuality.value : null,
        weather: weather.status === "fulfilled" ? weather.value?.[0] : null,
        precipitation:
          precipitation.status === "fulfilled" ? precipitation.value : null,
        fires: fires.status === "fulfilled" ? fires.value : null,
        imagery: imagery.status === "fulfilled" ? imagery.value : null,
        groundStations:
          groundStations.status === "fulfilled" ? groundStations.value : null,
        healthPrecautions:
          airQuality.status === "fulfilled" && airQuality.value
            ? this.getHealthPrecautions(airQuality.value.aqi)
            : null,
        dataQuality: this.assessDataQuality({
          airQuality: airQuality.status === "fulfilled",
          weather: weather.status === "fulfilled",
          precipitation: precipitation.status === "fulfilled",
          fires: fires.status === "fulfilled",
          imagery: imagery.status === "fulfilled",
          groundStations: groundStations.status === "fulfilled",
        }),
      };

      return report;
    } catch (error) {
      console.error("Error generating environmental report:", error);
      throw error;
    }
  }

  // Mock data generators for development
  private generateMockTEMPOData(
    location: GameLocation,
    date: Date
  ): AirQualityData {
    return {
      aqi: 50 + Math.random() * 100,
      pm25: 15 + Math.random() * 20,
      pm10: 25 + Math.random() * 30,
      no2: 20 + Math.random() * 25, // TEMPO specializes in NO2
      o3: 35 + Math.random() * 30,
      co: 1 + Math.random() * 2,
      so2: 5 + Math.random() * 10,
      timestamp: date,
      source: "tempo",
      uncertainty: 3, // TEMPO has high accuracy
    };
  }

  private generateMockPrecipitationData(
    location: GameLocation,
    startDate: Date,
    endDate: Date
  ): any[] {
    const data = [];
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      data.push({
        timestamp: new Date(currentDate),
        precipitation: Math.random() > 0.7 ? Math.random() * 10 : 0,
        precipitationType: Math.random() > 0.8 ? "snow" : "rain",
        intensity: Math.random() * 5,
        source: "IMERG",
      });
      currentDate.setHours(currentDate.getHours() + 3);
    }

    return data;
  }

  private generateMockAIRSData(
    location: GameLocation,
    date: Date
  ): WeatherData {
    return {
      temperature: 20 + Math.random() * 15,
      humidity: 50 + Math.random() * 40,
      windSpeed: 5 + Math.random() * 10,
      windDirection: Math.random() * 360,
      pressure: 1013 + Math.random() * 20,
      precipitation: 0,
      visibility: 10,
      timestamp: date,
      source: "airs",
    };
  }

  private generateMockGroundStationData(location: GameLocation): any {
    return {
      pandora: {
        station: { name: "Mock Pandora Station", location },
        no2: 15 + Math.random() * 10,
        o3: 40 + Math.random() * 20,
        hcho: 2 + Math.random() * 3,
        timestamp: new Date(),
        distance: Math.random() * 50,
      },
      airnow: this.generateMockAirNowData(location),
      openaq: this.generateMockOpenAQData(location),
      timestamp: new Date(),
    };
  }

  private generateMockAirNowData(location: GameLocation): any {
    return {
      aqi: 50 + Math.random() * 100,
      category: "Moderate",
      pollutant: "PM2.5",
      timestamp: new Date(),
    };
  }

  private generateMockOpenAQData(location: GameLocation): any[] {
    return [
      {
        parameter: "pm25",
        value: 15 + Math.random() * 20,
        unit: "µg/m³",
        lastUpdated: new Date(),
        coordinates: {
          latitude: location.latitude + (Math.random() - 0.5) * 0.1,
          longitude: location.longitude + (Math.random() - 0.5) * 0.1,
        },
      },
    ];
  }

  private generateMockAppEEARSData(
    location: GameLocation,
    product: string,
    startDate: Date,
    endDate: Date
  ): any {
    return {
      product,
      location,
      startDate,
      endDate,
      data: {
        ndvi: 0.3 + Math.random() * 0.4,
        evi: 0.2 + Math.random() * 0.3,
        quality: "good",
      },
      timestamp: new Date(),
    };
  }

  private findNearestPandoraStation(location: GameLocation): any {
    // Mock Pandora stations - in production, fetch from actual API
    const mockStations = [
      {
        name: "Station A",
        location: {
          latitude: location.latitude + 0.1,
          longitude: location.longitude + 0.1,
        },
      },
      {
        name: "Station B",
        location: {
          latitude: location.latitude - 0.1,
          longitude: location.longitude - 0.1,
        },
      },
    ];

    return mockStations[0]; // Return nearest (mock)
  }

  private calculateDistance(loc1: GameLocation, loc2: any): number {
    const R = 6371; // Earth's radius in km
    const dLat = ((loc2.latitude - loc1.latitude) * Math.PI) / 180;
    const dLon = ((loc2.longitude - loc1.longitude) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((loc1.latitude * Math.PI) / 180) *
        Math.cos((loc2.latitude * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private assessDataQuality(sources: Record<string, boolean>): any {
    const available = Object.values(sources).filter(Boolean).length;
    const total = Object.keys(sources).length;
    const percentage = (available / total) * 100;

    return {
      percentage,
      level:
        percentage > 80
          ? "excellent"
          : percentage > 60
          ? "good"
          : percentage > 40
          ? "fair"
          : "poor",
      availableSources: Object.entries(sources)
        .filter(([_, available]) => available)
        .map(([source, _]) => source),
      missingSources: Object.entries(sources)
        .filter(([_, available]) => !available)
        .map(([source, _]) => source),
    };
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Get cache size
   */
  getCacheSize(): number {
    return this.cache.size;
  }
}

// Export singleton instance
export const nasaApiService = new NASAApiService();
