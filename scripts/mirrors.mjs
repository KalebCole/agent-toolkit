#!/usr/bin/env node

import { createHash } from "node:crypto";
import {
  cp,
  lstat,
  mkdtemp,
  mkdir,
  readdir,
  readFile,
  rm,
  writeFile,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join, relative, resolve, sep } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const configPath = join(root, ".github/plugin/mirrors.json");
const shaPattern = /^[0-9a-f]{40}$/;
const namePattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const repoPattern = /^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/;

function pathInside(base, path, label) {
  const resolvedBase = resolve(base);
  const resolvedPath = resolve(base, path);
  const offset = relative(resolvedBase, resolvedPath);
  if (offset === ".." || offset.startsWith(`..${sep}`)) {
    throw new Error(`${label} escapes ${resolvedBase}: ${path}`);
  }
  return resolvedPath;
}

function pathsOverlap(first, second) {
  const firstOffset = relative(first, second);
  const secondOffset = relative(second, first);
  const isInside = (offset) =>
    offset === "" || (offset !== ".." && !offset.startsWith(`..${sep}`));
  return isInside(firstOffset) || isInside(secondOffset);
}

async function rejectSymlinks(path, label) {
  const stats = await lstat(path);
  if (stats.isSymbolicLink()) {
    throw new Error(`${label} contains a symbolic link: ${path}`);
  }
  if (!stats.isDirectory()) return;
  for (const entry of await readdir(path)) {
    await rejectSymlinks(join(path, entry), label);
  }
}

async function rejectSymlinkAncestors(base, path, label) {
  const offset = relative(resolve(base), resolve(path));
  let current = resolve(base);
  for (const part of ["", ...offset.split(sep)]) {
    current = part ? join(current, part) : current;
    let stats;
    try {
      stats = await lstat(current);
    } catch (error) {
      if (error.code === "ENOENT") return;
      throw error;
    }
    if (stats.isSymbolicLink()) {
      throw new Error(`${label} has a symbolic-link ancestor: ${current}`);
    }
  }
}

async function addInventory(inventory, path, target, label) {
  const stats = await lstat(path);
  if (stats.isSymbolicLink()) {
    throw new Error(`${label} contains a symbolic link: ${path}`);
  }
  if (stats.isDirectory()) {
    for (const entry of await readdir(path)) {
      await addInventory(
        inventory,
        join(path, entry),
        target ? join(target, entry) : entry,
        label,
      );
    }
    return;
  }
  if (!stats.isFile()) {
    throw new Error(`${label} contains an unsupported file type: ${path}`);
  }
  if (inventory.has(target)) {
    throw new Error(`${label} maps more than one file to ${target}`);
  }
  const content = await readFile(path);
  inventory.set(target, {
    hash: createHash("sha256").update(content).digest("hex"),
    executable: Boolean(stats.mode & 0o111),
  });
}

function compareInventories(expected, actual, name) {
  for (const [path, signature] of expected) {
    const installed = actual.get(path);
    if (!installed) {
      throw new Error(`${name} is missing ${path}`);
    }
    if (
      signature.hash !== installed.hash ||
      signature.executable !== installed.executable
    ) {
      throw new Error(`${name} differs from its source at ${path}`);
    }
  }
  for (const path of actual.keys()) {
    if (!expected.has(path)) {
      throw new Error(`${name} contains untracked payload ${path}`);
    }
  }
}

