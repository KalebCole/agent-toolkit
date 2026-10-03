import assert from "node:assert/strict";
import test from "node:test";

import { findUpdates, loadCanonicalCatalog, updatePin } from "../scripts/catalog.mjs";

const oldSha = "0123456789012345678901234567890123456789";
const newSha = "abcdefabcdefabcdefabcdefabcdefabcdefabcd";
const visualSha = "1111111111111111111111111111111111111111";
const pstackSha = "2222222222222222222222222222222222222222";
const catalog = {
  plugins: [
    {
      name: "kaleb-skills",
      source: { source: "local", path: "./plugins/kaleb-skills" },
    },
    {
      name: "humanizer",
      source: {
        source: "url",
        url: "https://github.com/blader/humanizer.git",
        ref: "main",
        sha: oldSha,
      },
    },
    {
      name: "visual-explainer",
      source: {
        source: "git-subdir",
        url: "https://github.com/nicobailon/visual-explainer.git",
        path: "plugins/visual-explainer",
        ref: "main",
        sha: visualSha,
      },
    },
    {
      name: "pstack",
      source: {
        source: "git-subdir",
        url: "https://github.com/michael-denyer/pstack-claude.git",
        path: "plugins/pstack",
        ref: "main",
        sha: pstackSha,
      },
    },
  ],
};

test("findUpdates emits one matrix entry for each changed external", async () => {
  const result = await findUpdates(catalog, async (source) => {
    if (source.url.includes("humanizer")) {
      return newSha;
    }
    if (source.url.includes("pstack-claude")) {
      return newSha;
    }
    return source.sha;
  });
  assert.deepEqual(result, {
    include: [{ name: "humanizer" }, { name: "pstack" }],
  });
});

test("updatePin changes only the named external", () => {
  const updated = updatePin(catalog, "pstack", newSha);
  assert.equal(updated.plugins[1].source.sha, oldSha);
  assert.equal(updated.plugins[2].source.sha, visualSha);
  assert.equal(updated.plugins[3].source.sha, newSha);
  assert.throws(
    () => updatePin(catalog, "kaleb-skills", newSha),
    /not external/,
  );
});

test("real update discovery excludes the frozen ADHD skill and local collection", async () => {
  const actualCatalog = await loadCanonicalCatalog();
  const requested = [];
  const result = await findUpdates(actualCatalog, async (source) => {
    requested.push(source.url);
    return newSha;
  });
  assert.deepEqual(result.include, [
    { name: "humanizer" },
    { name: "visual-explainer" },
    { name: "pstack" },
  ]);
  assert.ok(requested.every((url) => !url.includes("ayghri/i-have-adhd")));
  assert.throws(() => updatePin(actualCatalog, "i-have-adhd", newSha), /Unknown plugin/);
  assert.throws(() => updatePin(actualCatalog, "kaleb-skills", newSha), /not external/);
});
