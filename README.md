# Agent Toolkit

My **dotfiles for agents**: the plugins, skills, CLIs, and references that earn
a place in my working setup.

> [!IMPORTANT]
> Nothing here silently installs the whole catalog. The Agent Toolkit plugin
> will contain only first-party capabilities maintained in this repository.
> External entries stay upstream and are installed individually.

## Start with my daily stack

These are the native Copilot plugins I currently consider important.

| Plugin | Why I keep it | Canonical upstream |
| --- | --- | --- |
| `humanizer` | Removes mechanical AI writing patterns | [blader/humanizer](https://github.com/blader/humanizer) |
| `cli-printing-press` | Turns CLI work into durable written artifacts | [mvanhorn/cli-printing-press](https://github.com/mvanhorn/cli-printing-press) |
| `mattpocock-skills` | Planning, research, prototyping, and engineering workflows | [mattpocock/skills](https://github.com/mattpocock/skills) |

[See plugin details and installation commands](catalog/plugins.md).

## Browse by craft

The toolkit is broader than a plugin marketplace. Every entry is labeled by
what it actually is.

### Frontend

| Entry | Type | Role | Canonical upstream |
| --- | --- | --- | --- |
| `oil-motion` | Library | Interactive web animation | [oil-oil/oil-motion](https://github.com/oil-oil/oil-motion) |
| `grill-design` | Standalone skill | Interrogate a design before building it | [will-ness-ai/skills](https://github.com/will-ness-ai/skills/blob/main/skills/grill-design/SKILL.md) |
| `impeccable` | Toolkit candidate | Design language and workflow | [pbakaus/impeccable](https://github.com/pbakaus/impeccable) |

[Browse the frontend section](catalog/frontend.md).

## Two different promises

| Agent Toolkit plugin | Agent Toolkit catalog |
| --- | --- |
| Small and installable | Broad and browsable |
| Maintained in this repository | Links to canonical upstreams |
| Contains first-party capabilities | May include plugins, skills, CLIs, and libraries |
| One explicit installation | Every external entry is chosen separately |

## Under consideration

`superpowers` is useful occasionally, but its place in the initial catalog is
still being decided. It is not presented as part of the dependable core yet.

## Repository status

This branch is a **throwaway README-first prototype**. It demonstrates the
intended GitHub browsing experience; it is not the finished toolkit.

