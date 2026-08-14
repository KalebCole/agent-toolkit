# Agent Toolkit

Agent Toolkit is the public catalog of the tools I use with two agent setups:

- **GitHub Copilot — Engineer:** software engineering, research, documentation,
  and browser-assisted development.
- **Hermes — Personal Assistant:** tasks, communication, research, notes, and
  local computer workflows.

## Catalog

[`catalog.json`](catalog.json) is the canonical, machine-readable inventory. It
contains one entry per project and identifies whether Copilot, Hermes, or both
use it.

Each entry records:

- what the tool does;
- whether it is a CLI, skill, plugin, collection, or toolkit;
- which setup uses it;
- its canonical source and license.

## External-source policy

The v0 catalog links to external projects. It does not copy, repackage, pin, or
install their source. Each upstream maintainer controls releases, installation,
licensing, and updates.

The catalog includes proprietary tools when they are part of an actual setup.
Their entries link to the applicable first-party terms instead of presenting
them as open source.

## Scope

This first version is an inventory. It does not include an installer, a landing
page, or a repository-owned plugin.
