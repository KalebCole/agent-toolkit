# Agent Toolkit

My curated GitHub Copilot CLI marketplace: the agent tools I use, installed
from the repositories that own and maintain them.

Agent Toolkit does not copy external source. Each plugin is an individual
choice and follows its live upstream repository.

## Marketplace

| Plugin | Use | Source |
|---|---|---|
| `mattpocock-skills` | My primary engineering workflow | [mattpocock/skills](https://github.com/mattpocock/skills) |
| `humanizer` | Make AI-assisted writing sound natural | [blader/humanizer](https://github.com/blader/humanizer) |
| `cli-printing-press` | Build agent-friendly Go CLIs | [mvanhorn/cli-printing-press](https://github.com/mvanhorn/cli-printing-press) |
| `superpowers` | Optional, more prescriptive engineering workflows | [obra/superpowers](https://github.com/obra/superpowers) |

All entries are **External · Live upstream**. Their authors own their source,
releases, licenses, and future changes.

## Install

Register the marketplace:

```bash
copilot plugin marketplace add KalebCole/agent-toolkit
copilot plugin marketplace browse agent-toolkit
```

Registration installs nothing. Install only what you want:

```bash
copilot plugin install mattpocock-skills@agent-toolkit
copilot plugin install humanizer@agent-toolkit
copilot plugin install cli-printing-press@agent-toolkit
copilot plugin install superpowers@agent-toolkit
```

### CLI Printing Press prerequisite

The Printing Press skills require its Go binary. Install Go 1.26.5 or newer,
then install the binary:

```bash
go install github.com/mvanhorn/cli-printing-press/v4/cmd/cli-printing-press@latest
```

See the [upstream installation guide](https://github.com/mvanhorn/cli-printing-press#install)
for the supported full setup.

## Update

Refresh the marketplace catalog, then update installed plugins:

```bash
copilot plugin marketplace update agent-toolkit
copilot plugin update --all
```

These are separate operations. Refreshing the catalog does not update installed
plugin files.

To follow this custom marketplace automatically at Copilot session start, add
the following entry to your personal `~/.copilot/settings.json`:

```json
{
  "extraKnownMarketplaces": {
    "agent-toolkit": {
      "source": {
        "source": "github",
        "repo": "KalebCole/agent-toolkit"
      },
      "autoUpdate": true
    }
  }
}
```

This is a personal opt-in. Agent Toolkit cannot enable it for you. Because the
entries follow live upstream sources, updates can include changes that Agent
Toolkit has not reviewed.

## Other references

[`upstream/`](upstream/) is a pointer-only bibliography for useful tools that
do not fit the Copilot marketplace. It contains links, not mirrored source.

## Release scope

Marketplace v0 is verified with GitHub Copilot CLI. GitHub Copilot Desktop
support is not claimed until its plugin behavior is tested.

A later release will add a source-first Core Plugin after my public-safe skills,
agents, and hooks are ready. This release contains no empty plugin or synthetic
placeholder content.
