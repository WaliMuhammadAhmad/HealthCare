#!/bin/bash
if npm install && npm run build; then
    npm start
else
    echo "Error occurred during setup. Exiting."
    exit 1
fi