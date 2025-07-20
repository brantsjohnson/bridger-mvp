# Bridger Unified App

A unified wrapper that combines the auth-app, core-app, and quiz-app into a single experience.

## Navigation Flow

1. **Default Landing**: `localhost:3000` or `localhost:3000/core` → Core App (Bridger main interface)
2. **Auth Flow**: `localhost:3000/auth` → Auth App (login/signup)
3. **After Auth**: When "LET'S_FIX_SOCIETY" is clicked → Automatically navigates to Core App
4. **Quiz Access**: `localhost:3000/quiz` → Quiz App

## Features

- **URL-based routing**: Navigate directly to specific apps
- **Seamless auth flow**: Auth app automatically redirects to core app after completion
- **Camera permissions**: All apps have camera access for QR scanning
- **Cross-app communication**: Auth app can trigger navigation to core app

## Running the App

```bash
cd apps
npm run dev
```

This starts the unified app on `localhost:3000` with all three apps running concurrently.

## App Structure

- **Core App** (`localhost:3000/core`): Main Bridger interface with desktop icons, friend requests, and social features
- **Auth App** (`localhost:3000/auth`): Login/signup with retro terminal aesthetic
- **Quiz App** (`localhost:3000/quiz`): Personality assessment and compatibility testing

## Navigation Tabs

The top navigation allows switching between apps:
- **Auth App**: Login and signup functionality
- **Core App**: Main Bridger social platform
- **Quiz App**: Personality assessment tools 