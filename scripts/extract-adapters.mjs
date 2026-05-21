#!/usr/bin/env node
// Parses the parent Bug-Fab project's ADAPTERS_REGISTRY.md and emits a
// flat JSON array of adapter entries at `src/data/adapters.json`. The
// website's FrameworkSupport.astro reads this file so the marketing
// table never drifts from the canonical registry.
//
// Run via `npm run extract:adapters`, also wired into predev / prebuild
// so a stale parent registry never escapes a build.
//
// Output schema (one object per adapter entry, out-of-scope filtered):
//   { name, language, status, note, tier }
// Status is one of: "reference" | "community" | "sketch" | "wanted".
//
// When the parent repo isn't reachable (fresh clone, CI without the
// sibling, etc.) the script logs a warning and leaves the existing
// adapters.json untouched so the build still succeeds.

import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");
const registryPath = path.resolve(projectRoot, "../BUG-FAB/repo/docs/ADAPTERS_REGISTRY.md");
const outPath = path.join(projectRoot, "src/data/adapters.json");

const STATUS_EMOJI = {
  "🟢": "reference",
  "🔵": "community",
  "🟡": "sketch",
  "⚪": "wanted",
  "⚫": "out-of-scope",
};

const STATUS_ORDER = { reference: 0, community: 1, sketch: 2, wanted: 3 };

function parseRegistry(md) {
  const lines = md.split(/\r?\n/);
  const entries = [];
  let current = null;
  let currentTier = null;

  for (const raw of lines) {
    const line = raw.trimEnd();

    // Tier sections drive priority sort.
    const tierMatch = line.match(/^## Tier\s+(\d+)/i);
    if (tierMatch) {
      if (current) {
        entries.push(current);
        current = null;
      }
      currentTier = Number.parseInt(tierMatch[1], 10);
      continue;
    }

    // A new ## section that isn't a tier ends adapter parsing.
    if (line.startsWith("## ") && !tierMatch) {
      if (current) {
        entries.push(current);
        current = null;
      }
      currentTier = null;
      continue;
    }

    // H3 starts a new adapter entry (only inside a Tier section).
    const h3 = line.match(/^### (.+)$/);
    if (h3 && currentTier !== null) {
      if (current) entries.push(current);
      const heading = h3[1].trim();
      // "Name (Language)" or "Name (Language / Other)" or just "Name"
      const m = heading.match(/^(.+?)(?:\s*\(([^)]+)\))?\s*$/);
      current = {
        name: m[1].trim(),
        lang_hint: m[2]?.trim() ?? "",
        tier: currentTier,
      };
      continue;
    }

    // Field rows inside the entry's table.
    if (current) {
      const cells = line.match(/^\|\s*([^|]+?)\s*\|\s*(.+?)\s*\|\s*$/);
      if (cells) {
        const field = cells[1].trim().toLowerCase();
        // Skip the table header separator (|---|---|) and the schema row.
        if (field === "field" || /^-+$/.test(field)) continue;
        // Don't let the "| Tier | 1 |" row clobber the integer tier set
        // from the ## Tier section heading.
        if (field === "tier") continue;
        current[field] = cells[2].trim();
      }
    }
  }
  if (current) entries.push(current);

  return entries
    .map(normalize)
    .filter((r) => r && r.status !== "out-of-scope")
    .sort((a, b) => {
      const so = STATUS_ORDER[a.status] - STATUS_ORDER[b.status];
      if (so !== 0) return so;
      if (a.tier !== b.tier) return a.tier - b.tier;
      return a.name.localeCompare(b.name);
    });
}

function normalize(e) {
  const statusRaw = e.status || "";
  let status = null;
  for (const [emoji, word] of Object.entries(STATUS_EMOJI)) {
    if (statusRaw.includes(emoji)) {
      status = word;
      break;
    }
  }
  if (!status) return null;

  // Strip Markdown trailing "(first-party shim)" annotations from the
  // status raw string when deriving the note.
  const language = pickLanguage(e);
  const name = e.name.replace(/\s*\([^)]+\)\s*$/, "").trim();
  const note = deriveNote(status, e);
  const url = deriveUrl(name, e);

  return { name, language, status, note, url, tier: e.tier };
}

const REPO_BASE = "https://github.com/AZgeekster/Bug-Fab";

