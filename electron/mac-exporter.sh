# Step 1: Check if electron-builder is installed
if ! npm list electron-builder | grep -q electron-builder; then
  # Install electron-builder
  npm install electron-builder --save-dev
fi

# Step 2: Run "npm i" again
npm i

# Step 3: Run "npm run build" again
npm run build

open dist