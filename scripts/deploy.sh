#!/usr/bin/env bash
# Convenience wrapper for fly deploy. Re-syncs the Bug-Fab bundle from the
# sibling parent repo first so the deployed image has the latest version.
#
# Prerequisites: flyctl installed and authenticated; an app already created
# via `flyctl launch --no-deploy` (or rename `app` in fly.toml to a free name).

set -euo pipefail

cd "$(dirname "$0")/.."

echo "→ syncing bug-fab bundle from parent repo"
npm run sync:bugfab

echo "→ deploying to Fly.io"
flyctl deploy --remote-only

echo "→ done. URL:"
flyctl status --json | python -c "import json,sys; s=json.load(sys.stdin); print('  https://' + s.get('Hostname', 'unknown'))"
