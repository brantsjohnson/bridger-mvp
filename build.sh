#!/bin/bash

# Exit on any error
set -e

echo "Installing root dependencies..."
npm install

echo "Installing apps dependencies..."
cd apps
npm install

echo "Building the app..."
npm run build

echo "Build complete!" 