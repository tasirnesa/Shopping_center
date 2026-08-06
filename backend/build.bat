@echo off
echo Running tsc directly...
.\node_modules\.bin\tsc --project tsconfig.build.json > build-output.txt 2>&1
echo tsc exit code: %ERRORLEVEL% >> build-output.txt
echo. >> build-output.txt
echo Running nest build...
.\node_modules\.bin\nest build >> build-output.txt 2>&1
echo nest build exit code: %ERRORLEVEL% >> build-output.txt
