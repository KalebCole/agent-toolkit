# ADR 0001: Vendor Kaleb Superpowers

**Status:** Accepted  
**Date:** 2026-10-03

## Context

Superpowers provides a connected software-development workflow rather than an
isolated skill. Installing only selected files would break its
brainstorming-to-planning-to-execution flow. The marketplace also needs a
reviewed package with deterministic manual invocation of `brainstorming` and
without a conversation-wide bootstrap.

The authoritative source is <https://github.com/obra/superpowers>. The
selected immutable source is release `v6.4.2` (version `6.4.2`) at commit
`8ca22dba9a94f28898bbce59f2537ff4d87c747d`, snapshotted on 2026-10-03.
The annotated tag resolves to that commit; its tag object is
`668b16d4d8d4d603fd257567684fbbffccbf2022`.

Codex interface metadata comes from the official OpenAI plugin package at
<https://github.com/openai/plugins>, commit
`33bd9529725fcee78c9e51fcbaa93cd963c3a47b`. That package predates
`diagnosing-superpowers`, so this snapshot adds equivalent local display
metadata for that skill.

## Decision

Store a frozen runtime copy as the local plugin `kaleb-superpowers`. Retain
the exact upstream MIT license and attribution:
`Copyright (c) 2025 Jesse Vincent`.

The package supports exactly:

- Claude Code;
- GitHub Copilot, including the user's skill loader;
- OpenAI Codex.

The stored runtime includes all retained skills and their required scripts,
references, templates, prompts, and assets. It excludes upstream tests,
plans, release notes, Git history, development tooling, and runtime adapters
for other clients. It also excludes the optional brainstorming visual
companion and its local server files.

Remove `skills/using-superpowers/`, the session-start hook, and all manifest or
configuration wiring that injected that bootstrap. Do not replace it with a
global routing instruction. Rewrite runtime-qualified internal references
from `superpowers:<skill>` to `kaleb-superpowers:<skill>`.

Only `brainstorming` is manual-only:

- Claude Code and the user's Copilot loader read
  `disable-model-invocation: true` from
  `skills/brainstorming/SKILL.md`. Do not add the redundant
  `user-invocable: true`.
- Codex reads `policy.allow_implicit_invocation: false` from
  `skills/brainstorming/agents/openai.yaml`, with its current `interface`
  display metadata. Every retained skill has Codex interface metadata.

All other retained skills keep upstream invocation behavior. The
`brainstorming` content still hands approved designs to `writing-plans`, and
the downstream planning and execution workflow remains intact. Generated
specs and plans are temporary review artifacts stored outside the repository;
the workflow never adds or commits them. Implementation commits can still
include product Markdown when the requested change requires it.

## Re-vendoring policy

Updates are manual and reviewed. There is no scheduled updater, generator,
install-time mutation, or automatic sync. For a reviewed immutable upstream
release:

1. verify the tag and peeled commit;
2. review the complete runtime diff and licensing;
3. replace the retained runtime files;
4. reapply only these intentional deltas:
   - rename the plugin namespace and manifests to `kaleb-superpowers`;
   - rewrite qualified `superpowers:<skill>` runtime references;
   - omit `using-superpowers` and session-start injection;
   - remove retained references to the omitted bootstrap or unsupported
     runtime guidance;
   - omit the brainstorming visual companion, its instructions, and its
     local server files;
   - store generated specs and plans outside the repository and never add or
     commit those planning artifacts;
   - preserve OpenAI interface metadata for each retained skill and add
     matching metadata for skills not present in the pinned metadata source;
   - add the Claude/Copilot and Codex manual-only controls to
     `brainstorming`;
5. update the static runtime checksum inventory, provenance, validation,
   documentation, and generated catalogs.

## Consequences

The marketplace carries and reviews a complete runtime snapshot instead of
following upstream automatically. Security and behavior fixes arrive only
after a manual re-vendor. Runtime adapters outside the three supported clients
are unavailable. A static checksum inventory makes every runtime file change
visible in review, but maintainers must update it during a reviewed re-vendor.

GitHub Copilot's current published skill documentation does not document
`disable-model-invocation`. Its use here records behavior supported by the
user's Copilot loader, not a general compatibility promise for every Copilot
installation.
