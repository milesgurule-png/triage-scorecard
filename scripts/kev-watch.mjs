// KEV Watch: for every CVE CISA added to KEV in the last 14 days, what did EPSS say the day before?
// Writes KEV-WATCH.md and refreshes the README section between the kev-watch markers.
// Real data only, no future data: the score shown is from the last EPSS file published before dateAdded.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { KEV_URL, epssFile, readEpss } from '../src/data.js';

const WINDOW = 14, FLAG = 0.1, cache = process.env.CACHE || '.cache';
const day = (d, n = 0) => { const x = new Date(d + 'T00:00:00Z'); x.setUTCDate(x.getUTCDate() + n); return x.toISOString().slice(0, 10); };
const today = new Date().toISOString().slice(0, 10), since = day(today, -WINDOW);

mkdirSync(cache, { recursive: true });
const res = await fetch(KEV_URL);
if (!res.ok) throw new Error(`KEV ${res.status}`);
const kev = await res.json();
const recent = kev.vulnerabilities.filter((v) => v.dateAdded > since).sort((a, b) => b.dateAdded.localeCompare(a.dateAdded) || a.cveID.localeCompare(b.cveID));

// One EPSS file per distinct "day before"; fall back up to 3 days if a file is missing.
const scores = new Map(); // `${addedDay}|${cve}` -> { epss, pct, scoredOn }
for (const added of [...new Set(recent.map((v) => v.dateAdded))]) {
  const want = new Set(recent.filter((v) => v.dateAdded === added).map((v) => v.cveID));
  for (let back = 1; back <= 3; back++) {
    const d = day(added, -back);
    let file;
    try { file = await epssFile(d, { cache }); } catch { continue; }
    await readEpss(file, (cve, epss, pct) => { if (want.has(cve)) scores.set(`${added}|${cve}`, { epss, pct, scoredOn: d }); });
    break;
  }
}

const rows = recent.map((v) => ({ ...v, s: scores.get(`${v.dateAdded}|${v.cveID}`) }));
const scored = rows.filter((r) => r.s), missed = scored.filter((r) => r.s.epss < FLAG);
const pct = (x) => `${(100 * x).toFixed(1)}%`;
const esc = (t) => String(t).replace(/\|/g, '\\|');
const headline = scored.length
  ? `**${missed.length} of ${scored.length}** vulnerabilities CISA confirmed as exploited in the last ${WINDOW} days had an EPSS score under ${FLAG} the day before, so an "EPSS ≥ ${FLAG}" filter would not have flagged them.`
  : `No new KEV entries with EPSS scores in the last ${WINDOW} days.`;
const table = ['| Added to KEV | CVE | Vendor / product | EPSS day before | Percentile | EPSS ≥ ' + FLAG + '? |', '|---|---|---|---:|---:|:---:|',
  ...rows.map((r) => `| ${r.dateAdded} | [${r.cveID}](https://nvd.nist.gov/vuln/detail/${r.cveID}) | ${esc(r.vendorProject)} ${esc(r.product)} | ${r.s ? r.s.epss.toFixed(3) : 'not scored'} | ${r.s ? pct(r.s.pct) : '–'} | ${r.s ? (r.s.epss >= FLAG ? '✅ flagged' : '❌ missed') : '–'} |`)];

const note = '"Not scored" means EPSS had no score for that CVE yet, which is common for brand-new CVEs and is its own blind spot.';
const updated = `Updated ${today} from the [CISA KEV catalog](https://www.cisa.gov/known-exploited-vulnerabilities-catalog) and [FIRST EPSS](https://www.first.org/epss/).`;
writeFileSync('KEV-WATCH.md', [`# KEV Watch`, '', 'Every day, this repo checks what EPSS said about each newly confirmed exploited vulnerability **the day before** CISA added it to KEV.', '', headline, '', ...table, '', note, '', updated, ''].join('\n'));

const top = rows.slice(0, 8);
const section = ['<!-- kev-watch:start -->', `## 🔴 KEV Watch (updates daily)`, '', headline, '',
  ...table.slice(0, 2), ...table.slice(2, 2 + top.length), '', note, '', `${updated} [Full list →](KEV-WATCH.md)`, '<!-- kev-watch:end -->'].join('\n');
const readme = readFileSync('README.md', 'utf8');
writeFileSync('README.md', readme.replace(/<!-- kev-watch:start -->[\s\S]*<!-- kev-watch:end -->/, section));
console.log(`${rows.length} new KEV entries, ${scored.length} scored, ${missed.length} missed by EPSS >= ${FLAG}`);
