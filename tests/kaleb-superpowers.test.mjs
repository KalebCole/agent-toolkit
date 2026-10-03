import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { access, readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import yaml from "js-yaml";

const repoRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const pluginRoot = path.join(repoRoot, "plugins", "kaleb-superpowers");
const skillsRoot = path.join(pluginRoot, "skills");
const inventoryName = "VENDORED_RUNTIME.sha256";
const expectedSkills = [
  "brainstorming",
  "diagnosing-superpowers",
  "dispatching-parallel-agents",
  "executing-plans",
  "finishing-a-development-branch",
  "receiving-code-review",
  "requesting-code-review",
  "subagent-driven-development",
  "systematic-debugging",
  "test-driven-development",
  "using-git-worktrees",
  "verification-before-completion",
  "writing-plans",
  "writing-skills",
];

function parseFrontmatter(document) {
  const match = document.match(/^---\n([\s\S]*?)\n---\n/);
  assert.ok(match, "skill file must begin with YAML frontmatter");
  return yaml.load(match[1]);
}

async function runtimeFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const candidate = path.join(directory, entry.name);
      return entry.isDirectory() ? runtimeFiles(candidate) : [candidate];
    }),
  );
  return files.flat();
}

test("kaleb-superpowers packages only the approved skill runtime", async () => {
  const skillDirectories = (await readdir(skillsRoot, { withFileTypes: true }))
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();

  assert.deepEqual(skillDirectories, expectedSkills);
  await assert.rejects(access(path.join(pluginRoot, "hooks")));
  await assert.rejects(access(path.join(skillsRoot, "using-superpowers")));
  for (const excluded of [
    ".cursor-plugin",
    ".devin-plugin",
    ".hermes-plugin",
    ".kimi-plugin",
    ".muse-plugin",
    ".opencode",
    ".pi",
    "skills/systematic-debugging/CREATION-LOG.md",
    "skills/systematic-debugging/test-academic.md",
    "skills/systematic-debugging/test-pressure-1.md",
    "skills/systematic-debugging/test-pressure-2.md",
    "skills/systematic-debugging/test-pressure-3.md",
  ]) {
    await assert.rejects(access(path.join(pluginRoot, excluded)));
  }

  for (const relativePath of [
    "plugin.json",
    ".claude-plugin/plugin.json",
    ".codex-plugin/plugin.json",
    "LICENSE",
    "THIRD_PARTY_NOTICES.md",
    "assets/app-icon.png",
    "assets/superpowers-small.svg",
  ]) {
    await access(path.join(pluginRoot, relativePath));
  }
});

test("only brainstorming is manual-only for every supported runtime", async () => {
  for (const skill of expectedSkills) {
    const document = await readFile(path.join(skillsRoot, skill, "SKILL.md"), "utf8");
    const metadata = parseFrontmatter(document);

    assert.equal(metadata.name, skill);
    assert.equal(
      metadata["disable-model-invocation"],
      skill === "brainstorming" ? true : undefined,
    );
    assert.equal(metadata["user-invocable"], undefined);

    const openai = yaml.load(
      await readFile(
        path.join(skillsRoot, skill, "agents", "openai.yaml"),
        "utf8",
      ),
    );
    assert.equal(typeof openai.interface.display_name, "string");
    assert.equal(typeof openai.interface.short_description, "string");
    assert.deepEqual(
      openai.policy,
      skill === "brainstorming"
        ? { allow_implicit_invocation: false }
        : undefined,
    );
  }
});

test("frozen runtime matches the reviewed checksum inventory", async () => {
  const inventory = await readFile(path.join(pluginRoot, inventoryName), "utf8");
  const expected = new Map(
    inventory
      .trim()
      .split("\n")
      .map((line) => {
        const match = line.match(/^([0-9a-f]{64})  (.+)$/);
        assert.ok(match, `invalid inventory line: ${line}`);
        return [match[2], match[1]];
      }),
  );
  const actualPaths = (await runtimeFiles(pluginRoot))
    .map((file) => path.relative(pluginRoot, file))
    .filter((file) => file !== inventoryName)
    .sort();

  assert.equal(expected.size, inventory.trim().split("\n").length);
  assert.deepEqual([...expected.keys()].sort(), actualPaths);

  for (const relativePath of actualPaths) {
    const contents = await readFile(path.join(pluginRoot, relativePath));
    const digest = createHash("sha256").update(contents).digest("hex");
    assert.equal(digest, expected.get(relativePath), relativePath);
  }

  for (const relativePath of [
    "skills/brainstorming/scripts/start-server.sh",
    "skills/brainstorming/scripts/stop-server.sh",
    "skills/executing-plans/scripts/task-done",
    "skills/executing-plans/scripts/task-start",
    "skills/subagent-driven-development/scripts/review-package",
    "skills/subagent-driven-development/scripts/sdd-workspace",
    "skills/subagent-driven-development/scripts/task-brief",
    "skills/systematic-debugging/find-polluter.sh",
  ]) {
    const metadata = await stat(path.join(pluginRoot, relativePath));
    assert.equal(metadata.mode & 0o111, 0o111, `${relativePath} must be executable`);
  }
});

test("retained runtime uses only the kaleb-superpowers namespace", async () => {
  const files = [
    ...(await runtimeFiles(skillsRoot)),
    path.join(pluginRoot, "plugin.json"),
    path.join(pluginRoot, ".claude-plugin", "plugin.json"),
    path.join(pluginRoot, ".codex-plugin", "plugin.json"),
  ];
  for (const file of files) {
    const contents = await readFile(file, "utf8");
    assert.doesNotMatch(
      contents,
      /(?<!kaleb-)superpowers:/,
      path.relative(pluginRoot, file),
    );
    assert.doesNotMatch(contents, /using-superpowers/, path.relative(pluginRoot, file));
  }
});

test("kaleb-superpowers manifests identify the renamed frozen release", async () => {
  for (const manifestPath of [
    "plugin.json",
    ".claude-plugin/plugin.json",
    ".codex-plugin/plugin.json",
  ]) {
    const manifest = JSON.parse(
      await readFile(path.join(pluginRoot, manifestPath), "utf8"),
    );
    assert.equal(manifest.name, "kaleb-superpowers");
    assert.equal(manifest.version, "6.4.2");
    assert.equal(manifest.license, "MIT");
  }
});
