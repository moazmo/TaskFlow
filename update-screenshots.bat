@echo off
echo Adding new screenshots to git...
git add assets/screenshots/*.png

echo Committing screenshots...
git commit -m "Add actual TaskFlow application screenshots

- Added main interface screenshot in light theme
- Added dark theme screenshot showing theme toggle
- Added task detail screenshot (if included)
- Replaced demo SVG with real app visuals"

echo Pushing to GitHub...
git push origin main

echo Screenshots successfully added to GitHub repository!
pause