async function loadConfig() {
  const config = JSON.parse(await readFile(configPath, "utf8"));
  const names = new Set();

  for (const mirror of config.mirrors ?? []) {
    if (
      !namePattern.test(mirror.name ?? "") ||
      !repoPattern.test(mirror.repo ?? "") ||
      typeof mirror.branch !== "string" ||
      !mirror.branch ||
      !shaPattern.test(mirror.sha ?? "") ||
      !Number.isInteger(mirror.expectedSkills) ||
      mirror.expectedSkills < 1 ||
      (mirror.owned !== undefined && !Array.isArray(mirror.owned)) ||
      !mirror.copies?.length
    ) {
      throw new Error(`Invalid mirror configuration: ${mirror.name ?? "unknown"}`);
    }
    if (names.has(mirror.name)) {
      throw new Error(`Duplicate mirror name: ${mirror.name}`);
    }
    names.add(mirror.name);

    const pluginRoot = join(root, "plugins", mirror.name);
    const destinations = [];
    for (const mapping of mirror.copies) {
      if (
        typeof mapping.from !== "string" ||
        !mapping.from ||
        typeof mapping.to !== "string" ||
        !mapping.to ||
        mapping.to === "."
      ) {
        throw new Error(`Invalid copy mapping for ${mirror.name}`);
      }
      const destination = pathInside(
        pluginRoot,
        mapping.to,
        `${mirror.name} destination`,
      );
      if (destinations.some((existing) => pathsOverlap(existing, destination))) {
        throw new Error(`Overlapping copy destinations for ${mirror.name}`);
      }
      destinations.push(destination);
    }

    for (const owned of mirror.owned ?? []) {
      if (typeof owned !== "string" || !owned || owned === ".") {
        throw new Error(`Invalid owned path for ${mirror.name}`);
      }
      const path = pathInside(pluginRoot, owned, `${mirror.name} owned path`);
      if (destinations.some((destination) => pathsOverlap(destination, path))) {
        throw new Error(`Owned path overlaps mirrored files for ${mirror.name}`);
      }
      destinations.push(path);
    }

    if (
      mirror.versionFrom !== undefined &&
      (typeof mirror.versionFrom !== "string" ||
        !mirror.versionFrom ||
        !(mirror.owned ?? []).includes("plugin.json"))
    ) {
      throw new Error(`Invalid version source for ${mirror.name}`);
    }
  }

  return config;
}

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    encoding: "utf8",
    stdio: options.capture ? "pipe" : "inherit",
    ...options,
  });
  if (result.status !== 0) {
    throw new Error(
      `${command} ${args.join(" ")} failed${result.stderr ? `: ${result.stderr.trim()}` : ""}`,
    );
  }
  return result.stdout?.trim();
}

async function checkout(repo, sha) {
  const directory = await mkdtemp(join(tmpdir(), "agent-toolkit-mirror-"));
  run("git", ["init", "--quiet", directory]);
  run("git", ["-C", directory, "remote", "add", "origin", `https://github.com/${repo}.git`]);
  run("git", ["-C", directory, "fetch", "--quiet", "--depth", "1", "origin", sha]);
  run("git", ["-C", directory, "checkout", "--quiet", "--detach", "FETCH_HEAD"]);
  return directory;
}

async function latestSha(repo, branch) {
  const headers = {
    Accept: "application/vnd.github+json",
    "User-Agent": "agent-toolkit-mirror-updater",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }
  const response = await fetch(
    `https://api.github.com/repos/${repo}/commits/${encodeURIComponent(branch)}`,
    { headers },
  );
  if (!response.ok) {
    throw new Error(
      `Could not resolve ${repo}@${branch}: ${response.status} ${response.statusText}`,
    );
  }
  const sha = (await response.json()).sha;
  if (!shaPattern.test(sha ?? "")) {
    throw new Error(`Invalid commit returned for ${repo}@${branch}`);
  }
  return sha;
}

async function copyMirror(mirror, checkoutPath) {
  const copies = mirror.copies.map((mapping) => ({
    source: pathInside(checkoutPath, mapping.from, `${mirror.name} source`),
    destination: pathInside(
      join(root, "plugins", mirror.name),
      mapping.to,
      `${mirror.name} destination`,
    ),
  }));

  for (const { source } of copies) {
    await rejectSymlinkAncestors(checkoutPath, source, `${mirror.name} source`);
    await rejectSymlinks(source, `${mirror.name} source`);
  }

  for (const { source, destination } of copies) {
    await rejectSymlinkAncestors(root, destination, `${mirror.name} destination`);
    await rm(destination, { recursive: true, force: true });
    await mkdir(dirname(destination), { recursive: true });
    await cp(source, destination, { recursive: true, preserveTimestamps: true });
  }
}

