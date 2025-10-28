#!/usr/bin/env bash
# node_runtime/sandbox.sh
# Runs a containerized agent with seccomp confinement.

set -euo pipefail

IMAGE="${1:-hypernode/agent:latest}"
NAME="hypernode-agent-$(date +%s)"
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if ! command -v docker >/dev/null 2>&1; then
  echo "[sandbox] Docker not found"
  exit 1
fi

SECCOMP="$ROOT/seccomp/hypernode-default.json"
if [ ! -f "$SECCOMP" ]; then
  echo "[sandbox] Seccomp profile not found: $SECCOMP"
  exit 1
fi

echo "[sandbox] Starting container $NAME from $IMAGE"
docker run --rm --name "$NAME" \
  --security-opt seccomp="$SECCOMP" \
  --read-only \
  --pids-limit=256 \
  --network=none \
  "$IMAGE"
