#!/usr/bin/env bash
set -euo pipefail

root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

node "$root/scripts/catalog.mjs" validate
node "$root/scripts/catalog.mjs" check
node "$root/scripts/catalog.mjs" verify-sources
