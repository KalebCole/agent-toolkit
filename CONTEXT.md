# Agent Toolkit

Agent Toolkit is a source-first collection of reusable components for personal
AI-agent workflows, with external recommendations kept secondary to the
components maintained in the repository.

## Language

**Agent Toolkit**:
The public repository containing Kaleb-maintained agent components and a
secondary set of canonical upstream recommendations.
_Avoid_: Marketplace, catalog

**Core Plugin**:
The single installable Copilot plugin that bundles Agent Toolkit's owned skills,
agents, and hooks.
_Avoid_: Catalog plugin, universal manifest

**Canvas Extension**:
A personal GitHub Copilot app extension that provides a shared interactive
surface for human-agent work and is installed in the user's Copilot extension
space.
_Avoid_: Canvas, web page

**External Recommendation**:
A canonical upstream tool that Agent Toolkit recommends without copying,
bundling, or silently installing it.
_Avoid_: Included plugin, vendored tool

