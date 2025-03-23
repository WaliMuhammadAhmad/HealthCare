#!/bin/bash

# Navigate to the script's directory
cd "$(dirname "$0")"

# Install dependencies, build, and start the project
if npm install && npm run build; then
    npm start
else
    echo "Error occurred during setup. Exiting."
    exit 1
fi