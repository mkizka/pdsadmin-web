#!/usr/bin/env bash
set -euo pipefail

ATPROTO_DIR=/tmp/atproto-$(< .atproto-sha)
cd $ATPROTO_DIR
 
if [ -d "$ATPROTO_DIR/node_modules" ]; then
  echo "[scripts/run-dev-env.sh] Skipping atproto build, already exists."
else
  echo "[scripts/run-dev-env.sh] Building atproto..."
  make deps
  make build
fi

echo "[scripts/run-dev-env.sh] Starting atproto dev server..."
make run-dev-env
