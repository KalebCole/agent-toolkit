#!/usr/bin/env node

import { readFile, readdir, writeFile } from "node:fs/promises";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const marketplacePath = join(root, ".github/plugin/marketplace.json");
const catalogRoots = ["plugins", "frontend"];
const shaPattern = /^[0-9a-f]{40}$/;

async function findEntryFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await findEntryFiles(path)));
    } else if (entry.name === "entry.json") {
      files.push(path);
    }
  }

  return files;
}

async function loadEntries() {
  const files = (
    await Promise.all(
      catalogRoots.map((directory) => findEntryFiles(join(root, directory))),
    )
  ).flat();

  const entries = await Promise.all(
    files.map(async (path) => ({
      path,
      value: JSON.parse(await readFile(path, "utf8")),
    })),
  );

  const names = new Set();
  for (const { path, value } of entries) {
    const label = relative(root, path);
    if (!value.name || !["plugin", "reference"].includes(value.kind)) {
      throw new Error(`${label} must define a name and valid kind`);
    }
    if (names.has(value.name)) {
      throw new Error(`Duplicate catalog name: ${value.name}`);
    }
    names.add(value.name);

    const { repo, branch, sha } = value.source ?? {};
    if (!repo || !branch || !shaPattern.test(sha ?? "")) {
      throw new Error(`${label} must define repo, branch, and a full commit SHA`);
    }
  }

  return entries.sort(
    (left, right) =>
      left.value.order - right.value.order ||
      left.value.name.localeCompare(right.value.name),
  );
}

function toMarketplaceEntry(entry) {
  const source = {
    source: "github",
    repo: entry.source.repo,
    sha: entry.source.sha,
  };
  if (entry.source.path) source.path = entry.source.path;

  return {
    name: entry.name,
    description: entry.description,
    source,
    author: entry.author,
    repository: `https://github.com/${entry.source.repo}`,
    category: entry.category,
  };
}

async function expectedMarketplace(entries) {
  const marketplace = JSON.parse(await readFile(marketplacePath, "utf8"));
  marketplace.plugins = entries
    .map(({ value }) => value)
    .filter(({ kind }) => kind === "plugin")
    .map(toMarketplaceEntry);
  return `${JSON.stringify(marketplace, null, 2)}\n`;
}

async function syncMarketplace(entries, checkOnly) {
  const expected = await expectedMarketplace(entries);
  if (checkOnly) {
    const current = await readFile(marketplacePath, "utf8");
    if (current !== expected) {
      throw new Error(
        "marketplace.json is out of sync; run `node scripts/catalog.mjs sync`",
      );
    }
    return;
  }
  await writeFile(marketplacePath, expected);
}

async function fetchCommit(repo, branch) {
  const headers = {
    Accept: "application/vnd.github+json",
    "User-Agent": "agent-toolkit-pin-updater",
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
  return (await response.json()).sha;
}

async function verifySource(entry, ref = entry.source.sha) {
  const headers = {
    Accept: "application/vnd.github+json",
    "User-Agent": "agent-toolkit-pin-updater",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  const target = entry.source.path
    ? `contents/${entry.source.path}?ref=${encodeURIComponent(ref)}`
    : `commits/${encodeURIComponent(ref)}`;
  const response = await fetch(
    `https://api.github.com/repos/${entry.source.repo}/${target}`,
    { headers },
  );
  if (!response.ok) {
    throw new Error(
      `Could not resolve ${entry.name} at ${ref}: ${response.status} ${response.statusText}`,
    );
  }
}

async function updatePins(entries) {
  for (const entry of entries) {
    const latest = await fetchCommit(
      entry.value.source.repo,
      entry.value.source.branch,
    );
    await verifySource(entry.value, latest);
    if (latest === entry.value.source.sha) continue;

    entry.value.source.sha = latest;
    await writeFile(entry.path, `${JSON.stringify(entry.value, null, 2)}\n`);
    console.log(`${entry.value.name}: ${latest}`);
  }
}

const command = process.argv[2] ?? "check";
const entries = await loadEntries();

switch (command) {
  case "check":
    await syncMarketplace(entries, true);
    console.log(`Catalog valid: ${entries.length} entries`);
    break;
  case "sync":
    await syncMarketplace(entries, false);
    break;
  case "update":
    await updatePins(entries);
    await syncMarketplace(entries, false);
    break;
  case "verify-sources":
    await Promise.all(entries.map(({ value }) => verifySource(value)));
    console.log(`Source pins valid: ${entries.length} entries`);
    break;
  case "plugin-names":
    for (const { value } of entries) {
      if (value.kind === "plugin") console.log(value.name);
    }
    break;
  case "plugin-sources":
    for (const { value } of entries) {
      if (value.kind !== "plugin") continue;
      console.log(
        [
          value.name,
          value.source.repo,
          value.source.sha,
          value.source.path ?? "",
        ].join("\t"),
      );
    }
    break;
  default:
    throw new Error(`Unknown command: ${command}`);
}
