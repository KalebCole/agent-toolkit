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
A GitHub Copilot app-specific extension that provides a shared interactive
surface for human-agent work. Canvas Extensions are outside Agent Toolkit v0
because neither GitHub Copilot CLI nor Hermes provides that visual surface.
_Avoid_: Canvas, web page

**External Recommendation**:
A canonical upstream tool that Agent Toolkit recommends without copying,
bundling, or silently installing it.
_Avoid_: Included plugin, vendored tool
