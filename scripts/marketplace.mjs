#!/usr/bin/env node

import { access, readFile } from "node:fs/promises";
import { dirname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const pluginsRoot = join(root, "plugins");
const marketplace = JSON.parse(
  await readFile(join(root, ".github/plugin/marketplace.json"), "utf8"),
);
const mirrors = JSON.parse(
  await readFile(join(root, ".github/plugin/mirrors.json"), "utf8"),
);
const manifestLocations = [
  "plugin.json",
  ".plugin/plugin.json",
  ".github/plugin/plugin.json",
  ".claude-plugin/plugin.json",
];
const names = new Set();
const mirrorNames = new Set(mirrors.mirrors.map((mirror) => mirror.name));

function localPluginPath(source) {
  const path = resolve(root, source);
  const offset = relative(resolve(pluginsRoot), path);
  if (!offset || offset === ".." || offset.startsWith(`..${sep}`)) {
    throw new Error(`Plugin source must be a folder under plugins/: ${source}`);
  }
  return path;
}

async function findManifest(pluginRoot) {
  for (const location of manifestLocations) {
    const path = join(pluginRoot, location);
    try {
      await access(path);
      return path;
    } catch {
      // Continue through Copilot's manifest search order.
    }
  }
  throw new Error(`No plugin manifest found in ${pluginRoot}`);
}

for (const plugin of marketplace.plugins) {
  if (names.has(plugin.name)) {
    throw new Error(`Duplicate marketplace plugin: ${plugin.name}`);
  }
  names.add(plugin.name);
  if (typeof plugin.source !== "string") {
    throw new Error(`${plugin.name} must install from a local mirrored folder`);
  }
  if (!mirrorNames.has(plugin.name)) {
    throw new Error(`${plugin.name} has no mirror configuration`);
  }
  const pluginRoot = localPluginPath(plugin.source);
  if (pluginRoot !== resolve(pluginsRoot, plugin.name)) {
    throw new Error(`${plugin.name} must use source plugins/${plugin.name}`);
  }
  const manifest = JSON.parse(await readFile(await findManifest(pluginRoot), "utf8"));
  if (manifest.name !== plugin.name) {
    throw new Error(
      `${plugin.name} does not match manifest name ${manifest.name}`,
    );
  }
}

for (const mirrorName of mirrorNames) {
  if (!names.has(mirrorName)) {
    throw new Error(`${mirrorName} is mirrored but absent from the marketplace`);
  }
}

if (process.argv[2] === "plugin-names") {
  for (const plugin of marketplace.plugins) {
    const mirror = mirrors.mirrors.find(({ name }) => name === plugin.name);
    console.log(`${plugin.name}\t${mirror.expectedSkills}`);
  }
} else {
  console.log(`Marketplace valid: ${marketplace.plugins.length} plugins`);
}
