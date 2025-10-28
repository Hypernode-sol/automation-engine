#!/bin/bash
# Hypernode Automation Engine - Node Runtime Installation Script

echo "🚀 Installing Hypernode Automation Runtime..."

sudo apt update && sudo apt upgrade -y
sudo apt install -y docker.io python3 python3-pip curl git

echo "🔧 Setting up environment..."
pip3 install -r ../sdk/template_agent/requirements.txt

mkdir -p config
cat <<EOF > config/hypernode_node.yaml
node_id: "example-node"
token_address: "x402-xxxxxx"
capacity:
  cpu_cores: 8
  memory_gb: 32
  gpu_enabled: false
EOF

echo "✅ Node runtime environment configured."
echo "Run 'node connector.js' to connect your node to the network."
