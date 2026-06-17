#!/usr/bin/env node
// Maintain CHANGELOG.md from git commit history.

import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";

const CHANGELOG_PATH = "CHANGELOG.md";
const DATE_HEADING_RE = /^## (\d{4}-\d{2}-\d{2})\s*$/;

function gitLog(sinceDate) {
  const args = ["log", "--format=%ad|%s", "--date=short"];
  if (sinceDate) args.push(`--after=${sinceDate}`);
  const output = execFileSync("git", args, { encoding: "utf8" });

  const byDate = new Map();
  for (const line of output.split("\n")) {
    if (!line.includes("|")) continue;
    const [date, subject] = line.split("|", 2).map((s) => s.trim());
    if (!byDate.has(date)) byDate.set(date, []);
    byDate.get(date).push(subject);
  }
  return byDate;
}

function lastDateInChangelog(text) {
  for (const line of text.split("\n")) {
    const match = line.match(DATE_HEADING_RE);
    if (match) return match[1];
  }
  return null;
}

function renderSections(byDate) {
  const dates = [...byDate.keys()].sort().reverse();
  let out = "";
  for (const date of dates) {
    out += `\n## ${date}\n\n`;
    for (const subject of byDate.get(date)) {
      out += `- ${subject}\n`;
    }
  }
  return out;
}

function totalEntries(byDate) {
  let total = 0;
  for (const subjects of byDate.values()) total += subjects.length;
  return total;
}

function main() {
  if (!existsSync(CHANGELOG_PATH)) {
    const byDate = gitLog();
    if (byDate.size === 0) {
      console.log("No commits found — nothing to write.");
      return;
    }
    const content = "# Changelog\n" + renderSections(byDate);
    writeFileSync(CHANGELOG_PATH, content);
    console.log(
      `Created CHANGELOG.md with ${totalEntries(byDate)} entries across ${byDate.size} date(s).`
    );
    return;
  }

  const existing = readFileSync(CHANGELOG_PATH, "utf8");
  const last = lastDateInChangelog(existing);
  const byDate = gitLog(last ?? undefined);
  if (last) byDate.delete(last); // --after is date-inclusive; drop it to avoid duplicates

  if (byDate.size === 0) {
    console.log("No new commits since last entry — CHANGELOG.md is up to date.");
    return;
  }

  const lines = existing.split("\n");
  const insertAt = lines[0]?.startsWith("# ") ? 1 : 0;
  const before = lines.slice(0, insertAt).join("\n");
  const after = lines.slice(insertAt).join("\n");
  const updated =
    (before ? before + "\n" : "") + renderSections(byDate) + after;

  writeFileSync(CHANGELOG_PATH, updated);
  console.log(`Added ${totalEntries(byDate)} new entries to CHANGELOG.md.`);
}

main();
