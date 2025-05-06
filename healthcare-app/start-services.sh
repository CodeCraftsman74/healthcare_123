#!/bin/bash

# Start MongoDB
echo "Starting MongoDB..."
mongod --fork --logpath /tmp/mongodb.log

# Check if Ollama is installed
if command -v ollama &> /dev/null; then
    echo "Starting Ollama..."
    # Check if Gemma 3 (4B) model is available
    if ! ollama list | grep -q "gemma3:4b"; then
        echo "Gemma 3 (4B) model not found. Pulling it now..."
        ollama pull gemma3:4b
    fi
    
    echo "Ollama is ready with gemma3:4b model"
    echo "The chatbot will use 'ollama run gemma3:4b' when processing requests"
else
    echo "Ollama is not installed. Please install it from https://ollama.ai"
    echo "After installation, run: ollama pull gemma3:4b"
fi

echo "Services started. You can now run: npm run dev" 