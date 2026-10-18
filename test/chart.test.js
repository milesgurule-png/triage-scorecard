import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { gzipSync } from 'node:zlib';
import { chart } from '../src/chart.js';

// Synthetic plotting fixtures only; these are not vulnerability research results.
const result = {
  start: '2026-01-01', end: '2026-01-03',
  rows: [{ id: 'all', label: 'Show everything' }, { id: 'custom', label: 'Custom <filter> & "label"' }],
  daily: [
    { day: '2026-01-01', all: 10, custom: 0 },
    { day: '2026-01-02', all: 5, custom: 5 },
    { day: '2026-01-03', all: 0, custom: 10 },
  ],
};

test('daily series share a zero baseline and retain every day in order', () => {
  const svg = chart(result);
  const series = [...svg.matchAll(/<polyline data-filter="([^"]+)" points="([^"]+)"/g)];
  assert.deepEqual(series.map((m) => m[1]), ['all', 'custom']);
  const [all, custom] = series.map((m) => m[2].split(' ').map((p) => p.split(',').map(Number)));
  assert.equal(all.length, 3);
  assert.ok(all[0][0] < all[1][0] && all[1][0] < all[2][0]);
  assert.deepEqual(all.map((p) => p[0]), custom.map((p) => p[0]));
  assert.equal(all[0][1], custom[2][1]);
  assert.equal(all[1][1], custom[1][1]);
  assert.equal(all[2][1], custom[0][1]);
  assert.ok(all[0][1] < all[1][1] && all[1][1] < all[2][1]);
  assert.match(svg, /Date \(UTC\)/);
  assert.match(svg, /2026-01-01/);
  assert.match(svg, /2026-01-03/);
});

test('filter names are escaped as text, never SVG markup', () => {
  const svg = chart(result);
  assert.match(svg, /Custom &lt;filter&gt; &amp; &quot;label&quot;/);
  assert.doesNotMatch(svg, /<filter>/);
  const malicious = { ...result, rows: [{ id: 'all', label: '</text><script>alert(1)</script>' }] };
  assert.doesNotMatch(chart(malicious), /<script>/);
});

test('zero counts, one day, and empty data produce finite standalone charts', () => {
  for (const daily of [[], [{ day: result.start, all: 0, custom: 0 }]]) {
    const svg = chart({ ...result, daily });
    assert.match(svg, /^<svg xmlns="http:\/\/www.w3.org\/2000\/svg"/);
    assert.match(svg, /<\/svg>\n$/);
    assert.doesNotMatch(svg, /NaN|Infinity/);
    if (daily.length) assert.equal((svg.match(/<circle /g) || []).length, 2);
    else assert.match(svg, /No daily data/);
  }
});

test('invalid counts fail rather than plotting misleading values', () => {
  for (const value of [-1, NaN, Infinity, undefined]) {
    assert.throws(() => chart({ ...result, daily: [{ day: result.start, all: value, custom: 0 }] }), /invalid daily count/);
  }
});

test('CLI documents chart output and rejects a missing chart file before fetching data', () => {
  const cli = fileURLToPath(new URL('../src/cli.js', import.meta.url));
  const help = spawnSync(process.execPath, [cli, '--help'], { encoding: 'utf8' });
  assert.equal(help.status, 0, help.stderr);
  assert.match(help.stdout, /--chart FILE/);
  const missing = spawnSync(process.execPath, [cli, '--chart'], { encoding: 'utf8' });
  assert.notEqual(missing.status, 0);
  assert.match(missing.stderr, /--chart requires an output file/);
});

test('CLI writes selected and custom series without changing JSON or Markdown', (t) => {
  const dir = mkdtempSync(join(tmpdir(), 'triage-chart-'));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  const kev = join(dir, 'kev.json'), filter = join(dir, 'custom.mjs');
  writeFileSync(kev, JSON.stringify({ vulnerabilities: [] }));
  writeFileSync(join(dir, 'epss_scores-2026-01-01.csv.gz'), gzipSync('cve,epss,percentile\nCVE-TEST-A,0.2,0.9\nCVE-TEST-B,0.01,0.2\n'));
  writeFileSync(filter, 'export default { label: "Custom <rule>", flag: r => r.epss < 0.1 };');
  const cli = fileURLToPath(new URL('../src/cli.js', import.meta.url));
  const args = [cli, '--days', '1', '--end', '2026-01-01', '--epss-dir', dir,
    '--cache', dir, '--kev', kev, '--only', 'epss01', '--filter', filter];
  const baseline = spawnSync(process.execPath, [...args, '--json', join(dir, 'before.json')], { encoding: 'utf8' });
  assert.equal(baseline.status, 0, baseline.stderr);
  const withChart = spawnSync(process.execPath, [...args, '--json', join(dir, 'after.json'), '--chart', join(dir, 'chart.svg')], { encoding: 'utf8' });
  assert.equal(withChart.status, 0, withChart.stderr);
  assert.equal(withChart.stdout, baseline.stdout);
  assert.deepEqual(JSON.parse(readFileSync(join(dir, 'after.json'))), JSON.parse(readFileSync(join(dir, 'before.json'))));
  const svg = readFileSync(join(dir, 'chart.svg'), 'utf8');
  assert.deepEqual([...svg.matchAll(/data-filter="([^"]+)"/g)].map((m) => m[1]), ['all', 'epss01', 'custom']);
  assert.match(svg, /Custom &lt;rule&gt;/);
});
