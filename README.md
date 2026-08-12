# Agent Toolkit

My folder-first collection of agent tools, with a GitHub Copilot CLI
marketplace for installable plugins.

Each tool has its own folder and machine-readable `entry.json`. External source
stays in the repository that owns it.

## Browse

### Plugins

- [`mattpocock-skills`](plugins/mattpocock-skills/) — my primary engineering
  workflow
- [`humanizer`](plugins/humanizer/) — make AI-assisted writing sound natural
- [`cli-printing-press`](plugins/cli-printing-press/) — build agent-friendly Go
  CLIs
- [`superpowers`](plugins/superpowers/) — optional, more prescriptive
  engineering workflows

### Frontend

- [`impeccable`](frontend/impeccable/) — frontend design toolkit
- [`grill-design`](frontend/grill-design/) — design grilling skill
- [`oil-motion`](frontend/oil-motion/) — responsive web animation library

Each external entry is pinned to an exact source commit. The source authors own
their code, releases, licenses, and future changes.

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

This is a personal opt-in. Agent Toolkit cannot enable it for you.

## Automatic source updates

A daily GitHub Actions workflow checks every entry's tracked branch. When a
source commit changes, the workflow:

1. updates the commit pin in the entry and generated marketplace;
2. installs every pinned plugin in a clean Copilot configuration;
3. opens a pull request; and
4. merges the pull request after validation succeeds.

Only pins and descriptive metadata live here. External source is not copied
into Agent Toolkit. These updates are automated and are not human-reviewed.

Run the same checks locally:

```bash
node scripts/catalog.mjs check
bash scripts/validate-marketplace.sh
```

## Release scope

Marketplace v0 is verified with GitHub Copilot CLI. GitHub Copilot Desktop
support is not claimed until its plugin behavior is tested.

A later release will add my public-safe skills, agents, and hooks as real
folders. This release contains no empty plugin or synthetic placeholder
content.
