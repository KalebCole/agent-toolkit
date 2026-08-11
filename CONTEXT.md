# Agent Toolkit

Agent Toolkit is a curated distribution point for credited external plugins.
It will also become a source-first portfolio of Kaleb-maintained components
when public-safe owned source is ready.

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
from its canonical upstream repository. Marketplace v0 entries follow live,
unpinned upstream source.
_Avoid_: Agent Toolkit plugin, included source

**Upstream Reference**:
A pointer-only portfolio entry for a useful external tool that cannot be listed
through the Copilot marketplace.
_Avoid_: Vendored tool, submodule
