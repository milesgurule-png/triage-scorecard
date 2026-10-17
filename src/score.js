// Scores triage filters day by day. Day D only sees EPSS from day D and KEV entries added on or before D.
import { readEpss, epssFile, days } from './data.js';

export const BUILTIN = {
  all: { label: 'Show everything', flag: () => true },
  epss01: { label: 'EPSS >= 0.1', flag: (r) => r.epss >= 0.1 },
  epss05: { label: 'EPSS >= 0.5', flag: (r) => r.epss >= 0.5 },
  epssTop1: { label: 'EPSS top 1% (percentile >= 0.99)', flag: (r) => r.pct >= 0.99 },
  kev: { label: 'KEV only', flag: (r) => r.kev },
  kevEpss01: { label: 'KEV or EPSS >= 0.1', flag: (r) => r.kev || r.epss >= 0.1 },
};

function blank() { return { shown: 0, hits: 0, kevTotal: 0, kevShown: 0, early: new Map() }; }

// rows: async iterator source per day (injected for tests); default reads the EPSS file for that day.
export async function scorecard({ start, end, kev, filters, cohort = null, opts = {}, rowsFor }) {
  const window = days(start, end);
  const future = new Map([...kev].filter(([, added]) => added > start && added <= end));
  const acc = Object.fromEntries(Object.keys(filters).map((k) => [k, blank()]));
  const daily = [];
  for (const day of window) {
    const today = Object.fromEntries(Object.keys(filters).map((k) => [k, 0]));
    const each = (cve, epss, pct) => {
      if (cohort && !cohort.has(cve)) return;
      const added = kev.get(cve);
      const r = { cve, epss, pct, day, kev: added !== undefined && added <= day };
      for (const [k, f] of Object.entries(filters)) {
        const a = acc[k];
        const on = f.flag(r);
        if (r.kev) { a.kevTotal++; if (on) a.kevShown++; }
        if (!on) continue;
        a.shown++; today[k]++;
        if (r.kev) a.hits++;
        const fa = future.get(cve);
        if (fa && day < fa && !a.early.has(cve)) a.early.set(cve, day);
      }
    };
    if (rowsFor) for (const [c, e, p] of await rowsFor(day)) each(c, e, p);
    else await readEpss(await epssFile(day, opts), each);
    daily.push({ day, ...today });
    opts.onDay?.(day);
  }
  const n = window.length;
  const leadDays = (cve, first) => Math.round((Date.parse(future.get(cve)) - Date.parse(first)) / 864e5);
  const rows = Object.entries(filters).map(([k, f]) => {
    const a = acc[k];
    const leads = [...a.early].map(([cve, first]) => leadDays(cve, first)).sort((x, y) => x - y);
    return {
      id: k, label: f.label,
      perDay: a.shown / n,
      precision: a.shown ? a.hits / a.shown : null,
      kevRecall: a.kevTotal ? a.kevShown / a.kevTotal : null,
      earlyWarned: a.early.size,
      medianLeadDays: leads.length ? leads[Math.floor(leads.length / 2)] : null,
    };
  });
  const base = rows.find((r) => r.id === 'all')?.perDay;
  for (const r of rows) r.noiseCut = base ? 1 - r.perDay / base : null;
  return { start, end, days: n, newlyExploited: future.size, rows, daily };
}
