#!/usr/bin/env bash
set -euo pipefail

root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
test_home="$(mktemp -d)"
trap 'rm -rf "$test_home"' EXIT

node "$root/scripts/mirrors.mjs" check
node "$root/scripts/marketplace.mjs"

export COPILOT_HOME="$test_home"
copilot plugin marketplace add "$root"

while IFS=$'\t' read -r plugin expected_skills; do
  copilot plugin install "$plugin@agent-toolkit"
  installed="$COPILOT_HOME/installed-plugins/agent-toolkit/$plugin"
  actual_skills="$(find "$installed" -name SKILL.md -type f | wc -l)"
  if [[ "$actual_skills" -ne "$expected_skills" ]]; then
    echo "$plugin installed $actual_skills skills; expected $expected_skills" >&2
    exit 1
  fi
done < <(node "$root/scripts/marketplace.mjs" plugin-names)

copilot plugin list
