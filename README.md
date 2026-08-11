# Agent Toolkit — Capability-first prototype

This branch prototypes **Agent Toolkit as a set of capability areas**. A person
starts with the job they want the agent to do, then sees the skills, agents, and
hooks that work together in that area.

> [!NOTE]
> All owned components are synthetic placeholders. This branch tests structure,
> not the v0 payload.

## Browse by capability

- [`capabilities/writing/`](capabilities/writing/) — improve and produce writing
- [`capabilities/review/`](capabilities/review/) — inspect work before handoff
- [`capabilities/safety/`](capabilities/safety/) — enforce workflow boundaries
- [`external/`](external/) — secondary upstream recommendations

The root [`plugin.json`](plugin.json) points to native component directories
inside these areas, so the repository still installs as one Core Plugin.

```text
agent-toolkit/
├── plugin.json
├── capabilities/
│   ├── writing/
│   │   └── skills/
│   ├── review/
│   │   └── agents/
│   └── safety/
│       └── hooks/
└── external/
    ├── plugins/
    └── frontend/
```

## Prototype question

Does grouping related component types together make the collection easier to
understand, or does it hide the native plugin layout?
