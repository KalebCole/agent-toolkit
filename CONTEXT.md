# Agent Toolkit

Agent Toolkit is a source-first portfolio of Kaleb-maintained agent components
and a curated distribution point for credited external plugins.

## Language

**Core Plugin**:
The single Agent Toolkit plugin containing skills, agents, and hooks maintained
in this repository.
_Avoid_: Catalog plugin, universal manifest

**Curated Marketplace**:
The Agent Toolkit Copilot marketplace containing the Core Plugin and selected
external plugins. Registration installs nothing; users choose each plugin.
_Avoid_: Bundle, plugin pack

**External Plugin**:
A plugin listed by the Curated Marketplace but authored, sourced, and updated
from its canonical upstream repository.
_Avoid_: Agent Toolkit plugin, included source

**Upstream Reference**:
A pointer-only portfolio entry for a useful external tool that cannot be listed
through the Copilot marketplace.
_Avoid_: Vendored tool, submodule

