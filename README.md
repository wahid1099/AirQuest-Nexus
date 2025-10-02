# 🌍 CleanSpace - NASA Air Quality Game

[![NASA Space Apps Challenge](https://img.shields.io/badge/NASA-Space%20Apps%20Challenge-blue.svg)](https://spaceappschallenge.org/)
[![React](https://img.shields.io/badge/React-18.x-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-green.svg)](https://supabase.com/)
[![PWA](https://img.shields.io/badge/PWA-Ready-purple.svg)](https://web.dev/progressive-web-apps/)

> **CleanSpace** is a location-based air quality simulation game that uses real NASA satellite and model data to help players understand and improve air quality through strategic environmental actions.

## 🎯 Overview

CleanSpace transforms air quality data from NASA's POWER, MERRA-2, and MODIS datasets into an engaging, educational game experience. Players take on the role of environmental stewards, making strategic decisions to improve air quality in real-world locations while learning about atmospheric science and environmental policy.

### 🌟 Key Features

- **🛰️ Real NASA Data Integration**: Live data from NASA POWER, MERRA-2, and MODIS
- **🎮 Interactive Gameplay**: Strategic air quality improvement missions
- **🤖 AI-Powered Assistant**: Gemini AI provides intelligent recommendations
- **📱 Progressive Web App**: Full offline support and mobile optimization
- **🔐 Secure Authentication**: Supabase-powered user management
- **📊 Real-time Visualizations**: Dynamic charts and air quality monitoring
- **🌐 Social Features**: Share achievements and compete on leaderboards
- **📈 Analytics & Telemetry**: Comprehensive user behavior tracking

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Supabase account
- NASA API key (optional, has fallbacks)
- Gemini API key (optional, has fallbacks)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-org/cleanspace.git
   cd cleanspace
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Configure your `.env.local`:

   ```env
   # Supabase Configuration
   REACT_APP_SUPABASE_URL=your_supabase_project_url
   REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key

   # NASA APIs (optional - has fallbacks)
   REACT_APP_NASA_API_KEY=your_nasa_api_key
   REACT_APP_FIRMS_API_KEY=your_firms_api_key

   # Third-party APIs (optional)
   REACT_APP_GEMINI_API_KEY=your_gemini_api_key
   REACT_APP_AQICN_API_KEY=your_aqicn_api_key
   REACT_APP_PURPLEAIR_API_KEY=your_purpleair_api_key
   ```

4. **Set up Supabase database**

   ```bash
   # Run the schema in your Supabase SQL editor
   cat supabase_schema.sql
   ```

5. **Start development server**

   ```bash
   npm run dev
   ```

6. **Build for production**
   ```bash
   npm run build
   ```

## 🏗️ Architecture

### Frontend Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Recharts** for data visualizations
- **Lucide React** for icons

### Backend & Services

- **Supabase** for database, authentication, and real-time features
- **NASA APIs** for satellite and meteorological data
- **Gemini AI** for intelligent game recommendations
- **Service Workers** for offline functionality and caching

### Key Services

#### 🔐 Authentication Service (`authService.ts`)

- Supabase-powered authentication
- Social login (Google, GitHub)
- Profile management
- Password reset functionality

#### 📊 Data Service (`dataService.ts`)

- User data management (achievements, progress, sessions)
- Real-time subscriptions
- Leaderboard functionality
- Social sharing features

#### 🛰️ NASA API Service (`nasaApiService.ts`)

- NASA POWER meteorological data
- MERRA-2 aerosol data
- MODIS fire and AOD data
- Real-time air quality from multiple sources
- Intelligent caching and fallbacks

#### 🤖 Gemini AI Service (`geminiAiService.ts`)

- Game recommendations and strategies
- Air quality analysis and insights
- Educational content generation
- Contextual tips and guidance

#### 📱 Offline Service (`offlineService.ts`)

- Service worker integration
- Offline data caching
- Action queuing for sync
- Network status monitoring

#### 📈 Analytics Service (`analyticsService.ts`)

- User behavior tracking
- Performance monitoring
- Error reporting
- Custom event tracking

## 🎮 Game Mechanics

### Core Gameplay Loop

1. **Location Selection**: Choose a real-world location
2. **Data Analysis**: Review NASA satellite data for air quality baseline
3. **Strategic Planning**: Use AI recommendations to plan interventions
4. **Action Execution**: Implement environmental improvements
5. **Impact Assessment**: Monitor air quality changes over time
6. **Achievement Unlocking**: Earn badges and climb leaderboards

### Available Actions

- **🌳 Plant Trees**: Reduce PM2.5 through natural filtration
- **🏢 Rooftop Gardens**: Urban green spaces for air purification
- **🚗 Vehicle Removal**: Reduce mobile emissions
- **🏭 Factory Interventions**: Shutdown or retrofit industrial sources
- **🏗️ Construction Management**: Replace polluting construction

### Health & Energy System

Players assume the role of an asthma/allergy patient, adding urgency:

- **Health Bar**: Depletes in polluted areas
- **Safe Zones**: Areas with AQI < 50 for recovery
- **Time Pressure**: Limited exposure time before health impacts
- **Strategic Movement**: Balance action-taking with health management

## 📊 NASA Data Integration

### Data Sources

1. **NASA POWER API**

   - Hourly meteorological data
   - Temperature, humidity, wind speed
   - Planetary boundary layer parameters

2. **MERRA-2 Reanalysis**

   - Aerosol mixing ratios
   - Black carbon, organic carbon, sulfate, dust
   - 3-hourly to daily products

3. **MODIS Satellite Data**

   - Aerosol Optical Depth (AOD)
   - Fire detection and monitoring
   - True color imagery

4. **Real-time Sources**
   - Open-Meteo air quality API
   - AQICN global monitoring network
   - PurpleAir sensor network

### Data Processing Pipeline

```
Raw NASA Data → Spatial Subsetting → Unit Conversion → AQI Calculation → Game Integration
```

## 🔧 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checks
```

### Code Structure

```
src/
├── components/          # React components
│   ├── auth/           # Authentication components
│   ├── cleanspace/     # Game-specific components
│   ├── sharing/        # Social sharing features
│   ├── visualizations/ # Data visualization components
│   └── ui/             # Reusable UI components
├── contexts/           # React contexts
├── services/           # API and business logic services
├── types/              # TypeScript type definitions
├── lib/                # Utility libraries
└── data/               # Static data and configurations
```

### Environment Configuration

The app supports multiple deployment environments:

- **Development**: Full debugging, mock data fallbacks
- **Staging**: Production-like with test data
- **Production**: Optimized build with real APIs

## 🌐 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment

```bash
npm run build
# Deploy the `dist` folder to your hosting provider
```

### PWA Features

The app includes full Progressive Web App support:

- **Offline Functionality**: Core features work without internet
- **Install Prompt**: Add to home screen on mobile devices
- **Background Sync**: Sync data when connection is restored
- **Push Notifications**: Receive updates and reminders
- **Responsive Design**: Optimized for all screen sizes

## 🔐 Security & Privacy

### Data Protection

- All user data encrypted in transit and at rest
- Row Level Security (RLS) policies in Supabase
- GDPR-compliant data handling
- Optional telemetry with user consent

### API Security

- Rate limiting on all external API calls
- API key rotation and management
- Secure environment variable handling
- CORS and CSP headers configured

## 📈 Analytics & Monitoring

### Built-in Analytics

- User engagement tracking
- Game performance metrics
- Error monitoring and reporting
- A/B testing capabilities

### Performance Monitoring

- Core Web Vitals tracking
- Real User Monitoring (RUM)
- API response time monitoring
- Offline usage analytics

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and add tests
4. Commit your changes: `git commit -m 'Add amazing feature'`
5. Push to the branch: `git push origin feature/amazing-feature`
6. Open a Pull Request

### Code Standards

- **TypeScript**: Strict mode enabled
- **ESLint**: Airbnb configuration with React hooks
- **Prettier**: Automatic code formatting
- **Testing**: Jest and React Testing Library
- **Commits**: Conventional commit messages

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **NASA** for providing open access to satellite and meteorological data
- **Supabase** for the backend infrastructure
- **Google Gemini** for AI-powered insights
- **Open-Meteo** for real-time weather data
- **The open-source community** for the amazing tools and libraries

## 📞 Support

- **Documentation**: [docs.cleanspace.app](https://docs.cleanspace.app)
- **Issues**: [GitHub Issues](https://github.com/your-org/cleanspace/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-org/cleanspace/discussions)
- **Email**: support@cleanspace.app

---

**Built with ❤️ for the NASA Space Apps Challenge**

_Making air quality data accessible, engaging, and actionable for everyone._
