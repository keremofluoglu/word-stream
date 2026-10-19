@echo off
rem Starts the Fast Text Reader dev server and opens it in the browser.
cd /d "%~dp0"
if not exist node_modules (
  echo Installing packages...
  call npm install
)
call npm run dev -- --open
pause
