#!/bin/bash

# Create a directory for ChromaDB data on Render's persistent disk
mkdir -p /opt/render/.chroma-data

# Start the ChromaDB server
chroma run --path /opt/render/.chroma-data --host 0.0.0.0 --port 8000