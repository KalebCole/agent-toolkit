# Using Kaleb Marketplace

## Choose the distribution path

Use a **local stored plugin** when this repository intentionally stores and
licenses the plugin content. Use a **maintained external plugin reference**
when the source repository already provides a package layout that a target
client can install safely. Use a **native external installer** when the source
project publishes its own installer.

## Marketplace registration

```bash
copilot plugin marketplace add KalebCole/kaleb-marketplace
claude plugin marketplace add KalebCole/kaleb-marketplace
```

The marketplace name inside both client catalogs is `kaleb-marketplace`.
Browse the current contents in the
[canonical catalog](../.agents/plugins/marketplace.json).

Install one item at a time:

```bash
copilot plugin install <plugin-name>@kaleb-marketplace
claude plugin install <plugin-name>@kaleb-marketplace
```

The local package follows Agent Plugins 1.0. External entries use the native
package layout at the exact commit in `.agents/plugins/marketplace.json`.
Successful validation for one client is not proof of support for another
client.

## Use the stored ADHD skill

Install `kaleb-skills@kaleb-marketplace`, then explicitly invoke
`/i-have-adhd`. The skill remains active until you say "stop adhd mode" or
"normal mode". Its upstream user-only invocation settings are unchanged.

`i-have-adhd` is no longer a standalone external plugin in this marketplace.
If you installed that plugin before this change, uninstall it with your
client's plugin command to avoid loading two copies.

This is an intentionally frozen copy. Its exact source commit, copied paths,
and license are in
[`THIRD_PARTY_NOTICES.md`](../plugins/kaleb-skills/THIRD_PARTY_NOTICES.md).
The copied `agents/` files are passive upstream metadata; this marketplace
does not install Gemini commands or upstream hooks.

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
