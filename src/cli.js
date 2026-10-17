#!/usr/bin/env node
// triage-scorecard: how good is your vulnerability triage, measured on real public data?
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { loadKev } from './data.js';
import { scorecard, BUILTIN } from './score.js';
import { markdown } from './report.js';

const HELP = `Usage: triage-scorecard [options]

  --days N          window length in days (default 30)
  --end YYYY-MM-DD  last day of the window (default: 2 days ago, UTC)
  --cves FILE       only score these CVEs (one per line), e.g. your scanner's findings
  --flags FILE      your tool's decisions: CSV "date,cve" per flagged CVE per day,
                    or one CVE per line to flag it every day
  --filter FILE     a JS module: export default { label, flag(row) } where row is
                    { cve, epss, pct, day, kev }
  --only a,b        built-in filters to run (${Object.keys(BUILTIN).join(', ')})
  --cache DIR       download cache (default .cache)
  --epss-dir DIR    read epss_scores-YYYY-MM-DD.csv.gz from here first
  --kev FILE        use a local KEV JSON instead of downloading
  --json FILE       also write the full result as JSON
`;

function args(argv) {
  const o = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '-h' || a === '--help') o.help = true;
    else if (a.startsWith('--')) o[a.slice(2)] = argv[++i];
  }
  return o;
}

function readFlags(file) {
  const byDay = new Map(), always = new Set();
  for (const line of readFileSync(file, 'utf8').split(/\r?\n/)) {
    const t = line.trim();
    if (!t || t.startsWith('#') || /^date,/i.test(t)) continue;
    const [a, b] = t.split(',').map((s) => s.trim());
    if (b) { if (!byDay.has(a)) byDay.set(a, new Set()); byDay.get(a).add(b.toUpperCase()); } else always.add(a.toUpperCase());
  }
  return { label: 'Your tool (--flags)', flag: (r) => always.has(r.cve) || !!byDay.get(r.day)?.has(r.cve) };
}

const o = args(process.argv.slice(2));
if (o.help) { process.stdout.write(HELP); process.exit(0); }

const days = +(o.days || 30);
const endDate = o.end || new Date(Date.now() - 2 * 864e5).toISOString().slice(0, 10);
const startD = new Date(endDate + 'T00:00:00Z'); startD.setUTCDate(startD.getUTCDate() - days + 1);
const start = startD.toISOString().slice(0, 10);
const opts = { cache: o.cache || '.cache', epssDir: o['epss-dir'], onDay: (d) => process.stderr.write(`\rscoring ${d}`) };

const pick = o.only ? o.only.split(',') : Object.keys(BUILTIN);
// "Show everything" always runs first: noise cut is measured against it.
const filters = { all: BUILTIN.all };
for (const k of pick) { if (!BUILTIN[k]) throw new Error(`unknown filter ${k}`); filters[k] = BUILTIN[k]; }
if (o.flags) filters.yours = readFlags(o.flags);
if (o.filter) filters.custom = (await import(pathToFileURL(resolve(o.filter)).href)).default;
const cohort = o.cves ? new Set(readFileSync(o.cves, 'utf8').split(/\s+/).filter((s) => s.startsWith('CVE-'))) : null;

const kev = await loadKev({ cache: opts.cache, kevFile: o.kev });
const result = await scorecard({ start, end: endDate, kev, filters, cohort, opts });
process.stderr.write('\n');
process.stdout.write(markdown(result, { cohort: cohort ? `${cohort.size} CVEs from ${o.cves}` : 'every CVE with an EPSS score' }));
if (o.json) writeFileSync(o.json, JSON.stringify(result, null, 2));
