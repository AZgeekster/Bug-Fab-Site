#!/usr/bin/env node
// Copies the pre-built bug-fab.js bundle + html2canvas vendor file from the
// sibling BUG-FAB/repo into ./public/bug-fab/static/ so the site is
// self-contained. Records the source git SHA into version.txt for the footer.
//
// Run via `npm run sync:bugfab` (also wired into predev / prebuild).
//
// If the parent repo is missing, exits 0 with a warning rather than failing
// the build — lets CI / fresh clones get further before stopping.

import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");
const parentRepoStatic = path.resolve(projectRoot, "../BUG-FAB/repo/static");
const parentRepoGitHead = path.resolve(projectRoot, "../BUG-FAB/repo/.git/HEAD");
const outDir = path.join(projectRoot, "public/bug-fab/static");
const outVendor = path.join(outDir, "vendor");
const versionFile = path.join(projectRoot, "public/bug-fab/version.txt");

const files = [
  { from: "bug-fab.js", to: path.join(outDir, "bug-fab.js") },
  { from: "vendor/html2canvas.min.js", to: path.join(outVendor, "html2canvas.min.js") },
];

async function exists(p) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

async function resolveSha() {
  if (!(await exists(parentRepoGitHead))) return "unknown";
  const head = (await fs.readFile(parentRepoGitHead, "utf8")).trim();
  if (head.startsWith("ref: ")) {
    const refPath = path.resolve(parentRepoGitHead, "..", head.slice(5));
    if (await exists(refPath)) {
      return (await fs.readFile(refPath, "utf8")).trim().slice(0, 12);
    }
    // Packed-refs fallback would go here; for now, return unknown.
    return "unknown";
  }
  return head.slice(0, 12);
}

async function main() {
  if (!(await exists(parentRepoStatic))) {
    console.warn(
      `[sync-bug-fab] parent repo not found at ${parentRepoStatic} — skipping. The FAB will 404 at runtime.`,
    );
    return;
  }

  await fs.mkdir(outVendor, { recursive: true });

  for (const { from, to } of files) {
    const src = path.join(parentRepoStatic, from);
    if (!(await exists(src))) {
      console.warn(`[sync-bug-fab] missing ${from} in parent repo — skipping that file`);
      continue;
    }
    await fs.copyFile(src, to);
    const size = (await fs.stat(to)).size;
    console.log(`[sync-bug-fab] copied ${from} (${(size / 1024).toFixed(1)} KB)`);
  }

  const sha = await resolveSha();
  await fs.writeFile(versionFile, `${sha}\n`, "utf8");
  console.log(`[sync-bug-fab] bug-fab source SHA: ${sha}`);
}

main().catch((err) => {
  console.error("[sync-bug-fab] failed:", err);
  process.exit(1);
});
