# NASA API Setup for CleanSpace Game

## 🚨 Fixing the Blank/White Screen Issue

The CleanSpace game requires specific **Earth observation and air quality APIs** from NASA, not the space exploration APIs you mentioned. Here's how to fix it:

## Quick Fix (Recommended)

The game now has **automatic fallback to mock data** when NASA APIs are unavailable. Simply:

1. **Refresh your browser** - the game should now load with realistic mock data
2. **Check browser console** (F12) for any error messages
3. The game will display "Mock Data" in the data sources

## NASA APIs Used by CleanSpace Game

The game specifically needs these **Earth observation APIs**:

### 1. FIRMS (Fire Information for Resource Management System)

- **Purpose**: Real-time fire detection data
- **Get API Key**: https://firms.modaps.eosdis.nasa.gov/api/
- **Free**: Yes, requires registration

### 2. OpenAQ (Air Quality Data)

- **Purpose**: Global air quality measurements
- **Get API Key**: https://docs.openaq.org/
- **Free**: Yes, with rate limits

### 3. AirNow (US Air Quality)

- **Purpose**: US EPA air quality data
- **Get API Key**: https://docs.airnowapi.org/
- **Free**: Yes, requires registration

## Your NASA APIs vs. Game Requirements

Your APIs are for **space exploration**, but the game needs **Earth observation**:

| Your APIs                | Game Needs               |
| ------------------------ | ------------------------ |
| APOD (Astronomy Picture) | FIRMS (Fire Detection)   |
| Asteroids NeoWs          | OpenAQ (Air Quality)     |
| Mars Rover Photos        | AirNow (EPA Air Quality) |
| Exoplanet Archive        | NASA POWER (Weather)     |

## Configuration Steps

### Option 1: Use Mock Data (Immediate Fix)

The game now automatically uses realistic mock data when APIs aren't configured. No setup required!

### Option 2: Configure Real NASA APIs

1. **Get API Keys** from the links above
2. **Update .env file**:

```env
# Earth Observation APIs for CleanSpace
VITE_FIRMS_API_KEY=your_firms_key_here
VITE_OPENAQ_API_KEY=your_openaq_key_here
VITE_AIRNOW_API_KEY=your_airnow_key_here

# Already configured
VITE_SUPABASE_URL=https://vjrqwoqyhildcojybphm.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

3. **Restart the development server**:

```bash
npm run dev
```

## Troubleshooting

### Still Getting Blank Screen?

1. **Check Browser Console** (F12 → Console tab):

   - Look for error messages
   - Should see "Generating fallback environmental report"

2. **Clear Browser Cache**:

   - Ctrl+Shift+R (hard refresh)
   - Or clear browser cache completely

3. **Check Network Tab**:
   - F12 → Network tab
   - Look for failed API requests

### Console Messages You Should See:

```
✅ Mission selected: {level: 1, title: "Green Canopy Initiative: NYC"}
✅ Initializing game for location: {name: "New York City"}
✅ API Keys status: {hasApiKeys: false}
✅ NASA API keys not configured, using fallback data
✅ Generating fallback environmental report for New York City
✅ Fallback initialization completed
```

## Game Features Working with Mock Data

Even with mock data, you get full functionality:

- ✅ Multi-level mission system
- ✅ Air quality simulation
- ✅ Tree planting mechanics
- ✅ Mission objectives tracking
- ✅ Progress saving
- ✅ Realistic environmental data

## Need Help?

If you're still seeing a blank screen:

1. Check the browser console for errors
2. Try a different browser
3. Ensure JavaScript is enabled
4. Check if any browser extensions are blocking the app

The game should now work perfectly with mock data while you decide if you want to configure real NASA Earth observation APIs later!
