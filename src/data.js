// Real public data: CISA KEV (known exploited) and FIRST EPSS daily scores.
// Files are cached on disk so a rerun never downloads the same day twice.
import { createReadStream, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { createGunzip } from 'node:zlib';
import { createInterface } from 'node:readline';

export const KEV_URL = 'https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json';
export const EPSS_HOSTS = ['https://epss.empiricalsecurity.com', 'https://epss.cyentia.com'];

async function download(url, file) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  writeFileSync(file, Buffer.from(await res.arrayBuffer()));
}

export async function loadKev({ cache, kevFile }) {
  const file = kevFile || join(cache, 'kev.json');
  if (!existsSync(file)) { mkdirSync(cache, { recursive: true }); await download(KEV_URL, file); }
  const kev = new Map(); // CVE -> dateAdded (YYYY-MM-DD)
  for (const v of JSON.parse(readFileSync(file, 'utf8')).vulnerabilities) kev.set(v.cveID, v.dateAdded);
  return kev;
}

export async function epssFile(day, { cache, epssDir }) {
  const name = `epss_scores-${day}.csv.gz`;
  if (epssDir && existsSync(join(epssDir, name))) return join(epssDir, name);
  const file = join(cache, name);
  if (existsSync(file)) return file;
  mkdirSync(cache, { recursive: true });
  let last;
  for (const host of EPSS_HOSTS) {
    try { await download(`${host}/${name}`, file); return file; } catch (e) { last = e; }
  }
  throw new Error(`EPSS for ${day} unavailable: ${last.message}`);
}

// Calls onRow(cve, epss, percentile) for every scored CVE in one day's file.
export async function readEpss(file, onRow) {
  const lines = createInterface({ input: createReadStream(file).pipe(createGunzip()), crlfDelay: Infinity });
  for await (const line of lines) {
    if (!line.startsWith('CVE-')) continue; // skips the model comment and the header
    const [cve, epss, pct] = line.split(',');
    onRow(cve, +epss, +pct);
  }
}

export function days(start, end) {
  const out = [];
  for (let d = new Date(start + 'T00:00:00Z'); d <= new Date(end + 'T00:00:00Z'); d.setUTCDate(d.getUTCDate() + 1)) out.push(d.toISOString().slice(0, 10));
  return out;
}
