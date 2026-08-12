# Agent Toolkit

Agent Toolkit is a folder-first collection of agent tools and a curated
distribution point for credited external plugins.

## Language

**Core Plugin**:
The single Agent Toolkit plugin containing skills, agents, and hooks maintained
in this repository. It is a later release milestone and is not part of
Marketplace v0.
_Avoid_: Catalog plugin, universal manifest

**Curated Marketplace**:
The Agent Toolkit Copilot marketplace containing selected external plugins.
Registration installs nothing; users choose each plugin.
_Avoid_: Bundle, plugin pack

**Marketplace v0**:
The first public release of the Curated Marketplace. It contains only credited
External Plugins and does not contain an empty or synthetic Core Plugin.
_Avoid_: Core Plugin v0, source bundle

**External Plugin**:
A plugin listed by the Curated Marketplace but authored, sourced, and updated
from its Source Repository. Agent Toolkit pins each plugin to an exact commit.
_Avoid_: Agent Toolkit plugin, included source

**Catalog Entry**:
One tool folder containing an `entry.json` file. It records identity,
classification, authorship, Source Repository, and pinned source commit.
_Avoid_: Pointer card, Markdown entry

**Source Repository**:
The external GitHub repository that owns and maintains a Catalog Entry's
source. Agent Toolkit stores a pin and metadata, not a source copy.
_Avoid_: Upstream, vendored repository

**Pin Update**:
An automated pull request that moves a Catalog Entry from one exact source
commit to another after clean installation checks pass.
_Avoid_: Source import, vendoring
