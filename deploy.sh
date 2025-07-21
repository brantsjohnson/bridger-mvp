#!/bin/bash

# Clean install all dependencies
echo "Installing root dependencies..."
npm install

echo "Installing apps dependencies..."
cd apps && npm install && cd ..

echo "Building main app..."
cd apps && npm run build && cd ..

echo "Build complete! Check the apps/dist directory." 