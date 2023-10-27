#!/bin/bash

# Step 1: Run "npm i"
npm i

# Step 2: Run "npm run build"
npm run build

# Step 3: Change directory to "electron"
cd electron

# Step 4: Check if electron-builder is installed
if ! npm list electron-builder | grep -q electron-builder; then
  # Install electron-builder
  npm install electron-builder --save-dev
fi

# Step 5: Run "npm i" again
npm i

# Step 6: Change directory back to the previous directory
cd ..

# Step 7: Copy the build folder contents to "electron" directory (overwriting existing files)
rsync -av --delete build/ electron/

# Step 8: Replace all '="/' with '="./' in index.html
sed -i '' 's/="\//="./g' electron/build/index.html

# Step 9: Run "npm run build" in the "electron" directory
cd electron
npm run build

# Step 10: Open the file explorer in the "dist" directory
open dist
