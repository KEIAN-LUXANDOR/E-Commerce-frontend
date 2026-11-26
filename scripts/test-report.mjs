#!/usr/bin/env node
// Runs the unit tests with coverage and writes TEST_REPORT.md:
// what failed, where (file:line), why (expected vs received), and which code no test runs.
//
//   npm run test:report              -> coverage of the files the tests load
//   npm run test:report -- --all     -> coverage of every file in src/ (honest site-wide number)
//   npm run test:report -- --min=60  -> list files under 60% lines (default 80)
//   npm run test:report -- orders    -> only test files whose path contains "orders"

import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const outDir = path.join(root, ".test-report");
const resultsFile = path.join(outDir, "results.json");
const covDir = path.join(outDir, "coverage");
const reportFile = path.join(root, "TEST_REPORT.md");

const args = process.argv.slice(2);
const all = args.includes("--all");
const minArg = args.find((a) => a.startsWith("--min="));
const minLines = minArg ? Number(minArg.slice(6)) : 80;
const filters = args.filter((a) => !a.startsWith("--"));

rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });

const vitestArgs = [
  "vitest", "run", "--config", "vitest.config.mts", ...filters,
  "--reporter=default", "--reporter=json", `--outputFile.json=${resultsFile}`,
  "--coverage.enabled", "--coverage.provider=v8", "--coverage.reportOnFailure",
  "--coverage.reporter=json", "--coverage.reporter=json-summary", "--coverage.reporter=html",
  `--coverage.reportsDirectory=${covDir}`,
];
if (all) {
  vitestArgs.push(
    "--coverage.include=src/**/*.{ts,tsx}",
    "--coverage.exclude=src/**/*.{test,spec}.{ts,tsx}",
    "--coverage.exclude=src/**/__tests__/**",
    "--coverage.exclude=src/test/**",
    "--coverage.exclude=src/**/*.d.ts",
  );
}

console.log(`\n> npx ${vitestArgs.join(" ")}\n`);
const started = Date.now();
const run = spawnSync("npx", vitestArgs, { stdio: "inherit", shell: process.platform === "win32" });
const seconds = ((Date.now() - started) / 1000).toFixed(1);

