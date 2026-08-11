# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Static HTML/CSS/JavaScript for the throwaway prototype. The eventual product is
a public GitHub repository; its implementation stack remains undecided.

## Users

Kaleb is the first user, maintaining the tools he uses across AI-agent clients.
Other developers can browse the public repository to adopt selected parts of
the same setup.

## Product Purpose

Agent Toolkit is "dotfiles for agents": a public repository that documents a
curated agent setup, exposes a small Kaleb-owned plugin, and points people to
canonical upstream tools without copying or silently installing them.

## Positioning

Unlike a generic marketplace, Agent Toolkit is an opinionated, provenance-first
record of a real working setup. Every external entry stays owned and maintained
upstream.

## Operating Context

People encounter the toolkit on GitHub. They read the README, browse entries by
type or purpose, follow upstream links, and choose individual installation
commands.

## Capabilities and Constraints

- The public catalog may contain native plugins, standalone skills, CLIs, and
  frontend resources, but each type must be explicit.
- Installing the first-party Agent Toolkit plugin does not install catalog
  entries.
- Confirmed important plugins are `humanizer`, `cli-printing-press`, and
  `mattpocock-skills`.
- Whether `superpowers` belongs in the initial index is undecided.
- Existing frontend candidates are `oil-motion`, `grill-design`, and
  `impeccable`; their exact catalog classifications remain open.
- No employer material, credentials, private paths, or copied third-party
  source belongs in the public repository.

## Brand Commitments

- Name: Agent Toolkit
- Repository identity: `agent-toolkit`
- Positioning phrase: "dotfiles for agents"
- Wayfinder is the planning workflow, not product branding.

## Evidence on Hand

The Todoist Wayfinder project contains the approved v0 boundary, the
public-safe upstream inventory, and the current frontend candidate list. There
are no public launch claims, adoption metrics, screenshots, or testimonials.

## Product Principles

- Show provenance before convenience.
- Keep every tool's type and ownership legible.
- Let people adopt one entry without inheriting the whole setup.
- Reflect tools that are genuinely useful, not the largest possible catalog.
- Keep public and private working contexts strictly separate.

