# Kaleb Marketplace Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the custom Agent Toolkit catalog with a tested, multi-plugin Kaleb Marketplace that has one canonical catalog, deterministic client projections, frozen local skills, safe external references, and review-only update automation.

**Architecture:** `.agents/plugins/marketplace.json` is the hand-edited source of truth. `scripts/catalog.mjs` validates it and projects only supported source forms into committed Copilot and Claude catalogs. Local Agent Plugins 1.0 packages stay under `plugins/`; external packages remain in their source repositories at exact pins.

**Tech Stack:** Node.js 22, ECMAScript modules, Node test runner, JSON Schema, Bash, GitHub Actions, GitHub CLI

**Spec:** `docs/superpowers/specs/2026-10-03-kaleb-marketplace-design.md`

## Global Constraints

- Display name: `Kaleb Marketplace`.
- Prepare for, but do not perform, the GitHub rename from `agent-toolkit` to `kaleb-marketplace`.
- Local plugins use Agent Plugins 1.0 with root `plugin.json` and `skills/<name>/SKILL.md`.
- `.agents/plugins/marketplace.json` is the only hand-edited catalog.
- `.github/plugin/marketplace.json` and `.claude-plugin/marketplace.json` are deterministic generated files.
- Do not use `entry.json`, `plugin.lock.json`, Git submodules, content adapters, or duplicated external plugin content.
- Frozen skills are `bro`, `grilling`, and `grill-me` only; automation must not update them.
- External update automation opens one pull request per changed plugin and never auto-merges.
- Impeccable uses only `npx impeccable install` and `npx impeccable update`.
- Do not add CLI Printing Press, Superpowers, the full Matt Pocock Skills bundle, Grill Design, or Oil Motion.

---

### Task 1: Canonical Catalog and Generator Contract

**Files:**
- Create: `package.json`
- Create: `schemas/marketplace.schema.json`
- Create: `.agents/plugins/marketplace.json`
- Create: `tests/catalog.test.mjs`
- Modify: `scripts/catalog.mjs`
- Replace generated: `.github/plugin/marketplace.json`
- Create generated: `.claude-plugin/marketplace.json`
- Delete: `plugins/*/entry.json`
- Delete: `frontend/*/entry.json`

**Interfaces:**
- Consumes: canonical entries with `name`, `source`, `policy`, and `category`.
- Produces: `loadCanonicalCatalog()`, `generateCopilotCatalog(catalog)`, `generateClaudeCatalog(catalog)`, `renderJson(value)`, and CLI commands `generate`, `check`, `validate`, `verify-sources`, `check-updates`, and `update <name>`.

- [ ] **Step 1: Write generator tests**

Create `tests/catalog.test.mjs` with Node test cases that import the five
exported functions. Use in-memory catalogs to assert:

```js
assert.deepEqual(
  generateCopilotCatalog(localCatalog).plugins[0].source,
  "./plugins/kaleb-skills",
);
assert.deepEqual(
  generateClaudeCatalog(externalCatalog).plugins[0].source,
  {
    source: "url",
    url: "https://github.com/example/tool.git",
    ref: "main",
    sha: "0123456789012345678901234567890123456789",
  },
);
assert.throws(
  () => generateCopilotCatalog(unmappableCatalog),
  /tool.*Copilot.*archive/,
);
assert.equal(renderJson({ name: "x" }), '{\n  "name": "x"\n}\n');
```

Also copy a generated file to a temporary directory, change one byte, and
assert that the drift comparison reports the exact output path.

- [ ] **Step 2: Run the tests and confirm the old generator fails**

Run:

```bash
npm test
```

Expected: FAIL because `package.json` and the exported generator contract do
not exist.

- [ ] **Step 3: Add the canonical schema and catalog**

Create `package.json`:

```json
{
  "name": "kaleb-marketplace",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "test": "node --test",
    "generate": "node scripts/catalog.mjs generate",
    "check": "bash scripts/validate-marketplace.sh"
  },
  "devDependencies": {
    "ajv": "8.20.0",
    "js-yaml": "4.3.2"
  }
}
```

Run `npm install` to create `package-lock.json`.

