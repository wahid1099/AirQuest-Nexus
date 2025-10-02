# AI Quest Missions System - Comprehensive Climate Learning Platform

A gamified, AI-powered atmospheric science learning platform that combines NASA satellite data with interactive missions, real-time notifications, and community features.

## 🌟 Key Features

### 1. AI Quest Missions System

- **Mission Cards**: Each mission includes title, difficulty level, XP rewards, badges, and progress tracking
- **Difficulty Levels**: Beginner → Intermediate → Advanced → Expert
- **Mission Types**:
  - **Beginner**: Learn to read satellite/air quality data
  - **Intermediate**: Analyze real datasets (NASA TEMPO, MODIS)
  - **Advanced**: Predict patterns with ML models
  - **Expert**: Propose solutions for real-world air/climate challenges

#### Interactive Mission Elements

- **Drag-and-drop** data interpretation tasks
- **AI-powered Q&A quizzes** with chatbot assistance
- **Simulation puzzles** (e.g., predicting ozone depletion)
- **Real-time data analysis** with NASA APIs

### 2. User Profile System

- **Dashboard Features**:
  - Profile picture and username
  - Current level and total XP
  - Earned badges with rarity system (Common, Rare, Epic, Legendary)
  - Achievement timeline
  - Mission history and statistics
  - Global and friends-based leaderboards

### 3. Real-time Notification System

- **Notification Types**:

  - ✅ Mission completion alerts with XP earned
  - 🏆 New badge/achievement notifications
  - 📈 Level up celebrations
  - 🌍 Weekly climate insights
  - ⏰ Mission reminders and suggestions

- **Delivery Methods**:
  - In-app toast notifications
  - Email notifications (configurable)
  - Push notifications
  - Notification center with history

### 4. Comprehensive Settings System

- **Appearance**: Dark/Light theme toggle
- **Language Support**: 6+ languages with flag indicators
- **Notification Preferences**: Granular control over all notification types
- **API Connections**: NASA APIs and Gemini AI chatbot integration
- **Privacy Controls**: Data management and account settings

### 5. AI Chatbot Integration (Gemini API)

The AI Mission Mentor provides:

- **Mission Guidance**: Explains objectives and provides hints
- **Data Analysis Help**: Assists with NASA dataset interpretation
- **Interactive Learning**: Quizzes and knowledge testing
- **Storytelling Mode**: Presents missions as space exploration adventures
- **Team Collaboration**: Helps users find teammates and share results

#### Quick Actions

- Explain current mission
- Help with data analysis
- Quiz mode for learning
- Story-driven mission narratives
- Find teammates
- Suggest next missions

### 6. Authentication System

- **Registration/Login**: Secure user account creation
- **Profile Management**: Customizable user profiles
- **Progress Tracking**: Persistent XP, levels, and achievements
- **Social Features**: Friend connections and team formation

### 7. Global Leaderboard

- **Ranking Systems**: Global and friends-based leaderboards
- **Multiple Timeframes**: All-time, monthly, and weekly rankings
- **Achievement Showcase**: Badge collections and rare achievements
- **Competitive Elements**: Seasonal challenges and tournaments

### 8. Weekly Climate Insights

- **Personalized Reports**: Region-specific air quality analysis
- **Trend Analysis**: Improvement/decline patterns with explanations
- **Mission Suggestions**: AI-recommended missions based on current data
- **Educational Content**: Key findings and learning opportunities

