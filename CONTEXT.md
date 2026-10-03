# Kaleb Marketplace Context

Kaleb Marketplace is a personal, public marketplace for selected agent
plugins. It is not a universal package manager and does not promise automatic
cross-client compatibility.

## Language

**Local Stored Plugin**:
An independently installable Agent Plugins 1.0 package stored under
`plugins/<name>/`. It contains a root `plugin.json` and portable components in
fixed standard locations.
_Avoid_: bundle, copied external repository

**Maintained External Plugin Reference**:
A catalog entry that keeps plugin content in the author's repository and pins
one exact reviewed commit. Weekly automation can propose a new pin in a pull
request.
_Avoid_: vendored plugin, automatic compatibility

**Native External Installer**:
The installation path published and supported by an external project. The
marketplace documents this path instead of creating a wrapper.
_Avoid_: catalog workaround, generated adapter

**Canonical Catalog**:
The hand-edited `.agents/plugins/marketplace.json` file. It records local
paths and exact external Git pins in native marketplace source forms.
_Avoid_: entry file, private catalog model

**Generated Client Catalog**:
Either `.github/plugin/marketplace.json` or
`.claude-plugin/marketplace.json`. It is a deterministic projection of the
Canonical Catalog and must not be edited by hand.
_Avoid_: second source of truth

**Reviewed Pin**:
The exact 40-character commit stored in the Canonical Catalog after a person
reviews and merges its update pull request.
_Avoid_: latest version, floating branch

**Frozen Skill Copy**:
An intentionally stored skill whose source text, license, source repository,
path, and copied commit are recorded in `THIRD_PARTY_NOTICES.md`. Automation
does not update it.
_Avoid_: maintained external reference

## Current scope

- `kaleb-skills` is the only Local Stored Plugin.
- `i-have-adhd` is a Frozen Skill Copy in `kaleb-skills`, not an external plugin.
- Humanizer, Visual Explainer, and PStack are Maintained External Plugin
  References.
- Impeccable is documented through its Native External Installer.
- Client catalogs contain only mappings that preserve the pinned native
  package layout.
