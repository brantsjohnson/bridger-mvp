# Bridger MVP

A multi-app platform for connecting people through personality quizzes and social features.

## 🚀 Features

- **Authentication App** (`/auth`) - User signup/login with Supabase
- **Core App** (`/core`) - Main social platform with friend connections
- **Quiz App** (`/quiz`) - Personality assessment with AI integration
- **PWA Support** - Installable on mobile devices
- **Multi-user Support** - Multiple users can sign up and use the platform

## 🏗️ Architecture

This is a monorepo containing three main applications:

- `apps/auth-app/` - Authentication service
- `apps/core-app/` - Main social platform
- `apps/quiz-app/` - Personality quiz with AI
- `apps/` - Main router app (port 3000)

## 🛠️ Tech Stack

- **Frontend**: React + TypeScript + Vite
- **UI**: Tailwind CSS + shadcn/ui
- **Backend**: Supabase (PostgreSQL + Auth)
- **Deployment**: Vercel
- **PWA**: Service Worker + Manifest

## 🚀 Quick Start

### Development

```bash
# Install dependencies
npm install

# Start all apps
npm run dev

# Or start individual apps
npm run dev:main    # Main router (port 3000)
npm run dev:auth    # Auth app (port 8081)
npm run dev:core    # Core app (port 8080)
npm run dev:quiz    # Quiz app (port 8084)
```

### Production Build

```bash
# Build all apps
npm run build

# Build individual apps
cd apps/auth-app && npm run build
cd apps/core-app && npm run build
cd apps/quiz-app && npm run build
```

## 📱 Mobile Access

The app is designed as a Progressive Web App (PWA) that can be installed on mobile devices:

1. Visit the deployed URL on your phone
2. Tap "Add to Home Screen" when prompted
3. Use the app like a native mobile app

## 🌐 Deployment

### Vercel Deployment

1. Connect your GitHub repository to Vercel
2. Configure build settings:
   - **Framework Preset**: Vite
   - **Root Directory**: `apps`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 📁 Project Structure

```
bridger-mvp/
├── apps/
│   ├── auth-app/          # Authentication service
│   ├── core-app/          # Main social platform
│   ├── quiz-app/          # Personality quiz
│   └── src/               # Main router app
├── shared/                # Shared components and utilities
├── vercel.json           # Vercel deployment config
└── package.json          # Root package.json
```

## 🔧 Development

### Adding New Features

1. Create feature branch: `git checkout -b feature/new-feature`
2. Make changes in appropriate app directory
3. Test locally: `npm run dev`
4. Commit changes: `git commit -m "Add new feature"`
5. Push to GitHub: `git push origin feature/new-feature`

### Port Configuration

The apps use fixed ports to ensure consistent routing:

- **Main App**: `localhost:3000`
- **Auth App**: `localhost:8081`
- **Core App**: `localhost:8080`
- **Quiz App**: `localhost:8084`

## 📄 License

MIT License - see LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For support or questions, please open an issue on GitHub. 