#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SKILL_SRC="$ROOT_DIR/waitfit"
CODEX_HOME_DIR="${CODEX_HOME:-$HOME/.codex}"
SKILL_DEST="$CODEX_HOME_DIR/skills/waitfit"

if [[ ! -d "$SKILL_SRC" ]]; then
  echo "waitfit install failed: missing skill directory at $SKILL_SRC" >&2
  exit 1
fi

mkdir -p "$CODEX_HOME_DIR/skills"
rm -rf "$SKILL_DEST"
cp -R "$SKILL_SRC" "$SKILL_DEST"

chmod +x "$SKILL_DEST/scripts/"*.js

node "$SKILL_DEST/scripts/validate-movements.js"

echo "Installed waitfit to $SKILL_DEST"
echo "Restart Codex or open a new conversation to reload local skills."
