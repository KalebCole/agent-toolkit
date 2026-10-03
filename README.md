# Kaleb Marketplace

Kaleb Marketplace is my personal, public collection of selected agent
plugins. It is not a universal package manager, and a listing is not a promise
that the same package works in every agent client.

Browse the current contents in the
[canonical catalog](.agents/plugins/marketplace.json). Client catalogs are
generated from this source.

## Install from the marketplace

### GitHub Copilot CLI

```bash
copilot plugin marketplace add KalebCole/kaleb-marketplace
copilot plugin marketplace browse kaleb-marketplace
copilot plugin install <plugin-name>@kaleb-marketplace
```

### Codex

```bash
codex plugin marketplace add KalebCole/kaleb-marketplace
```

Then start Codex, run `/plugins`, choose `kaleb-marketplace`, and install a plugin.

### Claude Code

```bash
claude plugin marketplace add KalebCole/kaleb-marketplace
claude plugin install <plugin-name>@kaleb-marketplace
```

See [usage](docs/usage.md) for install syntax, support boundaries, and native
source paths.

## Install Impeccable

Impeccable is not a marketplace plugin. Use its supported native installer:

```bash
npx impeccable install
```

## Validate

```bash
npm ci
bash scripts/validate-marketplace.sh
```

See [contributing](docs/contributing.md) and
[maintenance](docs/maintenance.md).
