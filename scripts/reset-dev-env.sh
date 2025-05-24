#!/usr/bin/env bash
set -euo pipefail

ATPROTO_SHA=$(< .atproto-sha)
ATPROTO_DIR="$HOME/.cache/pdsadmin-web/atproto/$ATPROTO_SHA"

echo "[scripts/run-dev-env.sh] Resetting atproto dev server..."
cd $ATPROTO_DIR/packages/dev-infra && docker compose down -v
