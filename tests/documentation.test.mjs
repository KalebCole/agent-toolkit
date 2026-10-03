import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

async function read(paths) {
  return (
    await Promise.all(paths.map((file) => readFile(path.join(root, file), "utf8")))
  ).join("\n");
}

test("public documentation explains all three distribution paths", async () => {
  const allDocs = await read([
    "README.md",
    "CONTEXT.md",
    "docs/usage.md",
    "docs/contributing.md",
    "docs/maintenance.md",
    "docs/post-merge.md",
  ]);
  for (const phrase of [
    "local stored plugin",
    "maintained external plugin reference",
    "native external installer",
    "npx impeccable install",
    "npx impeccable update",
  ]) {
    assert.match(allDocs, new RegExp(phrase, "i"));
  }
});

test("browse documentation excludes removed catalog items", async () => {
  const browseDocs = await read(["README.md", "CONTEXT.md", "docs/usage.md"]);
  for (const removed of [
    "cli-printing-press",
    "mattpocock-skills",
    "grill-design",
    "oil-motion",
  ]) {
    assert.doesNotMatch(browseDocs, new RegExp(removed, "i"));
  }
});