function deriveUrl(name, e) {
  // Priority 1: extract an in-repo path from the Repository field. The
  // path validator below rejects private workspaces, external URLs, and
  // adapter notes/sketches that don't live on github.com/AZgeekster/Bug-Fab,
  // so the upfront "is this private?" check isn't needed and used to false-
  // match on em-dashes that are just punctuation inside the field.
  const repoPath = extractRepoPath(e.repository || "");
  if (repoPath) return `${REPO_BASE}/tree/main/${repoPath}`;

  // Priority 2: first inline markdown link in the Reference doc field
  // (sketches, community adapters with external homes). Paths in the
  // registry are written relative to the registry's own location at
  // `docs/ADAPTERS_REGISTRY.md`, so `./X.md` means `docs/X.md` on github.
  const refDoc = e["reference doc"] || "";
  const mdLink = refDoc.match(/\(([^)]+)\)/);
  if (mdLink) {
    let target = mdLink[1].trim();
    if (target.startsWith("http")) return target;
    if (target.startsWith("./")) {
      // Resolve relative to docs/ (where the registry lives).
      target = "docs/" + target.slice(2);
    }
    return `${REPO_BASE}/blob/main/${target}`;
  }

  // Priority 3: fall back to the registry's own anchor — guaranteed to
  // resolve even for entries with no Repository and no Reference doc.
  return `${REPO_BASE}/blob/main/docs/ADAPTERS_REGISTRY.md#${slugifyHeading(name)}`;
}

// Extract the first backtick-quoted in-repo path from a Repository field.
// Strips the parent's outer-dir "repo/" prefix (the GitHub repo IS the
// contents of that outer-dir, so the leading "repo/" is not on github).
// Returns null when the captured path doesn't point at a public part of
// the repo (private notes/, external URLs, etc.).
function extractRepoPath(repo) {
  // Scan ALL backtick-quoted segments — some Repository fields list
  // multiple (e.g., "bug_fab/adapters/flask/ + examples/flask-minimal/"),
  // others lead with a private path before naming a public companion.
  const matches = [...repo.matchAll(/`([^`]+)`/g)];
  for (const m of matches) {
    let path = m[1].trim();
    path = path.replace(/^\.?\/+/, "").replace(/^repo\//, "").replace(/\/$/, "");
    if (path.startsWith("http")) continue;
    if (/^(bug_fab|adapters|examples|docs|static|tests)\b/.test(path)) {
      return path;
    }
  }
  return null;
}

function slugifyHeading(name) {
  // Mirror GitHub's heading-anchor slug rules well enough for adapter
  // headings ("### Foo (Bar)" → "foo-bar"). Not bit-perfect; good enough
  // as a last-resort fallback.
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function pickLanguage(e) {
  // Prefer the explicit Language field, then guess from the heading's
  // parenthetical hint, then from the Stack field.
  const explicit = (e.language || "").trim();
  if (explicit) return canonicalLang(explicit);

  const hint = (e.lang_hint || "").trim();
  if (hint) return canonicalLang(hint);

  return canonicalLang(e.stack || "");
}

function canonicalLang(raw) {
  const s = raw.toLowerCase();
  // Order matters — check more specific before more general.
  if (s.includes("c#") || s.includes(".net")) return "C#";
  if (s.includes("typescript")) return "TypeScript";
  if (s.includes("python")) return "Python";
  if (s.includes("ruby")) return "Ruby";
  if (s.includes("php")) return "PHP";
  if (s.includes("elixir")) return "Elixir";
  if (/\bgo\b/.test(s)) return "Go";
  if (s.includes("node")) return "TypeScript";
  return raw.split(/[\s/,]/)[0].trim();
}

function deriveNote(status, e) {
  switch (status) {
    case "reference": {
      // Pull the package name out of the Package field's first backtick span.
      const pkg = (e.package || "").match(/`([^`]+)`/)?.[1];
      if (pkg) return `first-party — ${pkg}`;
      // Fall back to "this repo" form for in-repo unpublished adapters.
      if ((e.repository || "").toLowerCase().includes("this repo")) {
        return "first-party — in-repo source";
      }
      return "first-party adapter";
    }
    case "community": {
      const maintainer = (e.maintainer || "").replace(/\s*\([^)]*\)\s*$/, "").trim();
      return maintainer ? `${maintainer} — spec-conformant` : "community-maintained";
    }
    case "sketch":
      return "walkthrough in ADAPTERS.md";
    case "wanted":
      return "PR welcome";
    default:
      return "";
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
  if (!(await exists(registryPath))) {
    console.warn(
      `[extract-adapters] registry not found at ${registryPath} — leaving existing adapters.json in place`,
    );
    return;
  }

  const md = await fs.readFile(registryPath, "utf8");
  const rows = parseRegistry(md);

  await fs.mkdir(path.dirname(outPath), { recursive: true });
  await fs.writeFile(outPath, JSON.stringify(rows, null, 2) + "\n", "utf8");

  const counts = rows.reduce((acc, r) => {
    acc[r.status] = (acc[r.status] ?? 0) + 1;
    return acc;
  }, {});
  console.log(
    `[extract-adapters] wrote ${rows.length} entries to ${path.relative(projectRoot, outPath)}: ${
      Object.entries(counts)
        .map(([k, v]) => `${v} ${k}`)
        .join(", ")
    }`,
  );
}

main().catch((err) => {
  console.error("[extract-adapters] failed:", err);
  process.exit(1);
});
