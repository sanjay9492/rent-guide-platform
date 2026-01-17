#!/bin/bash
# Railway build script

echo "Installing Python dependencies..."
pip install -r requirements.txt

echo "Installing Node dependencies..."
cd frontend
npm install

echo "Building frontend..."
npm run build

echo "Build complete!"
