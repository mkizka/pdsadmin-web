#!/usr/bin/env bash
set -euo pipefail

ATPROTO_SHA=$(< .atproto-sha)
ATPROTO_DIR="/tmp/atproto/$ATPROTO_SHA"
 
echo "[scripts/run-dev-env.sh] Downloading atproto..."
pnpm giget gh:bluesky-social/atproto#$ATPROTO_SHA $ATPROTO_DIR --force --preferOffline
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
