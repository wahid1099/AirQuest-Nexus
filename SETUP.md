# 🚀 CleanSpace Setup Guide

This guide will help you set up CleanSpace locally and deploy it to production.

## 📋 Prerequisites

- **Node.js 18+** and npm
- **Supabase account** (free tier available)
- **Git** for version control

## 🔧 Local Development Setup

### 1. Clone and Install

```bash
# Clone the repository
git clone https://github.com/your-org/cleanspace.git
cd cleanspace

# Install dependencies
npm install
```

### 2. Environment Variables

Create a `.env.local` file in the root directory:

```env
# Required - Supabase Configuration
REACT_APP_SUPABASE_URL=https://your-project-ref.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-supabase-anon-key

# Optional - NASA APIs (has fallbacks)
REACT_APP_NASA_API_KEY=your-nasa-api-key
REACT_APP_FIRMS_API_KEY=your-firms-api-key

# Optional - AI Services (has fallbacks)
REACT_APP_GEMINI_API_KEY=your-gemini-api-key

# Optional - Third-party APIs
REACT_APP_AQICN_API_KEY=your-aqicn-api-key
REACT_APP_PURPLEAIR_API_KEY=your-purpleair-api-key
```

### 3. Supabase Setup

1. **Create a Supabase Project**

   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Note your project URL and anon key

2. **Run Database Schema**

   - Open the Supabase SQL editor
   - Copy and paste the contents of `supabase_schema.sql`
   - Execute the SQL to create all tables and functions

3. **Configure Authentication**

   - Enable email authentication
   - Optionally enable Google and GitHub OAuth
   - Set up redirect URLs for your domain

4. **Set up Storage**
   - The schema creates `avatars` and `shared-media` buckets
   - Configure CORS if needed for file uploads

### 4. API Keys (Optional)

#### NASA API Key

- Visit [api.nasa.gov](https://api.nasa.gov/)
- Sign up for a free API key
- Add to `REACT_APP_NASA_API_KEY`

#### NASA FIRMS API Key

- Visit [firms.modaps.eosdis.nasa.gov](https://firms.modaps.eosdis.nasa.gov/api/)
- Request API access for fire data
- Add to `REACT_APP_FIRMS_API_KEY`

#### Gemini AI API Key

- Visit [makersuite.google.com](https://makersuite.google.com/app/apikey)
- Create a new API key
- Add to `REACT_APP_GEMINI_API_KEY`

#### AQICN API Key (Optional)

- Visit [aqicn.org/data-platform/token](https://aqicn.org/data-platform/token/)
- Request API token
- Add to `REACT_APP_AQICN_API_KEY`

#### PurpleAir API Key (Optional)

- Visit [develop.purpleair.com](https://develop.purpleair.com/)
- Create developer account and get API key
- Add to `REACT_APP_PURPLEAIR_API_KEY`

### 5. Start Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## 🌐 Production Deployment

### Vercel (Recommended)

1. **Connect Repository**

   - Fork the repository to your GitHub account
   - Connect your GitHub account to Vercel
   - Import the CleanSpace project

2. **Configure Environment Variables**

   - In Vercel dashboard, go to Project Settings → Environment Variables
   - Add all your environment variables
   - Make sure to set them for Production, Preview, and Development

3. **Deploy**
   - Vercel will automatically deploy on push to main branch
   - First deployment may take a few minutes

### Manual Deployment

```bash
# Build for production
npm run build

# The dist/ folder contains the built app
# Deploy this folder to your hosting provider
```

### Environment-Specific Configuration

#### Development

```env
NODE_ENV=development
REACT_APP_DEBUG=true
REACT_APP_MOCK_MODE=true  # Use mock data
```

#### Staging

```env
NODE_ENV=production
REACT_APP_DEBUG=false
REACT_APP_MOCK_MODE=false
```

#### Production

```env
NODE_ENV=production
REACT_APP_DEBUG=false
REACT_APP_MOCK_MODE=false
# All API keys should be real
```

## 🔒 Security Considerations

### Supabase Security

1. **Row Level Security (RLS)**

   - The schema includes RLS policies
   - Users can only access their own data
   - Public data is properly scoped

2. **API Keys**

   - Never commit real API keys to version control
   - Use environment variables for all secrets
   - Rotate keys regularly

3. **CORS Configuration**
   - Configure CORS in Supabase for your domain
   - Restrict file upload permissions

### Production Security

1. **HTTPS Only**

   - Always use HTTPS in production
   - Configure security headers

2. **Environment Variables**

   - Use secure environment variable storage
   - Don't expose sensitive keys to client

3. **Content Security Policy**
   - Configure CSP headers
   - Restrict external resource loading

## 📱 PWA Setup

The app is configured as a Progressive Web App:

1. **Service Worker**

   - Automatically registered in production
   - Handles offline caching and background sync

2. **Manifest**

   - App can be installed on mobile devices
   - Configured for standalone mode

3. **Icons**
   - Add app icons to `public/icons/` directory
   - Update `manifest.json` with correct paths

## 🧪 Testing

### Run Tests

```bash
npm run test
```

### Type Checking

```bash
npm run type-check
```

### Linting

```bash
npm run lint
```

## 📊 Analytics Setup (Optional)

### Google Analytics

```env
REACT_APP_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

### Sentry Error Monitoring

```env
REACT_APP_SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id
```

## 🔧 Troubleshooting

### Common Issues

1. **Supabase Connection Errors**

   - Check your project URL and API key
   - Verify RLS policies are set up correctly
   - Check network connectivity

2. **NASA API Rate Limits**

   - NASA APIs have rate limits
   - App falls back to mock data when limits exceeded
   - Consider caching strategies for production

3. **Build Errors**

   - Clear node_modules and reinstall: `rm -rf node_modules package-lock.json && npm install`
   - Check TypeScript errors: `npm run type-check`
   - Verify all environment variables are set

4. **Service Worker Issues**
   - Clear browser cache and service workers
   - Check browser console for service worker errors
   - Ensure HTTPS is used in production

### Performance Optimization

1. **Bundle Size**

   - Use dynamic imports for large components
   - Optimize images and assets
   - Enable gzip compression

2. **API Caching**

   - NASA data is cached for 5 minutes by default
   - Adjust cache timeout via environment variables
   - Use service worker for offline caching

3. **Database Optimization**
   - Indexes are included in the schema
   - Use pagination for large datasets
   - Monitor query performance in Supabase

## 📞 Support

If you encounter issues:

1. Check this setup guide
2. Review the main README.md
3. Search existing GitHub issues
4. Create a new issue with detailed information

## 🚀 Next Steps

After setup:

1. **Customize the App**

   - Update branding and colors
   - Add your own missions and challenges
   - Customize the AI assistant responses

2. **Add Features**

   - Implement additional NASA datasets
   - Add more game mechanics
   - Enhance social features

3. **Deploy and Monitor**
   - Set up monitoring and analytics
   - Monitor performance and user feedback
   - Iterate based on usage patterns

---

**Happy coding! 🌍✨**

