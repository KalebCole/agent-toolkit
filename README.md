# Agent Toolkit

> [!WARNING]
> This branch is a throwaway v0 prototype. It tests one question: does one
> owned plugin plus a link-only external showcase feel like the right model?

Agent Toolkit is where I publish the agent workflows I own and document the
external tools I use.

## My toolkit

[`kaleb-toolkit`](plugins/kaleb-toolkit/) is the only plugin distributed by
this repository. Its source is visible here and maintained here.

The v0 prototype contains one original skill:

- [`toolkit-router`](plugins/kaleb-toolkit/skills/toolkit-router/) helps choose
  the smallest useful workflow for engineering, design, writing, or personal
  organization.

### Install

```bash
copilot plugin marketplace add KalebCole/agent-toolkit
copilot plugin install kaleb-toolkit@agent-toolkit
```

## External tools I use

These projects remain independent. Agent Toolkit does not copy, pin, repackage,
or update their source.

| Tool | What I use it for | Source |
|---|---|---|
| Matt Pocock Skills | Primary engineering workflow | [`mattpocock/skills`](https://github.com/mattpocock/skills) |
| Humanizer | Natural writing | [`blader/humanizer`](https://github.com/blader/humanizer) |
| CLI Printing Press | Building agent-friendly Go CLIs | [`mvanhorn/cli-printing-press`](https://github.com/mvanhorn/cli-printing-press) |
| Superpowers | Optional, more prescriptive engineering workflow | [`obra/superpowers`](https://github.com/obra/superpowers) |
| Impeccable | Frontend design work | [`pbakaus/impeccable`](https://github.com/pbakaus/impeccable) |
| Grill Design | Iterative design grilling | [`will-ness-ai/skills`](https://github.com/will-ness-ai/skills/tree/main/skills/grill-design) |
| Oil Motion | Responsive web animation | [`oil-oil/oil-motion`](https://github.com/oil-oil/oil-motion) |
| Todoist CLI | Tasks and personal-assistant workflows | [`Doist/todoist-cli`](https://github.com/Doist/todoist-cli) |
| Obsidian Skills | Notes and knowledge workflows | [`kepano/obsidian-skills`](https://github.com/kepano/obsidian-skills) |

Install external tools from their own documentation. Their maintainers control
their source, releases, licenses, and update behavior.

## Ownership rule

A skill ships in `kaleb-toolkit` only when its instructions are authored and
maintained here. An owned skill can depend on an external CLI or library, but
the dependency stays external and receives a direct source link.
