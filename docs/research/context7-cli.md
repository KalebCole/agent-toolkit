# Context7 CLI Identity

**Date:** 2026-08-14

## Finding

The tool is the official Upstash CLI:

| Property | Value |
|---|---|
| Command | `ctx7` |
| npm package | `ctx7` |
| Verified version | `0.5.8` |
| Source | [`upstash/context7`](https://github.com/upstash/context7/tree/master/packages/cli) |
| Install | `npm install -g ctx7` or `npx ctx7 setup` |

Local installation evidence confirms that `/usr/bin/ctx7` resolves to the
globally installed `ctx7` npm package. Its package metadata identifies Upstash's
Context7 repository and exposes `ctx7` as the executable.

## Distinctions

- `@upstash/context7-mcp` is the companion MCP server package. Its executable is
  `context7-mcp`, not `ctx7`.
- [`hschne/c7`](https://github.com/hschne/c7) is an independent Go client. It is
  not the installed tool.
- The third-party `context7-cli` npm package is deprecated. It is not the
  installed tool.

## Toolkit entry

Use **Context7 (`ctx7`)** as the name and
[`upstash/context7`](https://github.com/upstash/context7) as the canonical
source.

## Primary sources

- [`ctx7` npm registry metadata](https://registry.npmjs.org/ctx7/latest)
- [Official Context7 repository](https://github.com/upstash/context7)
- [`@upstash/context7-mcp` registry metadata](https://registry.npmjs.org/@upstash/context7-mcp/latest)
