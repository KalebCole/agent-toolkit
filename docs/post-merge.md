# Post-Merge Operations

The implementation branch does not rename the repository or close issues.
After merge, a maintainer must:

1. Rename `KalebCole/agent-toolkit` to `KalebCole/kaleb-marketplace`.
2. Update the repository description and topics.
3. Replace current-repository URLs in `README.md`,
   `plugins/kaleb-skills/plugin.json`, and other documentation.
4. Test fresh Copilot and Claude marketplace registration through the renamed
   repository.
5. Check external links that do not follow GitHub redirects.
6. Close the scope issues with links to the merged change.

## Issue cleanup

- #44: completed by the frozen `bro` skill in `kaleb-skills`.
- #45: completed by the pinned maintained i-have-adhd reference.
- #46: resolved by explicit non-inclusion; the requested design skill is
  outside the approved scope.
- #47: completed by documenting Impeccable's supported native installer.
- #48: completed by the pinned maintained Visual Explainer reference.
