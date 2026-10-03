# Using Kaleb Marketplace

## Choose the distribution path

Use a **local stored plugin** when this repository intentionally stores and
licenses the plugin content. Use a **maintained external plugin reference**
when the source repository already provides a package layout that a target
client can install safely. Use a **native external installer** when the source
project publishes its own installer.

## Marketplace registration

Until the GitHub repository is renamed:

```bash
copilot plugin marketplace add KalebCole/agent-toolkit
claude plugin marketplace add KalebCole/agent-toolkit
```

The marketplace name inside both client catalogs is `kaleb-marketplace`.

Install one item at a time:

```bash
copilot plugin install kaleb-skills@kaleb-marketplace
copilot plugin install kaleb-superpowers@kaleb-marketplace
claude plugin install kaleb-skills@kaleb-marketplace
claude plugin install kaleb-superpowers@kaleb-marketplace
```

Available marketplace names are `kaleb-skills`, `kaleb-superpowers`,
`humanizer`, `visual-explainer`, and `i-have-adhd`.

The local package follows Agent Plugins 1.0. External entries use the native
package layout at the exact commit in `.agents/plugins/marketplace.json`.
Successful validation for one client is not proof of support for another
client.

## Kaleb Superpowers

`kaleb-superpowers` is a frozen runtime snapshot of Superpowers 6.4.2 for
Claude Code, GitHub Copilot, and OpenAI Codex. Invoke `brainstorming`
explicitly. The plugin does not inject a session-start bootstrap or a global
routing instruction. The other retained skills preserve their upstream
invocation descriptions and workflow, including the handoff from
`brainstorming` to `writing-plans`.

For Codex, every retained skill includes `agents/openai.yaml` interface
metadata. Only the `brainstorming` file disables implicit invocation. Claude
Code and the user's Copilot loader use `disable-model-invocation: true` in the
skill frontmatter.

## Native installation

Impeccable is not a marketplace entry. Use its native external installer:

```bash
npx impeccable install
npx impeccable update
```

Follow the current upstream guide at
<https://github.com/pbakaus/impeccable>.

## Update installed marketplace plugins

Refresh the catalog, then update the selected client plugins:

```bash
copilot plugin marketplace update kaleb-marketplace
copilot plugin update --all
```

A refreshed catalog can contain a reviewed external pin update. Frozen skill
copies change only through a separate, explicit source-copy review.