Create `schemas/marketplace.schema.json` as a closed JSON Schema. Permit:

```json
{
  "name": "kaleb-marketplace",
  "interface": { "displayName": "Kaleb Marketplace" },
  "plugins": [
    {
      "name": "kaleb-skills",
      "source": {
        "source": "local",
        "path": "./plugins/kaleb-skills"
      },
      "policy": {
        "installation": "AVAILABLE",
        "authentication": "ON_INSTALL"
      },
      "category": "Productivity"
    }
  ]
}
```

The source union must allow only `local`, `url`, and `git-subdir`. External
sources require `url`, `ref`, and a 40-character lowercase `sha`;
`git-subdir` also requires `path`.

Add the four approved entries to `.agents/plugins/marketplace.json` in this
order: `kaleb-skills`, `humanizer`, `visual-explainer`, `i-have-adhd`. Use the
reviewed pins from the spec.

- [ ] **Step 4: Implement deterministic generation**

Replace `scripts/catalog.mjs` with an importable module and guarded CLI entry.
Normalize each native source using this exact mapping:

```js
const mappings = {
  local: {
    copilot: ({ path }) => path,
    claude: ({ path }) => path,
  },
  url: {
    copilot: ({ url, sha }) => ({
      source: "github",
      repo: githubRepo(url),
      sha,
    }),
    claude: ({ url, ref, sha }) => ({ source: "url", url, ref, sha }),
  },
  "git-subdir": {
    copilot: ({ url, path, sha }) => ({
      source: "github",
      repo: githubRepo(url),
      path,
      sha,
    }),
    claude: ({ url, path, ref, sha }) => ({
      source: "git-subdir",
      url,
      path,
      ref,
      sha,
    }),
  },
};
```

Reject non-GitHub external URLs for Copilot because its generated source
cannot preserve them. Validate source paths before generation. Write files
only for `generate`; `check` compares exact rendered bytes.

- [ ] **Step 5: Generate catalogs and remove the old model**

Run:

```bash
node scripts/catalog.mjs generate
```

Delete all old `entry.json` files and the empty `frontend/` tree. Confirm:

```bash
find . -name entry.json -o -name plugin.lock.json
```

Expected: no output.

- [ ] **Step 6: Run focused tests**

Run:

```bash
npm test
node scripts/catalog.mjs check
```

Expected: all tests pass and both generated catalogs match.

- [ ] **Step 7: Commit the catalog foundation**

```bash
git add package.json package-lock.json schemas .agents .github/plugin .claude-plugin scripts/catalog.mjs tests plugins frontend
git commit -m "feat: add canonical marketplace catalog" -m "Co-authored-by: Copilot App <223556219+Copilot@users.noreply.github.com>"
```

### Task 2: Frozen Kaleb Skills Plugin

**Files:**
- Create: `plugins/kaleb-skills/plugin.json`
- Create: `plugins/kaleb-skills/LICENSE`
- Create: `plugins/kaleb-skills/THIRD_PARTY_NOTICES.md`
- Create: `plugins/kaleb-skills/skills/bro/SKILL.md`
- Create: `plugins/kaleb-skills/skills/grilling/SKILL.md`
- Create: `plugins/kaleb-skills/skills/grill-me/SKILL.md`
- Create: `tests/local-plugin.test.mjs`

**Interfaces:**
- Consumes: Agent Plugins schema URL `https://agent-plugins.org/schemas/1.0.0/plugin.schema.json`.
- Produces: independently installable plugin `kaleb-skills` with exactly three discoverable skills.

- [ ] **Step 1: Write local package tests**

Create tests that read the plugin directory and assert:

```js
assert.deepEqual(skillDirectories, ["bro", "grill-me", "grilling"]);
assert.equal(manifest.$schema, AGENT_PLUGIN_SCHEMA);
assert.equal(manifest.name, "kaleb-skills");
assert.equal(frontmatter.name, directoryName);
assert.ok(frontmatter.description);
assert.match(notices, /dmmulroy\/skills/);
assert.match(notices, /8603380821fee6a77c82639f364ce8fe4f5a92be/);
assert.match(notices, /mattpocock\/skills/);
assert.match(notices, /d81f3a183412e71a5b1e84ca21bc1a35eea03a60/);
```