async function sourceVersion(mirror, checkoutPath) {
  const sourcePath = pathInside(
    checkoutPath,
    mirror.versionFrom,
    `${mirror.name} version source`,
  );
  await rejectSymlinkAncestors(
    checkoutPath,
    sourcePath,
    `${mirror.name} version source`,
  );
  const sourceManifest = JSON.parse(await readFile(sourcePath, "utf8"));
  if (typeof sourceManifest.version !== "string" || !sourceManifest.version) {
    throw new Error(`${mirror.name} source manifest has no version`);
  }
  return sourceManifest.version;
}

async function syncOwnedMetadata(mirror, checkoutPath) {
  if (!mirror.versionFrom) return;
  const destinationPath = join(root, "plugins", mirror.name, "plugin.json");
  const destinationManifest = JSON.parse(
    await readFile(destinationPath, "utf8"),
  );
  destinationManifest.version = await sourceVersion(mirror, checkoutPath);
  await writeFile(
    destinationPath,
    `${JSON.stringify(destinationManifest, null, 2)}\n`,
  );
}

async function checkOwnedMetadata(mirror, checkoutPath) {
  if (!mirror.versionFrom) return;
  const destinationPath = join(root, "plugins", mirror.name, "plugin.json");
  const destinationManifest = JSON.parse(
    await readFile(destinationPath, "utf8"),
  );
  if (destinationManifest.version !== (await sourceVersion(mirror, checkoutPath))) {
    throw new Error(`${mirror.name} compatibility manifest version is stale`);
  }
}

async function compareMirror(mirror, checkoutPath) {
  const pluginRoot = join(root, "plugins", mirror.name);
  const expected = new Map();
  const actual = new Map();

  for (const mapping of mirror.copies) {
    const source = pathInside(checkoutPath, mapping.from, `${mirror.name} source`);
    await rejectSymlinkAncestors(checkoutPath, source, `${mirror.name} source`);
    await rejectSymlinks(source, `${mirror.name} source`);
    await addInventory(expected, source, mapping.to, `${mirror.name} source`);
  }
  for (const owned of mirror.owned ?? []) {
    const path = pathInside(pluginRoot, owned, `${mirror.name} owned path`);
    await rejectSymlinkAncestors(root, path, `${mirror.name} owned path`);
    await addInventory(expected, path, owned, `${mirror.name} owned path`);
  }
  await checkOwnedMetadata(mirror, checkoutPath);
  await rejectSymlinkAncestors(root, pluginRoot, `${mirror.name} destination`);
  await addInventory(actual, pluginRoot, "", `${mirror.name} destination`);
  compareInventories(expected, actual, mirror.name);
}

async function sync(config) {
  for (const mirror of config.mirrors) {
    const sha = await latestSha(mirror.repo, mirror.branch);
    const checkoutPath = await checkout(mirror.repo, sha);
    try {
      await copyMirror(mirror, checkoutPath);
      await syncOwnedMetadata(mirror, checkoutPath);
      if (mirror.sha !== sha) {
        console.log(`${mirror.name}: ${mirror.sha} -> ${sha}`);
        mirror.sha = sha;
      }
    } finally {
      await rm(checkoutPath, { recursive: true, force: true });
    }
  }
  await writeFile(configPath, `${JSON.stringify(config, null, 2)}\n`);
}

async function check(config) {
  for (const mirror of config.mirrors) {
    const checkoutPath = await checkout(mirror.repo, mirror.sha);
    try {
      await compareMirror(mirror, checkoutPath);
    } finally {
      await rm(checkoutPath, { recursive: true, force: true });
    }
  }
  console.log(`Mirrors valid: ${config.mirrors.length} plugins`);
}

const command = process.argv[2] ?? "check";
const config = await loadConfig();

if (command === "sync") {
  await sync(config);
} else if (command === "check") {
  await check(config);
} else {
  throw new Error(`Unknown command: ${command}`);
}
