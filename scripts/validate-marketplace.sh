#!/usr/bin/env bash
set -euo pipefail

root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
test_home="$(mktemp -d)"
trap 'rm -rf "$test_home"' EXIT

jq --exit-status '
  .plugins | length == 1 and
  .[0].name == "kaleb-toolkit" and
  .[0].source == "plugins/kaleb-toolkit"
' "$root/.github/plugin/marketplace.json" > /dev/null

jq --exit-status '
  .name == "kaleb-toolkit" and
  .skills == ["./skills/toolkit-router"]
' "$root/plugins/kaleb-toolkit/plugin.json" > /dev/null

test -f "$root/plugins/kaleb-toolkit/skills/toolkit-router/SKILL.md"

export COPILOT_HOME="$test_home"
copilot plugin marketplace add "$root"
copilot plugin install kaleb-toolkit@agent-toolkit

installed="$COPILOT_HOME/installed-plugins/agent-toolkit/kaleb-toolkit"
test "$(find "$installed" -name SKILL.md -type f | wc -l)" -eq 1

copilot plugin list