Compare each copied `SKILL.md` against an exact expected string fixture in
the test so accidental edits fail.

- [ ] **Step 2: Run the local package tests and confirm failure**

Run:

```bash
node --test tests/local-plugin.test.mjs
```

Expected: FAIL because `plugins/kaleb-skills` does not exist.

- [ ] **Step 3: Create the portable plugin**

Create `plugin.json`:

```json
{
  "$schema": "https://agent-plugins.org/schemas/1.0.0/plugin.schema.json",
  "name": "kaleb-skills",
  "version": "1.0.0",
  "description": "Kaleb's intentionally frozen standalone skills.",
  "author": {
    "name": "Kaleb Cole",
    "url": "https://github.com/KalebCole"
  },
  "repository": "https://github.com/KalebCole/agent-toolkit",
  "license": "MIT",
  "keywords": ["skills", "productivity", "review"]
}
```

Copy the three reviewed skill files byte-for-byte from the source revisions in
the spec. Add the complete MIT text from the reviewed source licenses.
Document each source repository, original path, exact commit, copied files,
copyright, and MIT status in `THIRD_PARTY_NOTICES.md`.

- [ ] **Step 4: Run package and catalog tests**

Run:

```bash
npm test
node scripts/catalog.mjs validate
```

Expected: all tests pass; the plugin has exactly three valid skills.

- [ ] **Step 5: Commit the frozen plugin**

```bash
git add plugins/kaleb-skills tests/local-plugin.test.mjs
git commit -m "feat: add frozen kaleb skills plugin" -m "Co-authored-by: Copilot App <223556219+Copilot@users.noreply.github.com>"
```

### Task 3: Source and Package Validation

**Files:**
- Create: `scripts/validate-marketplace.mjs`
- Modify: `scripts/validate-marketplace.sh`
- Create: `tests/validation.test.mjs`
- Modify: `package.json`

**Interfaces:**
- Consumes: canonical catalog, local plugin trees, GitHub API, and generated catalogs.
- Produces: `validateLocalPlugins(root, catalog)`, `validateSkill(path)`, `verifyExternalSource(entry, fetch)`, and one nonzero exit on any failed invariant.

- [ ] **Step 1: Write validation failure tests**

Use temporary fixtures to assert failures for:

```js
await assert.rejects(
  () => validateLocalPlugins(rootWithMissingLicense, catalog),
  /kaleb-skills.*LICENSE/,
);
await assert.rejects(
  () => validateSkill(skillWithWrongName),
  /frontmatter name.*directory/,
);
await assert.rejects(
  () => verifyExternalSource(entry, notFoundFetch),
  /humanizer.*225a6f3.*not available/,
);
```

Also assert that each external package check requires its native marker files:

- Humanizer: `.claude-plugin/plugin.json`, `SKILL.md`, `LICENSE`.
- Visual Explainer: `plugins/visual-explainer/.claude-plugin/plugin.json`,
  `plugins/visual-explainer/SKILL.md`, `LICENSE`.
- i-have-adhd: `plugin.json`, `.agents/plugins/marketplace.json`,
  `.claude-plugin/plugin.json`, `skills/i-have-adhd/SKILL.md`, `LICENSE`.

- [ ] **Step 2: Run validation tests and confirm failure**

Run:

```bash
node --test tests/validation.test.mjs
```

Expected: FAIL because the validation module does not exist.

- [ ] **Step 3: Implement local and remote validation**

Validate the canonical file against `schemas/marketplace.schema.json` with
Ajv. Validate local `plugin.json` files against the Agent Plugins 1.0
constraints, reject escaping symlinks, parse skill YAML frontmatter, and
require notices for copied skills.

For each external entry, call GitHub's contents API at its exact `sha` for
every required marker. Set:

```js
const headers = {
  Accept: "application/vnd.github+json",
  "User-Agent": "kaleb-marketplace-validator",
  "X-GitHub-Api-Version": "2022-11-28",
  ...(process.env.GITHUB_TOKEN
    ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
    : {}),
};
```

Report HTTP status, plugin name, pin, and path for failures.

- [ ] **Step 4: Make the shell entry point complete**

