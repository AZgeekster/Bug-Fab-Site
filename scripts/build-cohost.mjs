#!/usr/bin/env node
// Build the Astro site and sync the output into the parent Bug-Fab repo's
// `marketing-dist/` directory, so the parent's Docker build can COPY it
// into the deploy image.
//
// Workflow:
//   1. npm run sync:bugfab     (refresh the FAB bundle from parent)
//   2. npx astro build          (produce dist/)
//   3. mirror dist/ → ../BUG-FAB/repo/marketing-dist/
//
// After this, `cd ../BUG-FAB/repo && flyctl deploy` ships the co-hosted
// site to bug-fab.fly.dev/. See docs/plans/2026-05-20_cohost-handoff.md
// for the parent-side plan that wires it in.

import { promises as fs } from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");
const distDir = path.join(projectRoot, "dist");
const parentMarketingDir = path.resolve(projectRoot, "../BUG-FAB/repo/marketing-dist");

function run(label, cmd, args) {
  console.log(`\n[build-cohost] ${label}: ${cmd} ${args.join(" ")}`);
  const result = spawnSync(cmd, args, {
    cwd: projectRoot,
    stdio: "inherit",
    shell: process.platform === "win32",
  });
  if (result.status !== 0) {
    console.error(`[build-cohost] ${label} failed with exit ${result.status}`);
    process.exit(result.status ?? 1);
  }
}

async function exists(p) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  run("astro build", "npx", ["astro", "build"]);

  if (!(await exists(distDir))) {
    console.error(`[build-cohost] expected ${distDir} after build — aborting`);
    process.exit(1);
  }

  const parentRepoRoot = path.resolve(projectRoot, "../BUG-FAB/repo");
  if (!(await exists(parentRepoRoot))) {
    console.error(
      `[build-cohost] parent repo not found at ${parentRepoRoot} — co-host sync skipped.`,
    );
    console.error(
      `[build-cohost] dist/ is built locally; copy it into the parent's marketing-dist/ manually if needed.`,
    );
    return;
  }

  // Wipe + copy. Node 22's fs.cp with recursive:true mirrors directories.
  console.log(`\n[build-cohost] syncing dist/ → ${parentMarketingDir}`);
  await fs.rm(parentMarketingDir, { recursive: true, force: true });
  await fs.cp(distDir, parentMarketingDir, { recursive: true });

  const filesShipped = await countFiles(parentMarketingDir);
  console.log(`[build-cohost] ${filesShipped} files copied`);
  console.log(`\n[build-cohost] next: cd ../BUG-FAB/repo && flyctl deploy`);
}

async function countFiles(dir) {
  let n = 0;
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) n += await countFiles(path.join(dir, entry.name));
    else n += 1;
  }
  return n;
}

main().catch((err) => {
  console.error("[build-cohost] failed:", err);
  process.exit(1);
});