// ---------- helpers ----------
const rel = (p) => path.relative(root, p).split(path.sep).join("/");
const stripAnsi = (s) => String(s ?? "").replace(/\u001b\[[0-9;]*m/g, "");
const cell = (s) => String(s ?? "").replace(/\|/g, "\\|").replace(/\r?\n/g, " ").trim();
const pct = (n) => (typeof n === "number" ? `${Math.round(n * 10) / 10}%` : "n/a");
const readJson = (f) => (existsSync(f) ? JSON.parse(readFileSync(f, "utf8")) : null);

// The first stack frame inside src/ = where the problem is (test file or app code)
function locate(message, fallbackFile) {
  const frames = [...stripAnsi(message).matchAll(/((?:[A-Za-z]:)?[^\s()]*?src[\\/][^\s():]+):(\d+):(\d+)/g)]
    .map((m) => ({ file: rel(path.resolve(m[1].replace(/^file:\/\//, ""))), line: Number(m[2]) }))
    .filter((f) => !f.file.includes("node_modules"));
  const appFrame = frames.find((f) => !/\.(test|spec)\.|__tests__/.test(f.file));
  const testFrame = frames.find((f) => /\.(test|spec)\.|__tests__/.test(f.file));
  return { at: testFrame ?? frames[0] ?? { file: fallbackFile, line: null }, appFrame };
}

function explain(message) {
  // Keep the error text and our own stack lines; drop Vitest/node internals
  const text = stripAnsi(message)
    .split("\n")
    .filter((l) => !/^\s*at .*(node_modules|node:internal|<anonymous>)/.test(l) && !/^\s*at new Promise/.test(l))
    .join("\n");
  const lines = text.split("\n").map((l) => l.trimEnd());
  const headline = (lines.find((l) => l.trim()) ?? "Unknown error").trim();
  const errorPart = lines.filter((l) => !/^\s*at /.test(l)).join("\n");   // message only, no stack

  // expect(a).toBe(b) -> "expected <a> to be <b>"; toEqual etc. print "- Expected / + Received"
  let expected = errorPart.match(/^\s*Expected:?\s+(.+)$/m)?.[1];
  let received = errorPart.match(/^\s*Received:?\s+(.+)$/m)?.[1];
  const inline = headline.match(/expected (.+?) to (?:be|equal|strictly equal|deeply equal|have length|contain|match|be close to) (.+?)(?: \/\/.*)?$/i);
  if (inline && !expected && !received) {
    received = inline[1];
    expected = inline[2];
  }

  let hint = "";
  if (/Unable to find (an|a)? ?.*(role|text|label)|Found multiple elements/i.test(errorPart)) hint = "The screen didn't show the expected element: check the text/role in the component or the test.";
  else if (/Failed to (resolve|load)|Cannot find module|Does the file exist/i.test(errorPart)) hint = "An import couldn't be found: a renamed/moved file or a wrong path alias.";
  else if (/Test timed out|timed out in \d+ms/i.test(errorPart)) hint = "The test waited too long: an awaited promise never resolved (missing mock or missing await).";
  else if (/is not a function|Cannot read propert|'undefined'|\bundefined\b/i.test(errorPart)) hint = "Something was undefined: a missing mock, a renamed export, or an API response shape that changed.";
  else if (/toHaveBeenCalled|called \d+ times|to have been called/i.test(errorPart)) hint = "A function wasn't called the way the test expected (arguments or number of calls).";
  else if (/fetch|\b40[0-9]\b|\b50[0-9]\b|Network/i.test(errorPart)) hint = "An API call didn't match: check the path, method or the mocked response.";
  else if (/AssertionError|expected/i.test(errorPart)) hint = "The code returned a different value than the test expects. Either the code changed on purpose (update the test) or it's a real bug.";
  return { headline, expected, received, hint, full: text.trim() };
}

function lineRanges(nums) {
  const sorted = [...new Set(nums)].sort((a, b) => a - b);
  const out = [];
  for (let i = 0; i < sorted.length; i++) {
    let j = i;
    while (j + 1 < sorted.length && sorted[j + 1] === sorted[j] + 1) j++;
    out.push(i === j ? `${sorted[i]}` : `${sorted[i]}–${sorted[j]}`);
    i = j;
  }
  return out;
}

// ---------- read results ----------
const results = readJson(resultsFile);
const summary = readJson(path.join(covDir, "coverage-summary.json"));
const final = readJson(path.join(covDir, "coverage-final.json"));

const md = [];
const now = new Date();
md.push("# Unit test report", "");
md.push(`- Generated: ${now.toISOString()}`);
md.push(`- Command: \`npm run test:report${args.length ? " -- " + args.join(" ") : ""}\` (${seconds}s)`);
md.push(`- Coverage counts: ${all ? "**every file in src/**" : "only files the tests load (add `--all` for every file)"}`);

if (!results) {
  md.push("", "## ❌ The tests could not run", "",
    "Vitest stopped before writing results. Scroll up in the terminal for the error. Usual causes: a syntax error in",
    "`vitest.config.mts` or `src/test/setup.ts`, or packages not installed (`npm ci`).");
  writeFileSync(reportFile, md.join("\n") + "\n");
  console.log(`\nWrote ${rel(reportFile)}`);
  process.exit(run.status || 1);
}

const failedFiles = results.testResults.filter((f) => f.status === "failed");
const failedTests = [];
const crashedFiles = [];
for (const file of results.testResults) {
  const fileName = rel(file.name);
  const failing = file.assertionResults.filter((t) => t.status === "failed");
  for (const t of failing) {
    const message = (t.failureMessages ?? []).join("\n");
    const loc = locate(message, fileName);
    const line = t.location?.line ?? loc.at.line;
    failedTests.push({ fileName, name: t.fullName || t.title, line, appFrame: loc.appFrame, at: loc.at, ...explain(message) });
  }
  // Whole file failed without any test failing = it crashed while loading (import/setup error)
  if (file.status === "failed" && failing.length === 0) {
    crashedFiles.push({ fileName, ...explain(file.message), at: locate(file.message, fileName).at });
  }
}

const passed = results.numPassedTests;
const failed = results.numFailedTests;
const skipped = (results.numPendingTests ?? 0) + (results.numTodoTests ?? 0);
const ok = failed === 0 && crashedFiles.length === 0 && results.success !== false;

md.push(`- Result: **${ok ? "PASS ✅" : "FAIL ❌"}**`, "");
md.push("## Summary", "");
md.push("| | |", "|---|---:|");
md.push(`| Test files | ${results.numTotalTestSuites ? results.testResults.length : 0} (${failedFiles.length} failing) |`);
md.push(`| Tests passed | ${passed} |`);
md.push(`| Tests failed | ${failed} |`);
md.push(`| Skipped / todo | ${skipped} |`);
md.push(`| Files that crashed before running | ${crashedFiles.length} |`);
if (summary?.total) {
  const t = summary.total;
  md.push(`| Coverage: lines | ${pct(t.lines.pct)} (${t.lines.covered}/${t.lines.total}) |`);
  md.push(`| Coverage: branches (if/else paths) | ${pct(t.branches.pct)} (${t.branches.covered}/${t.branches.total}) |`);
  md.push(`| Coverage: functions | ${pct(t.functions.pct)} (${t.functions.covered}/${t.functions.total}) |`);
}
md.push("");

// ---------- problems ----------
if (crashedFiles.length) {
  md.push("## ❌ Test files that crashed", "", "None of the tests in these files ran.", "");
  md.push("| File | Where | Problem |", "|---|---|---|");
  for (const c of crashedFiles) {
    md.push(`| \`${c.fileName}\` | ${c.at?.line ? `\`${c.at.file}:${c.at.line}\`` : "-"} | ${cell(c.headline)}${c.hint ? `<br>*${cell(c.hint)}*` : ""} |`);
  }
  md.push("");
  for (const c of crashedFiles) {
    md.push(`<details><summary>${c.fileName}: full error</summary>`, "", "```", c.full.slice(0, 4000), "```", "", "</details>", "");
  }
}

if (failedTests.length) {
  md.push("## ❌ Failing tests", "");
  md.push("| # | Test | Where | What is wrong |", "|---:|---|---|---|");
  failedTests.forEach((t, i) => {
    const where = `\`${t.fileName}${t.line ? ":" + t.line : ""}\`` + (t.appFrame ? `<br>app code: \`${t.appFrame.file}:${t.appFrame.line}\`` : "");
    md.push(`| ${i + 1} | ${cell(t.name)} | ${where} | ${cell(t.headline)}${t.hint ? `<br>*${cell(t.hint)}*` : ""} |`);
  });
  md.push("");
  failedTests.forEach((t, i) => {
    md.push(`### ${i + 1}. ${t.name}`, "");
    md.push(`- **Where:** \`${t.fileName}${t.line ? ":" + t.line : ""}\`${t.appFrame ? ` (error raised in \`${t.appFrame.file}:${t.appFrame.line}\`)` : ""}`);
    md.push(`- **Problem:** ${t.headline}`);
    if (t.expected || t.received) {
      md.push(`- **Expected:** \`${cell(t.expected ?? "-")}\``);
      md.push(`- **Received:** \`${cell(t.received ?? "-")}\``);
    }
    if (t.hint) md.push(`- **Likely cause:** ${t.hint}`);
    md.push("", "<details><summary>Full error</summary>", "", "```", t.full.slice(0, 4000), "```", "", "</details>", "");
  });
}

if (ok) md.push("## ✅ No failing tests", "");

// ---------- coverage gaps ----------
if (final) {
  const rows = Object.entries(final).map(([file, data]) => {
    const uncoveredLines = [];
    for (const [id, hits] of Object.entries(data.s)) {
      if (hits === 0) uncoveredLines.push(data.statementMap[id].start.line);
    }
    const untested = Object.entries(data.f)
      .filter(([, hits]) => hits === 0)
      .map(([id]) => data.fnMap[id]?.name)
      .filter((n) => n && !n.startsWith("(anonymous"));
    const s = summary?.[file] ?? summary?.[path.resolve(file)];
    return { file: rel(file), lines: s?.lines?.pct ?? 0, branches: s?.branches?.pct ?? 0, uncoveredLines, untested };
  });
  const weak = rows.filter((r) => r.lines < minLines).sort((a, b) => a.lines - b.lines || b.uncoveredLines.length - a.uncoveredLines.length);
  md.push(`## ⚠️ Code no test runs (files under ${minLines}% of lines)`, "");
  if (!weak.length) {
    md.push(`Every counted file has at least ${minLines}% of its lines run by a test.`, "");
  } else {
    md.push("Lines listed here never ran during the tests, so a bug there would not be caught.",
      "Open `.test-report/coverage/index.html` in a browser to see them highlighted in red.", "");
    md.push("| File | Lines | Branches | Untested functions | Lines never run |", "|---|---:|---:|---|---|");
    for (const r of weak) {
      const ranges = lineRanges(r.uncoveredLines);
      const shown = ranges.slice(0, 12).join(", ") + (ranges.length > 12 ? `, … (+${ranges.length - 12} more)` : "");
      const fns = r.untested.slice(0, 6).join(", ") + (r.untested.length > 6 ? ` +${r.untested.length - 6}` : "");
      md.push(`| \`${r.file}\` | ${pct(r.lines)} | ${pct(r.branches)} | ${cell(fns) || "-"} | ${shown || "-"} |`);
    }
    md.push("");
  }
}

md.push("## How to read and fix", "",
  "1. **Failing test:** open the file at the line shown. If *app code* is also shown, the bug is usually there, not in the test.",
  "2. **Crashed file:** fix the import or setup error first; one crash hides every test in that file.",
  "3. **Code no test runs:** not an error, but a risk. Start with files that handle money, orders or API calls.",
  "4. Re-run only one area while fixing: `npm run test:report -- orders`.", "");

writeFileSync(reportFile, md.join("\n") + "\n");
console.log(`\nWrote ${rel(reportFile)}  (coverage pages: ${rel(path.join(covDir, "index.html"))})`);
process.exit(ok ? 0 : 1);
