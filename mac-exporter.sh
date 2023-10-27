#!/bin/bash

# Step 1: Run "npm i"
npm i

# Step 2: Run "npm run build"
npm run build

# Step 3: If folder "electron" does not exist, create it
if [ ! -d "electron" ]; then
  mkdir electron
fi

# Step 7: Copy the build folder contents to "electron" directory (overwriting existing files)
rsync -av --update build/ electron/

# Step 8: Replace all '="/' with '="./' in index.html
sed -i '' 's/="\//=".\//g' electron/index.html



