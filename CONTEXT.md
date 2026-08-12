# Agent Toolkit

Agent Toolkit distributes one owned plugin and documents external tools without
redistributing them.

## Language

**Owned Plugin**:
The single `kaleb-toolkit` plugin distributed from this repository. It contains
only workflows maintained here.
_Avoid_: Core Plugin, bundle

**Owned Skill**:
An original skill whose instructions are authored and maintained in this
repository. It can use an external dependency without copying that dependency.
_Avoid_: Mirrored Skill, Adapter Skill

**External Tool**:
A plugin, skill collection, CLI, library, or MCP server maintained outside this
repository.
_Avoid_: Included Plugin, Marketplace Entry

**External Showcase**:
The root README section that explains which External Tools Kaleb uses and links
to their canonical source repositories.
_Avoid_: Catalog, marketplace

**Ownership Rule**:
Only Owned Skills ship in the Owned Plugin. External Tool source is linked, not
copied, pinned, repackaged, or updated here.
_Avoid_: Mirror policy
