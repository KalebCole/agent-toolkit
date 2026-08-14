#!/usr/bin/env bash
set -euo pipefail

root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

jq --exit-status '
  .schemaVersion == 1 and
  (.setups | keys | sort) == ["copilot", "hermes"] and
  (.items | length) == 29 and
  ([.items[].id] | length) == ([.items[].id] | unique | length) and
  all(
    .items[];
    (.id | type == "string" and length > 0) and
    (.name | type == "string" and length > 0) and
    (.summary | type == "string" and length > 0) and
    (.kind | IN("cli", "skill", "plugin", "skill-collection", "toolkit")) and
    (.roles | length > 0 and all(.[]; IN("copilot", "hermes"))) and
    (.source | startswith("https://")) and
    (.license.name | type == "string" and length > 0) and
    (.license.source | startswith("https://"))
  )
' "$root/catalog.json" > /dev/null
