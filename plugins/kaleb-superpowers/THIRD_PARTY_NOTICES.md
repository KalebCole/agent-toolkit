# Third-Party Notice for `kaleb-superpowers`

This plugin is a frozen, reviewed copy of the runtime portions of
`https://github.com/obra/superpowers`.

- Upstream release: `v6.4.2`
- Upstream commit: `8ca22dba9a94f28898bbce59f2537ff4d87c747d`
- Snapshot date: 2026-10-03
- Codex metadata source: `https://github.com/openai/plugins`
- Codex metadata commit: `33bd9529725fcee78c9e51fcbaa93cd963c3a47b`
- Upstream copyright:
  `Copyright (c) 2025 Jesse Vincent`
- License: MIT

`LICENSE` reproduces the upstream MIT license exactly. The local runtime
renames the plugin to `kaleb-superpowers`, supports Claude Code, GitHub
Copilot, and OpenAI Codex, omits the `using-superpowers` bootstrap and
session-start injection, removes the brainstorming visual companion and its
local server, keeps generated specs and plans outside the repository, and
makes `brainstorming` manual-only. Codex interface metadata is copied from
the OpenAI plugin package at the commit above. That package does not contain
`diagnosing-superpowers`, so this plugin adds matching local display metadata
for that retained upstream skill.
