# Agent Toolkit

My installable runtime packages for the tools and workflows I use.

Every folder under [`plugins/`](plugins/) is a complete standard plugin. Open a
folder to inspect its real skill files, agents, hooks, and manifest.

## Plugins

| Plugin | Uses |
|---|---|
| [`mattpocock-skills`](plugins/mattpocock-skills/) | Core, engineering |
| [`humanizer`](plugins/humanizer/) | Core, writing |
| [`cli-printing-press`](plugins/cli-printing-press/) | Engineering, CLI creation |
| [`superpowers`](plugins/superpowers/) | Engineering, optional guided workflow |
| [`impeccable`](plugins/impeccable/) | Engineering, frontend design |
| [`grill-design`](plugins/grill-design/) | Engineering, frontend design |
| [`oil-motion`](plugins/oil-motion/) | Engineering, frontend animation |
| [`todoist-cli`](plugins/todoist-cli/) | Core, engineering, personal assistant |
| [`obsidian-cli`](plugins/obsidian-cli/) | Personal assistant, knowledge |

Uses overlap by design. Standard marketplace `tags` describe those contexts;
folders stay flat by plugin name.

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
copilot plugin install impeccable@agent-toolkit
copilot plugin install grill-design@agent-toolkit
copilot plugin install oil-motion@agent-toolkit
copilot plugin install todoist-cli@agent-toolkit
copilot plugin install obsidian-cli@agent-toolkit
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

## Mirrored source

The external authors remain the source owners. Agent Toolkit mirrors only the
files that form each plugin package and preserves the source license in that
plugin folder.

A daily GitHub Actions workflow checks each source repository. When source
changes, it:

1. refreshes the mirrored plugin files;
2. verifies the files match the recorded source commit;
3. installs every plugin in a clean Copilot configuration; and
4. opens a pull request for human review.

Source-changing pull requests are never merged automatically.

Run the same checks locally:

```bash
node scripts/mirrors.mjs check
bash scripts/validate-marketplace.sh
```

## Release scope

Marketplace v0 is verified with GitHub Copilot CLI. GitHub Copilot Desktop
support is not claimed until its plugin behavior is tested.

GitHub Copilot CLI is the first verified runtime. Other runtime adapters remain
future work.
