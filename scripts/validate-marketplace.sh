#!/usr/bin/env bash
set -euo pipefail

root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

node "$root/scripts/catalog.mjs" validate
node "$root/scripts/catalog.mjs" check
npm test
node "$root/scripts/validate-marketplace.mjs"

test_home="$root/.validation-home"
rm -rf "$test_home"
mkdir -p "$test_home"
trap 'rm -rf "$test_home"' EXIT

if command -v copilot >/dev/null 2>&1; then
  COPILOT_HOME="$test_home" copilot plugin marketplace add "$root"
  COPILOT_HOME="$test_home" copilot plugin marketplace browse kaleb-marketplace --json >/dev/null
  for plugin in kaleb-skills kaleb-superpowers humanizer visual-explainer i-have-adhd; do
    COPILOT_HOME="$test_home" copilot plugin install "$plugin@kaleb-marketplace"
  done
  echo "Copilot catalog and clean install checks passed"
else
  echo "Skipping Copilot catalog smoke check: copilot is not installed"
fi

if command -v claude >/dev/null 2>&1; then
  CLAUDE_CONFIG_DIR="$test_home/claude" claude plugin validate "$root"
else
  echo "Skipping Claude catalog validation: claude is not installed"
fi
