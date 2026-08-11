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
- [`recommendations/`](recommendations/) — secondary links to canonical
  upstream tools

The root [`plugin.json`](plugin.json) makes the owned skills, agents, and hooks
one installable Core Plugin. External recommendations are not bundled.

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
└── recommendations/
    ├── plugins/
    └── frontend/
```

## Prototype question

Is **component type** the clearest way to browse a growing collection, or does
it hide how skills, agents, and hooks work together?
