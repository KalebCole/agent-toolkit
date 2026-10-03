import assert from "node:assert/strict";
import test from "node:test";

import { findUpdates, updatePin } from "../scripts/catalog.mjs";

const oldSha = "0123456789012345678901234567890123456789";
const newSha = "abcdefabcdefabcdefabcdefabcdefabcdefabcd";
const visualSha = "1111111111111111111111111111111111111111";
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
  ],
};

test("findUpdates emits one matrix entry for each changed external", async () => {
  const result = await findUpdates(catalog, async (source) =>
    source.url.includes("humanizer") ? newSha : source.sha,
  );
  assert.deepEqual(result, { include: [{ name: "humanizer" }] });
});

test("updatePin changes only the named external", () => {
  const updated = updatePin(catalog, "humanizer", newSha);
  assert.equal(updated.plugins[1].source.sha, newSha);
  assert.equal(updated.plugins[2].source.sha, visualSha);
  assert.throws(
    () => updatePin(catalog, "kaleb-skills", newSha),
    /not external/,
  );
});
