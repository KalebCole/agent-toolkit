# Kaleb Marketplace Design

**Date:** 2026-10-03

**Status:** Approved

## Purpose

Kaleb Marketplace is a personal, public collection of agent plugins that
Kaleb chooses to store or recommend. It is not a universal package manager.
It does not promise that one package works in every agent client.

This repository prepares for a later GitHub repository rename from
`KalebCole/agent-toolkit` to `KalebCole/kaleb-marketplace`. The display name is
**Kaleb Marketplace**. The repository rename is a post-merge operation.

## Design Principles

1. Use the Agent Plugins 1.0 package format for local plugins.
2. Keep one canonical catalog at `.agents/plugins/marketplace.json`.
3. Generate client catalogs; do not maintain them by hand.
4. List an external package in a client catalog only when its pinned package
   layout is valid for that client.
5. Keep copied skills frozen until a person reviews a new copy.
6. Open update pull requests for maintained external references, but never
   merge them automatically.
7. Keep native installers native. Do not wrap them to create unsupported
   compatibility.

## Distribution Paths

The repository supports three explicit paths.

### Local stored plugin

Owned or intentionally frozen content lives under `plugins/<name>/`. Each
plugin is independently installable and uses the Agent Plugins 1.0 layout:

```text
plugins/<name>/
├── plugin.json
├── skills/
│   └── <skill>/
│       └── SKILL.md
├── mcp.json                         # optional
├── <reverse-domain-namespace>/      # optional client overlay
└── LICENSE
```

The first local plugin is `plugins/kaleb-skills`. It contains exactly these
three frozen standalone skills:

- `bro`
- `grilling`
- `grill-me`

The skill text remains equal to its reviewed source copy. The plugin includes
the applicable MIT license and `THIRD_PARTY_NOTICES.md` records the original
repository, path, exact copied commit, and copyright notice for every copy.
No workflow updates these files.

### Maintained external plugin reference

The canonical catalog records a native Git source, tracked branch, and exact
40-character commit pin for each maintained external item:

| Name | Repository | Reviewed pin | Package evidence |
|---|---|---|---|
| `humanizer` | `blader/humanizer` | `225a6f39ac85f76ee48dbad772ea4abe4ed6c9d8` | Claude manifest plus root skill; supported by Claude and Copilot legacy loading |
| `visual-explainer` | `nicobailon/visual-explainer` | `5846f5aef34a23c8fea389d2f23ce56224cbf840` | Plugin package at `plugins/visual-explainer`; supported by its native Claude layout and Copilot legacy loading |
| `i-have-adhd` | `ayghri/i-have-adhd` | `839872f9d1cd634fed642b4589ce7226199cc15f` | Native `.agents`, Claude, and Codex manifests plus `skills/i-have-adhd/SKILL.md` |

The catalog uses only native marketplace source forms: local paths, Git URLs,
and Git subdirectories. The generator maps these forms to a target client's
native source form. A source type, field, or package layout without a safe
mapping is an error. The generator does not make adapters or copy external
plugin content.

The current external packages are safe to represent in the generated Copilot
and Claude catalogs at the reviewed pins. Documentation states the tested
catalog paths and does not promise compatibility with other clients.

### Native external installer

Impeccable remains outside all catalogs. Its supported install and update
commands are:

```bash
npx impeccable install
npx impeccable update
```

The repository documents those commands and links to
`https://github.com/pbakaus/impeccable`. It does not wrap Impeccable as a
Copilot marketplace plugin.

## Catalog Architecture

`.agents/plugins/marketplace.json` is the only hand-edited catalog. It is a
standards-based marketplace document with:

- marketplace name `kaleb-marketplace`;
- display name `Kaleb Marketplace`;
- a local source for `kaleb-skills`;
- pinned Git sources for Humanizer, Visual Explainer, and i-have-adhd;
- installation policy and category fields supported by the native catalog
  format.

`scripts/catalog.mjs` reads the canonical catalog and generates:

- `.github/plugin/marketplace.json` for GitHub Copilot CLI;
- `.claude-plugin/marketplace.json` for Claude Code.

Generation is deterministic:

- input entries keep canonical order;
- object field order is fixed by the generator;
- output uses two-space JSON indentation and one final newline;
- `check` compares bytes and fails on drift;
- unknown fields and unmappable source forms fail with the entry name and
  target catalog.

The generated files are committed so users can register the repository
directly with each client. No `entry.json`, `plugin.lock.json`, generated
content adapter, duplicated plugin content, or Git submodule is used.

## Validation

Local and CI validation covers:

1. the canonical marketplace JSON schema;
2. Agent Plugins 1.0 `plugin.json` schema rules;
3. generated catalog determinism and drift;
4. unique names and exact 40-character external pins;
5. source commit and package-path availability;
6. expected package markers for every generated client entry;
7. local plugin containment and fixed `skills/<name>/SKILL.md` layout;
8. Agent Skills frontmatter, name-to-directory equality, and descriptions;
9. required local licenses and third-party notices;
10. the smallest reliable client validation or clean install check available
    in CI, without treating one client result as proof for another.

Network checks use GitHub's API and `GITHUB_TOKEN` when available. Unit tests
use local fixtures and test successful generation, drift detection, and
explicit rejection of an unmappable source.

## External Update Automation

The update workflow runs weekly and by manual dispatch.

1. A discovery job resolves each maintained external entry's tracked branch.
2. The job emits only entries whose remote commit differs from the canonical
   pin.
3. A matrix job handles one changed entry per job.
4. Each job updates only that entry's exact pin, regenerates both client
   catalogs, and runs full validation.
5. It pushes `automation/update-<name>` and opens or updates one pull request
   for that external plugin.
6. It never enables auto-merge and never runs `gh pr merge`.

The pull request is the review boundary. The pin in the canonical catalog
changes only when that pull request is reviewed and merged.

## Documentation and Scope

`README.md`, `CONTEXT.md`, contribution guidance, usage guidance, maintenance
guidance, and workflow documentation use the same three-path vocabulary.
They distinguish package portability from tested client support.

The new scope removes all catalog and documentation entries for:

- CLI Printing Press;
- Superpowers;
- the full Matt Pocock Skills bundle;
- Grill Design;
- Oil Motion.

The copied `grilling` and `grill-me` skills keep Matt Pocock's attribution.
Grill Design is not added. This intentional non-inclusion addresses issue #46.

The redesign addresses the intent of:

- #44 by storing the frozen `bro` skill;
- #45 by adding a pinned maintained reference to `i-have-adhd`;
- #46 by documenting explicit non-inclusion of Grill Design;
- #47 by documenting Impeccable's supported native installer;
- #48 by adding a pinned maintained reference to Visual Explainer.

## Post-Merge Operations

After merge, a maintainer must:

1. rename the GitHub repository to `kaleb-marketplace`;
2. update repository topics and description;
3. test fresh marketplace registration through the renamed URL;
4. update any external links that do not follow GitHub redirects;
5. close #44, #45, #46, #47, and #48 with links to the merged change and the
   relevant documentation.

This branch does not rename the repository or close issues.
