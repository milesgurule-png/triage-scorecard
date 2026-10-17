import { test } from 'node:test';
import assert from 'node:assert/strict';
import { scorecard, BUILTIN } from '../src/score.js';

// Three days, four CVEs. CVE-B is known exploited from the start; CVE-C joins KEV on day 3.
const kev = new Map([['CVE-B', '2026-01-01'], ['CVE-C', '2026-01-03']]);
const day = { '2026-01-01': [['CVE-A', 0.01, 0.2], ['CVE-B', 0.9, 0.999], ['CVE-C', 0.3, 0.98], ['CVE-D', 0.02, 0.3]] };
day['2026-01-02'] = day['2026-01-01'];
day['2026-01-03'] = day['2026-01-01'];
const run = (filters, extra = {}) => scorecard({ start: '2026-01-01', end: '2026-01-03', kev, filters, rowsFor: async (d) => day[d], ...extra });

test('show everything flags every CVE and catches all KEV', async () => {
  const r = (await run({ all: BUILTIN.all })).rows[0];
  assert.equal(r.perDay, 4);
  assert.equal(r.kevRecall, 1);
  assert.equal(r.noiseCut, 0);
});

test('no time travel: CVE-C only counts as KEV from its dateAdded', async () => {
  const r = (await run({ all: BUILTIN.all, kev: BUILTIN.kev })).rows.find((x) => x.id === 'kev');
  // day 1: B; day 2: B; day 3: B and C
  assert.equal(r.perDay, 4 / 3);
  assert.equal(r.precision, 1);
  assert.equal(r.earlyWarned, 0); // KEV-only can never warn early
});

test('early warning and lead time', async () => {
  const res = await run({ all: BUILTIN.all, epss01: BUILTIN.epss01 });
  const r = res.rows.find((x) => x.id === 'epss01');
  assert.equal(res.newlyExploited, 1); // CVE-B was added on the start day, so it is not "new"
  assert.equal(r.earlyWarned, 1); // CVE-C flagged on day 1, two days before KEV
  assert.equal(r.medianLeadDays, 2);
  // flagged: B and C each day = 6; KEV hits: B x3 + C on day 3 = 4
  assert.equal(r.precision, 4 / 6);
  assert.equal(r.noiseCut, 0.5);
});

test('cohort restricts scoring to the given CVEs', async () => {
  const r = (await run({ all: BUILTIN.all }, { cohort: new Set(['CVE-A', 'CVE-B']) })).rows[0];
  assert.equal(r.perDay, 2);
  assert.equal(r.kevRecall, 1);
});
