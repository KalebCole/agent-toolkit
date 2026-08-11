# Agent Toolkit — Type-first prototype

This branch prototypes **Agent Toolkit as a source collection**. The repository
root is one installable Copilot plugin. Owned components are grouped by their
native type, like a skills collection.

> [!NOTE]
> The named components are synthetic placeholders used to judge the repository
> structure. This is not the v0 payload.

## Browse the source

- [`skills/`](skills/) — one directory and `SKILL.md` per owned skill
- [`agents/`](agents/) — owned custom agent profiles
- [`hooks/`](hooks/) — hook configurations and their scripts
- [`.github/plugin/marketplace.json`](.github/plugin/marketplace.json) —
  upstream Copilot plugins, installed and updated from their canonical sources
- [`upstream/`](upstream/) — pointer-only references for tools that are not
  Copilot plugins

The root [`plugin.json`](plugin.json) makes the owned skills, agents, and hooks
one installable Core Plugin. External source is never copied or submoduled.

```text
agent-toolkit/
├── plugin.json
├── skills/
│   └── example-workflow/
│       └── SKILL.md
├── agents/
│   └── example-reviewer.agent.md
├── hooks/
│   └── hooks.json
├── .github/plugin/
│   └── marketplace.json
└── upstream/
    └── frontend/
```

## Upstream Copilot plugins

The Agent Toolkit marketplace points to plugins maintained in their original
repositories:

- [`humanizer`](https://github.com/blader/humanizer), by blader
- [`cli-printing-press`](https://github.com/mvanhorn/cli-printing-press), by
  mvanhorn
- [`mattpocock-skills`](https://github.com/mattpocock/skills), by Matt Pocock

```bash
copilot plugin marketplace add KalebCole/agent-toolkit
copilot plugin marketplace browse agent-toolkit
```

Each plugin remains an individual choice. Agent Toolkit does not bundle it, and
Copilot's native plugin lifecycle remains responsible for updates.

## Other upstream references

Libraries, CLIs, and standalone resources that do not fit the Copilot
marketplace live under [`upstream/`](upstream/). These are bibliography entries,
not source mirrors.

## Prototype question

Does this split make ownership and updates clear while keeping external tools
visible as part of the portfolio?
