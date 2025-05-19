#!/usr/bin/env bash
set -euo pipefail

ATPROTO_DIR=/tmp/atproto-$(< .atproto-sha)
ATPROTO_LOG=$ATPROTO_DIR.log

make_atproto() {
  make -C $ATPROTO_DIR "$@"
}

cleanup() {
  echo "[dev.sh] Cleaning up..."
  pnpm kill-port 2583
}

main() {
  if [ -d "$ATPROTO_DIR/node_modules" ]; then
    echo "[dev.sh] Skipping atproto build, already exists."
  else
    echo "[dev.sh] Building atproto..."
    make_atproto deps
    make_atproto build
  fi

  echo "[dev.sh] Starting atproto dev server..."
  rm -f $ATPROTO_LOG
  make_atproto run-dev-env > $ATPROTO_LOG 2>&1 &
  pnpm wait-on http://localhost:2583/xrpc/_health

  echo "[dev.sh] Ready to start development environment."
  pnpm vite
}

trap cleanup EXIT
main
