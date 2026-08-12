#!/usr/bin/env bash
set -euo pipefail

root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
test_home="$(mktemp -d)"
trap 'rm -rf "$test_home"' EXIT

node "$root/scripts/catalog.mjs" check
node "$root/scripts/catalog.mjs" verify-sources

export COPILOT_HOME="$test_home"
copilot plugin marketplace add "$root"

while IFS=$'\t' read -r plugin repo sha path; do
  copilot plugin install "$plugin@agent-toolkit"

  source_tree="$(mktemp -d)"
  curl --fail --silent --show-error --location \
    "https://api.github.com/repos/$repo/tarball/$sha" \
    | tar --extract --gzip --strip-components=1 --directory "$source_tree"

  expected="$source_tree"
  if [[ -n "$path" ]]; then
    expected="$source_tree/$path"
  fi
  installed="$COPILOT_HOME/installed-plugins/agent-toolkit/$plugin"
  diff --recursive --brief "$expected" "$installed"
  rm -rf "$source_tree"
done < <(node "$root/scripts/catalog.mjs" plugin-sources)

copilot plugin list
