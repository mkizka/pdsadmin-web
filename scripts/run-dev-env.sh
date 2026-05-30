#!/usr/bin/env bash
set -euo pipefail

ATPROTO_SHA=$(< .atproto-sha)
ATPROTO_DIR="$HOME/.cache/pdsadmin-web/atproto/$ATPROTO_SHA"
READY_MARKER="/tmp/pdsadmin-web-atproto-ready"

rm -f "$READY_MARKER"

echo "[scripts/run-dev-env.sh] Starting atproto dev server..."
cd "$ATPROTO_DIR"

make run-dev-env 2>&1 | while IFS= read -r line; do
  printf '%s\n' "$line"
  if [[ "$line" == *"Dev environment is ready"* ]]; then
    touch "$READY_MARKER"
  fi
done
