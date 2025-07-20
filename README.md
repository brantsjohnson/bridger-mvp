# Bridger MVP - Monorepo

This monorepo contains three main applications that work together to create the Bridger MVP experience:

## 📁 Structure

```
bridger-mvp/
├── apps/
│   ├── quiz-app/          # Loveable quiz design (Vite/React)
│   ├── core-app/          # Main application (Vite/React) - TODO
│   └── auth-app/          # Authentication (Vite/React) - TODO
├── shared/
│   ├── lib/              # Shared utilities (Supabase client, etc.)
│   ├── types/            # Shared TypeScript types
│   └── constants/        # Shared constants and configuration
└── package.json          # Root package.json with workspaces
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation
```bash
# Install root dependencies
npm install

# Install all app dependencies
npm run install:all
```

### Development
```bash
# Run all apps simultaneously
npm run dev

# Run individual apps
npm run dev:quiz    # Quiz app only
npm run dev:core    # Core app only (when created)
npm run dev:auth    # Auth app only (when created)
```

## 📱 Apps

### Quiz App (`apps/quiz-app/`)
- **Purpose**: Loveable quiz design for personality assessment
- **Tech**: Vite + React + TypeScript
- **Port**: 5173 (default Vite port)
- **Status**: ✅ Complete

### Core App (`apps/core-app/`)
- **Purpose**: Main application with dashboard, user management, etc.
- **Tech**: Vite + React + TypeScript
- **Port**: TBD
- **Status**: 🚧 TODO

### Auth App (`apps/auth-app/`)
- **Purpose**: Sign in/sign up functionality
- **Tech**: Vite + React + TypeScript
- **Port**: TBD
- **Status**: 🚧 TODO

## 🔗 Shared Resources

### Shared Library (`shared/lib/`)
- `supabaseClient.ts` - Shared Supabase client for all apps
- User session management functions

### Shared Types (`shared/types/`)
- `user.ts` - User and authentication type definitions

### Shared Constants (`shared/constants/`)
- `app.ts` - App routing, storage keys, and API endpoints

## 🔐 Authentication & Data Flow

All apps share the same Supabase client and user session:
- User signs in through auth-app
- Session is shared across all apps
- Quiz results are saved to user's profile
- Core app can access user data and quiz results

## 🛠️ Adding New Apps

When you add new apps:

1. Create the app in `apps/[app-name]/`
2. Add it to the workspace scripts in root `package.json`
3. Import shared utilities from `shared/` as needed
4. Use the shared Supabase client for data access

## 📦 Build & Deploy

```bash
# Build all apps
npm run build

# Build individual apps
npm run build:quiz
npm run build:core
npm run build:auth
```

## 🔧 Environment Variables

Each app can have its own `.env` file, but shared variables should be consistent:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## 📝 Notes

- Each app maintains its own unique styling and components
- Shared utilities are minimal to avoid conflicts
- User session is managed centrally through shared Supabase client
- Apps can communicate through URL parameters or shared storage 