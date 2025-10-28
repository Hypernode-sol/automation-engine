#!/usr/bin/env bash
# node_runtime/installation_script.sh
# Sets up system dependencies, Node runtime, and default configuration.

set -euo pipefail

echo "[install] Updating system packages..."
if command -v apt >/dev/null 2>&1; then
  sudo apt update -y
  sudo apt install -y docker.io python3 python3-pip curl git nodejs npm
elif command -v apk >/dev/null 2>&1; then
  sudo apk add --no-cache docker python3 py3-pip curl git nodejs npm
elif command -v dnf >/dev/null 2>&1; then
  sudo dnf install -y docker python3 python3-pip curl git nodejs npm
else
  echo "[install] Please install Docker, Python3/pip, Node.js/npm manually."
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || echo "$(cd "$SCRIPT_DIR/.." && pwd)")"

echo "[install] Installing Node runtime dependencies..."
cd "$SCRIPT_DIR"
npm install

echo "[install] Installing SDK Python dependencies..."
if [ -f "$REPO_ROOT/sdk/template_agent/requirements.txt" ]; then
  pip3 install -r "$REPO_ROOT/sdk/template_agent/requirements.txt"
fi

echo "[install] Preparing configuration..."
mkdir -p "$SCRIPT_DIR/config"
if [ ! -f "$SCRIPT_DIR/config/hypernode_node.yaml" ]; then
  cat > "$SCRIPT_DIR/config/hypernode_node.yaml" <<'YAML'
node_id: "example-node"
token_address: "hyper-addr-000"
capacity:
  cpu_cores: 8
  memory_gb: 32
  gpu_enabled: false
network:
  bandwidth_mbps: 100
  location: "Unknown"
YAML
  echo "[install] Created default config at node_runtime/config/hypernode_node.yaml"
fi

if [ ! -f "$SCRIPT_DIR/.env" ] && [ -f "$SCRIPT_DIR/.env.example" ]; then
  cp "$SCRIPT_DIR/.env.example" "$SCRIPT_DIR/.env"
  echo "[install] Created .env from template"
fi

echo "[install] Done. Start the connector with:  cd node_runtime && npm start"
