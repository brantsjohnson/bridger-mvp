#!/bin/bash

# Exit on any error
set -e

echo "Installing root dependencies..."
npm install

echo "Installing apps dependencies..."
cd apps
npm install

echo "Building auth app..."
cd auth-app
npm install
npm run build
cd ..

echo "Building core app..."
cd core-app
npm install
npm run build
cd ..

echo "Building quiz app..."
cd quiz-app
npm install
npm run build
cd ..

echo "Copying built apps to public directory..."
mkdir -p public/auth-app
mkdir -p public/core-app
mkdir -p public/quiz-app

cp -r auth-app/dist/* public/auth-app/
cp -r core-app/dist/* public/core-app/
cp -r quiz-app/dist/* public/quiz-app/

echo "Building main app..."
npm run build

echo "Build complete!" 