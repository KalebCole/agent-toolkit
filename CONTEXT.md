# Agent Toolkit

Agent Toolkit is a collection of complete installable runtime packages for the
tools and workflows Kaleb uses.

## Language

**Core Plugin**:
The single Agent Toolkit plugin containing skills, agents, and hooks maintained
in this repository. It is a later release milestone and is not part of
Marketplace v0.
_Avoid_: Catalog plugin, universal manifest

**Curated Marketplace**:
The Agent Toolkit Copilot marketplace containing complete local Plugin
folders. Registration installs nothing; users choose each Plugin.
_Avoid_: Bundle, plugin pack

**Marketplace v0**:
The first public release of the Curated Marketplace. It contains only credited
External Plugins and does not contain an empty or synthetic Core Plugin.
_Avoid_: Core Plugin v0, source bundle

**External Plugin**:
A Mirrored Plugin whose source is authored and maintained in another
repository.
_Avoid_: Agent Toolkit-owned plugin

**Plugin**:
One complete folder under `plugins/` containing a standard plugin manifest and
the real skills, agents, hooks, or runtime configuration it distributes.
_Avoid_: Catalog entry, pointer card

**Source Repository**:
The external GitHub repository that owns and maintains a Mirrored Plugin's
source.
_Avoid_: Agent Toolkit repository

**Mirrored Plugin**:
A complete Plugin whose licensed package files are copied from a recorded
Source Repository commit. Its source license and authorship remain intact.
_Avoid_: Fork, Agent Toolkit-owned plugin

**Adapter Plugin**:
A Plugin package created here around an external CLI, library, MCP server, or
standalone skill that did not already ship as a complete plugin.
_Avoid_: Source fork, copied application

**Mirror Update**:
An automated pull request that refreshes Mirrored Plugin files from recorded
Source Repository commits. A human reviews changed agent instructions before
merge.
_Avoid_: Automatic merge