## 🛠 Technical Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS with custom gradients and animations
- **Animations**: Motion (Framer Motion) for smooth transitions
- **State Management**: React Context for authentication and user data
- **Backend Integration**: Supabase for user data and progress tracking
- **APIs**: NASA TEMPO, MODIS, and other atmospheric data sources
- **AI Integration**: Gemini API for chatbot functionality

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- NASA API key (optional for demo)
- Gemini API key (optional for chatbot)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd ai-quest-missions
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   # Add your API keys:
   # VITE_NASA_API_KEY=your_nasa_api_key
   # VITE_GEMINI_API_KEY=your_gemini_api_key
   # VITE_SUPABASE_URL=your_supabase_url
   # VITE_SUPABASE_ANON_KEY=your_supabase_key
   ```

4. **Start the development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 🎮 How to Use

### For New Users

1. **Sign Up**: Create an account to track progress
2. **Start with Beginner Missions**: Learn the basics of atmospheric data
3. **Use the AI Mentor**: Ask questions and get guidance
4. **Track Progress**: Watch your XP and level grow
5. **Join the Community**: Connect with other climate explorers

### For Educators

1. **Create Classroom Teams**: Organize students into collaborative groups
2. **Assign Missions**: Use the mission system for structured learning
3. **Monitor Progress**: Track student achievements and engagement
4. **Customize Content**: Adapt missions for different skill levels

### For Researchers

1. **Access Real Data**: Work with live NASA satellite feeds
2. **Contribute Insights**: Share findings with the community
3. **Advanced Missions**: Tackle expert-level climate challenges
4. **Collaborate**: Form research teams for complex projects

## 🏆 Mission Examples

### Beginner: "Atmospheric Detective"

- **Objective**: Identify pollution hotspots using TEMPO data
- **Skills**: Data visualization, pattern recognition
- **Reward**: 2,500 XP + Data Detective Badge
- **Interactive Elements**: Drag-and-drop data analysis, guided tutorials

### Advanced: "Ozone Guardian"

- **Objective**: Predict and prevent ozone depletion events
- **Skills**: Machine learning, predictive modeling
- **Reward**: 3,000 XP + Ozone Guardian Shield
- **Interactive Elements**: ML model training, simulation scenarios

### Expert: "Climate Commander"

- **Objective**: Design global air quality monitoring networks
- **Skills**: Strategic planning, systems thinking
- **Reward**: 1,800 XP + Command Badge
- **Interactive Elements**: Network optimization, real-world impact assessment

## 🌍 Data Sources

- **NASA TEMPO**: Hourly air quality monitoring over North America
- **NASA MODIS**: Global atmospheric and surface data
- **NASA IMERG**: Precipitation data for correlation analysis
- **EPA AirNow**: Real-time US air quality data
- **OpenWeather**: Meteorological data for context

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Areas for Contribution

- New mission designs
- Additional language translations
- Enhanced data visualizations
- Community features
- Educational content
- Bug fixes and optimizations

## 📱 Mobile Support

The platform is fully responsive and works on:

- Desktop browsers (Chrome, Firefox, Safari, Edge)
- Tablet devices (iPad, Android tablets)
- Mobile phones (iOS Safari, Android Chrome)

## 🔒 Privacy & Security

- **Data Protection**: All user data is encrypted and securely stored
- **Privacy Controls**: Users can download or delete their data anytime
- **API Security**: All external API calls are properly authenticated
- **GDPR Compliant**: Full compliance with data protection regulations

## 📊 Analytics & Insights

- **Learning Analytics**: Track user progress and engagement
- **Mission Effectiveness**: Measure educational impact
- **Community Metrics**: Monitor collaboration and sharing
- **Performance Optimization**: Continuous improvement based on usage data

## 🎯 Future Roadmap

### Phase 1 (Current)

- ✅ Core mission system
- ✅ User authentication
- ✅ AI chatbot integration
- ✅ Notification system

### Phase 2 (Next 3 months)

- 🔄 Advanced team collaboration
- 🔄 Real-time multiplayer missions
- 🔄 Enhanced data visualization
- 🔄 Mobile app development

### Phase 3 (6 months)

- 📋 VR/AR mission experiences
- 📋 Advanced AI tutoring
- 📋 Global climate challenges
- 📋 Educational institution partnerships

## 📞 Support

- **Documentation**: [docs.airquest-nexus.com](https://docs.airquest-nexus.com)
- **Community Forum**: [community.airquest-nexus.com](https://community.airquest-nexus.com)
- **Email Support**: support@airquest-nexus.com
- **Discord**: [Join our Discord server](https://discord.gg/airquest)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **NASA**: For providing open access to atmospheric data
- **Google**: For Gemini AI API access
- **Supabase**: For backend infrastructure
- **The Climate Community**: For inspiration and feedback

---

**Built with ❤️ for climate education and environmental awareness**
#   A i r Q u e s t - N e x u s  
 