Make `scripts/validate-marketplace.sh` run:

```bash
npm test
node scripts/catalog.mjs check
node scripts/validate-marketplace.mjs
node scripts/catalog.mjs verify-sources
```

Do not claim a Claude or Copilot install proves Agent Plugins conformance.
When a client executable is available, validate its generated catalog; when
it is absent, print a clear skip line and keep structural checks mandatory.

- [ ] **Step 5: Run targeted validation**

Run:

```bash
npm test
bash scripts/validate-marketplace.sh
```

Expected: unit tests, schema checks, catalog drift checks, and pinned source
checks pass.

- [ ] **Step 6: Commit validation**

```bash
git add package.json package-lock.json scripts tests schemas
git commit -m "test: validate marketplace packages and pins" -m "Co-authored-by: Copilot App <223556219+Copilot@users.noreply.github.com>"
```

### Task 4: Weekly One-Plugin Update Pull Requests

**Files:**
- Modify: `scripts/catalog.mjs`
- Modify: `.github/workflows/update-external-pins.yml`
- Modify: `.github/workflows/validate.yml`
- Create: `tests/update-pins.test.mjs`

**Interfaces:**
- Consumes: `check-updates --json` output shaped as `{ "include": [{ "name": "humanizer" }] }`.
- Produces: `update <name>` that changes one `sha`, regenerates both client catalogs, and prints old and new pins.

- [ ] **Step 1: Write update command tests**

Mock branch resolution and assert:

```js
assert.deepEqual(await findUpdates(catalog, fetchHead), {
  include: [{ name: "humanizer" }],
});
assert.equal(updatePin(catalog, "humanizer", NEW_SHA).plugins[1].source.sha, NEW_SHA);
assert.equal(updatePin(catalog, "humanizer", NEW_SHA).plugins[2].source.sha, VISUAL_SHA);
assert.throws(() => updatePin(catalog, "kaleb-skills", NEW_SHA), /not external/);
```

- [ ] **Step 2: Run update tests and confirm failure**

Run:

```bash
node --test tests/update-pins.test.mjs
```

Expected: FAIL because `findUpdates` and `updatePin` are not exported.

- [ ] **Step 3: Implement one-entry update operations**

Add `findUpdates(catalog, fetchHead)` and `updatePin(catalog, name, sha)`.
`check-updates --json` must emit a valid empty matrix when no source changed.
`update <name>` must reject local entries, verify the new package markers,
write only the named pin, and regenerate both client catalogs.

- [ ] **Step 4: Replace update automation**

Change the schedule to weekly:

```yaml
on:
  schedule:
    - cron: "17 9 * * 1"
  workflow_dispatch:
```

Use a discovery job and a matrix update job. Each matrix job must:

```bash
node scripts/catalog.mjs update "${{ matrix.name }}"
bash scripts/validate-marketplace.sh
git checkout -B "automation/update-${{ matrix.name }}"
git add .agents/plugins/marketplace.json \
  .github/plugin/marketplace.json \
  .claude-plugin/marketplace.json
git commit -m "chore: update ${{ matrix.name }} pin"
git push --force-with-lease origin "HEAD:automation/update-${{ matrix.name }}"
```

Open or update one pull request for that branch. Do not call `gh pr merge` and
do not enable auto-merge.

- [ ] **Step 5: Update validation CI**

Use Node.js 22, `npm ci`, and `bash scripts/validate-marketplace.sh`. Keep
permissions at `contents: read`.

- [ ] **Step 6: Run tests and inspect workflow rules**

Run:

```bash
npm test
bash scripts/validate-marketplace.sh
grep -R "gh pr merge\|auto-merge" .github/workflows && exit 1 || true
```

Expected: tests pass and the grep command finds no forbidden merge action.

- [ ] **Step 7: Commit automation**

```bash
git add scripts/catalog.mjs tests/update-pins.test.mjs .github/workflows
git commit -m "ci: open reviewed plugin update pull requests" -m "Co-authored-by: Copilot App <223556219+Copilot@users.noreply.github.com>"
```

### Task 5: User, Contributor, and Post-Merge Documentation

