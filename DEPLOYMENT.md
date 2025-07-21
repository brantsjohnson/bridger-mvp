# Bridger MVP Deployment Guide

## Vercel Deployment

This project is configured to deploy to Vercel automatically. The deployment process:

1. **Automatic Trigger**: When you push to the `main` branch, Vercel automatically starts a new deployment
2. **Build Process**: 
   - Installs root dependencies (`npm install`)
   - Installs apps dependencies (`cd apps && npm install`)
   - Builds the main app (`cd apps && npm run build`)
   - Outputs to `apps/dist` directory

## Local Testing

Before deploying, test the build locally:

```bash
# Install all dependencies
npm install
cd apps && npm install && cd ..

# Build the project
cd apps && npm run build && cd ..

# Check the dist folder
ls apps/dist
```

## Troubleshooting

If you encounter build errors:

1. **Missing Dependencies**: Make sure all dependencies are in the root `package.json`
2. **PostCSS Issues**: Ensure `tailwindcss`, `autoprefixer`, and `postcss` are installed
3. **Path Issues**: Verify the `vercel.json` configuration points to the correct directories

## Manual Deployment

If automatic deployment fails, you can manually trigger a new deployment:

1. Go to your Vercel dashboard
2. Select your project
3. Click "Redeploy" in the latest deployment

## Project Structure

```
bridger-mvp/
├── apps/                 # Main app (deployed)
├── apps/quiz-app/        # Quiz app
├── apps/core-app/        # Core app  
├── apps/auth-app/        # Auth app
├── shared/              # Shared components
├── vercel.json          # Vercel configuration
└── package.json         # Root dependencies
``` 