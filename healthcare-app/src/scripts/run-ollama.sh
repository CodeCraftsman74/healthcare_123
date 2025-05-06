#!/bin/bash

# This script runs the Ollama model with the provided input
# Usage: ./run-ollama.sh <model_name> <input_file>

MODEL=$1
INPUT_FILE=$2

if [ -z "$MODEL" ] || [ -z "$INPUT_FILE" ]; then
  echo "Error: Missing required parameters" >&2
  echo "Usage: ./run-ollama.sh <model_name> <input_file>" >&2
  exit 1
fi

if [ ! -f "$INPUT_FILE" ]; then
  echo "Error: Input file does not exist: $INPUT_FILE" >&2
  exit 1
fi

# Run the Ollama model with the input file
cat "$INPUT_FILE" | ollama run "$MODEL"