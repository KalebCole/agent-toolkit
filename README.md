# Agent Toolkit — Component-first prototype

This branch prototypes **each owned tool as the browsing unit**. Every component
has one self-contained directory with its native source and local explanation.
The root plugin manifest assembles those directories into one Core Plugin.

> [!NOTE]
> All owned components are synthetic placeholders. This branch tests structure,
> not the v0 payload.

## Browse the components

- [`components/example-workflow/`](components/example-workflow/) — skill package
- [`components/example-reviewer/`](components/example-reviewer/) — agent package
- [`components/safe-boundaries/`](components/safe-boundaries/) — hook package
- [`recommendations/`](recommendations/) — secondary external references

```text
agent-toolkit/
├── plugin.json
├── components/
│   ├── example-workflow/
│   │   ├── README.md
│   │   └── skill/SKILL.md
│   ├── example-reviewer/
│   │   ├── README.md
│   │   └── agents/example-reviewer.agent.md
│   └── safe-boundaries/
│       ├── README.md
│       └── hooks.json
└── recommendations/
```

## Prototype question

Is it more useful to keep everything for one component together, even though
that adds indirection between the repository tree and Copilot's native folders?
