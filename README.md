# Kaleb Marketplace

Kaleb Marketplace is my personal, public collection of selected agent
plugins. It is not a universal package manager, and a listing is not a promise
that the same package works in every agent client.

This repository is still at `KalebCole/agent-toolkit`. It is prepared for a
post-merge rename to `KalebCole/kaleb-marketplace`.

## What is here

Kaleb Marketplace uses three distribution paths:

1. **Local stored plugin**: reviewed content stored in this repository as an
   independently installable Agent Plugins 1.0 package.
2. **Maintained external plugin reference**: a native package in its author's
   repository, referenced at an exact reviewed commit.
3. **Native external installer**: a tool whose own installer is the supported
   distribution path.

| Item | Path | Source |
|---|---|---|
| Kaleb Skills (`bro`, `grilling`, `grill-me`) | Local stored plugin | [`plugins/kaleb-skills`](plugins/kaleb-skills/) |
| Kaleb Superpowers | Frozen local runtime plugin | [`plugins/kaleb-superpowers`](plugins/kaleb-superpowers/) |
| Humanizer | Maintained external plugin reference | [`blader/humanizer`](https://github.com/blader/humanizer) |
| Visual Explainer | Maintained external plugin reference | [`nicobailon/visual-explainer`](https://github.com/nicobailon/visual-explainer) |
| i-have-adhd | Maintained external plugin reference | [`ayghri/i-have-adhd`](https://github.com/ayghri/i-have-adhd) |
| Impeccable | Native external installer | [`pbakaus/impeccable`](https://github.com/pbakaus/impeccable) |

The canonical catalog is `.agents/plugins/marketplace.json`. The Copilot and
Claude catalogs are generated from it. External reference content is not
copied into this repository. Kaleb Superpowers is the deliberate exception:
it is a frozen, attributable runtime snapshot rather than an external
reference.

## Install from the marketplace

### GitHub Copilot CLI

```bash
copilot plugin marketplace add KalebCole/agent-toolkit
copilot plugin marketplace browse kaleb-marketplace
copilot plugin install kaleb-skills@kaleb-marketplace
copilot plugin install kaleb-superpowers@kaleb-marketplace
```

Replace `kaleb-skills` with `humanizer`, `visual-explainer`, or
`i-have-adhd` to install a maintained external reference.

### Claude Code

```bash
claude plugin marketplace add KalebCole/agent-toolkit
claude plugin install kaleb-skills@kaleb-marketplace
claude plugin install kaleb-superpowers@kaleb-marketplace
```

Kaleb Superpowers supports Claude Code, GitHub Copilot, and OpenAI Codex. Its
`brainstorming` skill must be invoked manually; all other retained skills keep
their upstream invocation behavior. See [usage](docs/usage.md) for the tested
support boundary and [ADR 0001](docs/adr/0001-vendor-kaleb-superpowers.md) for
the frozen-source decision and limitations.

## Install Impeccable

Impeccable uses its supported native installer. It is not wrapped as a
marketplace plugin.

```bash
npx impeccable install
npx impeccable update
```

## Validate

```bash
npm ci
bash scripts/validate-marketplace.sh
```

Validation checks the canonical schema, deterministic generated catalogs,
local Agent Plugins and Agent Skills layouts, licenses and notices, exact
external pins, source package markers, and available client catalog checks.

Weekly automation opens one pull request for each changed maintained external
plugin. It never auto-merges. Frozen local content is not updated by
automation.

See [contributing](docs/contributing.md),
[maintenance](docs/maintenance.md), and [post-merge operations](docs/post-merge.md).