**Files:**
- Modify: `README.md`
- Modify: `CONTEXT.md`
- Create: `docs/usage.md`
- Create: `docs/contributing.md`
- Create: `docs/maintenance.md`
- Create: `docs/post-merge.md`
- Create: `tests/documentation.test.mjs`

**Interfaces:**
- Consumes: the three distribution paths and commands from the design spec.
- Produces: consistent public instructions and explicit issue disposition.

- [ ] **Step 1: Write documentation assertions**

Assert that public docs:

```js
for (const phrase of [
  "local stored plugin",
  "maintained external plugin reference",
  "native external installer",
  "npx impeccable install",
  "npx impeccable update",
]) {
  assert.match(allDocs, new RegExp(escapeRegExp(phrase), "i"));
}
for (const removed of [
  "cli-printing-press",
  "mattpocock-skills",
  "grill-design",
  "oil-motion",
]) {
  assert.doesNotMatch(catalogAndBrowseDocs, new RegExp(removed, "i"));
}
```

The removal assertion excludes `docs/post-merge.md`, where issue #46 must be
named as intentionally not included.

- [ ] **Step 2: Run documentation tests and confirm failure**

Run:

```bash
node --test tests/documentation.test.mjs
```

Expected: FAIL because old names and old auto-merge claims remain.

- [ ] **Step 3: Rewrite the public documentation**

Explain:

- the Kaleb Marketplace identity and future repository rename;
- independent local plugin installation;
- maintained external references and exact reviewed pins;
- Impeccable's native installer;
- no cross-client compatibility promise;
- local validation and contribution commands;
- frozen-copy review policy;
- weekly one-plugin pull requests with no auto-merge.

`CONTEXT.md` must define `Local Stored Plugin`, `Maintained External Plugin
Reference`, `Native External Installer`, `Canonical Catalog`, `Generated
Client Catalog`, and `Reviewed Pin`.

- [ ] **Step 4: Record post-merge issue and rename work**

In `docs/post-merge.md`, list the GitHub rename and issue cleanup steps. State
the implemented disposition for #44, #45, #46, #47, and #48. Do not close an
issue from this branch.

- [ ] **Step 5: Run all documentation and repository checks**

Run:

```bash
npm test
bash scripts/validate-marketplace.sh
git grep -n "entry.json\\|plugin.lock.json\\|gh pr merge"
```

Expected: tests pass. The grep command may find the design and plan statements
that prohibit these items, but no implementation or user instruction uses
them.

- [ ] **Step 6: Commit documentation**

```bash
git add README.md CONTEXT.md docs tests/documentation.test.mjs
git commit -m "docs: explain Kaleb Marketplace distribution" -m "Co-authored-by: Copilot App <223556219+Copilot@users.noreply.github.com>"
```

### Task 6: Full Verification and Handoff

**Files:**
- Modify only files required to fix failures found by this task.

**Interfaces:**
- Consumes: all repository implementation and documentation.
- Produces: a clean, reproducible validation result and coherent commit history.

- [ ] **Step 1: Run full validation**

Run:

```bash
npm ci
npm test
bash scripts/validate-marketplace.sh
node scripts/catalog.mjs check
node scripts/catalog.mjs verify-sources
```

Expected: every command exits zero.

- [ ] **Step 2: Verify repository invariants**

Run:

```bash
test "$(find plugins/kaleb-skills/skills -mindepth 1 -maxdepth 1 -type d | wc -l | tr -d ' ')" = "3"
test -z "$(find . -name entry.json -o -name plugin.lock.json)"
! git grep -n "gh pr merge" -- .github/workflows
git diff --check
git status --short
```

Expected: all assertions pass; `git status --short` shows only expected
uncommitted spec/plan changes if they were not included in an earlier commit.

- [ ] **Step 3: Commit the approved design and plan if needed**

```bash
git add docs/superpowers
git commit -m "docs: record Kaleb Marketplace design" -m "Co-authored-by: Copilot App <223556219+Copilot@users.noreply.github.com>"
```

- [ ] **Step 4: Inspect final history**

Run:

```bash
git --no-pager log --oneline main..HEAD
git status --short
```

Expected: coherent commits are present and the worktree is clean.
