#!/usr/bin/env bash
set -euo pipefail

ATPROTO_SHA=$(< .atproto-sha)
ATPROTO_DIR="$HOME/.cache/pdsadmin-web/atproto/$ATPROTO_SHA"
 
if [ -d "$ATPROTO_DIR" ]; then
  echo "[scripts/run-dev-env.sh] Skipping atproto download, already exists."
else
  echo "[scripts/run-dev-env.sh] Downloading atproto..."
  pnpm giget gh:bluesky-social/atproto#$ATPROTO_SHA $ATPROTO_DIR --force --preferOffline
fi
cd $ATPROTO_DIR

if [ -d "$ATPROTO_DIR/packages/dev-env/dist" ]; then
  echo "[scripts/run-dev-env.sh] Skipping atproto build, already exists."
else
  echo "[scripts/run-dev-env.sh] Building atproto..."
  make deps
  make build
fi
