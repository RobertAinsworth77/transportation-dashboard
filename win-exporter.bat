start /wait cmd /c "npm i"
@REM Step 2: Run "npm run build"
start /wait cmd /c "npm run build"

@REM Step 3: If folder "electron" does not exist, create it
IF NOT EXIST electron mkdir electron

@REM @REM Step 4: Copy files from "dist" to "electron"
cp -rf ./build/* ./electron/
@REM Step 5: Replace all '="/' with '="./' in index.html
powershell -Command "(gc ./electron/index.html) -replace '=\"/','=\"./'| Out-File ./electron/index.html"

cd electron
start /wait cmd /c "npm install electron --save-dev"
start /wait cmd /c "npm i"
start /wait cmd /c "npm list electron-builder | findstr /C:'electron-builder' > nul && (echo Installing electron-builder... && npm install electron-builder --save-dev)"
start /wait cmd /c "npm run build"
cd dist
explorer .
