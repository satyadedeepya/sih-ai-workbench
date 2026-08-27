#!/bin/bash
# One-time setup: install Ollama + pull required models
set -e

echo "== Installing Ollama =="
curl -fsSL https://ollama.com/install.sh | sh

echo "== Starting Ollama server =="
ollama serve &
sleep 3

echo "== Pulling models =="
ollama pull llama3.1:8b          # general / document reasoning
ollama pull qwen2.5-coder:7b     # coding tasks
# ollama pull llava:7b           # stretch: vision/OCR-assist

echo "== Installed models =="
ollama list

echo "== Done. Test with: curl http://localhost:11434/api/tags =="